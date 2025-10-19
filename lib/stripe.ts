import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-09-30.clover",
  typescript: true,
});

export const getStripeSession = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

export const createCheckoutSession = async ({
  priceId,
  userId,
  userEmail,
  mode = "payment",
}: {
  priceId: string;
  userId: string;
  userEmail: string;
  mode?: "payment" | "subscription";
}) => {
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
    ...(mode === "subscription" && {
      subscription_data: {
        metadata: {
          userId,
        },
      },
    }),
  });

  return session;
};

export const createCustomerPortalSession = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return session;
};
