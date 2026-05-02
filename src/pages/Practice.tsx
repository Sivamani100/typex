import { Link } from "react-router-dom";
import { Home, Keyboard, Hand, Target, Zap, Repeat, BookOpen } from "lucide-react";

const Practice = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <div className="w-full flex-1 flex flex-col px-6 sm:px-14 pt-8 pb-10 max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="leading-tight">
            <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Typex
            </div>
            <div className="text-[11px] sm:text-xs font-medium tracking-[0.18em] text-primary mt-0.5">
              Practice Mode
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-secondary/70 text-primary text-sm font-medium
                         hover:bg-secondary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase">
            <Keyboard className="w-3.5 h-3.5" />
            Practice Playground
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-medium tracking-tight text-foreground">
            Learn how to type — fast & accurate
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Build muscle memory with proper finger placement, drills, and short
            warm-ups. Then put it to the test.
          </p>
        </section>

        {/* Tip cards */}
        <section className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TipCard
            icon={<Hand className="w-5 h-5" />}
            title="Home Row Position"
            body="Place left fingers on A S D F and right on J K L ; — your thumbs rest on space."
          />
          <TipCard
            icon={<Target className="w-5 h-5" />}
            title="Accuracy First"
            body="Slow down and aim for clean keystrokes. Speed follows accuracy, never the other way around."
          />
          <TipCard
            icon={<Repeat className="w-5 h-5" />}
            title="Daily Drills"
            body="10 focused minutes a day beats one long session. Consistency builds real speed."
          />
        </section>

        {/* Drill rows */}
        <section className="mt-12">
          <h2 className="text-xl font-medium text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Warm-up Drills
          </h2>
          <div className="space-y-3">
            <DrillRow label="Home row" text="asdf jkl; asdf jkl; aaaa ssss dddd ffff jjjj kkkk llll ;;;;" />
            <DrillRow label="Top row" text="qwer tyui qwer tyui quiet write power query ruler upper" />
            <DrillRow label="Bottom row" text="zxcv bnm, zxcv bnm, zoom value combo number music maven" />
            <DrillRow label="Common words" text="the and you that with have from this they will when your" />
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
                       bg-primary text-primary-foreground text-sm font-medium
                       hover:bg-primary/90 transition-colors"
          >
            <Zap className="w-4 h-4" />
            I'm ready — Start a real test
          </Link>
        </section>
      </div>
    </div>
  );
};

const TipCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-xl border border-border/60 bg-card p-5">
    <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
      {icon}
    </div>
    <h3 className="mt-3 text-base font-medium text-foreground">{title}</h3>
    <p className="mt-1 text-sm text-muted-foreground font-medium">{body}</p>
  </div>
);

const DrillRow = ({ label, text }: { label: string; text: string }) => (
  <div className="rounded-lg border border-border/50 bg-card/60 p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
    <div className="text-[11px] uppercase tracking-[0.18em] font-medium text-primary sm:w-32 shrink-0">
      {label}
    </div>
    <code className="text-sm sm:text-base font-medium text-foreground tracking-wide font-mono">
      {text}
    </code>
  </div>
);

export default Practice;
