import { Building2, Users, Target, Award, Lightbulb } from "lucide-react";

const stats = [
  { label: "Years of Experience", value: "10+" },
  { label: "Happy Customers", value: "50K+" },
  { label: "Products Listed", value: "10K+" },
  { label: "Verified Sellers", value: "2K+" },
];

export default function AboutCompanyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Building2 className="h-4 w-4" />
            About Us
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            About Bazaari
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We are building the future of e-commerce by connecting buyers and sellers in a trusted,
            innovative marketplace experience.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 mb-20">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed">
              Bazaari is a multi-vendor marketplace platform designed to empower sellers and delight
              buyers. Founded with a vision to simplify online commerce, we provide tools for sellers
              to launch stores and for buyers to discover quality products at great prices.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Target className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Trust</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified sellers, genuine reviews, and secure payments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Supporting sellers with onboarding, logistics, and growth tools.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <h3 className="font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground">
                    Constantly improving the experience with modern technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
