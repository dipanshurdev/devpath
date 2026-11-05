"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>

        <div className="border border-border/60 dark:border-zinc-800 bg-card p-8">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground dark:text-white">
                  Check your email
                </h1>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  If <strong>{email}</strong> is registered, we&apos;ve sent a
                  password reset link. It expires in 1 hour.
                </p>
              </div>
              <Button asChild className="w-full premium-button h-10 text-sm">
                <Link href="/login">Back to login</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* TODO: implement mailings */}
                {/* <h1 className="text-xl font-bold text-foreground dark:text-white">
                  Forgot your password?
                </h1> */}
                <p className="text-sm text-muted-foreground mt-1.5">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="rounded-none h-10 text-sm"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full premium-button h-10 text-sm font-semibold"
                >
                  {loading ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
