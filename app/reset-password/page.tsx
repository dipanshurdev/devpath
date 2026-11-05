"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm text-red-500">Invalid reset link. Please request a new one.</p>
        <Button asChild className="premium-button h-10 text-sm">
          <Link href="/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground dark:text-white">
            Password updated!
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Redirecting you to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="w-10 h-10 bg-neutral-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <Lock className="w-5 h-5 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground dark:text-white">
          Set a new password
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Choose a strong password for your DevPath account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider">
            New password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className="rounded-none h-10 text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider">
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            required
            className="rounded-none h-10 text-sm"
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full premium-button h-10 text-sm font-semibold"
        >
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
