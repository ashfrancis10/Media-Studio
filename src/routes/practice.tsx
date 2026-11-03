import { createFileRoute } from "@tanstack/react-router";
import { Edit } from "@/components/edit";
import { Photo } from "@/components/photo";
import { Shell } from "@/components/shell";
import { useSite } from "@/components/site-context";

export const Route = createFileRoute("/practice")({
  head: () => ({ meta: [{ title: "Practice · Media Studio" }] }),
  component: PracticePage,
});

function PracticePage() {
  const { content, patch, patchNamed } = useSite();
  return (
    <Shell>
      <div className="grid gap-10 px-5 py-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-7">
          <Edit
            value={content.practiceKicker}
            onChange={(practiceKicker) => patch({ practiceKicker })}
            className="text-xs uppercase tracking-widest text-muted"
            max={40}
          />
          <Edit
            as="h1"
            value={content.practiceTitle}
            onChange={(practiceTitle) => patch({ practiceTitle })}
            className="mt-3 font-serif text-5xl leading-none md:text-7xl"
            max={160}
          />
          <Edit
            as="p"
            value={content.practiceBody}
            onChange={(practiceBody) => patch({ practiceBody })}
            className="mt-8 max-w-2xl text-lg leading-relaxed"
            multiline
            max={1200}
          />
        </div>
        <Photo
          src={content.practiceImage}
          alt=""
          frameClass="md:col-span-5"
          imgClass="ratio-photo w-full object-cover"
          onChange={(practiceImage) => patch({ practiceImage })}
        />
      </div>
      <blockquote className="border-y border-line px-5 py-12 md:px-10">
        <Edit
          as="p"
          value={content.practiceAside}
          onChange={(practiceAside) => patch({ practiceAside })}
          className="max-w-3xl font-serif text-3xl leading-snug md:text-4xl"
          multiline
          max={400}
        />
      </blockquote>
      <ol className="px-5 py-14 md:px-10">
        {content.steps.map((step, index) => (
          <li key={step.name} className="grid gap-2 border-t border-line py-6 md:grid-cols-12">
            <span className="text-sm text-muted md:col-span-2">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Edit
              value={step.name}
              onChange={(name) => patchNamed("steps", index, { name })}
              className="font-serif text-3xl md:col-span-3"
              max={80}
            />
            <Edit
              value={step.line}
              onChange={(line) => patchNamed("steps", index, { line })}
              className="text-muted md:col-span-6"
              multiline
              max={280}
            />
          </li>
        ))}
      </ol>
      <section className="grid gap-8 px-5 pb-16 md:grid-cols-2 md:px-10">
        <Photo
          src={content.placesImage}
          alt="Broadsands beach"
          frameClass="aspect-[9/16] w-full max-w-md"
          imgClass="h-full w-full object-cover"
          onChange={(placesImage) => patch({ placesImage })}
        />
        <div className="flex flex-col justify-end">
          <Edit
            as="h2"
            value={content.placesTitle}
            onChange={(placesTitle) => patch({ placesTitle })}
            className="font-serif text-4xl"
            max={80}
          />
          <Edit
            as="p"
            value={content.placesBody}
            onChange={(placesBody) => patch({ placesBody })}
            className="mt-4 max-w-md leading-relaxed text-muted"
            multiline
            max={400}
          />
        </div>
      </section>
    </Shell>
  );
}
