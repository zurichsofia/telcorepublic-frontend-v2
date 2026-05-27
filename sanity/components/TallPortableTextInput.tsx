import { useLayoutEffect, useRef } from "react";

import type { ArrayOfObjectsInputProps } from "sanity";

export function TallPortableTextInput(props: ArrayOfObjectsInputProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const editorHeight = "min(70vh, 780px)";

    const apply = () => {
      const editor = root.querySelector<HTMLElement>('[data-testid="pt-editor"]');
      const toolbar = root.querySelector<HTMLElement>(
        '[data-testid="pt-editor__toolbar-card"]',
      );
      const scroller = root.querySelector<HTMLElement>(
        '[data-testid="scroll-container"]',
      );
      const editable = root.querySelector<HTMLElement>('[data-slate-editor="true"]');

      // Make the editor a fixed-height flex column: toolbar stays, body scrolls.
      if (editor) {
        editor.style.height = editorHeight;
        editor.style.maxHeight = editorHeight;
        editor.style.display = "flex";
        editor.style.flexDirection = "column";
      }

      if (toolbar) {
        toolbar.style.flex = "0 0 auto";
        toolbar.style.flexShrink = "0";
      }

      if (scroller) {
        scroller.style.flex = "1 1 auto";
        scroller.style.minHeight = "0";
        scroller.style.overflow = "auto";
      }

      if (editable) {
        editable.style.minHeight = "100%";
        editable.style.paddingBottom = "24px";
      }
    };

    // Run a few times to catch async mount/layout within Studio.
    const raf1 = requestAnimationFrame(() => apply());
    const raf2 = requestAnimationFrame(() => apply());
    const t = window.setTimeout(() => apply(), 250);
    const t2 = window.setTimeout(() => apply(), 1000);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-tall-portable-text
      style={{ minHeight: "70vh", display: "flex", flexDirection: "column" }}
    >
      <div
        style={{
          fontSize: 12,
          opacity: 0.65,
          margin: "2px 0 6px",
          userSelect: "none",
        }}
      >
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
