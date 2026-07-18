import React from "react";
import * as runtime from "react/jsx-runtime";
import { highlight } from "sugar-high";
import { HorizontalLine } from "./HorizontalLine";
import { MdxMermaid } from "./MdxMermaid";
import { MdxCodeBlock } from "./MdxCodeBlock";
import { MdxReveal } from "./MdxReveal";
import Link from "next/link";

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
  [key: string]: any;
}

// Shared typographic style — Fraunces serif, generous rhythm for focused reading.
const proseStyle: React.CSSProperties = {
  fontFeatureSettings: '"liga", "dlig", "kern"',
  fontVariationSettings: '"SOFT" 100, "opsz" 24',
  letterSpacing: "-0.003em",
  wordSpacing: "0.01em",
};

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ));
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(props) {
  let href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props) {
  return (
    <div className="relative">
      <span className="absolute inset-x-0 top-0">
        <HorizontalLine />
      </span>
      <img src={props.src} alt={props.alt} className="rounded-3xl" />
      <span className="absolute inset-x-0 bottom-0">
        <HorizontalLine />
      </span>
    </div>
  );
}

function Callout(props) {
  return (
    <div className="mb-8 flex items-center rounded border border-neutral-200 bg-neutral-50 p-1 px-4 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
      <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
      <div className="callout w-full">{props.children}</div>
    </div>
  );
}

function ProsCard({ title, pros }) {
  return (
    <div className="my-4 w-full rounded-xl border border-emerald-200 bg-neutral-50 p-6 dark:border-emerald-900 dark:bg-neutral-900">
      <span>{`You might use ${title} if...`}</span>
      <div className="mt-4">
        {pros.map((pro) => (
          <div key={pro} className="mb-2 flex items-baseline font-medium">
            <div className="mr-2 h-4 w-4">
              <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </g>
              </svg>
            </div>
            <span>{pro}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsCard({ title, cons }) {
  return (
    <div className="my-6 w-full rounded-xl border border-red-200 bg-neutral-50 p-6 dark:border-red-900 dark:bg-neutral-900">
      <span>{`You might not use ${title} if...`}</span>
      <div className="mt-4">
        {cons.map((con) => (
          <div key={con} className="mb-2 flex items-baseline font-medium">
            <div className="mr-2 h-4 w-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-red-500"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </div>
            <span>{con}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InlineCode({ children, ...props }) {
  const codeHTML = highlight(String(children));
  return (
    <code
      className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[0.9em] text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  );
}

function extractText(node: any): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node.props?.children) return extractText(node.props.children);
  return "";
}

function Pre({ children }: any) {
  // MDX passes <pre><code className="language-xxx">...</code></pre>
  const codeEl = React.Children.toArray(children).find(
    (c: any) => c?.props,
  ) as any;
  const rawClass = codeEl?.props?.className;
  const className: string = Array.isArray(rawClass)
    ? rawClass.join(" ")
    : rawClass || "";
  const language = className.match(/language-([\w-]+)/)?.[1]?.toLowerCase();
  const raw = extractText(codeEl?.props?.children).replace(/\n$/, "");

  const inner =
    language === "mermaid" ? (
      <MdxMermaid chart={raw} />
    ) : (
      <MdxCodeBlock code={raw} language={language} />
    );

  return <MdxReveal blur={12} y={18}>{inner}</MdxReveal>;
}

function StyledTable({ children }: any) {
  return (
    <MdxReveal blur={12} y={18}>
      <div className="mb-8 overflow-x-auto rounded-xl border border-border-primary">
        <table className="w-full border-collapse text-left text-sm">
          {children}
        </table>
      </div>
    </MdxReveal>
  );
}
function Thead({ children }: any) {
  return (
    <thead className="bg-neutral-50 dark:bg-neutral-900">{children}</thead>
  );
}
function Th({ children }: any) {
  return (
    <th className="border-b border-border-primary px-4 py-2 font-medium text-text-primary">
      {children}
    </th>
  );
}
function Td({ children }: any) {
  return (
    <td className="border-b border-dashed border-border-primary px-4 py-2 text-text-secondary">
      {children}
    </td>
  );
}
function Tr({ children }: any) {
  return <tr>{children}</tr>;
}

function Blockquote({ children }: any) {
  return (
    <MdxReveal blur={10} y={14}>
      <blockquote
        className="font-poem mb-10 border-l-4 border-indigo-500 bg-neutral-50 py-4 pl-6 pr-4 text-[1.15rem] italic leading-[1.75] text-text-secondary dark:bg-neutral-900"
        style={proseStyle}
      >
        {children}
      </blockquote>
    </MdxReveal>
  );
}

function Hr() {
  return (
    <MdxReveal blur={6} y={8}>
      <hr className="my-12 border-t border-dashed border-border-primary" />
    </MdxReveal>
  );
}


function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

const HEADING_SIZES: Record<number, string> = {
  1: "text-4xl md:text-5xl leading-[1.1] mt-16 mb-8",
  2: "text-3xl md:text-4xl leading-[1.15] mt-14 mb-6",
  3: "text-2xl md:text-3xl leading-[1.2] mt-12 mb-5",
  4: "text-xl md:text-2xl leading-[1.3] mt-10 mb-4",
  5: "text-lg md:text-xl leading-[1.35] mt-8 mb-3",
  6: "text-base md:text-lg leading-[1.4] mt-8 mb-3",
};

function createHeading(level: number) {
  const Tag = `h${level}` as any;
  const HeadingComp = ({ children }: any) => {
    const slug = slugify(children);
    return (
      <MdxReveal blur={12} y={16}>
        <Tag
          id={slug}
          className={`font-poem tracking-[-0.015em] font-medium text-text-primary ${HEADING_SIZES[level]}`}
          style={{
            fontFeatureSettings: '"liga", "dlig", "swsh", "kern"',
            fontVariationSettings: '"SOFT" 100, "opsz" 144',
          }}
        >
          <a href={`#${slug}`} className="anchor" aria-hidden />
          {children}
        </Tag>
      </MdxReveal>
    );
  };
  HeadingComp.displayName = `MdxH${level}`;
  return HeadingComp;
}

function paragraph({ children }) {
  return (
    <MdxReveal as="p"
      className="font-poem mb-8 text-[1.15rem] md:text-[1.2rem] leading-[1.85] text-text-secondary"
    >
      <span style={proseStyle}>{children}</span>
    </MdxReveal>
  );
}

function OrderedList({ children }) {
  return (
    <MdxReveal blur={8} y={12}>
      <ol className="font-poem mb-8 list-inside list-decimal space-y-2 text-[1.1rem] leading-[1.85] text-text-secondary" style={proseStyle}>
        {children}
      </ol>
    </MdxReveal>
  );
}

const sharedComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomLink,
  ol: OrderedList,
  ul: OrderedList,
  Callout,
  ProsCard,
  ConsCard,
  //   StaticTweet: TweetComponent,
  code: InlineCode,
  pre: Pre,
  table: StyledTable,
  thead: Thead,
  tbody: (props: any) => <tbody {...props} />,
  tr: Tr,
  th: Th,
  td: Td,
  blockquote: Blockquote,
  hr: Hr,
  Table,
  p: paragraph,
  //   LiveCode,
};

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

export const MDXContent = ({ code, components, ...props }: MDXProps) => {
  const Component = useMDXComponent(code);
  return (
    <Component components={{ ...sharedComponents, ...components }} {...props} />
  );
};
