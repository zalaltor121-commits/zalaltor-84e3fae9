import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Inbox,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Phone,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Zalaltor" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminDashboard,
});

type Lead = {
  id: string;
  name: string;
  business: string | null;
  website_type: string | null;
  phone: string | null;
  email: string;
  message: string | null;
  status: string;
  notes: string | null;
  source: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;

const PANELS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inbox", label: "Lead inbox", icon: Inbox },
  { id: "pipeline", label: "Pipeline", icon: KanbanSquare },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
] as const;
type PanelId = (typeof PANELS)[number]["id"];

const STATUS_COLORS: Record<string, string> = {
  new: "border-blue-500/40 bg-blue-500/10 text-blue-200",
  contacted: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
  qualified: "border-purple-500/40 bg-purple-500/10 text-purple-200",
  won: "border-green-500/40 bg-green-500/10 text-green-200",
  lost: "border-white/10 bg-white/5 text-muted-foreground",
};

const CHART_COLORS = ["#60a5fa", "#facc15", "#c084fc", "#4ade80", "#94a3b8"];

function AdminDashboard() {
  const navigate = useNavigate();
  const [panel, setPanel] = useState<PanelId>("overview");
  const [navOpen, setNavOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState<"checking" | "granted" | "denied">("checking");
  const [email, setEmail] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError(error.message);
      setLeads([]);
    } else {
      setLeads((data ?? []) as Lead[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          setAccess("denied");
          setLoading(false);
          return;
        }
        setEmail(userData.user.email ?? null);
        const { data: roles, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user.id);
        if (roleError) {
          setError(roleError.message);
          setAccess("denied");
          setLoading(false);
          return;
        }
        const admin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
        setAccess(admin ? "granted" : "denied");
        if (admin) await load();
        else setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load the dashboard.");
        setAccess("denied");
        setLoading(false);
      }
    })();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) setError(error.message);
    else setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
  }

  async function saveNotes(id: string, notes: string) {
    const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
    if (error) setError(error.message);
    else setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) setError(error.message);
    else {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selectedId === id) setSelectedId(null);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const selected = leads.find((l) => l.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!q) return true;
      return [l.name, l.business, l.email, l.phone, l.message]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, filter, query]);

  const stats = useMemo(() => {
    const now = Date.now();
    const week = leads.filter(
      (l) => now - new Date(l.created_at).getTime() < 7 * 864e5,
    ).length;
    const won = leads.filter((l) => l.status === "won").length;
    const closed = leads.filter((l) => l.status === "won" || l.status === "lost").length;
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === "new").length,
      week,
      won,
      winRate: closed ? Math.round((won / closed) * 100) : 0,
    };
  }, [leads]);

  if (access === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your access…
      </div>
    );
  }

  if (access === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ?? "Your account doesn't have admin access. Contact the site owner."}
          </p>
          <button onClick={signOut} className="btn-primary mt-6">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:flex">
      {/* Sidebar */}
      <aside
        className={`border-b border-white/10 bg-black/30 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r ${
          navOpen ? "" : "max-lg:pb-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">Zalaltor</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Admin console
            </div>
          </div>
          <button
            onClick={() => setNavOpen((o) => !o)}
            aria-label="Toggle navigation"
            className="rounded-lg border border-white/10 p-2 text-muted-foreground hover:text-foreground lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
        <nav className={`px-3 pb-4 ${navOpen ? "block" : "hidden lg:block"}`}>
          {PANELS.map((p) => {
            const Icon = p.icon;
            const active = panel === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setPanel(p.id);
                  setNavOpen(false);
                }}
                className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {p.label}
              </button>
            );
          })}
          <button
            onClick={signOut}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">
              {PANELS.find((p) => p.id === panel)?.label}
            </h1>
            <p className="text-xs text-muted-foreground">{email ?? "Signed in"}</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-white/20 hover:text-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </header>

        <div className="px-6 py-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center text-sm text-muted-foreground">
              Loading data…
            </div>
          ) : panel === "overview" ? (
            <OverviewPanel
              stats={stats}
              leads={leads}
              onOpen={(id) => {
                setSelectedId(id);
                setPanel("inbox");
              }}
            />
          ) : panel === "inbox" ? (
            <InboxPanel
              leads={filtered}
              total={leads.length}
              filter={filter}
              setFilter={setFilter}
              query={query}
              setQuery={setQuery}
              selected={selected}
              onSelect={setSelectedId}
              onStatus={updateStatus}
              onNotes={saveNotes}
              onDelete={deleteLead}
            />
          ) : panel === "pipeline" ? (
            <PipelinePanel
              leads={leads}
              onStatus={updateStatus}
              onOpen={(id) => {
                setSelectedId(id);
                setPanel("inbox");
              }}
            />
          ) : panel === "analytics" ? (
            <AnalyticsPanel leads={leads} />
          ) : (
            <SettingsPanel email={email} onSignOut={signOut} count={leads.length} />
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- Panels ---------------- */

function OverviewPanel({
  stats,
  leads,
  onOpen,
}: {
  stats: { total: number; new: number; week: number; won: number; winRate: number };
  leads: Lead[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total leads" value={stats.total} />
        <StatCard label="New / unactioned" value={stats.new} highlight />
        <StatCard label="Last 7 days" value={stats.week} />
        <StatCard label="Win rate" value={`${stats.winRate}%`} />
      </div>

      <Card title="Recent enquiries">
        {leads.length === 0 ? (
          <Empty>No leads yet — form submissions will appear here.</Empty>
        ) : (
          <ul className="divide-y divide-white/5">
            {leads.slice(0, 6).map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => onOpen(l.id)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left hover:opacity-80"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{l.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {l.business ?? "—"} · {l.email}
                    </span>
                  </span>
                  <StatusPill status={l.status} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function InboxPanel({
  leads,
  total,
  filter,
  setFilter,
  query,
  setQuery,
  selected,
  onSelect,
  onStatus,
  onNotes,
  onDelete,
}: {
  leads: Lead[];
  total: number;
  filter: string;
  setFilter: (s: string) => void;
  query: string;
  setQuery: (s: string) => void;
  selected: Lead | null;
  onSelect: (id: string) => void;
  onStatus: (id: string, s: string) => void;
  onNotes: (id: string, n: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, business…"
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-white/25"
          />
        </div>
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition ${
              filter === s
                ? "border-white/40 bg-white/10 text-foreground"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {leads.length} of {total} leads
      </p>

      {leads.length === 0 ? (
        <Empty>No leads match this view.</Empty>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-2">
            {leads.map((lead) => (
              <button
                key={lead.id}
                onClick={() => onSelect(lead.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selected?.id === lead.id
                    ? "border-white/40 bg-white/[0.06]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-medium">{lead.name}</span>
                  <StatusPill status={lead.status} />
                </div>
                <div className="mt-1 truncate text-xs text-muted-foreground">
                  {lead.business ?? "—"} · {lead.email}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {new Date(lead.created_at).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
          <div>
            {selected ? (
              <LeadDetail
                lead={selected}
                onStatus={(s) => onStatus(selected.id, s)}
                onNotes={(n) => onNotes(selected.id, n)}
                onDelete={() => onDelete(selected.id)}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center text-sm text-muted-foreground">
                Select a lead to view details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PipelinePanel({
  leads,
  onStatus,
  onOpen,
}: {
  leads: Lead[];
  onStatus: (id: string, s: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
      {STATUSES.map((status) => {
        const column = leads.filter((l) => l.status === status);
        return (
          <div key={status} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {status}
              </span>
              <span className="rounded-full bg-white/10 px-2 text-[10px] leading-5">
                {column.length}
              </span>
            </div>
            <div className="space-y-2">
              {column.length === 0 && (
                <p className="py-4 text-center text-xs text-muted-foreground/60">Empty</p>
              )}
              {column.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                >
                  <button
                    onClick={() => onOpen(lead.id)}
                    className="block w-full truncate text-left text-sm font-medium hover:underline"
                  >
                    {lead.name}
                  </button>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {lead.business ?? lead.email}
                  </div>
                  <select
                    value={lead.status}
                    onChange={(e) => onStatus(lead.id, e.target.value)}
                    className="mt-2 w-full rounded-md border border-white/10 bg-black/40 px-2 py-1 text-[11px] outline-none"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        Move to {s}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnalyticsPanel({ leads }: { leads: Lead[] }) {
  const byStatus = STATUSES.map((s) => ({
    name: s,
    value: leads.filter((l) => l.status === s).length,
  }));

  const byMonth = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      map.set(d.toLocaleString(undefined, { month: "short" }), 0);
    }
    leads.forEach((l) => {
      const key = new Date(l.created_at).toLocaleString(undefined, { month: "short" });
      if (map.has(key)) map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map].map(([name, value]) => ({ name, value }));
  }, [leads]);

  const byType = useMemo(() => {
    const map = new Map<string, number>();
    leads.forEach((l) => {
      const key = l.website_type || "Unspecified";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return [...map].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [leads]);

  if (leads.length === 0) return <Empty>No data to chart yet.</Empty>;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card title="Leads per month">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <YAxis allowDecimals={false} stroke="rgba(255,255,255,0.5)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Status breakdown">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85}>
                {byStatus.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.85)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Requested website types">
        <ul className="space-y-2">
          {byType.map((t) => (
            <li key={t.name} className="flex items-center gap-3 text-sm">
              <span className="w-40 shrink-0 truncate text-muted-foreground">{t.name}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <span
                  className="block h-full rounded-full bg-white/40"
                  style={{ width: `${(t.value / leads.length) * 100}%` }}
                />
              </span>
              <span className="w-8 text-right text-xs">{t.value}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Highlights">
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Busiest month:{" "}
            <span className="text-foreground">
              {byMonth.reduce((a, b) => (b.value > a.value ? b : a)).name}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Inbox className="h-4 w-4" /> Awaiting reply:{" "}
            <span className="text-foreground">
              {leads.filter((l) => l.status === "new").length}
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> With phone number:{" "}
            <span className="text-foreground">{leads.filter((l) => l.phone).length}</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}

function SettingsPanel({
  email,
  onSignOut,
  count,
}: {
  email: string | null;
  onSignOut: () => void;
  count: number;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card title="Account">
        <dl className="space-y-3 text-sm">
          <Field label="Signed in as">{email ?? "—"}</Field>
          <Field label="Role">admin</Field>
          <Field label="Leads stored">{count}</Field>
        </dl>
        <button
          onClick={onSignOut}
          className="mt-6 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-muted-foreground hover:border-white/20 hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </Card>
      <Card title="Export">
        <p className="text-sm text-muted-foreground">
          Download every lead as a CSV file for your records or CRM.
        </p>
        <button onClick={() => exportCsv()} className="btn-primary mt-4">
          Export leads CSV
        </button>
      </Card>
    </div>
  );
}

async function exportCsv() {
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Lead[];
  const cols = [
    "created_at",
    "name",
    "business",
    "email",
    "phone",
    "website_type",
    "status",
    "source",
    "message",
    "notes",
  ] as const;
  const csv = [
    cols.join(","),
    ...rows.map((r) =>
      cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `zalaltor-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---------------- Shared bits ---------------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] p-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-white/25 bg-gradient-to-br from-white/10 to-transparent"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
        STATUS_COLORS[status] ?? STATUS_COLORS.lost
      }`}
    >
      {status}
    </span>
  );
}

function LeadDetail({
  lead,
  onStatus,
  onNotes,
  onDelete,
}: {
  lead: Lead;
  onStatus: (s: string) => void;
  onNotes: (n: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(lead.notes ?? "");
  useEffect(() => setNotes(lead.notes ?? ""), [lead.id, lead.notes]);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-semibold">{lead.name}</h2>
          <p className="truncate text-sm text-muted-foreground">{lead.business ?? "—"}</p>
        </div>
        <button
          onClick={onDelete}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/10"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`mailto:${lead.email}`}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-white/25"
        >
          <Mail className="h-3.5 w-3.5" /> Email
        </a>
        {lead.phone && (
          <>
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-white/25"
            >
              <Phone className="h-3.5 w-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:border-white/25"
            >
              WhatsApp
            </a>
          </>
        )}
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <Field label="Email">{lead.email}</Field>
        {lead.phone && <Field label="Phone">{lead.phone}</Field>}
        {lead.website_type && <Field label="Website type">{lead.website_type}</Field>}
        {lead.source && <Field label="Source">{lead.source}</Field>}
        <Field label="Received">{new Date(lead.created_at).toLocaleString()}</Field>
        {lead.message && (
          <Field label="Message">
            <p className="whitespace-pre-wrap text-foreground/90">{lead.message}</p>
          </Field>
        )}
      </dl>

      <div className="mt-6">
        <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Status</div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => onStatus(s)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition ${
                lead.status === s
                  ? "border-white/40 bg-white/10 text-foreground"
                  : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
          Internal notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (lead.notes ?? "") && onNotes(notes)}
          rows={4}
          placeholder="Follow-up details, quote sent, etc."
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-white/25 focus:bg-white/10"
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{children}</dd>
    </div>
  );
}
