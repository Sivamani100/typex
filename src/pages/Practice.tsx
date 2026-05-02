import { Home, Keyboard, Hand, Target, Zap, Repeat, BookOpen, Palette, Volume2, VolumeX, ShieldCheck, GitBranch, Calendar, Copyright } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WindowControls from "@/components/WindowControls";

// Audio Context for the typing sounds
let audioCtx: AudioContext | null = null;

const playKeySound = (type: 'default' | 'space' | 'backspace' | 'enter' = 'default') => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    
    // 1. Crisp Click (Noise)
    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(type === 'space' ? 1500 : 3500, now);
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(type === 'backspace' ? 0.08 : 0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    // 2. Tonal Snap (Sine)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'sine';
    let freq = 600;
    let decay = 0.03;
    if (type === 'space') {
      freq = 200;
      decay = 0.06;
    } else if (type === 'backspace') {
      freq = 450;
      decay = 0.02;
    } else {
      freq = 550 + Math.random() * 100;
    }
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + decay);
    oscGain.gain.setValueAtTime(type === 'space' ? 0.18 : 0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + decay);
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    noiseSource.start(now);
    osc.start(now);
    osc.stop(now + decay);
  } catch (e) {
    console.warn("Audio error:", e);
  }
};

const Practice = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("typex-sound") !== "false";
  });
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);

  const lessons = [
    { id: 'home', label: 'Home Row', title: 'Home Row Essentials', text: 'asdf jkl; asdf jkl; aaaa ssss dddd ffff jjjj kkkk llll ;;;;' },
    { id: 'top', label: 'Top Row', title: 'Top Row Reach', text: 'qwer tyui qwer tyui quiet write power query ruler upper' },
    { id: 'bottom', label: 'Bottom Row', title: 'Bottom Row Glide', text: 'zxcv bnm, zxcv bnm, zoom value combo number music maven' },
    { id: 'common', label: 'Common', title: 'Common Words', text: 'the and you that with have from this they will when your' },
    { id: 'numbers', label: 'Numbers', title: 'Number Row', text: '123 456 789 012 345 678 901 234 567 890 102 938 475 621' },
  ];

  useEffect(() => {
    localStorage.setItem("typex-sound", soundEnabled.toString());
  }, [soundEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (soundEnabled) {
      if (e.key === ' ') playKeySound('space');
      else if (e.key === 'Backspace') playKeySound('backspace');
      else if (e.key === 'Enter') playKeySound('enter');
      else if (e.key.length === 1) playKeySound('default');
    }

    if (activeLesson && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (!startTime) setStartTime(Date.now());
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (startTime) {
      const minutes = (Date.now() - startTime) / 60000;
      const words = value.length / 5;
      setWpm(Math.round(words / minutes) || 0);
    }

    if (value === activeLesson?.text) {
      // Completed!
    }
  };

  const startLesson = (lesson: any) => {
    setActiveLesson(lesson);
    setUserInput("");
    setStartTime(null);
    setWpm(0);
  };
  return (
    <div className="h-screen w-full bg-transparent flex flex-col overflow-hidden" onKeyDown={handleKeyDown} tabIndex={0}>
      <WindowControls />
      {/* Header - Fixed at top - Draggable in Electron */}
      <header className="w-full px-6 sm:px-14 pt-10 pb-4 max-w-[1400px] mx-auto shrink-0 flex items-center justify-between [zoom:1] [-webkit-app-region:drag]">
        <div className="flex items-center gap-4 [-webkit-app-region:no-drag]">
          <div className="w-10 h-10 rounded-xl liquid-glass flex items-center justify-center overflow-hidden p-1.5 group hover:scale-105 transition-transform">
            <img src="/icon.svg" alt="Typex Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(33,255,18,0.3)]" />
          </div>
          <div className="leading-tight">
            <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Typex
            </div>
            <div className="text-[11px] sm:text-xs font-medium tracking-[0.18em] text-primary mt-0.5 uppercase">
              Practice Mode
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 [-webkit-app-region:no-drag]">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full glass hover:bg-white/10 transition-colors text-foreground/70 hover:text-primary"
            title={soundEnabled ? "Disable Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <ThemeToggle />
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       glass text-primary text-sm font-medium
                       hover:bg-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </nav>
      </header>

      {/* Main Content - Improved scrollable area */}
      <main className="flex-1 overflow-y-auto px-6 sm:px-14 scroll-smooth">
        <div className="w-full max-w-[1200px] mx-auto flex gap-12 py-12">
          
          {/* Side Bar - Minimalist Floating Navigation */}
          <aside className="hidden lg:flex flex-col gap-8 w-52 shrink-0 sticky top-0 h-fit pt-4">
            <div>
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.4em] mb-4 opacity-70">Library</div>
              <nav className="flex flex-col gap-1.5">
                <SideNavLink icon={<Keyboard className="w-4 h-4" />} label="Overview" active />
                <SideNavLink icon={<Target className="w-4 h-4" />} label="Technique" />
                <SideNavLink icon={<BookOpen className="w-4 h-4" />} label="Drills" />
                <SideNavLink icon={<Palette className="w-4 h-4" />} label="Themes" />
              </nav>
            </div>
            
            <div className="mt-4 relative overflow-hidden rounded-3xl p-5 glass border border-primary/20 bg-primary/[0.02]">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />
              <div className="relative">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Efficiency
                </div>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                  Daily practice of 15 minutes is proven to increase speed by 25% within a month.
                </p>
              </div>
            </div>
          </aside>

          {/* Center Content */}
          <div className="flex-1 max-w-[900px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {activeLesson ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <button 
                  onClick={() => setActiveLesson(null)}
                  className="mb-8 text-sm font-medium text-primary hover:underline flex items-center gap-2"
                >
                  ← Back to Lessons
                </button>
                
                <div className="mb-12">
                  <div className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-2">Active Lesson</div>
                  <h1 className="text-4xl font-medium text-foreground">{activeLesson.title}</h1>
                </div>

                <div className="glass rounded-3xl p-10 border border-white/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Speed</div>
                      <div className="text-2xl font-medium text-primary">{wpm} <span className="text-xs opacity-50">WPM</span></div>
                    </div>
                  </div>

                  <div className="relative text-2xl font-mono leading-relaxed tracking-wide min-h-[100px] flex flex-wrap gap-x-[0.2em]">
                    {activeLesson.text.split('').map((char, i) => {
                      let color = "text-muted-foreground/30";
                      if (i < userInput.length) {
                        color = userInput[i] === char ? "text-primary" : "text-destructive";
                      }
                      return (
                        <span key={i} className={cn(color, i === userInput.length && "bg-primary/20 rounded-sm px-0.5 animate-pulse")}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  
                  <input
                    autoFocus
                    type="text"
                    value={userInput}
                    onChange={handleTyping}
                    className="absolute inset-0 opacity-0 cursor-default"
                  />
                </div>
                
                <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground/50 font-medium">
                  <div className="px-3 py-1.5 rounded-full glass border border-white/5">Press any key to start</div>
                  <div className="px-3 py-1.5 rounded-full glass border border-white/5">Focus on accuracy over speed</div>
                </div>
              </div>
            ) : (
              <>
                {/* Hero */}
                <section className="text-left mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase mb-6">
                    <Keyboard className="w-3.5 h-3.5" />
                    Practice Playground
                  </div>
                  <h1 className="text-4xl sm:text-[54px] font-medium tracking-tight text-foreground leading-[1.1]">
                    Master your technique
                  </h1>
                  <p className="mt-4 text-lg sm:text-[20px] text-muted-foreground/80 font-medium max-w-2xl">
                    Build muscle memory with proper finger placement and consistent practice.
                  </p>
                </section>

                {/* Tip cards */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
                  <TipCard
                    icon={<Hand className="w-4 h-4" />}
                    title="Home Row"
                    body="Place fingers on A S D F and J K L ;"
                  />
                  <TipCard
                    icon={<Target className="w-4 h-4" />}
                    title="Accuracy"
                    body="Aim for clean keystrokes every time."
                  />
                  <TipCard
                    icon={<Repeat className="w-4 h-4" />}
                    title="Daily Drills"
                    body="10 minutes a day is the magic number."
                  />
                </section>

                {/* Drill rows */}
                <section className="space-y-12">
                  <div>
                    <h2 className="text-xl font-medium text-foreground mb-6 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Warm-up Drills
                    </h2>
                    <div className="space-y-3">
                      {lessons.map(lesson => (
                        <DrillRow 
                          key={lesson.id}
                          label={lesson.label} 
                          text={lesson.text} 
                          onClick={() => startLesson(lesson)}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                {/* CTA */}
                <section className="mt-20 pt-12 border-t border-white/5">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full
                               bg-primary text-primary-foreground text-base font-medium
                               hover:bg-primary/90 transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
                  >
                    <Zap className="w-5 h-5" />
                    Start a real test
                  </Link>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer - Slim Centered */}
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
          <div className="flex items-center gap-2 group cursor-default hover:text-muted-foreground/60 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
            <span>Privacy & Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const SideNavLink = ({ icon, label, active = false }: any) => (
  <button className={cn(
    "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-300 group relative",
    active 
      ? "bg-primary/10 text-primary shadow-sm" 
      : "text-muted-foreground/50 hover:text-foreground hover:bg-white/5"
  )}>
    {active && (
      <div className="absolute left-0 w-1 h-4 bg-primary rounded-full" />
    )}
    <span className={cn(
      "transition-all duration-500", 
      active ? "text-primary scale-110" : "text-muted-foreground/30 group-hover:text-primary/60 group-hover:scale-110"
    )}>
      {icon}
    </span>
    <span className="tracking-tight">{label}</span>
  </button>
);

const TipCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="rounded-2xl glass p-5 border border-white/5 hover:bg-white/5 transition-all">
    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
    <p className="text-[11px] text-muted-foreground/60 font-medium leading-relaxed">{body}</p>
  </div>
);

const DrillRow = ({ label, text, onClick }: { label: string; text: string; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full rounded-xl glass p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 border border-white/5 hover:border-primary/40 hover:bg-white/10 transition-all group text-left"
  >
    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60 sm:w-28 shrink-0 group-hover:text-primary transition-colors">
      {label}
    </div>
    <code className="text-sm sm:text-[13px] font-medium text-foreground/50 tracking-wide font-mono bg-white/5 px-3 py-1 rounded-md truncate">
      {text}
    </code>
    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary text-[10px] font-bold uppercase tracking-widest">
      Start Drill →
    </div>
  </button>
);

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default Practice;
