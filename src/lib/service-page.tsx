import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { ZalaltorMark } from "@/components/ZalaltorLogo";

export type ServiceContent = {
  slug: "business-websites" | "ecommerce" | "booking-systems";
  title: string;
  h1: string;
  intro: string;
  description: string;
  serviceType: string;
  features: { title: string; desc: string }[];
  outcomes: string[];
  faq: { q: string; a: string }[];
};

const BASE = "https://zalaltor.lovable.app";

export function serviceHead(c: ServiceContent) {
  const url = `${BASE}/services/${c.slug}`;
  return {
    meta: [
      { title: c.title },
      { name: "description", content: c.description },
      { property: "og:title", content: c.title },
      { property: "og:description", content: c.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: c.title },
      { name: "twitter:description", content: c.description },
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.h1,
          serviceType: c.serviceType,
          description: c.description,
          areaServed: "Worldwide",
          provider: {
            "@type": "ProfessionalService",
            name: "Zalaltor",
            url: BASE,
            email: "zalaltor121@gmail.com",
            telephone: "+923705104014",
          },
          url,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE + "/" },
            { "@type": "ListItem", position: 2, name: "Services", item: BASE + "/#services" },
            { "@type": "ListItem", position: 3, name: c.h1, item: url },
          ],
        }),
      },
      ...(c.faq.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: c.faq.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              }),
            },
          ]
        : []),
    ],
  };
}

export function ServicePage({ content }: { content: ServiceContent }) {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(60%_50%_at_20%_10%,color-mix(in_oklab,var(--brand)_25%,transparent),transparent_60%),radial-gradient(50%_40%_at_80%_0%,color-mix(in_oklab,var(--accent2)_25%,transparent),transparent_60%)]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <ZalaltorMark size={36} variant="accent" />
          <span className="font-display text-lg font-semibold">Zalaltor</span>
        </Link>
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>
      </header>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-16 pt-10 md:pt-20">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2 opacity-50">/</span>
          <span>Services</span>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-foreground">{content.h1}</span>
        </nav>

        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-gradient">{content.h1}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{content.intro}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/"
            hash="contact"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent2)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition-transform hover:scale-[1.02]"
          >
            Start your project <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/923705104014"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-foreground/90 transition-colors hover:bg-white/5"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">What you get</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-10">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Outcomes we design for</h2>
        <ul className="mt-6 space-y-3">
          {content.outcomes.map((o) => (
            <li key={o} className="flex items-start gap-3 text-foreground/90">
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/20 text-[var(--brand)]">
                <Check className="h-3 w-3" />
              </span>
              <span>{o}</span>
            </li>
          ))}
        </ul>
      </section>

      {content.faq.length > 0 && (
        <section className="relative z-10 mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Frequently asked</h2>
          <div className="mt-8 space-y-4">
            {content.faq.map((f) => (
              <details
                key={f.q}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="cursor-pointer font-display font-semibold">{f.q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-6 text-center">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-10">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Ready to build your{" "}
            <span className="text-gradient">{content.h1.toLowerCase()}</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us about your project — we reply within 24 hours with a plan and a quote.
          </p>
          <Link
            to="/"
            hash="contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent2)] px-6 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Start your project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}