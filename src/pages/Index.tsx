import { Link } from "react-router-dom";
import { ChevronDown, BookOpen, Target, Zap, Keyboard, FileText } from "lucide-react";
import { useState } from "react";
import TypingTest from "@/components/TypingTest";
import MetaTags, {
  createWebApplicationSchema,
  createOrganizationSchema,
  createFAQSchema,
} from "@/seo/MetaTags";
import AdNetwork, { AdContainer, AdDirectLink } from "@/components/AdNetwork";

const faqData = [
  {
    question: "What is a typing speed test?",
    answer: "A typing speed test measures how many words you type per minute (WPM) and your accuracy percentage. Typex shows your result instantly — no sign-up needed.",
  },
  {
    question: "What is WPM in typing?",
    answer: "WPM stands for Words Per Minute — the number of 5-character groups you type correctly in one minute. It is the standard measure of typing speed worldwide.",
  },
  {
    question: "What is the average typing speed?",
    answer: "The average typing speed for adults is 40 WPM. Most office workers type between 50-70 WPM, while professional typists reach 70-100 WPM.",
  },
  {
    question: "How is typing accuracy calculated?",
    answer: "Typing accuracy is the percentage of keystrokes typed correctly. Typex calculates it as: (correct characters ÷ total characters typed) × 100.",
  },
  {
    question: "How do I improve my typing speed?",
    answer: "Practice daily with a free typing test like Typex. Focus on accuracy first, speed second. Touch typing (without looking at the keyboard) is the fastest path to improvement.",
  },
  {
    question: "Is 60 WPM fast?",
    answer: "Yes, 60 WPM is above average. Most adults type between 40-60 WPM. At 60 WPM, you are faster than the majority of the general population.",
  },
  {
    question: "Is Typex typing test free?",
    answer: "Yes. Typex is completely free — no account needed, no ads, no limits. Just open the site and start typing.",
  },
  {
    question: "How long is the Typex typing test?",
    answer: "Typex offers 15, 30, 60, and 120 second test durations. The default is 60 seconds, which is the industry standard for measuring WPM.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blogLinks: { slug: string; title: string; icon: any }[] = [
  { slug: "what-is-a-good-wpm", title: "What is a Good WPM? Complete Guide", icon: Target },
  { slug: "how-to-type-faster", title: "How to Type Faster: Reach 100 WPM", icon: Zap },
  { slug: "touch-typing-tutorial", title: "Touch Typing Tutorial for Beginners", icon: Keyboard },
  { slug: "average-typing-speed", title: "Average Typing Speed Statistics", icon: FileText },
  { slug: "best-typing-websites-2026", title: "Best Typing Websites 2026 Comparison", icon: BookOpen },
];

const Index = () => {
  const webAppSchema = createWebApplicationSchema();
  const orgSchema = createOrganizationSchema();
  const faqSchema = createFAQSchema(faqData);

  return (
    <>
      <MetaTags
        title="Free Typing Speed Test — Check Your WPM Online | Typex"
        description="Test your typing speed for free. Get your WPM and accuracy score in 60 seconds. The cleanest, fastest typing test online — no sign-up needed."
        canonical="/"
        ogTitle="Free Typing Speed Test — Check Your WPM Online | Typex"
        ogDescription="Test your typing speed for free. Get your WPM and accuracy score in 60 seconds. The cleanest, fastest typing test online — no sign-up needed."
        ogUrl="/"
        jsonLd={[webAppSchema, orgSchema, faqSchema]}
        hreflang={[
          { lang: "en", url: "/" },
          { lang: "x-default", url: "/" },
        ]}
      />
      <h1 className="sr-only">Typex — Online Typing Test for Speed and Accuracy</h1>
      
      {/* Top Banner Ad - Leaderboard */}
      <div className="w-full flex justify-center py-4 px-4">
        <AdNetwork type="profitable-cpm-leaderboard" />
      </div>
      
      <TypingTest />
      
      {/* Middle Ad Section */}
      <section className="w-full max-w-[1200px] mx-auto px-6 sm:px-14 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Skyscraper */}
          <div className="hidden md:flex justify-center">
            <AdNetwork type="profitable-cpm-skyscraper" />
          </div>
          
          {/* Center Content */}
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <AdDirectLink />
            <p className="text-xs text-muted-foreground/50 text-center">
              Support Typex by checking out our partners
            </p>
          </div>
          
          {/* Right Skyscraper */}
          <div className="hidden md:flex justify-center">
            <AdNetwork type="profitable-cpm-rectangle" />
          </div>
        </div>
      </section>
      
      <FAQSection />
      
      {/* FAQ Bottom Ad */}
      <div className="w-full flex justify-center py-6 px-4">
        <AdNetwork type="profitable-cpm-banner" />
      </div>
      
      <BlogLinksSection />
      
      {/* Blog Section Ad */}
      <section className="w-full max-w-[1000px] mx-auto px-6 sm:px-14 py-8">
        <div className="glass rounded-xl border border-white/5 p-6">
          <h3 className="text-lg font-medium text-center mb-4">Sponsored</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <AdContainer containerId="container-0bb4c5329cf485af7b48c6ba21661f31" />
          </div>
        </div>
      </section>
      
      {/* Bottom Mobile Banner */}
      <div className="w-full flex justify-center py-4 px-4 md:hidden">
        <AdNetwork type="profitable-cpm-mobile" />
      </div>
    </>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full max-w-[1000px] mx-auto px-6 sm:px-14 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground mb-3">
          Common Questions About Typing Speed
        </h2>
        <p className="text-muted-foreground">
          Everything you need to know about WPM, accuracy, and improving your typing
        </p>
      </div>

      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="glass rounded-xl border border-white/5 overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-foreground pr-4">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-primary shrink-0 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const BlogLinksSection = () => {
  return (
    <section className="w-full max-w-[1000px] mx-auto px-6 sm:px-14 py-12 border-t border-white/5">
      <div className="text-center mb-8">
        <h2 className="text-xl font-medium text-foreground mb-2">
          Learn to Type Faster
        </h2>
        <p className="text-sm text-muted-foreground">
          Expert guides to improve your WPM
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogLinks.map((post) => {
          const IconComponent = post.icon;
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group flex items-start gap-3 p-4 rounded-xl glass border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <span className="text-[11px] text-muted-foreground/60 mt-1 inline-block">
                  Read article →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          View All Typing Guides
        </Link>
      </div>
    </section>
  );
};

export default Index;
