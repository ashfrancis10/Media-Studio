import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit } from "@/components/edit";
import { Photo } from "@/components/photo";
import { Shell } from "@/components/shell";
import { useSite } from "@/components/site-context";

export const Route = createFileRoute("/work")({
  head: () => ({ meta: [{ title: "Work · Media Studio" }] }),
  component: WorkPage,
});

function WorkPage() {
  const { content, patchPiece } = useSite();
  const [kind, setKind] = useState("All");
  const kinds = useMemo(
    () => ["All", ...Array.from(new Set(content.pieces.map((piece) => piece.kind)))],
    [content.pieces],
  );
  const visible = content.pieces.filter((piece) => kind === "All" || piece.kind === kind);

  return (
    <Shell>
      <div className="px-5 py-14 md:px-10">
        <p className="text-xs uppercase tracking-widest text-muted">{content.placeLine}</p>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-none md:text-7xl">
          {content.workTitle}
        </h1>
        <p className="mt-6 max-w-xl text-muted">
          Series rather than client logos. Each one is the shape of work Media Studio makes for
          brands, businesses and events.
        </p>
        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {kinds.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setKind(item)}
              className={
                item === kind
                  ? "shrink-0 border border-ink bg-ink px-4 py-2 text-sm text-cream"
                  : "shrink-0 border border-line px-4 py-2 text-sm"
              }
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
          {visible.map((piece) => (
            <article key={piece.slug} className="group">
              <Photo
                src={piece.image}
                alt=""
                frameClass="overflow-hidden"
                imgClass="frame-img ratio-photo w-full object-cover transition duration-700 group-hover:scale-105"
                onChange={(image) => patchPiece(piece.slug, { image })}
              />
              <div className="mt-4">
                <Edit
                  as="h2"
                  value={piece.title}
                  onChange={(title) => patchPiece(piece.slug, { title })}
                  className="font-serif text-3xl"
                  max={140}
                />
                <p className="mt-2 text-sm text-muted">
                  <Edit value={piece.place} onChange={(place) => patchPiece(piece.slug, { place })} max={80} />
                  <span aria-hidden> · </span>
                  <Edit value={piece.kind} onChange={(kindName) => patchPiece(piece.slug, { kind: kindName })} max={80} />
                  <span aria-hidden> · </span>
                  <Edit value={piece.year} onChange={(year) => patchPiece(piece.slug, { year })} max={20} />
                </p>
                <Edit
                  as="p"
                  value={piece.summary}
                  onChange={(summary) => patchPiece(piece.slug, { summary })}
                  className="mt-3 max-w-md text-sm leading-relaxed"
                  multiline
                  max={400}
                />
                <Link
                  to="/work/$slug"
                  params={{ slug: piece.slug }}
                  className="mt-3 inline-block text-sm underline decoration-line underline-offset-4"
                >
                  View
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Shell>
  );
}
