import "./globals.css";
import { Navbar5 } from "../components/navbar5";

export default function HomePage() {
  return (
    <main>
      <Navbar5 />
      <section className="container py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Multivendor marketplace
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Browse products, sign in, or create an account to get started.
        </p>
      </section>
    </main>
  );
}