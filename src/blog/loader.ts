import { marked } from "marked";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  content: string;
  html: string;
}

// Use import.meta.glob to load markdown files
const markdownModules = import.meta.glob("./posts/*.md", { 
  query: "?raw", 
  import: "default",
  eager: true 
}) as Record<string, string>;

// Simple YAML-like frontmatter parser for browser
function parseFrontmatter(content: string): { data: Record<string, unknown>; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  const data: Record<string, unknown> = {};
  
  // Parse simple key: value pairs
  const lines = frontmatterText.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value: unknown = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if (typeof value === 'string' && value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (typeof value === 'string' && value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      // Parse arrays (simple format: [item1, item2])
      if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/["']/g, ''));
      }
      
      data[key] = value;
    }
  }
  
  return { data, body };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  try {
    for (const [path, content] of Object.entries(markdownModules)) {
      // Extract slug from path: "./posts/what-is-a-good-wpm.md" -> "what-is-a-good-wpm"
      const slug = path.replace("./posts/", "").replace(".md", "");
      
      const parsed = parseFrontmatter(content);
      const html = await marked.parse(parsed.body || "");
      
      posts.push({
        slug,
        title: (parsed.data.title as string) || "",
        description: (parsed.data.description as string) || "",
        date: (parsed.data.date as string) || "",
        category: (parsed.data.category as string) || "",
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
        author: (parsed.data.author as string) || "Typex Team",
        readTime: (parsed.data.readTime as string) || "5 min read",
        content: parsed.body || "",
        html,
      });
    }
  } catch (error) {
    console.error("Error loading blog posts:", error);
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export async function getRelatedPosts(currentSlug: string, category: string, limit: number = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, limit);
}

export function generateTableOfContents(html: string): { level: number; text: string; id: string }[] {
  const headings: { level: number; text: string; id: string }[] = [];
  const headingRegex = /<h([23])[^>]*>([^<]+)<\/h\1>/g;
  let match;
  
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    headings.push({ level, text, id });
  }
  
  return headings;
}

// Extract FAQs from markdown content for structured data
export function extractFAQs(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  
  // Match ### Question followed by answer text until next ### or ##
  const faqRegex = /###\s+([^\n]+)\n\n([^#]+?)(?=\n###|\n##|$)/gs;
  let match;
  
  while ((match = faqRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim().replace(/\n+/g, " ").substring(0, 300); // Limit length
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }
  
  return faqs;
}
