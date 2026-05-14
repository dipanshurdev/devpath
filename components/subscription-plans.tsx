"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { config, type SubscriptionTier } from "@/lib/config"

interface PlanFeature {
  name: string
  included: boolean
}

interface Plan {
  id: SubscriptionTier
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  features: PlanFeature[]
  popular?: boolean
}

/** Human-readable labels for each feature gate key */
const FEATURE_LABELS: Record<string, string> = {
  custom_roadmaps: "Create custom roadmaps",
  team_collaboration: "Team collaboration",
  premium_resources: "Premium resources",
  advanced_analytics: "Advanced analytics",
  priority_support: "Priority support",
}

/** Build feature list for a given tier based on FEATURE_GATES config */
function buildFeatures(tier: SubscriptionTier): PlanFeature[] {
  const tierOrder: SubscriptionTier[] = ["FREE", "PRO", "TEAM"]
  const tierIndex = tierOrder.indexOf(tier)

  // Always-included base features
  const baseFeatures: PlanFeature[] = [
    { name: "Access to public roadmaps", included: true },
    { name: "Progress tracking", included: true },
  ]

  // Gate-based features
  const gateFeatures = Object.entries(config.featureGates).map(([key, requiredTier]) => {
    const requiredIndex = tierOrder.indexOf(requiredTier as SubscriptionTier)
    return {
      name: FEATURE_LABELS[key] ?? key.replace(/_/g, " "),
      included: tierIndex >= requiredIndex,
    }
  })

  return [...baseFeatures, ...gateFeatures]
}

const plans: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Basic access to public roadmaps",
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: buildFeatures("FREE"),
  },
  {
    id: "PRO",
    name: "Pro",
    description: "For serious learners and professionals",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    features: buildFeatures("PRO"),
    popular: true,
  },
  {
    id: "TEAM",
    name: "Team",
    description: "For teams and organizations",
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    features: buildFeatures("TEAM"),
  },
]

export function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const handleSubscribe = (planId: string) => {
    console.log(`Subscribing to ${planId} plan`)
    // In a real app, you would redirect to a checkout page or open a checkout modal
  }

  return (
    <div className="my-20 bg-gradient-to-b from-background via-muted/20 to-card/30 py-16 dark:via-card/20 dark:to-background">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
          Choose Your <span className="gradient-text">Plan</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Select the perfect plan to accelerate your learning journey and master new skills faster.
        </p>

        <div className="flex items-center justify-center mt-8 space-x-2">
          <Label 
            htmlFor="billing-toggle" 
            className={`transition-colors ${
              billingCycle === "monthly" ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={billingCycle === "yearly"}
            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
          />
          <Label 
            htmlFor="billing-toggle" 
            className={`transition-colors ${
              billingCycle === "yearly" ? "font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            Yearly
            <Badge variant="outline" className="ml-2 border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              Save 20%
            </Badge>
          </Label>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`hover-lift relative transition-all duration-300 hover:scale-[1.02] ${
              plan.popular 
                ? "border-primary/40 bg-gradient-to-b from-primary/8 to-transparent shadow-lg shadow-primary/15" 
                : "border-border/60 bg-card/80 backdrop-blur-sm dark:bg-card/60"
            }`}
          >
            {plan.popular && (
              <Badge className="gradient-bg absolute -right-2 -top-2 shadow-lg shadow-primary/30">
                Most Popular
              </Badge>
            )}
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold text-foreground">
                  ${billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="ml-1 text-muted-foreground">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature.included ? (
                      <Check className="mr-2 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="mr-2 h-5 w-5 shrink-0 text-muted-foreground" />
                    )}
                    <span className={`${
                      feature.included 
                        ? "text-foreground" 
                        : "text-muted-foreground"
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full transition-all duration-300 ${
                  plan.popular
                    ? "gradient-bg shadow-lg shadow-primary/20 hover:scale-[1.02] hover:opacity-90"
                    : plan.id === "FREE"
                      ? "border border-border/60 bg-muted hover:bg-muted/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                variant={plan.id === "FREE" ? "outline" : "default"}
              >
                {plan.id === "FREE" ? "Get Started" : "Subscribe"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
