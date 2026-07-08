import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Nav, Footer, ScrollProgress, Spotlight, Process } from "@/lib/site-parts";

const URL = "https://zalaltor.lovable.app/process";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "Our Process — From Idea to Launch | Zalaltor" },
      { name: "description", content: "A proven 5-step framework — discovery, planning, design, development, launch — that we use on every Zalaltor project." },
      { property: "og:title", content: "Our Process — Zalaltor" },
      { property: "og:description", content: "Transparent, collaborative and fast — the 5-step framework behind every project." },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Our Process — Zalaltor" },
      { name: "twitter:description", content: "From idea to launch, in 5 steps." },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ProcessPage,
});

function ProcessPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <ScrollProgress />
      <Spotlight />
      <Nav />
      <div className="pt-24">
        <Process />
        <section className="relative py-20 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <Link to="/contact" className="btn-primary">Start a project <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
