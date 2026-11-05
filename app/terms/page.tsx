import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import LandingFooter from "@/components/landing-footer";

export const metadata = {
  title: "Terms of Service | DevPath",
  description: "DevPath terms of service and acceptable usage guidelines.",
};

export default function TermsPage() {
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
          <FileText className="w-4 h-4" />
          Agreement
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mb-10">
          Last updated: November 2026
        </p>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using DevPath (&ldquo;the Service&rdquo;), you agree to be bound by these
              Terms of Service. If you do not agree with any part of these terms, you may not use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              2. User Accounts & Responsibilities
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials.
              You agree not to share your account, reverse engineer the platform, or misuse our API
              endpoints beyond documented rate limits.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              3. Subscriptions & Billing
            </h2>
            <p>
              DevPath offers Free, Pro, and Team tiers. Paid tiers are billed in advance on a recurring
              monthly or yearly basis through Stripe. You may cancel your subscription at any time
              through your account billing dashboard. Upon cancellation, your access remains active
              until the conclusion of the current billing cycle.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              4. Content & Intellectual Property
            </h2>
            <p>
              Curated roadmaps, diagrams, and educational summaries provided by DevPath are protected
              under copyright and intellectual property laws. You may use them for personal learning
              and professional development.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              5. Contact Us
            </h2>
            <p>
              Questions regarding these Terms of Service may be directed to{" "}
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

