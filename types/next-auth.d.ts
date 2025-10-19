import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      stripeCustomerId?: string | null;
      stripeSubscriptionId?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
