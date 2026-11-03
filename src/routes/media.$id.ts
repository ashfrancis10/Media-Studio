import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/media/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          return new Response("Not found", { status: 404 });
        }
        const sql = await getSql();
        const rows = await sql<{ mime: string; data: string }>`
          select mime, data from site_media where id = ${id}
        `;
        const row = rows[0];
        if (!row) return new Response("Not found", { status: 404 });
        const bytes = new Uint8Array(Buffer.from(row.data, "base64"));
        return new Response(bytes, {
          headers: {
            "content-type": row.mime,
            "cache-control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
