import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import LandingFooter from "@/components/landing-footer";

export const metadata = {
  title: "Privacy Policy | DevPath",
  description: "DevPath privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div className="container-xl pt-28 pb-16 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-primary mb-3">
          <Shield className="w-4 h-4" />
          Legal Notice
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mb-10">
          Last updated: November 2026
        </p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              1. Information We Collect
            </h2>
            <p>
              When you create an account on DevPath, we collect your name, username, email address,
              and optional profile links (GitHub, LinkedIn, website). If you register using an OAuth
              provider (Google or GitHub), we receive your public profile identifier and primary email.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              2. How We Use Your Information
            </h2>
            <p>
              We use the collected information to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Track your learning roadmap progress and calculate streaks and achievements.</li>
              <li>Authenticate your sessions securely.</li>
              <li>Process subscription payments and billing invoices via Stripe.</li>
              <li>Send critical transactional emails (password reset, subscription receipts).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              3. Payment Information
            </h2>
            <p>
              We do not store or process your credit card numbers on our servers. All payment
              transactions and subscription billing are handled directly by{" "}
              <strong className="text-foreground dark:text-white">Stripe</strong>, a PCI-certified
              payment service provider.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              4. Cookies & Analytics
            </h2>
            <p>
              We use essential HTTP session cookies to keep you signed in and maintain session integrity.
              We may use privacy-preserving analytics to understand platform traffic and improve roadmap quality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              5. Data Deletion & Contact
            </h2>
            <p>
              You may request deletion of your account and personal learning data at any time by
              contacting us at{" "}
              <a
                href="mailto:dipanshurdev@gmail.com"
                className="text-primary hover:underline font-medium"
              >
                dipanshurdev@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      <LandingFooter />
    </div>
  );
}

