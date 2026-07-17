declare module "#site/content" {
  export type Blog = {
    title: string;
    publishedAt: string;
    summary: string;
    imageName: string;
    categories: string[];
    slug: string;
    slugAsParams: string;
    code: string;
    canonicalUrl?: string;
    draft?: boolean;
    audioFile?: string;
    headings: Array<{
      level: 2 | 3;
      text: string;
      slug: string;
    }>;
  };

  export type Changelog = {
    title: string;
    publishedAt: string;
    imageName?: string;
    slug: string;
    slugAsParams: string;
    code: string;
    draft?: boolean;
  };

  export const posts: Blog[];
  export const changelogItems: Changelog[];
}