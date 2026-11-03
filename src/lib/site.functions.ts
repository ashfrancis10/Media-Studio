import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { coerceContent, siteContentSchema, type SiteContent } from "@/lib/content";

type EditorState =
  | { role: "owner"; content: SiteContent | null }
  | { role: "unclaimed"; content: null }
  | { role: "locked"; content: null };

export const getPublished = createServerFn({ method: "GET" }).handler(async () => {
  const { ensureOwnerAccount, applyStudioReel } = await import("@/lib/owner-account.server");
  await ensureOwnerAccount();
  await applyStudioReel();
  const sql = await getSql();
  const rows = await sql<{ content: unknown }>`
    select content from site_state where id = 1
  `;
  if (!rows[0]) return null;
  return coerceContent(rows[0].content);
});

export const getEditor = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<EditorState> => {
    const sql = await getSql();
    const rows = await sql<{ owner_id: string | null; content: unknown }>`
      select owner_id, content from site_state where id = 1
    `;
    if (!rows[0]) return { role: "unclaimed", content: null };
    const owner = rows[0].owner_id;
    if (!owner || owner === context.userId) {
      return { role: "owner", content: coerceContent(rows[0].content) };
    }
    return { role: "locked", content: null };
  });

export const saveSite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => siteContentSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const payload = JSON.stringify(data);
    const rows = await sql<{ owner_id: string | null }>`
      select owner_id from site_state where id = 1
    `;
    if (!rows[0]) {
      await sql`
        insert into site_state (id, owner_id, content)
        values (1, ${context.userId}, ${payload}::jsonb)
      `;
      return { ok: true as const };
    }
    if (rows[0].owner_id && rows[0].owner_id !== context.userId) {
      return {
        ok: false as const,
        error: "This site is already saved to another account.",
      };
    }
    await sql`
      update site_state
      set owner_id = ${context.userId},
          content = ${payload}::jsonb,
          updated_at = now()
      where id = 1
    `;
    return { ok: true as const };
  });

const MAX_PHOTO_BYTES = 3_000_000;

function sniffedMime(bytes: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length > 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (
    bytes.length > 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export const uploadPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    if (typeof input !== "string") throw new Error("Missing photo.");
    const data = input.replace(/\s/g, "");
    if (data.length === 0 || data.length > 4_200_000) throw new Error("Photo is too large.");
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(data)) throw new Error("Photo could not be read.");
    return data;
  })
  .handler(async ({ context, data }) => {
    const bytes = Buffer.from(data, "base64");
    if (bytes.length === 0 || bytes.length > MAX_PHOTO_BYTES) {
      return { ok: false as const, error: "Use a photo under 3 MB." };
    }
    const mime = sniffedMime(bytes);
    if (!mime) return { ok: false as const, error: "Use a JPEG, PNG, or WebP." };

    const sql = await getSql();
    const rows = await sql<{ owner_id: string | null }>`
      select owner_id from site_state where id = 1
    `;
    if (rows[0]?.owner_id && rows[0].owner_id !== context.userId) {
      return { ok: false as const, error: "This site is already saved to another account." };
    }

    const id = crypto.randomUUID();
    await sql`
      insert into site_media (id, owner_id, mime, data)
      values (${id}, ${context.userId}, ${mime}, ${data})
    `;
    return { ok: true as const, url: `/media/${id}` };
  });
