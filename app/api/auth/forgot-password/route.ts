import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { withErrorHandler, createApiResponse } from "@/lib/api-handler";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email(),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json();
  const { email } = schema.parse(body);

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true },
  });

  if (user) {
    // Delete any existing tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Create a new reset token (expires in 1 hour)
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email (non-blocking)
    sendPasswordResetEmail(email, token).catch((err) =>
      console.error("[forgot-password] Email error:", err)
    );
  }

  // Always return the same response
  return createApiResponse(
    { message: "If that email is registered, a reset link has been sent." },
    undefined,
    200
  );
});
