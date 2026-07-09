import Hero from "../modules/home/hero/page";
import "./globals.css";
import Section1 from "../modules/home/section1/page";
import Section2 from "../modules/home/section2/page";
import Categories from "../modules/home/categories/pages";
import Section3 from "../modules/home/section3/Page";
import Section4 from "../modules/home/section4/Page";
import Section5 from "../modules/home/section5/Page";
import ProductsSection from "../modules/home/PRoductsSection/Page";
export default function HomePage() {
  return (
    <main>
      <section className="container py-16">
        <Hero />
        <Section1 />
        <Section2 />
        <Categories />
        <ProductsSection />
        <Section3 />
        <Section4 />
        <Section5 />
      </section>
    </main>
  );
}
