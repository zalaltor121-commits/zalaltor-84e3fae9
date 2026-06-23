import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Search, X,
} from "lucide-react";
import { MENU, formatPKR, WHATSAPP_NUMBER, type MenuCategory } from "@/lib/menu-data";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Online — Wrap Station" },
      { name: "description", content: "Build your order from Wrap Station's full menu — wraps, burgers, loaded fries, sandwiches and drinks. Send straight to WhatsApp for fast pickup or delivery." },
      { property: "og:title", content: "Order Online — Wrap Station" },
      { property: "og:description", content: "Pick your favorites and send your order to Wrap Station on WhatsApp in seconds." },
    ],
    links: [{ rel: "canonical", href: "/order" }],
  }),
  component: OrderPage,
});

const CATEGORIES: ("All" | MenuCategory)[] = ["All", "Wraps", "Burgers", "Sides", "Sandwiches", "Drinks"];

function OrderPage() {
  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const { add, count } = useCart();

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU.filter((m) => (activeCat === "All" || m.category === activeCat))
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q));
  }, [activeCat, query]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[var(--ink)]/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 text-[var(--cream)]">
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--ember)] text-[var(--brand-foreground)] font-display text-lg">W</span>
            <span className="truncate font-display text-xl sm:text-2xl">Wrap Station</span>
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative inline-flex items-center gap-2 rounded-full bg-[var(--brand)] hover:bg-[var(--ember)] text-[var(--brand-foreground)] px-4 sm:px-5 py-2.5 font-semibold text-sm transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="grid min-w-6 h-6 px-1.5 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)] text-xs font-bold">
              {count}
            </span>
          </button>
        </div>
      </header>

      {/* TITLE */}
      <section className="bg-[var(--ink)] text-[var(--cream)] pt-6 pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <span className="chip bg-[var(--ember)]/20 text-[var(--ember)]">Order Online</span>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl leading-tight">
            Build your <span className="text-[var(--ember)]">order</span>.
          </h1>
          <p className="mt-3 text-[var(--cream)]/75 max-w-xl">
            Tap to add items, then send your cart straight to our WhatsApp for fast pickup or delivery.
          </p>

          {/* SEARCH */}
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cream)]/50" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu…"
              className="w-full rounded-full bg-white/10 border border-white/15 pl-11 pr-4 py-3 text-[var(--cream)] placeholder:text-[var(--cream)]/40 outline-none focus:ring-2 focus:ring-[var(--ember)]"
            />
          </div>

          {/* CATEGORY TABS */}
          <div className="mt-5 flex gap-2 overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0 pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors border ${
                  activeCat === c
                    ? "bg-[var(--brand)] text-[var(--brand-foreground)] border-[var(--brand)]"
                    : "bg-transparent text-[var(--cream)]/80 border-white/15 hover:border-[var(--ember)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MENU GRID */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No items match your search.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group card-hover rounded-3xl overflow-hidden bg-card shadow-md border flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {item.tag && (
                      <span className="absolute top-3 left-3 chip bg-[var(--brand)] text-[var(--brand-foreground)]">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
                      <span className="font-display text-xl text-[var(--brand)] shrink-0">{formatPKR(item.price)}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{item.desc}</p>
                    <button
                      onClick={() => add(item)}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] hover:bg-[var(--brand)] text-[var(--cream)] px-4 py-2.5 font-semibold text-sm transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MOBILE STICKY CART BAR */}
      {count > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-5 inset-x-5 sm:left-auto sm:right-8 sm:bottom-8 z-40 inline-flex items-center justify-between gap-3 rounded-full bg-[var(--brand)] hover:bg-[var(--ember)] text-[var(--brand-foreground)] px-5 py-4 shadow-2xl font-semibold transition-colors"
        >
          <span className="inline-flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" /> View cart
          </span>
          <span className="grid min-w-7 h-7 px-2 place-items-center rounded-full bg-[var(--ink)] text-[var(--cream)] text-xs font-bold">
            {count}
          </span>
        </button>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lines, subtotal, setQty, remove, clear } = useCart();
  const [orderType, setOrderType] = useState<"Pickup" | "Delivery">("Pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const canSubmit = lines.length > 0 && name.trim().length > 1 && phone.trim().length >= 7 &&
    (orderType === "Pickup" || address.trim().length > 4);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const lineText = lines
      .map((l) => `• ${l.qty} × ${l.item.name} — ${formatPKR(l.qty * l.item.price)}`)
      .join("\n");
    const message = [
      `*New Order — Wrap Station*`,
      ``,
      `*Name:* ${name.trim()}`,
      `*Phone:* ${phone.trim()}`,
      `*Type:* ${orderType}`,
      orderType === "Delivery" ? `*Address:* ${address.trim()}` : null,
      notes.trim() ? `*Notes:* ${notes.trim()}` : null,
      ``,
      `*Items:*`,
      lineText,
      ``,
      `*Total: ${formatPKR(subtotal)}*`,
    ].filter(Boolean).join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 h-16 border-b bg-[var(--ink)] text-[var(--cream)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="font-display text-2xl">Your Cart</h2>
          </div>
          <button onClick={onClose} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-secondary text-muted-foreground">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="mt-4 font-semibold">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">Add a few favorites to get started.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.item.id} className="flex gap-3 rounded-2xl border bg-card p-3">
                  <img src={l.item.img} alt={l.item.name} className="h-20 w-20 rounded-xl object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">{l.item.name}</div>
                        <div className="text-xs text-muted-foreground">{formatPKR(l.item.price)} each</div>
                      </div>
                      <button onClick={() => remove(l.item.id)} aria-label={`Remove ${l.item.name}`} className="text-muted-foreground hover:text-[var(--brand)]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border">
                        <button onClick={() => setQty(l.item.id, l.qty - 1)} aria-label="Decrease" className="grid h-8 w-8 place-items-center hover:bg-secondary rounded-l-full">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{l.qty}</span>
                        <button onClick={() => setQty(l.item.id, l.qty + 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center hover:bg-secondary rounded-r-full">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="font-display text-lg text-[var(--brand)]">{formatPKR(l.qty * l.item.price)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {lines.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {(["Pickup", "Delivery"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrderType(t)}
                    className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                      orderType === t
                        ? "bg-[var(--ink)] text-[var(--cream)] border-[var(--ink)]"
                        : "bg-background text-foreground border-input hover:border-[var(--brand)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 80))}
                  required
                  className="rounded-xl border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="Your name"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.slice(0, 20))}
                  required
                  inputMode="tel"
                  className="rounded-xl border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="03xx xxxxxxx"
                />
              </label>
              {orderType === "Delivery" && (
                <label className="grid gap-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Delivery Address</span>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value.slice(0, 250))}
                    required
                    rows={2}
                    className="rounded-xl border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                    placeholder="House #, street, area, city"
                  />
                </label>
              )}
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value.slice(0, 300))}
                  rows={2}
                  className="rounded-xl border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--brand)]"
                  placeholder="Extra sauce, no onions, etc."
                />
              </label>

              <button
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-[var(--brand)] underline underline-offset-4"
              >
                Clear cart
              </button>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t bg-card px-5 sm:px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="font-display text-2xl text-[var(--brand)]">{formatPKR(subtotal)}</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3.5 font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Send order on WhatsApp
            </button>
            <p className="text-[11px] text-center text-muted-foreground">
              Opens WhatsApp with your order pre-filled. Final confirmation by the restaurant.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}