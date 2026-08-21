import { Users, TrendingUp, Heart } from "lucide-react";

const stories = [
  {
    name: "Fatima's Fashion House",
    owner: "Fatima Akter",
    location: "Dhaka",
    quote:
      "Starting on Bazaari transformed my small tailoring shop into a recognized brand. I now ship orders across the country.",
    impact: "Revenue grew by 300% within the first year.",
  },
  {
    name: "Tech Gadgets BD",
    owner: "Rahim Uddin",
    location: "Chittagong",
    quote:
      "The platform's logistics support made it easy for me to focus on sourcing the best gadgets while Bazaari handled delivery.",
    impact: "Expanded from 50 to 500+ product listings.",
  },
  {
    name: "Green Home Organics",
    owner: "Nusrat Jahan",
    location: "Sylhet",
    quote:
      "Bazaari helped me reach eco-conscious customers who value organic products. The community here is amazing.",
    impact: "Won the &quot;Best Sustainable Seller&quot; award in 2024.",
  },
];

export default function SuccessStoryPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Heart className="h-4 w-4" />
            Inspiring Journeys
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Success Stories
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Real sellers, real growth. Discover how Bazaari has helped entrepreneurs turn their
            passion into thriving businesses.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {story.owner.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold">{story.owner}</h3>
                  <p className="text-xs text-muted-foreground">{story.location}</p>
                </div>
              </div>
              <h4 className="font-bold mb-2">{story.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">{story.quote}</p>
              <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">{story.impact}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <Users className="mx-auto h-10 w-10 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your Story Could Be Next</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of successful sellers on Bazaari. Start your journey today and write your
            own success story.
          </p>
        </div>
      </div>
    </div>
  );
}
