import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav, Footer, ScrollProgress, Spotlight, Portfolio, Reveal, CardSpotlight } from "@/lib/site-parts";

const URL = "https://zalaltor.lovable.app/work";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Our Work — Case Studies | Zalaltor" },
      { name: "description", content: "Selected case studies and live projects built by Zalaltor across law, retail, hospitality and SaaS." },
      { property: "og:title", content: "Our Work — Zalaltor Case Studies" },
      { property: "og:description", content: "Explore live projects and case studies engineered end-to-end for performance and conversion." },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Our Work — Zalaltor" },
      { name: "twitter:description", content: "Case studies built to convert." },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: WorkPage,
});

const SERVICE_LINKS = [
  { to: "/services/business-websites" as const, label: "Business Websites" },
  { to: "/services/ecommerce" as const, label: "E-commerce Stores" },
  { to: "/services/booking-systems" as const, label: "Booking Systems" },
];

function WorkPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <ScrollProgress />
      <Spotlight />
      <Nav />
      <div className="pt-24">
        <Portfolio />
        <section className="relative pb-28">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mx-auto mb-10 max-w-2xl text-center">
              <div className="chip mb-4">Related Services</div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                <span className="text-gradient">Explore</span> what we build.
              </h2>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {SERVICE_LINKS.map((s) => (
                <Link key={s.to} to={s.to} className="group block rounded-2xl">
                  <CardSpotlight className="glass card-hover h-full rounded-2xl p-6">
                    <h3 className="font-display text-lg font-semibold">{s.label}</h3>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </CardSpotlight>
                </Link>
              ))}
            </div>
            <div className="mt-14 text-center">
              <Link to="/contact" className="btn-primary">Start your project <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
