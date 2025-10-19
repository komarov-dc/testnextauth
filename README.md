# Next.js SaaS Starter

A production-ready SaaS starter template built with Next.js 15, NextAuth.js v5, Prisma, Neon PostgreSQL, and Stripe.

## Features

- **Authentication**
  - Email/Password authentication with bcrypt
  - Google OAuth integration
  - Protected routes with middleware
  - Role-based access control (Owner/Member)

- **Payments**
  - One-time payments via Stripe Checkout
  - Recurring subscriptions
  - Stripe Customer Portal for subscription management
  - Webhook integration for payment events

- **Database**
  - Neon PostgreSQL (serverless)
  - Prisma ORM with type-safe queries
  - Database migrations

- **UI/UX**
  - Tailwind CSS for styling
  - shadcn/ui component library
  - Responsive design
  - Modern, clean interface

- **Developer Experience**
  - TypeScript for type safety
  - ESLint for code quality
  - Modular component architecture
  - Server Actions for mutations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: NextAuth.js v5 (Auth.js)
- **Database**: Neon PostgreSQL + Prisma
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon account (free tier available)
- A Stripe account
- A Google Cloud account (for OAuth)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd testnextauth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Neon PostgreSQL

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy your database connection string
4. Update `.env.local` with your `DATABASE_URL`

### 4. Set up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Choose "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy your Client ID and Client Secret
8. Update `.env.local` with `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

### 5. Set up Stripe

1. Sign up at [Stripe](https://stripe.com)
2. Get your API keys from the Dashboard
3. Update `.env.local` with `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

#### Create Products in Stripe

1. Go to Stripe Dashboard → Products
2. Create two products:
   - **One-Time Payment**: Set price (e.g., $29), one-time payment
   - **Monthly Subscription**: Set price (e.g., $9/month), recurring monthly
3. Copy the Price IDs (starting with `price_...`)
4. Update `.env.local` with `STRIPE_ONETIME_PRICE_ID` and `STRIPE_SUBSCRIPTION_PRICE_ID`

#### Set up Stripe Webhooks

For local development:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret (starts with `whsec_...`) and update `.env.local` with `STRIPE_WEBHOOK_SECRET`

For production (Vercel):
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the signing secret and add to Vercel environment variables

### 6. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Update `.env.local` with the generated `NEXTAUTH_SECRET`

### 7. Set up the database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 8. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_ONETIME_PRICE_ID="price_..."
STRIPE_SUBSCRIPTION_PRICE_ID="price_..."
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.example`
4. Update `NEXTAUTH_URL` to your production URL
5. Deploy!

### Post-Deployment

1. Update Google OAuth redirect URI with production URL
2. Set up Stripe production webhook (see Stripe setup section)
3. Update environment variables in Vercel with production values

## Project Structure

```
testnextauth/
├── app/
│   ├── (auth)/            # Auth pages (login, register)
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth routes
│   │   └── stripe/        # Stripe routes
│   ├── dashboard/         # Protected dashboard
│   ├── pricing/           # Pricing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── actions/           # Server actions
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   ├── stripe.ts          # Stripe helpers
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── types/                 # TypeScript type definitions
└── middleware.ts          # Route protection middleware
```

## Database Schema

The application uses Prisma with the following models:

- **User**: User accounts with auth and Stripe data
- **Account**: OAuth account information
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

## Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Any future expiry date and any 3-digit CVC

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
