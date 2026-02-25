import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags: string[];
  readingTime: string;
  draft: boolean;
  coAuthors?: string[];
  views?: number;
};

export type PostDetail = PostSummary & {
  content: string;
};

const postsDirectory = path.join(process.cwd(), "content");

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const numberOfWords = content.split(/\s/g).length;
  const minutes = Math.ceil(numberOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

export async function getPosts(limit?: number): Promise<PostSummary[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        id: slug,
        slug,
        title: data.title || slug,
        summary: data.summary || "",
        image: data.image || "",
        publishedAt: data.publishedAt || "",
        updatedAt: data.updatedAt || data.publishedAt || "",
        tags: data.tags || [],
        readingTime: calculateReadingTime(content),
        draft: !!data.draft,
        coAuthors: data.coAuthors || [],
        views: 0,
      } as PostSummary;
    });

  // Sort posts by date
  const sortedPosts = allPostsData.sort((a, b) => {
    if ((a.publishedAt || "") < (b.publishedAt || "")) {
      return 1;
    } else {
      return -1;
    }
  });

  return limit ? sortedPosts.slice(0, limit) : sortedPosts;
}

export async function getPostBySlug(slug: string): Promise<PostDetail | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id: slug,
      slug,
      title: data.title || slug,
      summary: data.summary || "",
      image: data.image || "",
      publishedAt: data.publishedAt || "",
      updatedAt: data.updatedAt || data.publishedAt || "",
      tags: data.tags || [],
      readingTime: calculateReadingTime(content),
      draft: !!data.draft,
      coAuthors: data.coAuthors || [],
      views: 0,
      content,
    } as PostDetail;
  } catch (err) {
    console.error(`Error fetching post ${slug}:`, err);
    return null;
  }
}
