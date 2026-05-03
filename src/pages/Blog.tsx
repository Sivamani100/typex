import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Home, Clock, ArrowRight, User } from "lucide-react";
import MetaTags, { createBreadcrumbSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";
import AdUnit from "@/components/AdUnit";
import { getAllPosts, type BlogPost } from "@/blog/loader";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setLoading(false);
    };
    loadPosts();
  }, []);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ]);

  return (
    <>
      <MetaTags
        title="Typing Tips & Guides — Typex Blog"
        description="Expert articles on improving typing speed, WPM averages, touch typing, and keyboard techniques. Free guides for all skill levels."
        canonical="/blog"
        ogTitle="Typing Tips & Guides — Typex Blog"
        ogDescription="Expert articles on improving typing speed, WPM averages, touch typing, and keyboard techniques. Free guides for all skill levels."
        ogUrl="/blog"
        jsonLd={breadcrumbSchema}
      />

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
          <div className="w-full max-w-[1000px] mx-auto py-12">
            {/* Hero */}
            <section className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                Typex Blog
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.1] mb-4">
                Typing Tips & Guides
              </h1>
              <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl mx-auto">
                Expert articles to help you type faster, more accurately, and with better technique.
              </p>
            </section>

            {/* Blog Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-muted-foreground">Loading articles...</div>
              </div>
            ) : (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </section>
            )}

            {/* Ad Unit - Between content and CTA */}
            <div className="flex justify-center mb-12">
              <AdUnit size="medium-rectangle" slot="blog-listing-ad" />
            </div>

            {/* CTA */}
            <section className="text-center pt-12 border-t border-white/5">
              <p className="text-muted-foreground mb-4">Ready to put these tips into practice?</p>
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
              >
                <BookOpen className="w-5 h-5" />
                Take a Free Typing Test
              </Link>
            </section>
          </div>
        </main>

      </div>
    </>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group glass rounded-2xl p-6 border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all"
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
        {post.category}
      </span>
      <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
        <Clock className="w-3 h-3" />
        {post.readTime}
      </span>
    </div>
    <h2 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
      {post.title}
    </h2>
    <p className="text-[13px] text-muted-foreground/70 font-medium leading-relaxed mb-4 line-clamp-2">
      {post.description}
    </p>
    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
        <User className="w-3.5 h-3.5" />
        <span>{post.author}</span>
        <span>•</span>
        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>
      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </Link>
);

export default Blog;
