import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent as ReactMouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Sparkles, Layers, ShoppingBag, CalendarCheck,
  Rocket, Bot, Wand2, Smartphone, Search, Zap, LifeBuoy, Code2,
  Compass, ClipboardList, Palette, Cpu, Send, Mail, Phone, MessageCircle,
  Star, Menu as MenuIcon, X, Check,
} from "lucide-react";

import turnerImg from "@/assets/portfolio/turner.png";
import cramerImg from "@/assets/portfolio/cramer.png";
import wrapImg from "@/assets/portfolio/wrapstation.png";
import afzalImg from "@/assets/portfolio/afzal.jpg";
import uppercutImg from "@/assets/portfolio/uppercut.png";
import { ZalaltorLogo, ZalaltorMark } from "@/components/ZalaltorLogo";

/* ============================================================
   PRIMITIVES
   ============================================================ */

export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Respect reduced-motion + skip on touch/small screens for perf.
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isCoarse || reduced) return;
    let raf = 0;
    let lx = 0, ly = 0;
    const handler = (e: MouseEvent) => {
      lx = e.clientX; ly = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        x.set(lx); y.set(ly);
        raf = 0;
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y]);
  return { x, y };
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-[var(--brand)] via-[var(--accent2)] to-[var(--brand)]"
    />
  );
}

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(60%_50%_at_20%_20%,color-mix(in_oklab,var(--brand)_35%,transparent)_0%,transparent_60%),radial-gradient(50%_40%_at_80%_10%,color-mix(in_oklab,var(--accent2)_35%,transparent)_0%,transparent_60%),radial-gradient(60%_50%_at_60%_80%,color-mix(in_oklab,var(--brand)_25%,transparent)_0%,transparent_60%)]" />
      <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[70vh] w-[120vw] -translate-x-1/2 blur-3xl"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, color-mix(in oklab, var(--brand) 40%, transparent), color-mix(in oklab, var(--accent2) 30%, transparent), color-mix(in oklab, var(--brand) 40%, transparent))",
          opacity: 0.35,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 [background-image:linear-gradient(color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
    </div>
  );
}

export function Spotlight() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!isCoarse && !reduced);
  }, []);
  const { x, y } = useMousePosition();
  const bx = useSpring(x, { stiffness: 60, damping: 20 });
  const by = useSpring(y, { stiffness: 60, damping: 20 });
  const bg = useTransform([bx, by], ([lx, ly]: number[]) =>
    `radial-gradient(600px circle at ${lx}px ${ly}px, color-mix(in oklab, var(--brand) 22%, transparent), transparent 70%)`
  );
  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{ background: bg as unknown as string, willChange: "background" }}
      className="pointer-events-none fixed inset-0 z-30 mix-blend-screen"
    />
  );
}

export function FloatingOrbs() {
  const orbs = [
    { size: 220, x: "8%", y: "20%", delay: 0, color: "var(--brand)" },
    { size: 160, x: "80%", y: "30%", delay: 1.5, color: "var(--accent2)" },
    { size: 120, x: "70%", y: "75%", delay: 0.8, color: "var(--brand)" },
    { size: 90, x: "15%", y: "70%", delay: 2.2, color: "var(--accent2)" },
  ];
  return (
    <div className="pointer-events-none absolute inset-0">
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            background: `radial-gradient(circle, color-mix(in oklab, ${o.color} 60%, transparent), transparent 70%)`,
          }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, delay: o.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function AnimatedWords({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.15em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Reveal({
  children,
  y = 30,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={`${variant === "primary" ? "btn-primary" : "btn-outline"} ${className}`}
    >
      {children}
    </motion.a>
  );
}

export function TiltCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });

  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function CardSpotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useTransform([mx, my], ([lx, ly]: number[]) =>
    `radial-gradient(320px circle at ${lx}px ${ly}px, color-mix(in oklab, var(--brand) 25%, transparent), transparent 60%)`
  );
  const onMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`group relative overflow-hidden ${className}`}>
      <motion.div
        style={{ background: bg as unknown as string }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {children}
    </div>
  );
}

export function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  // Render the final value on the server so crawlers see the real number,
  // then animate from 0 -> to on the client once in view.
  const [val, setVal] = useState(to);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    setVal(0);
  }, []);
  useEffect(() => {
    if (!inView || !hydrated) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, hydrated]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ============================================================
   DATA
   ============================================================ */

export type Project = {
  name: string;
  industry: string;
  description: string;
  features: string[];
  tech: string[];
  url: string;
  image: string;
};

export const PROJECTS: Project[] = [
  {
    name: "Turner Law Offices",
    industry: "Law Firm — Iowa",
    description:
      "A trust-first legal presence with cinematic hero, animated practice areas and a conversion-optimized consultation funnel.",
    features: ["Consultation Funnel", "Practice Areas", "Google Reviews", "Local SEO"],
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    url: "https://sparkling-pastelito-4f1b1e.netlify.app/",
    image: turnerImg,
  },
  {
    name: "Cramer Law Services",
    industry: "Law Firm — Dallas",
    description:
      "Editorial, high-conviction brand system with case-results storytelling, attorney profiles and a premium intake flow.",
    features: ["Case Results", "Attorney Profiles", "Intake Flow", "FAQ System"],
    tech: ["React", "TypeScript", "Tailwind", "GSAP"],
    url: "https://cramerlawservices.lovable.app",
    image: cramerImg,
  },
  {
    name: "Wrap Station",
    industry: "Restaurant — Rawalpindi",
    description:
      "A bold fast-casual brand with interactive menu, WhatsApp ordering and a mobile-first cart built for peak dinner traffic.",
    features: ["Online Ordering", "Interactive Menu", "WhatsApp Checkout", "Cart System"],
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    url: "https://animated-beijinho-1a81da.netlify.app",
    image: wrapImg,
  },
  {
    name: "Style by Afzal",
    industry: "Barbershop — Islamabad",
    description:
      "An editorial newspaper-style barbershop brand with live deals, membership tiers and a frictionless online booking flow.",
    features: ["Online Booking", "Deals & Offers", "Membership Plans", "Editorial Design"],
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    url: "https://style-by-afzal.vercel.app/",
    image: afzalImg,
  },
  {
    name: "The UpperCut Barber",
    industry: "Barbershop — Florida",
    description:
      "Warm editorial branding meets a frictionless booking experience — built to convert walk-ins into regulars.",
    features: ["Online Booking", "Barber Profiles", "Gallery", "Reviews"],
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    url: "https://chic-frangollo-52fe15.netlify.app/",
    image: uppercutImg,
  },
];

export const SERVICES = [
  { icon: Layers, title: "Business Websites", desc: "Custom marketing sites engineered to build trust and generate qualified leads.", href: "/services/business-websites" as const },
  { icon: ShoppingBag, title: "E-commerce Stores", desc: "Conversion-focused online stores with fast checkout and elegant product storytelling.", href: "/services/ecommerce" as const },
  { icon: CalendarCheck, title: "Booking Systems", desc: "Appointment and reservation platforms that fill your calendar on autopilot.", href: "/services/booking-systems" as const },
  { icon: Rocket, title: "Landing Pages", desc: "High-converting campaign pages built to turn ad spend into paying customers." },
  { icon: Bot, title: "AI Automations", desc: "AI chat, lead qualifiers and workflow automations that scale your operations." },
  { icon: Wand2, title: "Website Redesigns", desc: "Modernize your outdated site into a premium, mobile-first digital experience." },
];

export const WHY = [
  { icon: Palette, title: "Modern Design", desc: "Award-quality visuals crafted with intention — not templates." },
  { icon: Smartphone, title: "Mobile Optimization", desc: "Pixel-perfect experiences on every device your customers use." },
  { icon: Search, title: "SEO Optimization", desc: "Built to rank — structured data, semantic HTML, performance-first." },
  { icon: Zap, title: "Fast Performance", desc: "Sub-second loads. Optimized assets. Best-in-class Core Web Vitals." },
  { icon: LifeBuoy, title: "Reliable Support", desc: "Real humans, real fast. We're partners, not vendors." },
  { icon: Code2, title: "Professional Development", desc: "Clean, maintainable code you can scale for years, not months." },
];

export const PROCESS = [
  { icon: Compass, title: "Discovery", desc: "We dive deep into your business, goals and audience." },
  { icon: ClipboardList, title: "Planning", desc: "A precise strategy, sitemap and conversion architecture." },
  { icon: Palette, title: "Design", desc: "Premium visual direction, refined until it feels inevitable." },
  { icon: Cpu, title: "Development", desc: "Clean, performant code — animated with craftsmanship." },
  { icon: Rocket, title: "Launch", desc: "We ship, measure and iterate — long after go-live." },
];

export const TESTIMONIALS = [
  { name: "Ahmed R.", role: "Founder, Retail Brand", quote: "Zalaltor delivered a site that outperformed our previous version 3x in conversions. Truly world-class." },
  { name: "Sarah L.", role: "Marketing Director", quote: "From strategy to launch, every detail was considered. Our brand finally looks the way we always felt." },
  { name: "James O.", role: "Restaurant Owner", quote: "Orders started coming in within days of launch. The design is stunning and the ordering flow just works." },
  { name: "Priya K.", role: "Legal Partner", quote: "Professional, fast and creative. Our new site changed how clients perceive our firm." },
  { name: "Marco T.", role: "E-commerce Founder", quote: "The best agency experience I've had. Our storefront finally matches the quality of our products." },
  { name: "Ayesha M.", role: "Studio Owner", quote: "Zalaltor understood our vision immediately and elevated it. Bookings are up dramatically." },
  { name: "Paulo Coelho", role: "Author", quote: "If I must fall, may it be from a high place." },
];

/* ============================================================
   PAGE
   ============================================================ */
/* ---------------- NAV ---------------- */

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = [
    { href: "/", label: "Home" },
    { href: "/work", label: "Work" },
    { href: "/#services", label: "Services" },
    { href: "/process", label: "Process" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];
  // Lock body scroll when overlay is open.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-300 md:top-6 md:px-6 ${scrolled ? "glass shadow-[0_20px_60px_-30px_rgba(0,0,0,0.6)]" : "bg-transparent"}`}
    >
      <a
        href="#top"
        aria-label="Zalaltor — home"
        className="group flex items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60"
      >
        <span className="relative inline-flex transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
          <span className="absolute inset-0 -z-10 rounded-full bg-[var(--brand)]/25 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          <ZalaltorLogo size={36} variant="accent" />
        </span>
      </a>
      <nav className="hidden items-center gap-1 md:flex">
        {links.filter((l) => l.href !== "#top").map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="relative z-10">{l.label}</span>
            <span className="absolute inset-0 rounded-full bg-white/0 transition-colors hover:bg-white/5" />
          </a>
        ))}
      </nav>
      <div className="hidden md:block">
        <Link to="/contact" className="btn-primary text-sm">Start a Project <ArrowRight className="h-4 w-4" /></Link>
      </div>
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-[70] rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur md:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <MobileMenuOverlay links={links} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function MobileMenuOverlay({
  links,
  onClose,
}: {
  links: { href: string; label: string }[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[65] md:hidden"
      style={{ willChange: "opacity" }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className="absolute inset-0 bg-[color-mix(in_oklab,var(--ink)_82%,transparent)] backdrop-blur-2xl"
      />
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(60%_50%_at_20%_20%,color-mix(in_oklab,var(--brand)_25%,transparent)_0%,transparent_60%),radial-gradient(50%_40%_at_80%_80%,color-mix(in_oklab,var(--accent2)_25%,transparent)_0%,transparent_60%)]" />

      {/* Panel */}
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -12, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full flex-col px-6 pb-10 pt-24"
      >
        <div className="mb-4 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Menu</div>
        <nav className="flex flex-col">
          {links.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              onClick={onClose}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.08 + i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group flex items-center justify-between border-b border-white/10 py-4"
            >
              <span className="font-display text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
                {l.label}
              </span>
              <ArrowUpRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>
          ))}
        </nav>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.08 + links.length * 0.06 + 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <Link to="/contact" onClick={onClose} className="btn-primary w-full text-base">
            Start Your Project <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.08 + links.length * 0.06 + 0.12 }}
          className="mt-auto space-y-2 pt-10 text-sm text-muted-foreground"
        >
          <div className="text-[11px] uppercase tracking-[0.3em]">Get in touch</div>
          <a href="mailto:zalaltor121@gmail.com" className="block truncate text-foreground/90 hover:text-foreground">zalaltor121@gmail.com</a>
          <a href="tel:+923139120755" className="block text-foreground/80 hover:text-foreground">+92 313 9120755</a>
          <a href="https://wa.me/923139120755" className="block text-foreground/80 hover:text-foreground">WhatsApp · +92 313 9120755</a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- HERO ---------------- */

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden pt-32">
      <AuroraBackground />
      <FloatingOrbs />
      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-[var(--brand)]" />
          Build. Grow. Succeed
        </motion.div>

        <h1 className="text-gradient font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <AnimatedWords text="Websites That Turn" />
          <br />
          <AnimatedWords text="Visitors Into Customers" delay={0.35} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mx-auto mt-8 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          Custom websites, e-commerce stores, booking systems and digital experiences
          designed to help ambitious businesses grow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <MagneticButton href="/work" variant="primary">
            View Our Work <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="/contact" variant="outline">
            Book a Consultation
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span>Trusted by ambitious brands</span>
          <span className="opacity-40">•</span>
          <span>Law · Retail · Hospitality · SaaS</span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-[var(--brand)] to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------------- PORTFOLIO ---------------- */

export function Portfolio() {
  return (
    <section id="work" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="chip mb-4">Featured Work</div>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              <span className="text-gradient">Selected projects</span>
              <br />
              built to convert.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            A curated look at recent work — every project engineered end-to-end
            for performance, brand, and measurable business results.
          </p>
        </Reveal>

        <div className="space-y-24 md:space-y-32">
          {PROJECTS.map((p, i) => (
            <ProjectRow key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reverse = index % 2 === 1;
  return (
    <Reveal>
      <div className={`grid gap-10 md:grid-cols-12 md:items-center ${reverse ? "md:[direction:rtl]" : ""}`}>
        <div className="md:col-span-7 md:[direction:ltr]">
          <TiltCard className="group relative">
            <CardSpotlight className="relative overflow-hidden rounded-3xl border border-white/10 bg-[var(--surface)] p-2 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/30 px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  <span className="ml-3 truncate text-[11px] text-muted-foreground">{new URL(project.url).host}</span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={`${project.name} website preview`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </div>
            </CardSpotlight>
          </TiltCard>
        </div>

        <div className="md:col-span-5 md:[direction:ltr]">
          <div className="chip mb-4">{project.industry}</div>
          <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{project.name}</h3>
          <p className="mt-4 text-muted-foreground">{project.description}</p>

          <ul className="mt-6 grid grid-cols-2 gap-2">
            {project.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-[var(--brand)]" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-colors hover:border-[var(--brand)]/50 hover:bg-white/10"
            >
              Visit Live Site
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- SERVICES ---------------- */

export function Services() {
  return (
    <section id="services" className="relative py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(50%_40%_at_50%_0%,color-mix(in_oklab,var(--brand)_15%,transparent),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <div className="chip mb-4">Services</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-gradient">Everything you need</span> to grow online.
          </h2>
          <p className="mt-4 text-muted-foreground">
            From brand-defining websites to AI-powered systems — we design, build and scale.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05}>
              {s.href ? (
                <Link to={s.href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]/60 rounded-2xl" aria-label={`${s.title} — learn more`}>
                  <CardSpotlight className="glass card-hover h-full rounded-2xl p-7">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent2)]/20 text-[var(--brand)] ring-1 ring-white/10">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                    <div className="mt-6 flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[var(--brand)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </CardSpotlight>
                </Link>
              ) : (
                <CardSpotlight className="glass card-hover h-full rounded-2xl p-7">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent2)]/20 text-[var(--brand)] ring-1 ring-white/10">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </CardSpotlight>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY US ---------------- */

export function WhyUs() {
  const stats = [
    { value: 40, suffix: "+", label: "Projects Delivered" },
    { value: 98, suffix: "%", label: "Client Satisfaction" },
    { value: 3, suffix: "x", label: "Avg. Conversion Lift" },
    { value: 24, suffix: "/7", label: "Support Availability" },
  ];
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="chip mb-4">About Zalaltor</div>
              <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                <span className="text-gradient">Craftsmanship</span> you can measure.
              </h2>
              <p className="mt-4 max-w-md text-muted-foreground">
                We combine strategy, design and engineering — obsessing over every pixel and
                every millisecond so your business wins online.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-6">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="font-display text-3xl font-semibold text-gradient">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 sm:grid-cols-2">
              {WHY.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.05}>
                  <CardSpotlight className="glass h-full rounded-2xl p-6">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-[var(--accent2)] ring-1 ring-white/10">
                      <w.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{w.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{w.desc}</p>
                  </CardSpotlight>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PROCESS ---------------- */

export function Process() {
  return (
    <section id="process" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-20 max-w-2xl text-center">
          <div className="chip mb-4">Our Process</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-gradient">From idea</span> to launch.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A proven 5-step framework we use on every project — transparent, collaborative, and fast.
          </p>
        </Reveal>

        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--brand)]/40 to-transparent md:block" />
          <div className="space-y-14 md:space-y-24">
            {PROCESS.map((step, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={step.title}>
                  <div className="grid gap-6 md:grid-cols-2 md:items-center">
                    <div className={`${left ? "md:pr-16 md:text-right md:order-1" : "md:pl-16 md:order-2"}`}>
                      <div className="chip mb-3">Step 0{i + 1}</div>
                      <h3 className="font-display text-3xl font-semibold tracking-tight">{step.title}</h3>
                      <p className="mt-3 text-muted-foreground">{step.desc}</p>
                    </div>
                    <div className={`relative ${left ? "md:order-2" : "md:order-1"}`}>
                      <div className="glass mx-auto flex h-24 w-24 items-center justify-center rounded-3xl md:mx-0 md:h-32 md:w-32">
                        <step.icon className="h-9 w-9 text-[var(--brand)] md:h-11 md:w-11" />
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */

export function Testimonials() {
  const row1 = TESTIMONIALS;
  const row2 = [...TESTIMONIALS].reverse();
  return (
    <section id="testimonials" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto mb-16 max-w-3xl px-6 text-center">
        <Reveal>
          <div className="chip mb-4">Clients</div>
          <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            <span className="text-gradient">Loved</span> by founders and teams.
          </h2>
        </Reveal>
      </div>

      <Marquee items={row1} duration={40} />
      <div className="h-5" />
      <Marquee items={row2} duration={55} reverse />
    </section>
  );
}

export function Marquee({
  items,
  duration,
  reverse = false,
}: {
  items: typeof TESTIMONIALS;
  duration: number;
  reverse?: boolean;
}) {
  return (
    <div className="group relative [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-5"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {[0, 1].map((copy) =>
          items.map((t, i) => (
          <div
            key={`${copy}-${i}`}
            className="w-[340px] shrink-0 sm:w-[400px]"
            aria-hidden={copy === 1 ? "true" : undefined}
          >
            <CardSpotlight className="glass card-hover h-full rounded-2xl p-6">
              <div className="mb-3 flex items-center gap-1 text-[var(--accent2)]">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">“{t.quote}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--accent2)] font-display text-sm font-semibold text-[var(--ink)]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </CardSpotlight>
          </div>
          )),
        )}
      </motion.div>
    </div>
  );
}

/* ---------------- CONTACT ---------------- */

export function Contact() {
  return (
    <section id="contact" className="relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--surface)] p-8 sm:p-12 md:p-16">
          <div className="pointer-events-none absolute inset-0 opacity-80 [background:radial-gradient(60%_50%_at_20%_20%,color-mix(in_oklab,var(--brand)_25%,transparent)_0%,transparent_60%),radial-gradient(50%_40%_at_90%_10%,color-mix(in_oklab,var(--accent2)_25%,transparent)_0%,transparent_60%)]" />
          <div className="relative grid gap-12 md:grid-cols-2 md:items-start">
            <div>
              <Reveal>
                <div className="chip mb-4">Contact</div>
                <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                  <span className="text-gradient">Let's build something</span> exceptional.
                </h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Tell us about your business and goals. We'll get back within one business day
                  with next steps and ideas.
                </p>

                <div className="mt-10 space-y-4">
                  <ContactLine icon={Mail} label="Email" value="zalaltor121@gmail.com" href="mailto:zalaltor121@gmail.com" />
                  <ContactLine icon={Phone} label="Call" value="+92 313 9120755" href="tel:+923139120755" />
                  <ContactLine icon={MessageCircle} label="WhatsApp" value="+92 313 9120755" href="https://wa.me/923139120755" />
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <MultiStepLeadForm />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export type LeadData = {
  name: string;
  business: string;
  websiteType: string;
  phone: string;
  email: string;
  message: string;
};

export const WEBSITE_TYPES = [
  "Business Website",
  "E-commerce Store",
  "Booking System",
  "Landing Page",
  "Other",
];

export function MultiStepLeadForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState<LeadData>({
    name: "", business: "", websiteType: "", phone: "", email: "", message: "",
  });

  const steps: {
    key: keyof LeadData;
    title: string;
    subtitle?: string;
    type: "text" | "email" | "tel" | "textarea" | "choice";
    placeholder?: string;
    options?: string[];
    required?: boolean;
    validate?: (v: string) => string | null;
  }[] = [
    { key: "name", title: "What's your name?", subtitle: "Let's start with an introduction.", type: "text", placeholder: "e.g. Ahmed Khan", required: true },
    { key: "business", title: "What's your business name?", subtitle: "So we can tailor our reply.", type: "text", placeholder: "e.g. Zalaltor Studio", required: true },
    { key: "websiteType", title: "What type of website do you need?", subtitle: "Pick the closest match.", type: "choice", options: WEBSITE_TYPES, required: true },
    { key: "phone", title: "What's your phone number?", subtitle: "We'll only use this to contact you.", type: "tel", placeholder: "+92 3XX XXXXXXX", required: true },
    {
      key: "email", title: "What's your email address?", subtitle: "We'll send the proposal here.", type: "email", placeholder: "you@company.com", required: true,
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Please enter a valid email address.",
    },
    { key: "message", title: "Tell us about your project.", subtitle: "Goals, timeline, references — anything helps.", type: "textarea", placeholder: "We're launching a new brand and need…", required: true },
  ];

  const total = steps.length;
  const isThankYou = submitted;
  const progress = isThankYou ? 100 : (step / total) * 100;

  const current = steps[step];
  const value = current ? data[current.key] : "";
  const error = current?.validate && value ? current.validate(value) : null;
  const canProceed = current
    ? (!current.required || value.trim().length > 0) && !error
    : false;

  const goNext = () => {
    if (!canProceed) return;
    setDir(1);
    if (step < total - 1) setStep(step + 1);
    else submit();
  };
  const goBack = () => {
    if (step === 0) return;
    setDir(-1);
    setStep(step - 1);
  };

  const submit = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      await supabase.from("leads").insert({
        name: data.name,
        business: data.business || null,
        website_type: data.websiteType || null,
        phone: data.phone || null,
        email: data.email,
        message: data.message || null,
        source: "website",
      });
    } catch (err) {
      console.error("Lead insert failed", err);
    }
    setSubmitted(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && current?.type !== "textarea") {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{isThankYou ? "Complete" : `Step ${step + 1} of ${total}`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent2)]"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <div className="relative min-h-[280px]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          {isThankYou ? (
            <motion.div
              key="thankyou"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-6 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent2)]/20 ring-1 ring-white/10">
                <Send className="h-7 w-7 text-[var(--brand)]" />
              </div>
              <h3 className="font-display text-2xl font-semibold sm:text-3xl">Thank you, {data.name.split(" ")[0] || "friend"}!</h3>
              <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                We'll contact you shortly with next steps and ideas tailored to {data.business || "your business"}.
              </p>
              <a href="https://wa.me/923139120755" className="btn-primary mt-6">
                Chat on WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 id={`lead-step-${step}`} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                {current.title}
              </h3>
              {current.subtitle && (
                <p className="mt-2 text-sm text-muted-foreground">{current.subtitle}</p>
              )}

              <div className="mt-6">
                {current.type === "choice" ? (
                  <div className="grid gap-2">
                    {current.options!.map((opt) => {
                      const selected = value === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setData({ ...data, [current.key]: opt });
                            setTimeout(() => {
                              setDir(1);
                              setStep((s) => Math.min(s + 1, total - 1));
                            }, 180);
                          }}
                          className={`group flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "border-[var(--brand)]/60 bg-white/10"
                              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
                          }`}
                        >
                          <span className="font-medium">{opt}</span>
                          <ArrowRight className={`h-4 w-4 transition ${selected ? "text-[var(--brand)]" : "text-muted-foreground group-hover:translate-x-0.5"}`} />
                        </button>
                      );
                    })}
                  </div>
                ) : current.type === "textarea" ? (
                  <textarea
                    autoFocus
                    id={`lead-input-${current.key}`}
                    name={current.key}
                    aria-labelledby={`lead-step-${step}`}
                    value={value}
                    onChange={(e) => setData({ ...data, [current.key]: e.target.value })}
                    rows={5}
                    placeholder={current.placeholder}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
                  />
                ) : (
                  <input
                    autoFocus
                    id={`lead-input-${current.key}`}
                    name={current.key}
                    aria-labelledby={`lead-step-${step}`}
                    type={current.type}
                    value={value}
                    onChange={(e) => setData({ ...data, [current.key]: e.target.value })}
                    onKeyDown={onKeyDown}
                    placeholder={current.placeholder}
                    inputMode={current.type === "tel" ? "tel" : current.type === "email" ? "email" : "text"}
                    autoComplete={
                      current.key === "email" ? "email" :
                      current.key === "phone" ? "tel" :
                      current.key === "name" ? "name" :
                      current.key === "business" ? "organization" : "off"
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
                  />
                )}
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isThankYou && (
        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-muted-foreground transition hover:border-white/20 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4 rotate-180" /> Back
          </button>
          {current?.type !== "choice" && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === total - 1 ? "Submit" : "Next"}
              {step === total - 1 ? <Send className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ContactLine({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string; href: string }) {
  return (
    <a href={href} className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-[var(--brand)]/40 hover:bg-white/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent2)]/20 text-[var(--brand)] ring-1 ring-white/10">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </a>
  );
}

export function Field({
  label, value, onChange, type = "text", required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
      />
    </div>
  );
}

/* ---------------- FOOTER ---------------- */

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12">
      <figure className="mx-auto mb-10 max-w-3xl px-6 text-center">
        <blockquote className="font-display text-xl italic leading-snug text-foreground/90 sm:text-2xl">
          &ldquo;If I must fall, may it be from a high place.&rdquo;
        </blockquote>
        <figcaption className="mt-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          &mdash; Paulo Coelho
        </figcaption>
      </figure>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <ZalaltorMark size={36} variant="accent" animated={false} />
          <div>
            <div className="font-display text-sm font-semibold">Zalaltor</div>
            <div className="text-[11px] text-muted-foreground">Build. Grow. Succeed.</div>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground md:text-right">
          © {new Date().getFullYear()} Zalaltor. Crafted with care. <br className="md:hidden" />
          <a href="mailto:zalaltor121@gmail.com" className="hover:text-foreground">zalaltor121@gmail.com</a>
        </div>
      </div>
    </footer>
  );
}
