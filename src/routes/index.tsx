import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Flame, Clock, Leaf, ShieldCheck, Star, MapPin, Phone, Mail,
  Menu as MenuIcon, X, Instagram, Facebook, ArrowRight, Sparkles,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import chickenWrap from "@/assets/chicken-wrap.jpg";
import spicyWrap from "@/assets/spicy-wrap.jpg";
import beefWrap from "@/assets/beef-wrap.jpg";
import loadedFries from "@/assets/loaded-fries.jpg";
import burger from "@/assets/burger.jpg";
import clubSandwich from "@/assets/club-sandwich.jpg";
import drinks from "@/assets/drinks.jpg";
import interior from "@/assets/interior.jpg";
import making from "@/assets/making.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wrap Station — Fresh Wraps. Bold Flavors." },
      { name: "description", content: "Wrap Station serves fresh chicken & beef wraps, loaded fries, burgers, sandwiches and refreshing drinks — made daily with premium ingredients in Rawalpindi." },
      { property: "og:title", content: "Wrap Station — Fresh Wraps. Bold Flavors." },
      { property: "og:description", content: "Premium fast-casual wraps, burgers and loaded fries made fresh daily." },
      { property: "og:url", content: "/" },
      { property: "og:image", content: hero },
      { name: "twitter:image", content: hero },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "Wrap Station",
          servesCuisine: ["Fast Food", "Wraps", "Burgers"],
          priceRange: "Rs 1–1,000",
          telephone: "+92 328 3777553",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Afghan house, main Commercial Market Rd, opposite Askari bank, B-Block, Satellite Town",
            addressLocality: "Rawalpindi",
            addressCountry: "PK",
          },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.4", reviewCount: "681" },
          openingHours: "Mo-Su 15:00-02:00",
        }),
      },
    ],
  }),
  component: Index,
});

const menu = [
  { name: "Chicken Wrap", desc: "Grilled chicken, fresh greens, signature creamy sauce in a warm tortilla.", price: "Rs 450", img: chickenWrap, tag: "Bestseller" },
  { name: "Spicy Chicken Wrap", desc: "Fiery marinated chicken, chili flakes, peppers — for the bold.", price: "Rs 490", img: spicyWrap, tag: "Hot" },
  { name: "Beef Wrap", desc: "Tender beef strips, caramelized onions and melted cheese.", price: "Rs 550", img: beefWrap },
  { name: "Loaded Fries", desc: "Crispy fries piled with cheese, chicken, jalapeños and sauces.", price: "Rs 520", img: loadedFries, tag: "Sharing" },
  { name: "Classic Burger", desc: "Juicy beef patty, cheddar, lettuce, tomato on a toasted bun.", price: "Rs 600", img: burger },
  { name: "Club Sandwich", desc: "Triple-decker with chicken, crispy bacon, lettuce and tomato.", price: "Rs 580", img: clubSandwich },
  { name: "Fresh Drinks", desc: "Mint lemonade, berry fizz and classic lemon — ice cold.", price: "Rs 180", img: drinks },
];

const reviews = [
  { name: "Qasim Ali Zaidi", role: "Local Guide", text: "Amazing food and speedy delivery! Burgers were juicy and flavorful. Friendly staff and cozy ambiance — highly recommend.", stars: 5 },
  { name: "Saqib Mehmood", role: "Customer", text: "Visited the Commercial branch — the Value Box Deal is incredible. Staff is polite and humble, management is great.", stars: 5 },
  { name: "Ayesha Khan", role: "Customer", text: "The spicy chicken wrap is unreal. Fresh, generous portions, and the sauce is addictive. My new go-to spot.", stars: 5 },
  { name: "Hamza R.", role: "Customer", text: "Loaded fries are easily the best in Rawalpindi. Cheesy, crunchy and perfectly seasoned every time.", stars: 4 },
];

const nav = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[var(--ink)]/90 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <a href="#home" className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--ember)] text-[var(--brand-foreground)] font-display text-lg">W</span>
            <span className="truncate font-display text-2xl sm:text-3xl text-[var(--cream)]">Wrap Station</span>
          </a>
          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-semibold text-[var(--cream)]/85 hover:text-[var(--ember)] transition-colors">
                {n.label}
              </a>
            ))}
            <Link to="/order" className="btn-primary text-sm">Order Now <ArrowRight className="w-4 h-4" /></Link>
          </nav>
          <button
            className="md:hidden grid h-10 w-10 place-items-center rounded-full bg-[var(--cream)]/10 text-[var(--cream)]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden bg-[var(--ink)]/95 backdrop-blur-md border-t border-white/10 animate-fade-in">
            <div className="px-5 py-4 flex flex-col gap-3">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="text-[var(--cream)]/90 py-2 font-semibold"
                >
                  {n.label}
                </a>
              ))}
              <Link to="/order" onClick={() => setOpen(false)} className="btn-primary mt-2">Order Now</Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-[100svh] flex items-center overflow-hidden">
        <img
          src={hero}
          alt="Fresh chicken wrap with grilled chicken and creamy sauce"
          className="absolute inset-0 w-full h-full object-cover"
          width={1600}
          height={1200}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--ink)]/95 via-[var(--ink)]/70 to-[var(--ink)]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-28 pb-20 sm:py-32 w-full">
          <div className="max-w-2xl animate-fade-in">
            <span className="chip bg-[var(--ember)]/20 text-[var(--ember)]">
              <Sparkles className="w-3.5 h-3.5" /> Rawalpindi · 4.4 ★ (681 reviews)
            </span>
            <h1 className="mt-5 font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] text-[var(--cream)]">
              Fresh Wraps. <br />
              <span className="bg-gradient-to-r from-[var(--ember)] to-[var(--brand)] bg-clip-text text-transparent">
                Bold Flavors.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-base sm:text-lg text-[var(--cream)]/80">
              Made fresh daily with premium ingredients. Hand-rolled wraps, sizzling burgers and loaded fries — built for cravings.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/order" className="btn-primary">Order Now <ArrowRight className="w-4 h-4" /></Link>
              <a href="#menu" className="btn-outline">View Menu</a>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-[var(--cream)]/70 text-sm">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--ember)]" /> Open 3 PM – Late</div>
              <div className="flex items-center gap-2"><Leaf className="w-4 h-4 text-[var(--ember)]" /> 100% Fresh Daily</div>
              <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-[var(--ember)]" /> Hand-rolled</div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative">
            <img
              src={making}
              alt="Chef wrapping a fresh wrap by hand"
              loading="lazy"
              width={1024}
              height={1024}
              className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
            />
            <div className="absolute -bottom-6 -right-4 sm:-right-8 bg-[var(--ink)] text-[var(--cream)] rounded-2xl p-5 sm:p-6 shadow-xl max-w-[15rem]">
              <div className="font-display text-4xl text-[var(--ember)]">10+</div>
              <div className="text-sm opacity-80 mt-1">years of rolling Rawalpindi's favorite wraps</div>
            </div>
          </div>
          <div>
            <span className="chip">Our Story</span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-tight">
              Crafted with fire, <span className="text-[var(--brand)]">served with love.</span>
            </h2>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              Wrap Station started with a simple idea — make the kind of wraps you'd cross town for. Today, from our Commercial Market kitchen, we hand-roll every order with marinated meats, fresh produce, and sauces we make in-house.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              No shortcuts. No yesterday's prep. Just bold flavors, quick service, and food we'd proudly feed our own family.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { k: "681+", v: "Reviews" },
                { k: "4.4★", v: "Rated" },
                { k: "50k+", v: "Wraps served" },
              ].map((s) => (
                <div key={s.v} className="rounded-2xl bg-card p-4 text-center shadow-sm border">
                  <div className="font-display text-3xl text-[var(--brand)]">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="py-20 sm:py-28 bg-[var(--ink)] text-[var(--cream)] relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-[var(--brand)]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-[var(--ember)]/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="chip bg-[var(--ember)]/20 text-[var(--ember)]">Popular Menu</span>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-tight">
                The fan favorites
              </h2>
            </div>
            <p className="max-w-md text-[var(--cream)]/70">
              Every item below is hand-prepared to order. Prices may vary at the counter.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menu.map((item, i) => (
              <article
                key={item.name}
                className="group card-hover rounded-3xl overflow-hidden bg-[var(--cream)] text-[var(--ink)] shadow-xl"
                style={{ animation: `fade-in 0.6s ease-out both`, animationDelay: `${i * 60}ms` }}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    width={1024}
                    height={768}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {item.tag && (
                    <span className="absolute top-3 left-3 chip bg-[var(--brand)] text-[var(--brand-foreground)]">
                      {item.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl">{item.name}</h3>
                    <span className="font-display text-2xl text-[var(--brand)] shrink-0">{item.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="chip">Why Choose Us</span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-tight">
              Quality you can <span className="text-[var(--brand)]">taste.</span>
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Leaf, title: "Fresh Ingredients", text: "Locally sourced produce, marinated daily." },
              { icon: Flame, title: "Fast Service", text: "Hot, hand-rolled and out the door in minutes." },
              { icon: Star, title: "Affordable Prices", text: "Premium taste without the premium tag." },
              { icon: ShieldCheck, title: "Hygienic Kitchen", text: "Clean prep stations, gloved handling, every order." },
            ].map((f) => (
              <div key={f.title} className="card-hover rounded-3xl bg-card border p-7 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--ember)] text-[var(--brand-foreground)]">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl">{f.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-20 sm:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <span className="chip">Gallery</span>
              <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-tight">A taste of the vibe</h2>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {[
              { src: chickenWrap, cls: "row-span-2 aspect-[3/4]" },
              { src: loadedFries, cls: "aspect-square" },
              { src: burger, cls: "aspect-square" },
              { src: interior, cls: "col-span-2 aspect-[2/1]" },
              { src: beefWrap, cls: "aspect-square" },
              { src: drinks, cls: "aspect-square" },
              { src: spicyWrap, cls: "aspect-square" },
              { src: clubSandwich, cls: "aspect-square" },
            ].map((g, i) => (
              <div key={i} className={`overflow-hidden rounded-2xl group ${g.cls}`}>
                <img
                  src={g.src}
                  alt="Wrap Station gallery"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="chip">Customer Reviews</span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-tight">
              Loved by <span className="text-[var(--brand)]">681+</span> diners
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((r) => (
              <figure key={r.name} className="card-hover rounded-3xl bg-card border p-6 shadow-sm flex flex-col">
                <div className="flex gap-1 text-[var(--ember)]">
                  {Array.from({ length: r.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85 flex-1">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 pt-4 border-t">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--ember)] text-[var(--brand-foreground)] font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 sm:py-28 bg-[var(--ink)] text-[var(--cream)]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid gap-12 lg:grid-cols-2">
          <div>
            <span className="chip bg-[var(--ember)]/20 text-[var(--ember)]">Visit Us</span>
            <h2 className="mt-4 font-display text-4xl sm:text-6xl leading-tight">Come hungry. Leave happy.</h2>
            <p className="mt-4 text-[var(--cream)]/75 max-w-md">
              Drop in for dine-in, takeout or no-contact delivery. We're on Commercial Market Road, opposite Askari Bank.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand)]/20 text-[var(--ember)]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold">Address</div>
                  <div className="text-[var(--cream)]/70 text-sm">Afghan House, Commercial Market Rd, opposite Askari Bank, B-Block Satellite Town, Rawalpindi</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand)]/20 text-[var(--ember)]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Phone</div>
                  <a href="tel:+923283777553" className="text-[var(--cream)]/70 text-sm hover:text-[var(--ember)]">+92 328 3777553</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--brand)]/20 text-[var(--ember)]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Opening Hours</div>
                  <div className="text-[var(--cream)]/70 text-sm">Daily · 3:00 PM – 2:00 AM</div>
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <iframe
                title="Wrap Station location"
                src="https://www.google.com/maps?q=Wrap+Station+Commercial+Market+Rawalpindi&output=embed"
                className="w-full h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <form
            className="rounded-3xl bg-[var(--cream)] text-[var(--ink)] p-6 sm:p-8 shadow-2xl"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! We'll be in touch shortly.");
            }}
          >
            <h3 className="font-display text-3xl">Send us a message</h3>
            <p className="mt-1 text-sm text-muted-foreground">Questions, catering, or feedback — we read every one.</p>
            <div className="mt-6 grid gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</span>
                <input required className="rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholder="Your name" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</span>
                  <input required type="email" className="rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholder="you@email.com" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</span>
                  <input className="rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholder="03xx xxxxxxx" />
                </label>
              </div>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Message</span>
                <textarea required rows={5} className="rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--brand)]" placeholder="How can we help?" />
              </label>
              <button type="submit" className="btn-primary mt-2">Send Message <ArrowRight className="w-4 h-4" /></button>
            </div>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[var(--ink)] text-[var(--cream)]/80 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--ember)] text-[var(--brand-foreground)] font-display text-lg">W</span>
              <span className="font-display text-2xl text-[var(--cream)]">Wrap Station</span>
            </div>
            <p className="mt-4 max-w-sm text-sm">
              Fresh wraps, bold flavors. Hand-rolled in Rawalpindi since day one.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-[var(--brand)] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-[var(--brand)] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="mailto:hello@wrapstation.pk" aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full bg-white/5 hover:bg-[var(--brand)] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div>
            <div className="font-display text-lg text-[var(--cream)]">Explore</div>
            <ul className="mt-4 space-y-2 text-sm">
              {nav.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-[var(--ember)]">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-display text-lg text-[var(--cream)]">Visit</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li>Commercial Market Rd</li>
              <li>Satellite Town, Rawalpindi</li>
              <li>+92 328 3777553</li>
              <li>Daily 3 PM – 2 AM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--cream)]/60">
            <div>© {new Date().getFullYear()} Wrap Station. All rights reserved.</div>
            <div>Crafted with fire 🔥 in Rawalpindi.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
