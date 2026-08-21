import { Award, Trophy, Star } from "lucide-react";

const awards = [
  {
    year: "2025",
    title: "Best E-Commerce Platform",
    organization: "Bangladesh Tech Awards",
    description: "Recognized for innovation in multi-vendor marketplace solutions.",
  },
  {
    year: "2024",
    title: "Top 10 Rising Startups",
    organization: "Dhaka Innovation Summit",
    description: "Awarded for rapid growth and impact on local commerce.",
  },
  {
    year: "2023",
    title: "Customer Choice Award",
    organization: "E-Commerce Review Board",
    description: "Voted by users as the most trusted shopping platform.",
  },
  {
    year: "2022",
    title: "Excellence in Seller Support",
    organization: "Seller Ecosystem Awards",
    description: "For providing best-in-class tools and support for online sellers.",
  },
];

export default function AwardsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Award className="h-4 w-4" />
            Recognition
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Awards & Achievements
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Our journey has been marked by milestones that reflect our commitment to excellence,
            innovation, and customer satisfaction.
          </p>
        </div>

        <div className="space-y-6">
          {awards.map((award) => (
            <div
              key={award.year + award.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold">{award.title}</h3>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {award.year}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-primary font-medium">
                    {award.organization}
                  </p>
                  <p className="mt-2 text-muted-foreground">{award.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <Star className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every award inspires us to keep improving. We thank our customers, sellers, and team
            for making these achievements possible.
          </p>
        </div>
      </div>
    </div>
  );
}
