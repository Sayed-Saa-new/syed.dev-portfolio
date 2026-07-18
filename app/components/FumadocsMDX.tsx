"use client";

import * as runtime from "react/jsx-runtime";
import { isValidElement, useMemo, type ReactNode, createElement } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { withArticle } from "fumadocs-ui/page";
import { MdxMermaid } from "./MdxMermaid";
import { MdxReveal } from "./MdxReveal";

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
    return (
      <MdxReveal blur={10} y={16}>
        <MdxMermaid chart={chart} />
      </MdxReveal>
    );
  }

  const DefaultPre: any = (defaultMdxComponents as any).pre;
  return (
    <MdxReveal blur={8} y={12}>
      <DefaultPre {...props} />
    </MdxReveal>
  );
}

// Wrap a Fumadocs default component (or plain tag) in a scroll-triggered
// blur-fade reveal — keeps all default styling, just adds the entrance.
function withReveal(
  tag: string,
  opts: { blur?: number; y?: number } = {},
) {
  const Default: any = (defaultMdxComponents as any)[tag] ?? tag;
  const Wrapped = (props: any) => (
    <MdxReveal blur={opts.blur ?? 8} y={opts.y ?? 12}>
      {createElement(Default, props)}
    </MdxReveal>
  );
  Wrapped.displayName = `Reveal(${tag})`;
  return Wrapped;
}

const revealComponents = {
  h1: withReveal("h1", { blur: 10, y: 16 }),
  h2: withReveal("h2", { blur: 10, y: 16 }),
  h3: withReveal("h3", { blur: 8, y: 14 }),
  h4: withReveal("h4"),
  p: withReveal("p", { blur: 6, y: 10 }),
  ul: withReveal("ul"),
  ol: withReveal("ol"),
  blockquote: withReveal("blockquote", { blur: 10, y: 14 }),
  table: withReveal("table", { blur: 10, y: 16 }),
  img: withReveal("img", { blur: 12, y: 18 }),
  figure: withReveal("figure", { blur: 12, y: 18 }),
  hr: withReveal("hr"),
};

export function FumadocsMDX({ code, components }: Props) {
  const Component = useMDXComponent(code);
  return withArticle({
    children: (
      <Component
        components={{
          ...defaultMdxComponents,
          ...revealComponents,
          pre: PreWithMermaid,
          ...components,
        }}
      />
    ),
  });
}
