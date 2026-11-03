import { createFileRoute, Link } from "@tanstack/react-router";
import { Edit } from "@/components/edit";
import { Photo } from "@/components/photo";
import { Shell } from "@/components/shell";
import { useSite } from "@/components/site-context";

export const Route = createFileRoute("/work/$slug")({
  head: () => ({ meta: [{ title: "Work · Media Studio" }] }),
  component: PiecePage,
});

function PiecePage() {
  const { slug } = Route.useParams();
  const { content, patch, patchPiece } = useSite();
  const index = content.pieces.findIndex((piece) => piece.slug === slug);
  const piece = content.pieces[index];

  if (!piece) {
    return (
      <Shell>
        <div className="px-5 py-24 md:px-10">
          <h1 className="font-serif text-5xl">That piece is not on the wall.</h1>
          <Link to="/work" className="mt-6 inline-block text-sm underline">
            Back to work
          </Link>
        </div>
      </Shell>
    );
  }

  const next = content.pieces[(index + 1) % content.pieces.length];

  return (
    <Shell>
      <Photo
        src={piece.image}
        alt=""
        imgClass="max-h-[78svh] w-full object-cover"
        onChange={(image) => patchPiece(piece.slug, { image })}
      />
      <div className="grid gap-10 px-5 py-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <p className="text-xs uppercase tracking-widest text-muted">{piece.kind}</p>
          <Edit
            as="h1"
            value={piece.title}
            onChange={(title) => patchPiece(piece.slug, { title })}
            className="mt-3 font-serif text-5xl leading-none md:text-7xl"
            max={140}
          />
          <Edit
            as="p"
            value={piece.summary}
            onChange={(summary) => patchPiece(piece.slug, { summary })}
            className="mt-6 max-w-xl text-lg text-muted"
            multiline
            max={400}
          />
        </div>
        <dl className="grid grid-cols-2 gap-6 self-end text-sm md:col-span-4 md:col-start-9">
          <div>
            <dt className="text-xs uppercase tracking-widest text-muted">Place</dt>
            <dd className="mt-2">
              <Edit value={piece.place} onChange={(place) => patchPiece(piece.slug, { place })} max={80} />
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-muted">Year</dt>
            <dd className="mt-2">
              <Edit value={piece.year} onChange={(year) => patchPiece(piece.slug, { year })} max={20} />
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs uppercase tracking-widest text-muted">Kind</dt>
            <dd className="mt-2">
              <Edit value={piece.kind} onChange={(kind) => patchPiece(piece.slug, { kind })} max={80} />
            </dd>
          </div>
        </dl>
      </div>
      <div className="grid gap-8 px-5 pb-16 md:grid-cols-12 md:px-10">
        <Edit
          as="p"
          value={piece.story}
          onChange={(story) => patchPiece(piece.slug, { story })}
          className="whitespace-pre-wrap text-lg leading-relaxed md:col-span-7"
          multiline
          max={2400}
        />
        <Photo
          src={content.deskImage}
          alt=""
          frameClass="md:col-span-5"
          imgClass="ratio-photo w-full object-cover"
          onChange={(deskImage) => patch({ deskImage })}
        />
      </div>
      {next && next.slug !== piece.slug && (
        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          className="flex items-end justify-between border-t border-line px-5 py-10 md:px-10"
        >
          <span>
            <span className="text-xs uppercase tracking-widest text-muted">Next</span>
            <span className="mt-2 block font-serif text-4xl">{next.title}</span>
          </span>
          <span className="text-sm">{next.place}</span>
        </Link>
      )}
    </Shell>
  );
}
