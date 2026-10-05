# Multivendor-client

Next.js ভিত্তিক একটি Multi-Vendor E-Commerce Platform। এটি Buyer, Seller, Admin এবং Delivery Person — চারটি ভিন্ন রোলের জন্য আলাদা আলাদা ইন্টারফেস এবং ফিচার অফার করে।

## Features

- **Buyer Flow** — প্রোডাক্ট ব্রাউজ, ক্যাটাগরি ভিউ, কার্ট, চেকআউট (Stripe পেমেন্ট), অর্ডার ট্র্যাকিং, রিভিউ এবং রিফান্ড রিকোয়েস্ট
- **Seller Flow** — সেলার অ্যাপ্লিকেশন, প্রোডাক্ট ম্যানেজমেন্ট, অর্ডার হ্যান্ডলিং
- **Admin Flow** — অ্যাডমিন ড্যাশবোর্ড, ইউজার/প্রোডাক্ট/অর্ডার ওয়াচ ও ম্যানেজমেন্ট
- **Delivery Flow** — ডেলিভারি পারসন ড্যাশবোর্ড, অর্ডার ডেলিভারি ট্র্যাকিং
- **Authentication** — লগইন/রেজিস্টার, JWT ভিত্তিক প্রটেকশন, রোল-বেসড রিডাইরেক্ট
- **Payments** — Stripe ইন্টিগ্রেশন
- **State Management** — TanStack Query v5, React Hook Form + Zod
- **UI/UX** — shadcn/ui + Radix UI, Tailwind CSS v4, Dark Mode, Smooth Scroll (Lenis), Animations (Motion/Framer Motion)
- **Analytics** — Recharts ভিত্তিক অ্যাডমিন চার্ট

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Runtime:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (Radix Nova), Radix UI
- **State:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Payment:** Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`)
- **Charts:** Recharts
- **Animations:** Motion (`motion/react`)
- **Smooth Scroll:** Lenis
- **Theme:** next-themes
- **Icons:** Lucide React, React Icons
- **HTTP Client:** Axios

## Project Structure

```
src/
├── app/                     # Next.js App Router পেজ এবং লেআউট
│   ├── layout.tsx
│   ├── page.tsx             # হোমপেজ (Lenis + Motion + Home modules)
│   ├── login/               # লগইন পেজ
│   ├── register/            # রেজিস্টার পেজ
│   ├── cart/                # কার্ট পেজ
│   ├── checkout/            # চেকআউট পেজ
│   ├── orders/              # অর্ডার ট্র্যাকিং
│   ├── seller/              # সেলার ড্যাশবোর্ড
│   ├── admin/               # অ্যাডমিন ড্যাশবোর্ড
│   ├── delivery/            # ডেলিভারি ড্যাশবোর্ড
│   ├── dashboard/           # বাইয়ার ড্যাশবোর্ড
│   ├── about/               # অ্যাবাউট পেজ
│   └── ...
├── components/              # রিউযেবল কম্পোনেন্ট
│   ├── LayoutWrapper.tsx
│   ├── navbar5.tsx
│   ├── footer7.tsx
│   └── ui/                  # shadcn/ui কম্পোনেন্ট
├── features/                # ফিচার-ওয়াইজ মডিউল
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── products/
│   ├── refund/
│   ├── reviews/
│   └── seller/
├── modules/                 # হোম এবং বিশেষ পেজ মডিউল
│   ├── home/
│   ├── orders/
│   ├── Blog/
│   └── sellerAPPlication/
├── services/                # API সার্ভিস/ কনফিগ
│   ├── auth.service.ts
│   ├── Product.service.ts
│   ├── cart.service.ts
│   ├── admin.service.ts
│   ├── refund.service.ts
│   ├── review.service.ts
│   └── seller.service.ts
├── hooks/                   # কাস্টম হুক
│   ├── useAuth.ts
│   └── use-mobile.ts
├── lib/                     # অ核心 লাইব্রেরি কনফিগ
│   ├── axios.ts
│   ├── queryClient.ts
│   └── stripe.ts
├── providers/               # অ্যাপ লেভেল প্রভাইডার
│   ├── AppProviders.tsx
│   ├── QueryProvider.tsx
│   └── ThemeProvider.tsx
├── middleware/              # Next.js মিডলওয়্যার (রোল-বেসড রুট প্রটেকশন)
│   └── middleware.ts
└── libs/                    # শেয়ার্ড যুটিলিটি
    └── utils.ts
```

## Roles & Routes

| Role | Home Route | Protected Routes |
|------|-----------|------------------|
| ADMIN | `/dashboard/admin` | `/admin/*`, `/dashboard/admin/*` |
| SELLER | `/seller` | `/seller/*` |
| DELIVERY | `/delivery` | `/delivery/*` |
| USER | `/` | `/cart/*`, `/checkout/*`, `/dashboard/*` |

Middleware স্বয়ংক্রিয়ভাবে `accessToken` এবং `userRole` কুকির উপর ভিত্তি করে রুট প্রটেক্ট এবং রিডাইরেক্ট করে।

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Getting Started

প্রজেক্ট ক্লোন করুন:

```bash
git clone <repository-url>
cd Multivendor-client
```

ডিপেন্ডেন্সি ইনস্টল করুন:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

ডেভেলপমেন্ট সার্ভার চালু করুন:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

এরপর [http://localhost:3000](http://localhost:3000) ওপেন করুন।

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | ডেভেলপমেন্ট সার্ভার চালু |
| `npm run build` | প্রোডাকশন বিল্ড |
| `npm run start` | প্রোডাকশন সার্ভার চালু |
| `npm run lint` | ESLint চেক |

## Build & Deploy

**Build:**

```bash
npm run build
```

**Start:**

```bash
npm run start
```

**Vercel-এ ডিপ্লয়:**

```bash
vercel
```

## Contributing

1. একটি নতুন ব্রাঞ্চ তৈরি করুন: `git checkout -b feature/your-feature`
2. পরিবর্তন করুন এবং কমিট করুন: `git commit -m 'Add some feature'`
3. ব্রাঞ্চ পুশ করুন: `git push origin feature/your-feature`
4. একটি Pull Request খুলুন

## License

Private
