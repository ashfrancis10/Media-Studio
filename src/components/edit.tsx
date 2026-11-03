import {
  useLayoutEffect,
  useRef,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useSite } from "@/components/site-context";

type As = "span" | "p" | "h1" | "h2" | "h3";

export function Edit({
  value,
  onChange,
  as = "span",
  className,
  multiline = false,
  max = 400,
}: {
  value: string;
  onChange: (next: string) => void;
  as?: As;
  className?: string;
  multiline?: boolean;
  max?: number;
}) {
  const { editing } = useSite();
  const ref = useRef<HTMLElement | null>(null);
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value, editing]);

  if (!editing) {
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }

  function commit(el: HTMLElement) {
    let next = (el.textContent ?? "").replace(/\u00a0/g, " ");
    next = multiline ? next.trim() : next.replace(/\s+/g, " ").trim();
    next = next.slice(0, max);
    if (!next) {
      el.textContent = value;
      return;
    }
    if (next !== value) onChange(next);
    else if (el.textContent !== value) el.textContent = value;
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!multiline && event.key === "Enter") event.preventDefault();
  }

  function onPaste(event: ClipboardEvent<HTMLElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
  }

  const shared = {
    ref: setRef,
    "data-edit": "",
    contentEditable: true,
    suppressContentEditableWarning: true,
    className,
    onBlur: (event: FocusEvent<HTMLElement>) => commit(event.currentTarget),
    onKeyDown,
    onPaste,
  };

  if (as === "h1") return <h1 {...shared} />;
  if (as === "h2") return <h2 {...shared} />;
  if (as === "h3") return <h3 {...shared} />;
  if (as === "p") return <p {...shared} />;
  return <span {...shared} />;
}
