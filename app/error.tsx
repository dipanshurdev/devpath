'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-lg w-full mx-auto text-center space-y-8 p-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground">Something went wrong</h1>
          
          <p className="text-muted-foreground text-lg leading-relaxed">
            {isDevelopment 
              ? 'An error occurred while rendering this page.'
              : 'We encountered an unexpected error. Please try again later.'
            }
          </p>
        </div>

        {/* Show error details in development */}
        {isDevelopment && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 text-left">
            <h3 className="font-semibold text-sm text-destructive mb-2">Error Details:</h3>
            <p className="text-xs text-muted-foreground font-mono break-all">
              {error.message}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  View Stack Trace
                </summary>
                <pre className="text-xs text-muted-foreground font-mono mt-2 whitespace-pre-wrap break-all">
                  {error.stack}
                </pre>
              </details>
            )}
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Error ID:</strong> {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            If this problem persists, please contact our support team.
            {error.digest && (
              <> Please include this Error ID: <code className="bg-muted px-1 py-0.5 rounded text-xs">{error.digest}</code></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
