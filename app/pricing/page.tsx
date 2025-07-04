import { SubscriptionPlans } from "@/components/subscription-plans";

export default function PricingPage() {
  return (
    <div className="container">
      <SubscriptionPlans />

      <div className="max-w-3xl mx-auto mt-16 mb-16">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-lg">
            <h4 className="font-bold mb-2">
              Can I cancel my subscription anytime?
            </h4>
            <p className="text-muted-foreground">
              Yes, you can cancel your subscription at any time. Your access
              will continue until the end of your billing period.
            </p>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <h4 className="font-bold mb-2">
              What payment methods do you accept?
            </h4>
            <p className="text-muted-foreground">
              We accept all major credit cards, PayPal, and Apple Pay. All
              payments are processed securely.
            </p>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <h4 className="font-bold mb-2">Is there a free trial?</h4>
            <p className="text-muted-foreground">
              Yes, you can try our Pro plan free for 14 days. No credit card
              required during the trial period.
            </p>
          </div>

          <div className="glass-card p-6 rounded-lg">
            <h4 className="font-bold mb-2">Can I switch plans later?</h4>
            <p className="text-muted-foreground">
              You can upgrade or downgrade your plan at any time. Changes will
              be applied immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
