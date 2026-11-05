import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, ApiError, createApiResponse } from "@/lib/api-handler";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { token, password } = schema.parse(body);

  // Find the token
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    throw ApiError.badRequest("Invalid or expired reset token.");
  }

  if (verificationToken.expires < new Date()) {
    // Clean up expired token
    await prisma.verificationToken.delete({ where: { token } });
    throw ApiError.badRequest("Reset token has expired. Please request a new one.");
  }

  // Find the user
  const user = await prisma.user.findUnique({
    where: { email: verificationToken.identifier },
  });

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update password and delete the token
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    }),
    prisma.verificationToken.delete({ where: { token } }),
  ]);

  return createApiResponse({ message: "Password updated successfully." });
});
