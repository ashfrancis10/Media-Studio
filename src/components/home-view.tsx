import { Link } from "@tanstack/react-router";
import { Edit } from "@/components/edit";
import { Photo } from "@/components/photo";
import { Shell } from "@/components/shell";
import { useSite } from "@/components/site-context";

export function HomeView() {
  const { content, patch, patchPiece, patchNamed, patchNote } = useSite();
  const featured = content.pieces.slice(0, 3);

  return (
    <Shell>
      <section className="relative min-h-[82svh]">
        <Photo
          src={content.heroImage}
          alt="North Devon coast in late light"
          frameClass="absolute inset-0"
          imgClass="h-full w-full object-cover object-[center_22%]"
          onChange={(heroImage) => patch({ heroImage })}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/75 via-night/20 to-night/10" />
        <div className="pointer-events-none relative flex min-h-[82svh] flex-col justify-end px-5 pb-12 text-cream md:px-10 md:pb-16">
          <div className="pointer-events-auto">
          <Edit
            value={content.heroEyebrow}
            onChange={(heroEyebrow) => patch({ heroEyebrow })}
            className="text-xs uppercase tracking-widest text-cream/80"
            max={80}
          />
          <Edit
            as="h1"
            value={content.heroTitle}
            onChange={(heroTitle) => patch({ heroTitle })}
            className="mt-4 max-w-4xl font-serif text-5xl leading-none md:text-7xl"
            max={160}
          />
          <Edit
            as="p"
            value={content.heroDeck}
            onChange={(heroDeck) => patch({ heroDeck })}
            className="mt-6 max-w-xl text-base text-cream/90 md:text-lg"
            multiline
            max={400}
          />
          </div>
        </div>
      </section>

      <section className="grid gap-8 px-5 py-20 md:grid-cols-12 md:px-10">
        <Edit
          value={content.introKicker}
          onChange={(introKicker) => patch({ introKicker })}
          className="text-xs uppercase tracking-widest text-muted md:col-span-3"
          max={40}
        />
        <div className="md:col-span-8">
          <Edit
            as="h2"
            value={content.introTitle}
            onChange={(introTitle) => patch({ introTitle })}
            className="font-serif text-4xl leading-tight md:text-5xl"
            max={160}
          />
          <Edit
            as="p"
            value={content.introBody}
            onChange={(introBody) => patch({ introBody })}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
            multiline
            max={800}
          />
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 md:px-10">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <Edit
              value={content.workKicker}
              onChange={(workKicker) => patch({ workKicker })}
              className="text-xs uppercase tracking-widest text-muted"
              max={40}
            />
            <Edit
              as="h2"
              value={content.workTitle}
              onChange={(workTitle) => patch({ workTitle })}
              className="mt-3 font-serif text-4xl"
              max={120}
            />
          </div>
          <Link to="/work" className="shrink-0 text-sm underline decoration-line underline-offset-4">
            <Edit value={content.workLink} onChange={(workLink) => patch({ workLink })} max={60} />
          </Link>
        </div>
        <div className="flex flex-col gap-14">
          {featured.map((piece) => (
            <article key={piece.slug} className="group">
              <Photo
                src={piece.image}
                alt=""
                frameClass="overflow-hidden"
                imgClass="frame-img ratio-photo w-full object-cover transition duration-700 group-hover:scale-105"
                onChange={(image) => patchPiece(piece.slug, { image })}
              />
              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                <Edit
                  as="h3"
                  value={piece.title}
                  onChange={(title) => patchPiece(piece.slug, { title })}
                  className="font-serif text-3xl"
                  max={140}
                />
                <p className="text-sm text-muted">
                  <Edit
                    value={piece.place}
                    onChange={(place) => patchPiece(piece.slug, { place })}
                    max={80}
                  />
                  <span aria-hidden> · </span>
                  <Edit
                    value={piece.kind}
                    onChange={(kind) => patchPiece(piece.slug, { kind })}
                    max={80}
                  />
                  <span aria-hidden> · </span>
                  <Edit
                    value={piece.year}
                    onChange={(year) => patchPiece(piece.slug, { year })}
                    max={20}
                  />
                </p>
              </div>
              <Link
                to="/work/$slug"
                params={{ slug: piece.slug }}
                className="mt-3 inline-block text-sm underline decoration-line underline-offset-4"
              >
                View
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 md:px-10">
        <Edit
          value={content.disciplineKicker}
          onChange={(disciplineKicker) => patch({ disciplineKicker })}
          className="text-xs uppercase tracking-widest text-muted"
          max={40}
        />
        <Edit
          as="h2"
          value={content.disciplineTitle}
          onChange={(disciplineTitle) => patch({ disciplineTitle })}
          className="mt-3 font-serif text-4xl"
          max={120}
        />
        <ul className="mt-10">
          {content.disciplines.map((item, index) => (
            <li
              key={item.name}
              className="grid gap-2 border-t border-line py-5 md:grid-cols-12 md:items-baseline"
            >
              <span className="text-sm text-muted md:col-span-2">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Edit
                value={item.name}
                onChange={(name) => patchNamed("disciplines", index, { name })}
                className="font-serif text-2xl md:col-span-4"
                max={80}
              />
              <Edit
                value={item.line}
                onChange={(line) => patchNamed("disciplines", index, { line })}
                className="text-muted md:col-span-6"
                multiline
                max={280}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-line px-5 py-16 md:px-10">
        <Edit
          value={content.notesKicker}
          onChange={(notesKicker) => patch({ notesKicker })}
          className="text-xs uppercase tracking-widest text-muted"
          max={40}
        />
        <Edit
          as="h2"
          value={content.notesTitle}
          onChange={(notesTitle) => patch({ notesTitle })}
          className="mt-3 font-serif text-4xl"
          max={120}
        />
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {content.notes.map((note, index) => (
            <article key={note.title} className="border-t border-line pt-5">
              <p className="text-xs uppercase tracking-widest text-muted">
                <Edit
                  value={note.date}
                  onChange={(date) => patchNote(index, { date })}
                  max={20}
                />
                <span aria-hidden> · </span>
                <Edit
                  value={note.label}
                  onChange={(label) => patchNote(index, { label })}
                  max={40}
                />
              </p>
              <Edit
                as="h3"
                value={note.title}
                onChange={(title) => patchNote(index, { title })}
                className="mt-4 font-serif text-2xl"
                max={160}
              />
              <Edit
                as="p"
                value={note.body}
                onChange={(body) => patchNote(index, { body })}
                className="mt-3 text-sm leading-relaxed text-muted"
                multiline
                max={800}
              />
            </article>
          ))}
        </div>
      </section>

      <section className="bg-night px-5 py-20 text-cream md:px-10">
        <Edit
          as="h2"
          value={content.bandTitle}
          onChange={(bandTitle) => patch({ bandTitle })}
          className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl"
          max={160}
        />
        <Edit
          as="p"
          value={content.bandBody}
          onChange={(bandBody) => patch({ bandBody })}
          className="mt-6 max-w-xl text-cream/80"
          multiline
          max={400}
        />
        <Link
          to="/enquire"
          className="mt-8 inline-flex min-h-11 items-center border border-cream/40 px-5 text-sm"
        >
          <Edit value={content.bandLink} onChange={(bandLink) => patch({ bandLink })} max={60} />
        </Link>
      </section>
    </Shell>
  );
}
