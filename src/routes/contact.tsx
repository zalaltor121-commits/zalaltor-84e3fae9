import { createFileRoute } from "@tanstack/react-router";
import { Nav, Footer, ScrollProgress, Spotlight, Contact } from "@/lib/site-parts";

const URL = "https://zalaltor.lovable.app/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Zalaltor — Let's Build Something Exceptional" },
      { name: "description", content: "Tell us about your business and goals. Zalaltor replies within one business day with next steps and ideas." },
      { property: "og:title", content: "Contact Zalaltor" },
      { property: "og:description", content: "Start your project with a premium web agency — reply within one business day." },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Contact Zalaltor" },
      { name: "twitter:description", content: "Let's build something exceptional." },
    ],
    links: [{ rel: "canonical", href: URL }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <ScrollProgress />
      <Spotlight />
      <Nav />
      <div className="pt-24">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
