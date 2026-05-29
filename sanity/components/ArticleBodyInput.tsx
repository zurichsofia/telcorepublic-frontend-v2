import { useCallback, useRef, useState } from "react";
import { PatchEvent, set, type ArrayOfObjectsInputProps } from "sanity";

import { docxToPortableText } from "../lib/docxToPortableText";

const toolbarStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 10,
  marginBottom: 10,
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid rgba(17, 24, 39, 0.12)",
  background: "rgba(17, 24, 39, 0.03)",
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  color: "rgba(17, 24, 39, 0.92)",
  background: "#fff",
  border: "1px solid rgba(17, 24, 39, 0.18)",
};

const buttonDisabledStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.55,
  cursor: "not-allowed",
};

const hintStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.45,
  color: "rgba(17, 24, 39, 0.58)",
  margin: 0,
};

const statusOkStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(21, 128, 61, 0.95)",
  margin: 0,
};

const statusErrorStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(185, 28, 28, 0.95)",
  margin: 0,
};

const statusWarnStyle: React.CSSProperties = {
  fontSize: 12,
  lineHeight: 1.45,
  color: "rgba(161, 98, 7, 0.95)",
  margin: "4px 0 0",
};

function hasBodyContent(value: unknown) {
  return Array.isArray(value) && value.length > 0;
}

type ImportStatus =
  | { tone: "error"; text: string; }
  | { tone: "ok"; text: string; };

export function ArticleBodyInput(props: ArrayOfObjectsInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [status, setStatus] = useState<ImportStatus | null>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".docx")) {
        setStatus({ tone: "error", text: "Please choose a .docx file." });
        event.target.value = "";
        return;
      }

      if (
        hasBodyContent(props.value) &&
        !window.confirm(
          "Replace the current body with the imported Word document?",
        )
      ) {
        event.target.value = "";
        return;
      }

      setImporting(true);
      setStatus(null);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const { blocks } = await docxToPortableText(
          arrayBuffer,
          props.schemaType,
        );

        if (!blocks.length) {
          setStatus({
            tone: "error",
            text: "No content found in that document.",
          });
          return;
        }

        props.onChange(PatchEvent.from(set(blocks)));

        setStatus({
          tone: "ok",
          text: `Imported ${blocks.length} block(s) from “${file.name}”.`,
        });
      } catch (error) {
        setStatus({
          tone: "error",
          text:
            error instanceof Error
              ? error.message
              : "Import failed. Try exporting the document again as .docx.",
        });
      } finally {
        setImporting(false);
        event.target.value = "";
      }
    },
    [props],
  );

  return (
    <div>
      <div style={toolbarStyle}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          hidden
          onChange={handleFileChange}
        />
        <button
          type="button"
          style={importing ? buttonDisabledStyle : buttonStyle}
          disabled={importing}
          onClick={() => fileInputRef.current?.click()}
        >
          {importing ? "Importing…" : "Import from Word (.docx)"}
        </button>
        <p style={hintStyle}>
          Headings,
          lists, links, and basic formatting are supported.
          <br />!Important: Inline images are not supported.
        </p>
      </div>

      {status ? (
        <div style={{ marginBottom: 10 }}>
          <p style={status.tone === "ok" ? statusOkStyle : statusErrorStyle}>
            {status.text}
          </p>
          {status.tone === "ok" ? (
            <p style={statusWarnStyle}>
              Please have a look at the article body to make sure everything is
              imported as expected before publishing.
            </p>
          ) : null}
        </div>
      ) : null}

      {props.renderDefault(props)}
    </div>
  );
}
