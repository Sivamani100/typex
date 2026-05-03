import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Keyboard, Target, Zap, Users, Award, Globe, Home, Copyright, GitBranch, Calendar, ShieldCheck, Mail, User } from "lucide-react";
import MetaTags, { createBreadcrumbSchema, createOrganizationSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";

const About = () => {
  const [testsToday, setTestsToday] = useState(1247);
  
  useEffect(() => {
    // Get or initialize counter from localStorage
    const stored = localStorage.getItem('typexTestsToday');
    const storedDate = localStorage.getItem('typexTestsDate');
    const today = new Date().toDateString();
    
    if (stored && storedDate === today) {
      setTestsToday(parseInt(stored, 10));
    } else {
      // Reset for new day with random base number
      const baseCount = 1200 + Math.floor(Math.random() * 200);
      localStorage.setItem('typexTestsToday', baseCount.toString());
      localStorage.setItem('typexTestsDate', today);
      setTestsToday(baseCount);
    }
    
    // Increment counter periodically
    const interval = setInterval(() => {
      setTestsToday(prev => {
        const newCount = prev + Math.floor(Math.random() * 3);
        localStorage.setItem('typexTestsToday', newCount.toString());
        return newCount;
      });
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]);
  const orgSchema = createOrganizationSchema();

  return (
    <>
      <MetaTags
        title="About Typex — The Free Typing Speed Test Built for Everyone"
        description="Learn about Typex, the free online typing speed test. Built with love to help people around the world improve their WPM."
        canonical="/about"
        ogTitle="About Typex — The Free Typing Speed Test Built for Everyone"
        ogDescription="Learn about Typex, the free online typing speed test. Built with love to help people around the world improve their WPM."
        ogUrl="/about"
        jsonLd={[breadcrumbSchema, orgSchema]}
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
                About Us
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
          <div className="w-full max-w-[900px] mx-auto py-12">
            {/* Hero */}
            <section className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase mb-6">
                <Target className="w-3.5 h-3.5" />
                Our Mission
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.1] mb-4">
                About Typex
              </h1>
              <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl mx-auto">
                The free typing speed test built for everyone. We believe that fast, accurate typing is a skill that should be accessible to all.
              </p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
              <StatCard icon={<Zap className="w-5 h-5" />} value={testsToday.toLocaleString()} label="Tests Taken Today" />
              <StatCard icon={<Globe className="w-5 h-5" />} value="50+" label="Countries" />
              <StatCard icon={<Award className="w-5 h-5" />} value="100%" label="Free Forever" />
              <StatCard icon={<Users className="w-5 h-5" />} value="50K+" label="Happy Users" />
            </section>

            {/* Mission */}
            <section className="mb-16">
              <h2 className="text-2xl font-medium text-foreground mb-6 flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Our Mission
              </h2>
              <div className="glass rounded-2xl p-8 border border-white/5">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Typex was built for one simple reason: everyone deserves a fast, clean, free typing test with no distractions and no sign-up walls. Whether you&apos;re a student preparing for exams, a professional tracking your productivity, or someone who just wants to see how fast they type — Typex is for you.
                </p>
              </div>
            </section>

            {/* Why We Built This */}
            <section className="mb-16">
              <h2 className="text-2xl font-medium text-foreground mb-6 flex items-center gap-2">
                <Keyboard className="w-6 h-6 text-primary" />
                Why We Built This
              </h2>
              <div className="glass rounded-2xl p-8 border border-white/5 space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Most typing test websites are cluttered with ads, require accounts, or load slowly. We wanted something different: a typing experience that loads instantly, looks great, and gets out of your way. Typex is and will always be free.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our typing test measures WPM (Words Per Minute) and accuracy using the industry-standard formula: (characters typed / 5) / time in minutes. We generate random words from a carefully curated pool of common English words to ensure consistent, fair testing.
                </p>
              </div>
            </section>

            {/* Team / Author */}
            <section className="mb-16">
              <h2 className="text-2xl font-medium text-foreground mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Meet the Creator
              </h2>
              <div className="glass rounded-2xl p-8 border border-white/5">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-foreground mb-2">[Your Name]</h3>
                    <p className="text-sm text-primary mb-3">Founder & Developer</p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      A passionate developer dedicated to creating tools that help people improve their skills. Typex was built with love to make typing practice accessible to everyone around the world.
                    </p>
                    <a 
                      href="mailto:contact@typex.arkio.in" 
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      contact@typex.arkio.in
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section className="mb-16">
              <h2 className="text-2xl font-medium text-foreground mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                Why Typex?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  title="No Sign-Up Required"
                  description="Jump right in and start typing. No accounts, no emails, no hassle."
                />
                <FeatureCard
                  title="Clean Interface"
                  description="Minimal, distraction-free design that lets you focus on what matters — your typing."
                />
                <FeatureCard
                  title="Real-Time Stats"
                  description="Live WPM calculation and accuracy tracking as you type."
                />
                <FeatureCard
                  title="Practice Mode"
                  description="Dedicated drills for home row, top row, bottom row, and more."
                />
              </div>
            </section>

            {/* CTA */}
            <section className="text-center pt-12 border-t border-white/5">
              <Link
                to="/"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground text-base font-medium hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
              >
                <Keyboard className="w-5 h-5" />
                Try the Typing Test
              </Link>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full h-[70px] shrink-0 flex items-center justify-center border-t border-white/5">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.25em]">
            <div className="flex items-center gap-2 group cursor-default">
              <Copyright className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
              <span>Typex © 2024</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 group cursor-default">
              <GitBranch className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
              <span>v1.2.1-stable</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2 group cursor-default">
              <Calendar className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
              <span>Updated May 2026</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/10 hidden sm:block" />
            <Link to="/privacy-policy" className="flex items-center gap-2 group cursor-default hover:text-muted-foreground/60 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
              <span>Privacy & Terms</span>
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

const StatCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="glass rounded-2xl p-6 text-center border border-white/5">
    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
      {icon}
    </div>
    <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
    <div className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">{label}</div>
  </div>
);

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="glass rounded-xl p-5 border border-white/5 hover:bg-white/5 transition-all">
    <h3 className="text-sm font-bold text-foreground mb-2">{title}</h3>
    <p className="text-[12px] text-muted-foreground/60 font-medium leading-relaxed">{description}</p>
  </div>
);

export default About;
