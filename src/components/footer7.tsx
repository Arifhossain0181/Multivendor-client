import Link from "next/link";
import { ArrowUpRight, ShoppingCart } from "lucide-react";
import { cn } from "@/src/libs/utils";

const footerSections = [
  {
    title: "Shop",
    links: [
      { name: "Browse Products", href: "/shoP/products" },
      { name: "Categories", href: "/#categories" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "My Orders", href: "/orders" },
    ],
  },
  {
    title: "About Bazaari",
    links: [
      { name: "About Us", href: "/about/company" },
      { name: "Mission & Vision", href: "/about/mission-vision" },
      { name: "Success Stories", href: "/about/success-story" },
      { name: "Blog & Guides", href: "/module/blog" },
    ],
  },
  {
    title: "Join Bazaari",
    links: [
      { name: "Become a Seller", href: "/seller/apply" },
      { name: "Delivery Man Registration", href: "/register/delivery" },
      { name: "Create an Account", href: "/register" },
      { name: "Sign In", href: "/login" },
    ],
  },
];

const Footer7 = ({ className }: { className?: string }) => (
  <footer
    className={cn("relative isolate overflow-hidden border-t border-emerald-900/30 text-white", className)}
    style={{
      backgroundImage: "url('/Screenshot%202026-10-09%20202732.png')",
      backgroundPosition: "center 55%",
      backgroundSize: "cover",
    }}
  >
    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/85 via-emerald-950/80 to-slate-900/85" />
    <div className="container mx-auto px-4">
      <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_2fr] lg:gap-16 lg:py-14">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight" aria-label="Bazaari home">
            <ShoppingCart className="h-8 w-8 text-emerald-300" strokeWidth={2.8} />
            <span><span className="text-emerald-300">B</span>azaari</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-white/80">
            Shop together and grow together. Discover products from trusted sellers across the Bazaari marketplace.
          </p>
          <Link href="/shoP/products" className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300 hover:bg-emerald-400/15">
            Explore the marketplace <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerSections.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-emerald-200">{section.title}</h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/80 transition hover:text-white hover:underline hover:underline-offset-4">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/20 py-5 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Bazaari. All rights reserved.</p>
        <Link href="/" className="hover:text-white">Shop Together · Grow Together</Link>
      </div>
    </div>
  </footer>
);

export { Footer7 };
