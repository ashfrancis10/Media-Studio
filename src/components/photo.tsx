import { useRef, useState, type ChangeEvent } from "react";
import { uploadPhoto } from "@/lib/site.functions";
import { useSite } from "@/components/site-context";

export function Photo({
  src,
  alt,
  imgClass,
  frameClass,
  onChange,
}: {
  src: string;
  alt: string;
  imgClass: string;
  frameClass?: string;
  onChange: (next: string) => void;
}) {
  const { canEdit } = useSite();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const reel = src.endsWith("/broadsands.jpg") ? "Dc6Wl9eBvRl" : "";

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const mime = mimeOf(file);
    if (!mime) {
      setError("Use a JPEG, PNG, or WebP.");
      return;
    }
    if (file.size > 3_000_000) {
      setError("Use a photo under 3 MB.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const data = await readBase64(file);
      const result = await uploadPhoto({ data });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onChange(result.url);
    } catch {
      setError("Could not upload that photo. Sign in and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`relative overflow-hidden ${frameClass ?? ""}`}>
      <img src={src} alt={alt} className={playing && reel ? `invisible ${imgClass}` : imgClass} />
      {playing && reel && (
        <iframe
          src={`https://www.instagram.com/reel/${reel}/embed/`}
          title="Broadsands reel"
          className="absolute inset-0 z-10 h-full w-full border-0 bg-night"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
      {reel && (
        <button
          type="button"
          onClick={() => setPlaying((value) => !value)}
          className="absolute top-24 right-4 z-20 bg-ink px-3 py-2 text-sm text-cream"
        >
          {playing ? "Close" : "Play reel"}
        </button>
      )}
      {canEdit && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="absolute top-3 left-3 z-10 bg-ink px-3 py-2 text-sm text-cream disabled:opacity-40"
          >
            {busy ? "Uploading…" : "Change photo"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => void onPick(event)}
          />
        </>
      )}
      {error && (
        <p className="absolute right-3 bottom-3 left-3 z-10 bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      )}
    </div>
  );
}

function mimeOf(file: File) {
  if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp") {
    return file.type;
  }
  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return "";
}

function readBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const value = String(reader.result ?? "");
      const comma = value.indexOf(",");
      resolve(comma >= 0 ? value.slice(comma + 1) : value);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
