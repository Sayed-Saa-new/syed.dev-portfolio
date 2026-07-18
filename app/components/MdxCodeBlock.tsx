"use client";

import { useState } from "react";
import { highlight } from "sugar-high";

export function MdxCodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const html = highlight(code);
  const label = filename || language;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border-primary bg-neutral-950">
      {(label || true) && (
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-2">
          <span className="font-mono text-xs text-neutral-400">
            {label || "code"}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="font-mono text-xs text-neutral-400 transition-colors hover:text-neutral-100"
            aria-label="Copy code"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-neutral-100">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
