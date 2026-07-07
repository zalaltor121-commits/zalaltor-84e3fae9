import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
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

function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setIsAdmin(false);
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      const admin = (roles ?? []).some((r: { role: string }) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) load();
    })();
  }, [load]);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (!error) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      if (selected?.id === id) setSelected({ ...selected, status });
    }
  }

  async function saveNotes(id: string, notes: string) {
    await supabase.from("leads").update({ notes }).eq("id", id);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (!error) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);
  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    won: leads.filter((l) => l.status === "won").length,
  };

  if (isAdmin === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-2xl font-semibold">Not authorized</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account exists but doesn't have admin access. Contact the site owner.
          </p>
          <button onClick={signOut} className="btn-primary mt-6">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight">Zalaltor Admin</h1>
            <p className="text-xs text-muted-foreground">Lead inbox</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-muted-foreground hover:border-white/20 hover:text-foreground"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <StatCard label="Total leads" value={stats.total} />
          <StatCard label="New" value={stats.new} highlight />
          <StatCard label="Won" value={stats.won} />
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          {["all", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs uppercase tracking-wider transition ${
                filter === s
                  ? "border-[var(--brand)]/60 bg-white/10 text-foreground"
                  : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={load}
            className="ml-auto rounded-full border border-white/10 px-3 py-1 text-xs text-muted-foreground hover:border-white/20 hover:text-foreground"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center text-sm text-muted-foreground">
            Loading leads…
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center text-sm text-muted-foreground">
            No leads {filter !== "all" && `with status "${filter}"`} yet.
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-2">
              {filtered.map((lead) => (
                <button
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selected?.id === lead.id
                      ? "border-[var(--brand)]/60 bg-white/[0.06]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium">{lead.name}</span>
                    <StatusPill status={lead.status} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
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
                  onStatus={(s) => updateStatus(selected.id, s)}
                  onNotes={(n) => saveNotes(selected.id, n)}
                  onDelete={() => deleteLead(selected.id)}
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
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-[var(--brand)]/40 bg-gradient-to-br from-[var(--brand)]/10 to-transparent"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "border-blue-500/40 bg-blue-500/10 text-blue-200",
    contacted: "border-yellow-500/40 bg-yellow-500/10 text-yellow-200",
    qualified: "border-purple-500/40 bg-purple-500/10 text-purple-200",
    won: "border-green-500/40 bg-green-500/10 text-green-200",
    lost: "border-white/10 bg-white/5 text-muted-foreground",
  };
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
        colors[status] ?? colors.lost
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
        <div>
          <h2 className="font-display text-xl font-semibold">{lead.name}</h2>
          <p className="text-sm text-muted-foreground">{lead.business ?? "—"}</p>
        </div>
        <button
          onClick={onDelete}
          className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/10"
        >
          Delete
        </button>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <Field label="Email">
          <a href={`mailto:${lead.email}`} className="text-foreground hover:underline">
            {lead.email}
          </a>
        </Field>
        {lead.phone && (
          <Field label="Phone">
            <a href={`tel:${lead.phone}`} className="text-foreground hover:underline">
              {lead.phone}
            </a>
          </Field>
        )}
        {lead.website_type && <Field label="Website type">{lead.website_type}</Field>}
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
                  ? "border-[var(--brand)]/60 bg-white/10 text-foreground"
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
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}