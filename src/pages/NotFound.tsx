import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertTriangle, Copyright, GitBranch, Calendar, ShieldCheck } from "lucide-react";
import MetaTags from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <MetaTags
        title="Page Not Found — Typex"
        description="The page you are looking for does not exist. Return to Typex typing test."
        noindex={true}
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
                404
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
        <main className="flex-1 flex items-center justify-center px-6 sm:px-14">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-6xl sm:text-7xl font-bold text-foreground mb-4 tracking-tight">
              404
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Page not found
            </p>
            <p className="text-sm text-muted-foreground/60 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
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

export default NotFound;
