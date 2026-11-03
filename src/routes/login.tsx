import { useState, type FormEvent } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import { emailForSignIn } from "@/lib/owner-login";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in · Media Studio" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isPending } = useCurrentUserState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (isPending) {
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-6">
        <p className="font-serif text-3xl">Media Studio</p>
      </main>
    );
  }
  if (user) return <Navigate to="/" />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const result = await authClient.signIn.email({
        email: emailForSignIn(username),
        password,
      });
      if (result.error) {
        setError(result.error.message ?? "Could not sign in.");
        setPending(false);
        return;
      }
      window.location.assign("/");
    } catch {
      setError("Could not sign in.");
      setPending(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-paper text-ink md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src="/frames/desk.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex flex-col justify-center px-6 py-16 md:px-16">
        <Link to="/" className="font-serif text-3xl">
          Media Studio
        </Link>
        <h1 className="mt-10 font-serif text-5xl leading-none">Sign in to edit</h1>
        <p className="mt-4 max-w-sm text-muted">
          The studio login can change every line and photograph. Save is what visitors see.
        </p>
        {emailAndPasswordEnabled && (
          <form onSubmit={onSubmit} className="mt-10 flex max-w-sm flex-col gap-4">
            <label className="flex flex-col gap-2 text-sm">
              Username
              <input
                type="text"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                className="min-h-11 border border-line bg-paper px-3 outline-none focus:border-ink"
              />
            </label>
            <label className="flex flex-col gap-2 text-sm">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="min-h-11 border border-line bg-paper px-3 outline-none focus:border-ink"
              />
            </label>
            {error && <p className="text-sm text-bronze">{error}</p>}
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 bg-ink text-sm text-cream disabled:opacity-40"
            >
              {pending ? "Please wait…" : "Sign in"}
            </button>
          </form>
        )}
        <div className="mt-8 flex max-w-sm flex-col gap-3">
          {GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              onClick={() => signIn(provider.providerId, { callbackURL: "/" })}
              className="min-h-11 border border-line text-sm hover:border-ink"
            >
              Continue with {provider.label}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
