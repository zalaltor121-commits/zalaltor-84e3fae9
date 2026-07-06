import { createFileRoute } from "@tanstack/react-router";
import { ServicePage, serviceHead, type ServiceContent } from "@/lib/service-page";

const content: ServiceContent = {
  slug: "ecommerce",
  title: "E-commerce Website Development | Zalaltor",
  h1: "E-commerce Stores",
  serviceType: "E-commerce Website Design and Development",
  intro:
    "High-performance online stores built to sell — beautiful product pages, frictionless checkout and the analytics you need to grow revenue.",
  description:
    "Custom e-commerce development by Zalaltor. Fast, conversion-optimized online stores on Shopify or headless stacks with checkout, payments and analytics.",
  features: [
    { title: "Conversion-tuned product pages", desc: "Sharp imagery, trust cues and the right CTA placement — designed to lift add-to-cart rates." },
    { title: "Frictionless checkout", desc: "Multiple payment methods, express checkout and cart recovery to reduce drop-off." },
    { title: "Inventory & orders you control", desc: "Clean admin flows so your team can manage products, stock and fulfilment without friction." },
    { title: "Analytics & tracking", desc: "GA4, Meta Pixel and server-side events wired properly so your ad spend is measurable." },
    { title: "SEO for product discovery", desc: "Structured data, sitemaps and category pages built to rank for buyer intent." },
    { title: "Scales with you", desc: "Shopify, headless commerce or custom — chosen based on your catalog and roadmap." },
  ],
  outcomes: [
    "Higher conversion rate on every product page",
    "Lower checkout abandonment",
    "Better ROAS from properly tracked campaigns",
    "A store your team can operate confidently",
  ],
  faq: [
    { q: "Shopify or custom?", a: "Shopify for most brands under 10k SKUs. Headless or custom when you need bespoke UX, B2B pricing, or unusual integrations." },
    { q: "Do you handle migrations?", a: "Yes — from WooCommerce, Wix, Magento or an existing Shopify theme, with URL redirects to preserve SEO." },
    { q: "Can you integrate our POS or ERP?", a: "Yes. We integrate with the common POS, ERP and accounting tools via their APIs or middleware." },
  ],
};

export const Route = createFileRoute("/services/ecommerce")({
  head: () => serviceHead(content),
  component: () => <ServicePage content={content} />,
});
