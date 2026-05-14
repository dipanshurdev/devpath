import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "@/lib/prisma/client";
import bcrypt from "bcryptjs";
import { env } from "@/lib/env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      username?: string;
      role: string;
      avatar?: string;
      image?: string;
    };
  }

  interface User {
    role: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
    username?: string;
    avatar?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(env.GITHUB_ID && env.GITHUB_SECRET
      ? [
          GitHubProvider({
            clientId: env.GITHUB_ID,
            clientSecret: env.GITHUB_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as {
          role: string;
          id: string;
          username?: string | null;
          avatar?: string | null;
          image?: string | null;
        };
        token.role = u.role;
        token.id = u.id;
        token.username = u.username ?? undefined;
        token.avatar = u.avatar ?? u.image ?? undefined;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string | undefined;
        session.user.image = token.avatar as string | undefined;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // For OAuth providers, upsert user in database
      if (account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // Update existing user: refresh avatar and emailVerified,
          // but preserve role, username, and points
          await prisma.user.update({
            where: { email: user.email! },
            data: {
              avatar: user.image || existingUser.avatar,
              emailVerified: existingUser.emailVerified ?? new Date(),
            },
          });
        } else {
          // Derive username from email prefix and handle collisions
          let username = user.email?.split("@")[0] || "";
          let suffix = 1;
          while (await prisma.user.findUnique({ where: { username } })) {
            username = `${user.email?.split("@")[0]}${suffix}`;
            suffix++;
          }

          // Create new user from OAuth
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name || "",
              username,
              avatar: user.image,
              emailVerified: new Date(),
              role: "USER",
            },
          });

          // Create FREE subscription for new user
          await prisma.subscription.create({
            data: {
              userId: newUser.id,
              tier: "FREE",
              status: "ACTIVE",
              currentPeriodStart: new Date(),
            },
          });
        }
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
  // NODE_ENV is a Node.js built-in and is not part of the Zod env schema.
  debug: process.env.NODE_ENV === "development",
};
