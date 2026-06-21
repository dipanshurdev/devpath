import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function AccountDisabledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto text-center space-y-8 p-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Account Disabled
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your account has been disabled and you can no longer access DevPath.
            If you believe this is a mistake, please contact our support team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="premium-button">
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
