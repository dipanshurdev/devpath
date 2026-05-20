import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";

const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(254),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  name: z.string().min(2, "Name must be at least 2 characters").max(80),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(32)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores",
    ),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();

  // Validate input
  const validatedData = registerSchema.parse(body);
  const { email, password, name, username } = validatedData;

  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw ApiError.badRequest("Email already registered");
    }
    throw ApiError.badRequest("Username already taken");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user and FREE subscription atomically
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        username,
        name,
        password: hashedPassword,
        role: "USER",
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        createdAt: true,
      },
    });

    // Create FREE subscription for new user
    await tx.subscription.create({
      data: {
        userId: newUser.id,
        tier: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
      },
    });

    return newUser;
  });

  return createApiResponse(
    {
      message: "Account created successfully",
      user,
    },
    undefined,
    201
  );
});
