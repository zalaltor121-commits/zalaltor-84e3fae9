import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav, Footer, ScrollProgress, Spotlight, WhyUs, Testimonials } from "@/lib/site-parts";

const URL = "https://zalaltor.lovable.app/about";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Zalaltor — Craftsmanship You Can Measure" },
      { name: "description", content: "Zalaltor combines strategy, design and engineering to help ambitious businesses win online with measurable results." },
      { property: "og:title", content: "About Zalaltor" },
      { property: "og:description", content: "Strategy, design and engineering — obsessing over every pixel and every millisecond." },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "About Zalaltor" },
      { name: "twitter:description", content: "Craftsmanship you can measure." },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <ScrollProgress />
      <Spotlight />
      <Nav />
      <div className="pt-24">
        <WhyUs />
        <Testimonials />
        <section className="relative py-20 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <Link to="/contact" className="btn-primary">Work with us <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
