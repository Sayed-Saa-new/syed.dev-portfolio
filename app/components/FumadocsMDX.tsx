"use client";

import * as runtime from "react/jsx-runtime";
import { isValidElement, useMemo, type ReactNode } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { withArticle } from "fumadocs-ui/page";
import { MdxMermaid } from "./MdxMermaid";

interface Props {
  code: string;
  components?: Record<string, any>;
}

function useMDXComponent(code: string) {
  return useMemo(() => {
    const fn = new Function(code);
    return fn({ ...runtime }).default;
  }, [code]);
}

// Extract the raw string content out of nested MDX children (handles cases
// where the compiler wraps text in <span>s).
function collectText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(collectText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return collectText(props.children);
  }
  return "";
}

function PreWithMermaid(props: any) {
  const child: any = props?.children;
  const className: string =
    (child && child.props && child.props.className) || props?.className || "";
  const isMermaid =
    /\blanguage-mermaid\b/.test(className) || /\bmermaid\b/.test(className);

  if (isMermaid) {
    const chart = collectText(child?.props?.children ?? props?.children).trim();
    return <MdxMermaid chart={chart} />;
  }

  const DefaultPre: any = (defaultMdxComponents as any).pre;
  return <DefaultPre {...props} />;
}

export function FumadocsMDX({ code, components }: Props) {
  const Component = useMDXComponent(code);
  return withArticle({
    children: (
      <Component
        components={{
          ...defaultMdxComponents,
          pre: PreWithMermaid,
          ...components,
        }}
      />
    ),
  });
}
