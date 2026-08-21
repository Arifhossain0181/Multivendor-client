import { Target, Eye, ArrowRight } from "lucide-react";

export default function MissionVisionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Target className="h-4 w-4" />
            Our Purpose
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Mission & Vision
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Guided by a clear purpose, we strive to transform the way people shop and sell online.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To democratize e-commerce by providing an accessible, secure, and innovative marketplace
              where anyone can buy and sell with confidence. We aim to empower local sellers, create
              economic opportunities, and deliver unmatched convenience to customers across the
              country.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                Simplify online selling for everyone
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                Build trust through transparency and quality
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                Use technology to connect communities
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-6">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              To become the most trusted and customer-centric multi-vendor marketplace in South Asia,
              setting new standards for convenience, choice, and commerce empowerment. We envision a
              future where every seller can thrive and every customer finds exactly what they need.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                Become the leading marketplace in the region
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                Enable millions of small businesses to go digital
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <ArrowRight className="mt-0.5 h-4 w-4 text-primary" />
                Drive inclusive economic growth through commerce
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
