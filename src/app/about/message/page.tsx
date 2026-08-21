import Image from "next/image";
import { Quote } from "lucide-react";

export default function MessagePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            Leadership
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
            Message from Managing Director
          </h1>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                alt="Managing Director"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">Ahmed Rahman</h2>
              <p className="text-sm text-primary font-medium">Managing Director, Bazaari</p>
            </div>
          </div>

          <div className="relative mt-8">
            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
            <p className="text-lg leading-relaxed text-muted-foreground">
              &quot;At Bazaari, we believe that commerce is more than transactions; it is about building
              trust, enabling dreams, and creating lasting relationships. Our platform is designed to
              give every seller a fair chance to grow and every buyer a delightful experience. We are
              committed to pushing boundaries, embracing innovation, and serving our community with
              integrity and passion.&quot;
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-muted/50 p-6">
            <h3 className="font-semibold mb-2">Key Focus Areas</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Expanding seller enablement programs nationwide</li>
              <li>Investing in logistics and delivery infrastructure</li>
              <li>Launching trusted buyer protection policies</li>
              <li>Driving financial inclusion for micro-entrepreneurs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
