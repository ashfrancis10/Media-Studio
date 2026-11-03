import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Edit } from "@/components/edit";
import { Shell } from "@/components/shell";
import { useSite } from "@/components/site-context";

export const Route = createFileRoute("/enquire")({
  head: () => ({ meta: [{ title: "Enquire · Media Studio" }] }),
  component: EnquirePage,
});

function EnquirePage() {
  const { content, patch, editing } = useSite();
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <Shell>
      <div className="grid gap-12 px-5 py-14 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Edit
            value={content.enquireKicker}
            onChange={(enquireKicker) => patch({ enquireKicker })}
            className="text-xs uppercase tracking-widest text-muted"
            max={40}
          />
          <Edit
            as="h1"
            value={content.enquireTitle}
            onChange={(enquireTitle) => patch({ enquireTitle })}
            className="mt-3 font-serif text-5xl leading-none"
            max={140}
          />
          <Edit
            as="p"
            value={content.enquireBody}
            onChange={(enquireBody) => patch({ enquireBody })}
            className="mt-6 leading-relaxed text-muted"
            multiline
            max={400}
          />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          {sent ? (
            <p className="font-serif text-3xl leading-snug">
              <Edit
                value={content.enquireThanks}
                onChange={(enquireThanks) => patch({ enquireThanks })}
                multiline
                max={240}
              />
            </p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <Field label={content.fieldName} onLabel={(fieldName) => patch({ fieldName })} name="name" />
              <Field
                label={content.fieldBusiness}
                onLabel={(fieldBusiness) => patch({ fieldBusiness })}
                name="business"
              />
              <Field
                label={content.fieldEmail}
                onLabel={(fieldEmail) => patch({ fieldEmail })}
                name="email"
                type="email"
              />
              <label className="flex flex-col gap-2 text-sm">
                <Edit
                  value={content.fieldMessage}
                  onChange={(fieldMessage) => patch({ fieldMessage })}
                  max={40}
                />
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="border border-line bg-paper px-3 py-3 text-base outline-none focus:border-ink"
                />
              </label>
              {editing ? (
                <div className="inline-flex min-h-11 items-center self-start bg-ink px-6 text-sm text-cream">
                  <Edit value={content.fieldSend} onChange={(fieldSend) => patch({ fieldSend })} max={40} />
                </div>
              ) : (
                <button type="submit" className="min-h-11 self-start bg-ink px-6 text-sm text-cream">
                  {content.fieldSend}
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </Shell>
  );
}

function Field({
  label,
  onLabel,
  name,
  type = "text",
}: {
  label: string;
  onLabel: (next: string) => void;
  name: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <Edit value={label} onChange={onLabel} max={40} />
      <input
        name={name}
        type={type}
        required
        autoComplete={name === "email" ? "email" : "name"}
        className="min-h-11 border border-line bg-paper px-3 text-base outline-none focus:border-ink"
      />
    </label>
  );
}
