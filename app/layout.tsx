import "./globals.css";
import type { Metadata } from "next";
import Layout from "@/layout/Layout";
import RootWrapper from "@/layout/RootWrapper";
import { GoogleAnalytics } from "@/components/google-analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { env } from "@/lib/env";

function resolveMetadataBase(): URL {
  if (env.NEXT_PUBLIC_APP_URL) {
    return new URL(env.NEXT_PUBLIC_APP_URL);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  title: "DevPath | Developer Roadmaps & Learning Paths",
  description:
    "DevPath is a SaaS platform that helps you master your tech career with expert-curated roadmaps, progress tracking, and personalized learning paths. Start free today.",
  openGraph: {
    title: "DevPath | Developer Roadmaps & Learning Paths",
    description:
      "Expert-curated roadmaps, progress tracking, and personalized learning paths for developers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <GoogleAnalytics />
          <RootWrapper>
            <Layout>{children}</Layout>
          </RootWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
