"use client";

import * as runtime from "react/jsx-runtime";
import { useMemo } from "react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { withArticle } from "fumadocs-ui/page";

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

export function FumadocsMDX({ code, components }: Props) {
  const Component = useMDXComponent(code);
  return withArticle({
    children: (
      <Component components={{ ...defaultMdxComponents, ...components }} />
    ),
  });
}
