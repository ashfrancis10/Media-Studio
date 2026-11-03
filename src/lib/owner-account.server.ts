import { hashPassword, verifyPassword } from "@better-auth/utils/password";
import { randomUUID } from "node:crypto";
import { getSql } from "@/lib/db";
import { DEFAULT_CONTENT, coerceContent } from "@/lib/content";
import { OWNER_EMAIL } from "@/lib/owner-login";

const OWNER_NAME = "Sammi";
const OWNER_PASSWORD = "Sunshinenflower123";

let pending: Promise<void> | null = null;

/** Create the studio login and claim an unowned site. Safe to call often. */
export function ensureOwnerAccount(): Promise<void> {
  pending ??= seed().catch((error) => {
    pending = null;
    throw error;
  });
  return pending;
}

async function seed() {
  const sql = await getSql();
  const found = await sql<{ id: string }>`
    select id from "user" where lower(email) = ${OWNER_EMAIL}
  `;
  let userId = found[0]?.id;
  const hash = await hashPassword(OWNER_PASSWORD);

  if (!userId) {
    userId = randomUUID();
    await sql`
      insert into "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
      values (${userId}, ${OWNER_NAME}, ${OWNER_EMAIL}, true, now(), now())
    `;
  }

  const accounts = await sql<{ id: string; password: string | null }>`
    select id, password from "account"
    where "userId" = ${userId} and "providerId" = 'credential'
    limit 1
  `;
  const account = accounts[0];
  if (!account) {
    await sql`
      insert into "account" (
        "id", "accountId", "providerId", "userId", "password", "createdAt", "updatedAt"
      ) values (
        ${randomUUID()}, ${userId}, 'credential', ${userId}, ${hash}, now(), now()
      )
    `;
  } else if (!account.password || !(await verifyPassword(account.password, OWNER_PASSWORD))) {
    await sql`
      update "account"
      set password = ${hash}, "updatedAt" = now()
      where id = ${account.id}
    `;
  }

  const state = await sql<{ owner_id: string | null }>`
    select owner_id from site_state where id = 1
  `;
  if (!state[0]) {
    await sql`
      insert into site_state (id, owner_id, content)
      values (1, ${userId}, ${JSON.stringify(DEFAULT_CONTENT)}::jsonb)
    `;
  } else if (!state[0].owner_id) {
    await sql`
      update site_state set owner_id = ${userId}, updated_at = now() where id = 1
    `;
  }
}

/** Swap the stock coast stills for the studio reel poster, once. */
export async function applyStudioReel() {
  const sql = await getSql();
  const rows = await sql<{ content: unknown }>`
    select content from site_state where id = 1
  `;
  if (!rows[0]) return;
  const content = coerceContent(rows[0].content);
  if (!content) return;
  let changed = false;
  if (content.heroImage === "/frames/coast.jpg") {
    content.heroImage = "/frames/broadsands.jpg";
    changed = true;
  }
  if (content.placesImage === "/frames/estuary.jpg") {
    content.placesImage = "/frames/broadsands.jpg";
    changed = true;
  }
  content.pieces = content.pieces.map((piece) => {
    if (piece.slug !== "between-tides" || piece.image !== "/frames/estuary.jpg") return piece;
    changed = true;
    return {
      ...piece,
      image: "/frames/broadsands.jpg",
      place: "Broadsands",
      summary: "The cove, filmed as it is. Clear water, a small beach, the coast doing the talking.",
      story:
        "North Devon is not a backdrop you drop a logo onto. When a brand belongs here, the coast can carry the film: clear water, a small beach, a day that is not postcard blue. We use it sparingly, and only when it is true.",
    };
  });
  if (!changed) return;
  await sql`
    update site_state
    set content = ${JSON.stringify(content)}::jsonb, updated_at = now()
    where id = 1
  `;
}
