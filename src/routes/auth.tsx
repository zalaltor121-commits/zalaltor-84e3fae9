import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isTrustedDevice, unlockAdminDevice } from "@/lib/admin-gate";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in — Zalaltor" },
      { name: "description", content: "Owner access to the Zalaltor admin console." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isTrustedDevice()) navigate({ to: "/admin", replace: true });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const ok = await unlockAdminDevice(passcode);
    setLoading(false);
    if (!ok) {
      setError("Incorrect passcode.");
      setPasscode("");
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to site
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
          <h1 className="font-display text-2xl font-semibold tracking-tight">Owner access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the admin passcode. This device stays trusted afterwards, so you only do it once.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="passcode"
                className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground"
              >
                Passcode
              </label>
              <input
                id="passcode"
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? "Checking…" : "Unlock dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
