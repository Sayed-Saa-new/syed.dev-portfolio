"use client";

import { useRef, useState, type ReactNode } from "react";
import { Clipboard, Check } from "lucide-react";

export function GeminiCodeBlock({
  children,
  ...rest
}: {
  children?: ReactNode;
  [key: string]: any;
}) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="not-prose relative my-6 rounded-2xl bg-neutral-100 ring-1 ring-neutral-200/80">
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy code"
        className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-200/70 hover:text-neutral-800"
      >
        {copied ? <Check size={15} /> : <Clipboard size={15} />}
      </button>
      <pre
        ref={ref}
        {...rest}
        className="overflow-x-auto rounded-2xl bg-transparent px-5 py-4 pr-14 font-mono text-[13.5px] leading-6 text-neutral-800"
      >
        {children}
      </pre>
    </div>
  );
}
