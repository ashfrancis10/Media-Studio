import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  DEFAULT_CONTENT,
  type Piece,
  type SiteContent,
} from "@/lib/content";
import { getEditor, saveSite } from "@/lib/site.functions";

type Named = { name: string; line: string };
type Note = SiteContent["notes"][number];

type SiteApi = {
  content: SiteContent;
  editing: boolean;
  setEditing: (next: boolean) => void;
  canEdit: boolean;
  locked: boolean;
  dirty: boolean;
  saving: boolean;
  notice: string | null;
  patch: (partial: Partial<SiteContent>) => void;
  patchPiece: (slug: string, partial: Partial<Piece>) => void;
  patchNamed: (key: "disciplines" | "steps", index: number, partial: Partial<Named>) => void;
  patchNote: (index: number, partial: Partial<Note>) => void;
  save: () => Promise<void>;
};

const SiteContext = createContext<SiteApi | null>(null);

export function SiteProvider({
  initial,
  children,
}: {
  initial: SiteContent | null;
  children: ReactNode;
}) {
  const { user, isPending } = useCurrentUserState();
  const starting = initial ?? DEFAULT_CONTENT;
  const [content, setContent] = useState<SiteContent>(starting);
  const [baseline, setBaseline] = useState(() => JSON.stringify(starting));
  const [canEdit, setCanEdit] = useState(false);
  const [locked, setLocked] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  useEffect(() => {
    if (isPending) return;
    let cancel = false;
    if (!user) {
      setCanEdit(false);
      setLocked(false);
      setEditing(false);
      return;
    }
    getEditor()
      .then((editor) => {
        if (cancel) return;
        if (editor.role === "locked") {
          setCanEdit(false);
          setLocked(true);
          setEditing(false);
          return;
        }
        const next =
          editor.role === "owner" && editor.content
            ? editor.content
            : contentRef.current;
        setContent(next);
        setBaseline(JSON.stringify(next));
        setCanEdit(true);
        setLocked(false);
        setNotice(null);
      })
      .catch(() => {
        if (!cancel) {
          setCanEdit(false);
          setLocked(false);
        }
      });
    return () => {
      cancel = true;
    };
  }, [isPending, user?.id]);

  const api = useMemo<SiteApi>(() => {
    const dirty = JSON.stringify(content) !== baseline;
    return {
      content,
      editing: canEdit && editing,
      setEditing: (next) => {
        if (canEdit) setEditing(next);
      },
      canEdit,
      locked,
      dirty,
      saving,
      notice,
      patch: (partial) => setContent((current) => ({ ...current, ...partial })),
      patchPiece: (slug, partial) =>
        setContent((current) => ({
          ...current,
          pieces: current.pieces.map((piece) =>
            piece.slug === slug ? { ...piece, ...partial } : piece,
          ),
        })),
      patchNamed: (key, index, partial) =>
        setContent((current) => ({
          ...current,
          [key]: current[key].map((item, itemIndex) =>
            itemIndex === index ? { ...item, ...partial } : item,
          ),
        })),
      patchNote: (index, partial) =>
        setContent((current) => ({
          ...current,
          notes: current.notes.map((note, noteIndex) =>
            noteIndex === index ? { ...note, ...partial } : note,
          ),
        })),
      save: async () => {
        setSaving(true);
        setNotice(null);
        try {
          const result = await saveSite({ data: contentRef.current });
          if (!result.ok) {
            setNotice(result.error);
            setLocked(true);
            setCanEdit(false);
            setEditing(false);
            return;
          }
          setBaseline(JSON.stringify(contentRef.current));
          setNotice("Saved to your account. Visitors see this version.");
        } catch {
          setNotice("Sign in again to save.");
        } finally {
          setSaving(false);
        }
      },
    };
  }, [baseline, canEdit, content, editing, locked, notice, saving]);

  return <SiteContext.Provider value={api}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("useSite must be used inside SiteProvider");
  return value;
}
