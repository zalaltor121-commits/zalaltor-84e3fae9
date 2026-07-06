import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead, type ServiceContent } from "@/lib/service-page";

const content: ServiceContent = {
  slug: "business-websites",
  title: "Business Website Design & Development | Zalaltor",
  h1: "Business Websites",
  serviceType: "Business Website Design and Development",
  intro:
    "Premium, high-converting business websites engineered to build trust, generate leads and grow revenue — designed and built by Zalaltor.",
  description:
    "Custom business website design and development by Zalaltor. Fast, SEO-ready, conversion-focused sites that turn visitors into paying customers.",
  features: [
    { title: "Custom brand-led design", desc: "No templates. Every layout, color and motion decision is made around your brand and audience." },
    { title: "Conversion-first UX", desc: "Structured to guide the visitor from headline to CTA with clear hierarchy and social proof." },
    { title: "Lightning-fast performance", desc: "Optimized images, edge rendering and modern stacks for sub-second loads and 90+ Lighthouse scores." },
    { title: "SEO foundations built in", desc: "Semantic HTML, structured data, sitemaps and metadata handled from day one." },
    { title: "Mobile-first responsive", desc: "Pixel-perfect on every device with thumb-friendly interactions and accessible contrast." },
    { title: "CMS or code — your call", desc: "Ship a fully coded site or a lightweight CMS your team can edit without breaking design." },
  ],
  outcomes: [
    "More qualified leads from organic and paid traffic",
    "Stronger brand credibility in your niche",
    "Faster sales cycles thanks to clearer positioning",
    "A site your team is proud to send to prospects",
  ],
  faq: [
    { q: "How long does a business website take?", a: "Most projects launch in 2–4 weeks depending on scope, content readiness and revision rounds." },
    { q: "Do you write the copy?", a: "We can. We collaborate with a copywriter on positioning and page copy when clients need it." },
    { q: "Can I update the site myself later?", a: "Yes. We can ship with a lightweight CMS or leave clear docs so any developer can maintain it." },
  ],
};

export const Route = createFileRoute("/services/business-websites")({
  head: () => serviceHead(content),
  component: () => <ServicePage content={content} />,
});
