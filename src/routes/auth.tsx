import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Zalaltor" },
      { name: "description", content: "Sign in or create the Zalaltor admin account." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        if (data.session) {
          navigate({ to: "/admin" });
          return;
        }
        setMessage({
          type: "info",
          text: "Account created. Check your inbox for the confirmation link, then sign in.",
        });
        setMode("signin");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message ?? "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 block text-center text-sm text-muted-foreground hover:text-foreground">
          ← Back to site
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
          <div className="mb-6 flex rounded-xl border border-white/10 bg-white/5 p-1 text-sm">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setMessage(null);
              }}
              className={`flex-1 rounded-lg px-3 py-2 transition ${
                mode === "signin" ? "bg-white/10 text-foreground" : "text-muted-foreground"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMessage(null);
              }}
              className={`flex-1 rounded-lg px-3 py-2 transition ${
                mode === "signup" ? "bg-white/10 text-foreground" : "text-muted-foreground"
              }`}
            >
              Create account
            </button>
          </div>

          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {mode === "signin" ? "Admin sign in" : "Create admin account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Access the Zalaltor lead dashboard."
              : "The first account created becomes the admin."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base outline-none transition focus:border-[var(--brand)]/60 focus:bg-white/10"
              />
            </div>

            {message && (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  message.type === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-200"
                    : "border-blue-500/30 bg-blue-500/10 text-blue-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
