import { z } from "zod";

const imagePath = z
  .string()
  .regex(/^\/(?:frames\/[a-z]+\.jpg|media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);

const pieceSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).max(80),
  title: z.string().min(1).max(140),
  place: z.string().max(80),
  kind: z.string().max(80),
  year: z.string().max(20),
  summary: z.string().max(400),
  story: z.string().max(2400),
  image: imagePath,
});

const namedSchema = z.object({
  name: z.string().min(1).max(80),
  line: z.string().max(280),
});

const noteSchema = z.object({
  date: z.string().max(20),
  label: z.string().max(40),
  title: z.string().min(1).max(160),
  body: z.string().max(800),
});

export const siteContentSchema = z.object({
  brand: z.string().min(1).max(60),
  placeLine: z.string().max(80),
  navWork: z.string().min(1).max(40),
  navPractice: z.string().min(1).max(40),
  navEnquire: z.string().min(1).max(40),
  heroEyebrow: z.string().max(80),
  heroTitle: z.string().min(1).max(160),
  heroDeck: z.string().max(400),
  introKicker: z.string().max(40),
  introTitle: z.string().min(1).max(160),
  introBody: z.string().max(800),
  workKicker: z.string().max(40),
  workTitle: z.string().min(1).max(120),
  workLink: z.string().max(60),
  disciplineKicker: z.string().max(40),
  disciplineTitle: z.string().min(1).max(120),
  disciplines: z.array(namedSchema).min(1).max(8),
  notesKicker: z.string().max(40),
  notesTitle: z.string().min(1).max(120),
  notes: z.array(noteSchema).min(1).max(6),
  bandTitle: z.string().min(1).max(160),
  bandBody: z.string().max(400),
  bandLink: z.string().max(60),
  practiceKicker: z.string().max(40),
  practiceTitle: z.string().min(1).max(160),
  practiceBody: z.string().max(1200),
  practiceAside: z.string().max(400),
  steps: z.array(namedSchema).min(1).max(6),
  placesTitle: z.string().min(1).max(80),
  placesBody: z.string().max(400),
  enquireKicker: z.string().max(40),
  enquireTitle: z.string().min(1).max(140),
  enquireBody: z.string().max(400),
  fieldName: z.string().max(40),
  fieldBusiness: z.string().max(40),
  fieldEmail: z.string().max(40),
  fieldMessage: z.string().max(40),
  fieldSend: z.string().max(40),
  enquireThanks: z.string().max(240),
  footerNote: z.string().max(160),
  instagramLabel: z.string().max(40),
  heroImage: imagePath,
  practiceImage: imagePath,
  placesImage: imagePath,
  deskImage: imagePath,
  pieces: z.array(pieceSchema).min(1).max(12),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type Piece = SiteContent["pieces"][number];

export const DEFAULT_CONTENT: SiteContent = {
  brand: "Media Studio",
  placeLine: "North Devon",
  navWork: "Work",
  navPractice: "Practice",
  navEnquire: "Enquire",
  heroEyebrow: "Business content · North Devon",
  heroTitle: "Content that gives a business a presence.",
  heroDeck:
    "Content creation and social media, held by strategy, storytelling and creative direction. For brands, businesses and events.",
  introKicker: "The practice",
  introTitle: "Made for the feed, and for the room it came from.",
  introBody:
    "Media Studio is retained by the people who keep the room — a hotel, a shop, a kitchen, a night. What they already do becomes a series in their own voice: precise, unhurried, and unmistakably theirs.",
  workKicker: "Selected work",
  workTitle: "The kinds of stories we make.",
  workLink: "All work",
  disciplineKicker: "What we do",
  disciplineTitle: "Six ways in.",
  disciplines: [
    {
      name: "Content creation",
      line: "Films, stills and series made to be posted, not left in a drive.",
    },
    {
      name: "Social media",
      line: "A rhythm a small team can actually keep, week after week.",
    },
    {
      name: "Strategy",
      line: "What to say, to whom, and what is better left unsaid.",
    },
    {
      name: "Storytelling",
      line: "The through-line from a walk-in to the caption underneath.",
    },
    {
      name: "Creative direction",
      line: "Look, pace and tone, so every frame belongs with the others.",
    },
    {
      name: "Events",
      line: "Coverage that feels like the night, rather than a brochure of it.",
    },
  ],
  notesKicker: "Notes",
  notesTitle: "From the studio.",
  notes: [
    {
      date: "02.11.26",
      label: "Field note",
      title: "A series, not a pile of posts.",
      body: "One idea, shot so it can live for a month. That is usually more useful than twelve unrelated clips.",
    },
    {
      date: "18.10.26",
      label: "Practice",
      title: "Post less, on purpose.",
      body: "North Devon businesses do not need a content factory. They need a voice people recognise when they are already in town.",
    },
    {
      date: "03.09.26",
      label: "Weather",
      title: "Shoot the day you have.",
      body: "Overcast on the estuary is not a delay. It is the picture. We plan for the light that is actually here.",
    },
  ],
  bandTitle: "Tell us what the business is trying to say.",
  bandBody:
    "Brands, businesses and events across North Devon. A conversation first — then a shape for the work.",
  bandLink: "Start a conversation",
  practiceKicker: "Practice",
  practiceTitle: "A small studio with a point of view.",
  practiceBody:
    "Media Studio is a business content practice in North Devon. The work is content creation and social media, with the strategy, storytelling and creative direction that keep it coherent. We partner with brands, businesses and events — the independent ones especially, where the owner is still in the room.",
  practiceAside:
    "The public account is @media.studio_uk. This site is the longer version of that bio: what we make, and how a project actually runs.",
  steps: [
    { name: "Listen", line: "What the business is, who it is for, and what should never be said in its voice." },
    { name: "Shape", line: "A story and a posting rhythm, before anyone picks up a camera." },
    { name: "Shoot", line: "On the ground in North Devon — rooms, service, landscape, the people only from behind if they prefer." },
    { name: "Cut", line: "Edit for the feed: pace, captions, and a set you can keep using." },
  ],
  placesTitle: "On the ground",
  placesBody:
    "Based in North Devon. Working in Barnstaple, Braunton, Croyde, Woolacombe, Ilfracombe and the villages between.",
  enquireKicker: "Enquire",
  enquireTitle: "Bring the brief, even if it is still rough.",
  enquireBody:
    "Tell us the business, the event, or the season you are heading into. We reply from the studio.",
  fieldName: "Name",
  fieldBusiness: "Business",
  fieldEmail: "Email",
  fieldMessage: "What you need",
  fieldSend: "Send",
  enquireThanks: "Received. We will come back to you from the studio.",
  footerNote: "Content, strategy and direction for North Devon.",
  instagramLabel: "Instagram",
  heroImage: "/frames/broadsands.jpg",
  practiceImage: "/frames/filming.jpg",
  placesImage: "/frames/broadsands.jpg",
  deskImage: "/frames/desk.jpg",
  pieces: [
    {
      slug: "open-for-the-season",
      title: "Open for the season",
      place: "Croyde",
      kind: "Hospitality",
      year: "2026",
      summary: "A social series for a coastal stay: mornings, the table, and the walk down to the sand.",
      story:
        "Hospitality content fails when it looks like a brochure and succeeds when it feels like a morning you would book. This series is built around one stay: the light in the room, the cup, the path to the beach. Shot to be posted across a fortnight, not dumped on a single launch day.",
      image: "/frames/hotel.jpg",
    },
    {
      slug: "the-counter",
      title: "The counter",
      place: "Barnstaple",
      kind: "Retail",
      year: "2026",
      summary: "Still and short-form work for an independent shop — objects, hands, and the reason someone comes in.",
      story:
        "A shop does not need a lifestyle campaign. It needs pictures of what is actually on the table, and a line of copy that sounds like the person behind it. We direct the frames so the grid feels collected, then hand back a set the team can keep posting.",
      image: "/frames/shop.jpg",
    },
    {
      slug: "night-of",
      title: "Night of",
      place: "Ilfracombe",
      kind: "Events",
      year: "2025",
      summary: "Event coverage that stays with the room: long table, low light, the feeling rather than the schedule.",
      story:
        "Events move too fast for a shot list and too slow for a highlight reel of every speech. We cover the night as a story — arrival, the table, the late quiet — so the business has something worth sharing the next morning.",
      image: "/frames/event.jpg",
    },
    {
      slug: "service",
      title: "Service",
      place: "Braunton",
      kind: "Food",
      year: "2025",
      summary: "Kitchen and plate, cut for a restaurant that would rather show the work than announce a special.",
      story:
        "Food content is mostly noise. We stay close to the pass: hands, linen, one dish, the window light. The point is appetite and trust, not a menu typed over a clip.",
      image: "/frames/kitchen.jpg",
    },
    {
      slug: "on-camera",
      title: "On camera",
      place: "North Devon",
      kind: "Founders",
      year: "2026",
      summary: "Founder films for owners who should be heard, without turning them into presenters.",
      story:
        "Some businesses are the person who runs them. We film from the work itself — the counter, the harbour light, the phone already in their hand — so the piece feels witnessed rather than performed. Strategy first: what they are actually willing to say.",
      image: "/frames/filming.jpg",
    },
    {
      slug: "between-tides",
      title: "Between tides",
      place: "Broadsands",
      kind: "Place",
      year: "2025",
      summary: "The cove, filmed as it is. Clear water, a small beach, the coast doing the talking.",
      story:
        "North Devon is not a backdrop you drop a logo onto. When a brand belongs here, the coast can carry the film: clear water, a small beach, a day that is not postcard blue. We use it sparingly, and only when it is true.",
      image: "/frames/broadsands.jpg",
    },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function coerceContent(value: unknown): SiteContent | null {
  let raw = value;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw) as unknown;
    } catch {
      return null;
    }
  }
  if (!isRecord(raw)) return null;
  const pieces = Array.isArray(raw.pieces) ? raw.pieces : DEFAULT_CONTENT.pieces;
  const candidate = {
    ...DEFAULT_CONTENT,
    ...raw,
    pieces: pieces.map((piece, index) => ({
      ...(DEFAULT_CONTENT.pieces[index] ?? DEFAULT_CONTENT.pieces[0]),
      ...(isRecord(piece) ? piece : {}),
    })),
    disciplines: mergeNamed(DEFAULT_CONTENT.disciplines, raw.disciplines),
    steps: mergeNamed(DEFAULT_CONTENT.steps, raw.steps),
    notes: mergeNotes(raw.notes),
  };
  const parsed = siteContentSchema.safeParse(candidate);
  return parsed.success ? parsed.data : null;
}

function mergeNamed(
  fallback: SiteContent["disciplines"],
  incoming: unknown,
): SiteContent["disciplines"] {
  if (!Array.isArray(incoming) || incoming.length === 0) return fallback;
  return incoming.map((item, index) => ({
    ...(fallback[index] ?? fallback[0]),
    ...(isRecord(item) ? item : {}),
  }));
}

function mergeNotes(incoming: unknown): SiteContent["notes"] {
  if (!Array.isArray(incoming) || incoming.length === 0) return DEFAULT_CONTENT.notes;
  return incoming.map((item, index) => ({
    ...(DEFAULT_CONTENT.notes[index] ?? DEFAULT_CONTENT.notes[0]),
    ...(isRecord(item) ? item : {}),
  }));
}
