"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Github, Mail, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface LoginFormProps {
  callbackUrl: string;
}

export default function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid credentials 😮");
      } else {
        toast.success("Welcome back! 🥳🥂");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong");
      toast.error("Failed to sign in 🥲");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error(`Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className="surface-auth flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md border-border/60 shadow-xl dark:border-border/50 dark:shadow-2xl dark:shadow-black/40 bg-glass-card">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>Sign in to continue your learning path</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="alert-destructive" role="alert">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>


           {/* TODO: implement mailings */}     
                {/* <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link> */}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gradient-bg hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            {/* <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div> */}
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={loading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("github")}
              disabled={loading}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div> */}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-muted-foreground w-full">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
