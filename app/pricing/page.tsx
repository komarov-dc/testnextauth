"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";

const products = [
  {
    name: "One-Time Payment",
    description: "Make a single payment for immediate access",
    price: "$29",
    priceId: process.env.NEXT_PUBLIC_STRIPE_ONETIME_PRICE_ID || "price_onetime",
    mode: "payment" as const,
    features: [
      "Single payment",
      "Immediate access",
      "No recurring charges",
      "Lifetime access",
    ],
  },
  {
    name: "Monthly Subscription",
    description: "Get ongoing access with monthly billing",
    price: "$9/month",
    priceId: process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID || "price_subscription",
    mode: "subscription" as const,
    features: [
      "Monthly billing",
      "Cancel anytime",
      "Premium support",
      "Regular updates",
      "Access to all features",
    ],
    popular: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async (priceId: string, mode: "payment" | "subscription") => {
    try {
      setLoading(priceId);

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, mode }),
      });

      const data = await response.json();

      if (data.url) {
        router.push(data.url);
      } else {
        alert("Error creating checkout session");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating checkout session");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Select the option that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <Card
              key={product.priceId}
              className={product.popular ? "border-primary border-2 relative" : ""}
            >
              {product.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl rounded-tr">
                  Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-6">{product.price}</div>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleCheckout(product.priceId, product.mode)}
                  disabled={loading === product.priceId}
                >
                  {loading === product.priceId
                    ? "Loading..."
                    : product.mode === "payment"
                    ? "Buy Now"
                    : "Subscribe Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
