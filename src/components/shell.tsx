import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Edit } from "@/components/edit";
import { useSite } from "@/components/site-context";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";

export function Shell({ children }: { children: ReactNode }) {
  const site = useSite();
  const { content, canEdit, editing, setEditing, dirty, saving, notice, locked, save, patch } =
    site;
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/work" as const, label: content.navWork, key: "navWork" as const },
    { to: "/practice" as const, label: content.navPractice, key: "navPractice" as const },
    { to: "/enquire" as const, label: content.navEnquire, key: "navEnquire" as const },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-5 py-3 md:px-8">
          <Link to="/" className="font-serif text-2xl tracking-tight" onClick={() => setOpen(false)}>
            <Edit value={content.brand} onChange={(brand) => patch({ brand })} max={60} />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm tracking-wide">
                <Edit
                  value={link.label}
                  max={40}
                  onChange={(next) => patch({ [link.key]: next })}
                />
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <AuthSlot />
            <button
              type="button"
              className="grid h-11 w-11 place-items-center md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {canEdit && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-2 md:px-8">
            <p className="text-sm text-muted">
              {dirty
                ? "Unsaved changes"
                : notice ?? "Change any line or photo, then save."}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="text-sm underline decoration-line underline-offset-4"
                onClick={() => setEditing(!editing)}
              >
                {editing ? "Preview" : "Edit text"}
              </button>
              <button
                type="button"
                disabled={!dirty || saving}
                onClick={() => void save()}
                className="bg-ink px-4 py-2 text-sm text-cream disabled:opacity-40"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
        {locked && (
          <p className="border-t border-line px-5 py-2 text-sm text-muted md:px-8">
            Signed in, but this site is already saved to another account. You are seeing the published version.
          </p>
        )}
        {open && (
          <div className="flex flex-col gap-1 border-t border-line px-5 py-4 md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="py-3 text-lg"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-line px-5 py-10 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif text-3xl">{content.brand}</p>
            <p className="mt-2 max-w-md text-sm text-muted">
              <Edit value={content.footerNote} onChange={(footerNote) => patch({ footerNote })} max={160} />
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Edit value={content.placeLine} onChange={(placeLine) => patch({ placeLine })} max={80} />
            <a
              href="https://www.instagram.com/media.studio_uk/"
              className="underline decoration-line underline-offset-4"
            >
              <Edit
                value={content.instagramLabel}
                onChange={(instagramLabel) => patch({ instagramLabel })}
                max={40}
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || isPending) {
    return <div className="h-8 w-20 animate-pulse bg-line" aria-hidden />;
  }
  if (user) return <UserButton />;
  return (
    <Link to="/login" className="text-sm underline decoration-line underline-offset-4">
      Sign in
    </Link>
  );
}
