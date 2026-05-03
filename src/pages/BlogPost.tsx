import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { BookOpen, Home, Clock, ArrowLeft, User, Calendar as CalendarIcon, Share2, Twitter, Linkedin, Link2, List, ChevronRight } from "lucide-react";
import MetaTags, { createBreadcrumbSchema, createArticleSchema, createFAQSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdUnit from "@/components/AdUnit";
import AdNetwork, { AdContainer, AdDirectLink } from "@/components/AdNetwork";
import { getPostBySlug, getRelatedPosts, type BlogPost, generateTableOfContents, extractFAQs } from "@/blog/loader";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [toc, setToc] = useState<{ level: number; text: string; id: string }[]>([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      const foundPost = await getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        const headings = generateTableOfContents(foundPost.html);
        setToc(headings);
        const related = await getRelatedPosts(slug, foundPost.category);
        setRelatedPosts(related);
      }
      setLoading(false);
    };
    loadPost();
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = post ? encodeURIComponent(`${post.title} via @typex`) : "";
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading article...</div>
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Extract FAQs for structured data (rich snippets)
  const faqs = extractFAQs(post.content);
  const faqSchema = faqs.length > 0 ? createFAQSchema(faqs) : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const articleSchema = createArticleSchema({
    headline: post.title,
    author: post.author,
    datePublished: post.date,
    image: `https://typex.arkio.in/og-image.png`,
  });

  // Combine schemas - Article + FAQPage for maximum SEO
  const jsonLdSchemas = faqSchema 
    ? [breadcrumbSchema, articleSchema, faqSchema]
    : [breadcrumbSchema, articleSchema];

  return (
    <>
      <MetaTags
        title={`${post.title} — Typex Blog`}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        ogTitle={post.title}
        ogDescription={post.description}
        ogUrl={`/blog/${post.slug}`}
        ogType="article"
        jsonLd={jsonLdSchemas}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100]">
        <div
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="min-h-screen w-full bg-background flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="w-full px-6 sm:px-14 pt-10 pb-4 max-w-[1400px] mx-auto shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="leading-tight">
              <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                Typex
              </div>
              <div className="text-[11px] sm:text-xs font-medium tracking-[0.18em] text-primary mt-0.5 uppercase">
                Blog
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3 mr-32">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass text-primary text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-14">
          <div className="w-full max-w-[1200px] mx-auto py-12">
            <div className="flex gap-12">
              {/* Sidebar TOC */}
              {toc.length > 0 && (
                <aside className="hidden lg:block w-64 shrink-0">
                  <div className="sticky top-8">
                    <div className="glass rounded-xl p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-4">
                        <List className="w-4 h-4 text-primary" />
                        Table of Contents
                      </div>
                      <nav className="space-y-2">
                        {toc.map((heading, index) => (
                          <a
                            key={index}
                            href={`#${heading.id}`}
                            className={`block text-[13px] hover:text-primary transition-colors ${
                              heading.level === 2 ? "text-muted-foreground pl-0" : "text-muted-foreground/60 pl-3"
                            }`}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </aside>
              )}

              {/* Article Content */}
              <div className="flex-1 max-w-[800px]">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                  <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-foreground truncate">{post.title}</span>
                </nav>

                {/* Back Link */}
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Link>

                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground leading-[1.2] mb-4">
                    {post.title}
                  </h1>
                  <p className="text-lg text-muted-foreground/80">
                    {post.description}
                  </p>
                  <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5 text-[13px] text-muted-foreground/60">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </header>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                  <span className="text-sm text-muted-foreground">Share:</span>
                  <button
                    onClick={shareOnTwitter}
                    className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareOnLinkedIn}
                    className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-full glass hover:bg-white/10 transition-colors relative"
                    title="Copy link"
                  >
                    <Link2 className="w-4 h-4" />
                    {showCopied && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-primary text-primary-foreground text-[10px] whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                  <div className="ml-auto">
                    <AdDirectLink />
                  </div>
                </div>

                {/* Top Banner Ad - Before Article */}
                <div className="mb-8 flex justify-center">
                  <AdNetwork type="profitable-cpm-leaderboard" />
                </div>

                {/* Article Content */}
                <article
                  className="prose prose-invert prose-primary max-w-none
                    prose-headings:text-foreground prose-headings:font-medium
                    prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                    prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5
                    prose-li:mb-2
                    prose-strong:text-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-table:border-white/10
                    prose-th:border-white/10 prose-th:bg-white/5 prose-th:text-foreground
                    prose-td:border-white/10 prose-td:text-muted-foreground
                    prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                  dangerouslySetInnerHTML={{ __html: post.html }}
                />

                {/* Mid-Article Ad Section */}
                <div className="my-12 glass rounded-xl border border-white/5 p-6">
                  <h3 className="text-sm font-medium text-center text-muted-foreground mb-4 uppercase tracking-wider">
                    Sponsored
                  </h3>
                  <div className="flex flex-wrap justify-center gap-6">
                    <AdContainer containerId="container-0bb4c5329cf485af7b48c6ba21661f31" />
                    <div className="hidden md:block">
                      <AdNetwork type="profitable-cpm-rectangle" />
                    </div>
                  </div>
                </div>

                {/* Ad Units - Below blog post content */}
                <div className="mt-8 space-y-6">
                  <div className="flex justify-center">
                    <AdUnit size="leaderboard" slot="blog-post-bottom" />
                  </div>
                  <div className="flex justify-center">
                    <AdNetwork type="profitable-cpm-banner" />
                  </div>
                  <div className="flex justify-center md:hidden">
                    <AdNetwork type="profitable-cpm-mobile" />
                  </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                  <section className="mt-12 pt-8 border-t border-white/5">
                    <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-primary" />
                      Related Articles
                    </h2>
                    <div className="space-y-3">
                      {relatedPosts.map((related) => (
                        <Link
                          key={related.slug}
                          to={`/blog/${related.slug}`}
                          className="block p-4 rounded-xl glass border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">
                              {related.category}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60">• {related.readTime}</span>
                          </div>
                          <h3 className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            {related.title}
                          </h3>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* CTA */}
                <section className="mt-12 pt-8 border-t border-white/5 text-center">
                  <p className="text-muted-foreground mb-4">Ready to improve your typing speed?</p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
                  >
                    <BookOpen className="w-5 h-5" />
                    Take a Free Typing Test
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </main>

      </div>
    </>
  );
};

export default BlogPost;
