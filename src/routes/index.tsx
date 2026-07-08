import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import {
  Nav, Hero, Services, Footer, ScrollProgress, Spotlight,
  Reveal, TiltCard, CardSpotlight, PROJECTS,
} from "@/lib/site-parts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zalaltor — Websites That Turn Visitors Into Customers" },
      {
        name: "description",
        content:
          "Zalaltor is a premium web agency building high-converting websites, e-commerce stores, booking systems and AI experiences for ambitious businesses.",
      },
      { property: "og:title", content: "Zalaltor — Websites That Turn Visitors Into Customers" },
      {
        property: "og:description",
        content:
          "Custom websites, e-commerce, booking systems and AI automations designed to help businesses grow.",
      },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Zalaltor — Premium Web Agency" },
      { name: "twitter:description", content: "Where Vision Becomes Digital Reality." },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Zalaltor",
          description:
            "Premium web design agency building high-converting websites, e-commerce, booking systems and AI automations.",
          email: "zalaltor121@gmail.com",
          telephone: "+923705104014",
          areaServed: "Worldwide",
          slogan: "Where Vision Becomes Digital Reality.",
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <ScrollProgress />
      <Spotlight />
      <Nav />
      <Hero />
      <Services />
      <FeaturedWork />
      <ExploreMore />
      <Footer />
    </div>
  );
}

/* ---- Featured (3 projects, teaser) ---- */
function FeaturedWork() {
  const featured = PROJECTS.slice(0, 3);
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="chip mb-4">Featured Work</div>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              <span className="text-gradient">Recent projects</span>
              <br />
              engineered to convert.
            </h2>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:border-[var(--brand)]/50 hover:bg-white/10"
          >
            See all work <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((p) => (
            <Reveal key={p.name}>
              <TiltCard>
                <CardSpotlight className="glass card-hover h-full overflow-hidden rounded-2xl">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={`${p.name} website preview`}
                      loading="lazy"
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <div className="chip mb-3">{p.industry}</div>
                    <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                    <ul className="mt-4 grid grid-cols-2 gap-1.5">
                      {p.features.slice(0, 4).map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Check className="h-3.5 w-3.5 text-[var(--brand)]" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardSpotlight>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- Explore More CTA band ---- */
function ExploreMore() {
  const cards = [
    { to: "/work" as const, title: "See our work", desc: "Explore case studies and live projects across law, retail, hospitality and SaaS." },
    { to: "/about" as const, title: "Learn about us", desc: "How we combine strategy, design and engineering to ship measurable results." },
    { to: "/process" as const, title: "Our process", desc: "The 5-step framework we use on every project — transparent, collaborative, fast." },
    { to: "/contact" as const, title: "Get in touch", desc: "Tell us about your goals and we'll reply within one business day." },
  ];
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <div className="chip mb-4">Explore</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="text-gradient">Ready when</span> you are.
          </h2>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <Reveal key={c.to}>
              <Link
                to={c.to}
                className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60"
              >
                <CardSpotlight className="glass card-hover flex h-full flex-col justify-between rounded-2xl p-6">
                  <div>
                    <h3 className="font-display text-xl font-semibold">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </CardSpotlight>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
