import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto text-center space-y-8 p-8">
        <div className="space-y-4">
          <div className="relative">
            <div className="text-9xl font-black text-primary/20">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-bold text-primary">Oops!</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Here are some helpful links instead:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="premium-button">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/roadmaps" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Browse Roadmaps
              </Link>
            </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
