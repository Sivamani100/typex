import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Home, RotateCw, Copyright, GitBranch, Calendar, ShieldCheck, Zap, Target, CheckCircle2, XCircle, Clock, Trophy, Palette, Volume2, VolumeX, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import WindowControls from "./WindowControls";

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
    
    // 1. The "Click" (Noise)
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
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02); // Sharper decay
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    // 2. The "Thump" (Sine)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.type = 'sine';
    let freq = 600; // Higher pitch for Typing Club feel
    let decay = 0.03; // Snappier
    
    if (type === 'space') {
      freq = 200;
      decay = 0.06;
    } else if (type === 'backspace') {
      freq = 450;
      decay = 0.02;
    } else if (type === 'enter') {
      freq = 300;
      decay = 0.1;
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

const WORD_POOL = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
  "he", "was", "for", "on", "are", "as", "with", "his", "they",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
  "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if",
  "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
  "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
  "two", "more", "write", "go", "see", "number", "no", "way", "could", "people",
  "my", "than", "first", "water", "been", "call", "who", "its", "now", "find",
  "long", "down", "day", "did", "get", "come", "made", "may", "part", "over",
  "new", "sound", "take", "only", "little", "work", "know", "place", "year", "live",
  "back", "give", "most", "very", "after", "thing", "our", "just", "name",
  "good", "man", "think", "say", "great", "where", "help", "through",
  "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell",
  "follow", "came", "want", "show", "also", "around", "form", "three", "small",
  "set", "put", "end", "why", "again", "turn", "here", "off", "went",
  "between", "against", "develop", "without", "become", "those", "open", "move",
  "during", "both", "must",
];

const TEST_WORD_COUNT = 72;
const TIMER_SECONDS = 60;

function generateWords(count = TEST_WORD_COUNT) {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return arr;
}

type Stats = {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  timeSeconds: number;
  correctWords: number;
  totalWords: number;
};

function computeStats(words: string[], typed: string, timeSeconds: number): Stats {
  const typedWords = typed.length === 0 ? [] : typed.split(" ");
  let correctChars = 0;
  let incorrectChars = 0;
  let correctWords = 0;

  typedWords.forEach((tw, i) => {
    const target = words[i] ?? "";
    const len = Math.max(tw.length, target.length);
    let wordOk = tw.length === target.length;
    for (let k = 0; k < len; k++) {
      const t = tw[k];
      const r = target[k];
      if (t == null) {
        // missing char (only when this isn't the actively-being-typed last word)
        if (i < typedWords.length - 1) incorrectChars++;
      } else if (r == null) {
        incorrectChars++;
        wordOk = false;
      } else if (t === r) {
        correctChars++;
      } else {
        incorrectChars++;
        wordOk = false;
      }
    }
    // count spaces between completed words
    if (i < typedWords.length - 1) correctChars++;
    if (wordOk && i < typedWords.length - 1) correctWords++;
    // also count last word if fully matches and length equal (test finished case)
    if (wordOk && i === typedWords.length - 1 && tw.length === target.length && tw.length > 0) {
      correctWords++;
    }
  });

  const totalChars = correctChars + incorrectChars;
  const minutes = Math.max(timeSeconds, 1) / 60;
  const wpm = Math.round((correctChars / 5) / minutes);
  const rawWpm = Math.round((totalChars / 5) / minutes);
  const accuracy = totalChars === 0 ? 0 : Math.round((correctChars / totalChars) * 100);

  return {
    wpm,
    rawWpm,
    accuracy,
    correctChars,
    incorrectChars,
    totalChars,
    timeSeconds,
    correctWords,
    totalWords: words.length,
  };
}

export const TypingTest = () => {
  const [words, setWords] = useState<string[]>(() => generateWords());
  const [typed, setTyped] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const typedRef = useRef(typed);

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("typex-sound") !== "false";
  });

  useEffect(() => {
    localStorage.setItem("typex-sound", soundEnabled.toString());
  }, [soundEnabled]);

  // keep typedRef in sync
  useEffect(() => {
    typedRef.current = typed;
  }, [typed]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // helper to finalize the test and compute stats
  const finishTest = useCallback((finalTyped: string) => {
    const elapsed = startTimeRef.current
      ? Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
      : secondsElapsed;
    const s = computeStats(words, finalTyped, elapsed);
    setStats(s);
    setFinished(true);
    // scroll results into view
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [words, secondsElapsed]);

  // timer
  useEffect(() => {
    if (!started || finished) return;
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [started, finished]);

  const reset = useCallback((newWords = true) => {
    if (newWords) setWords(generateWords());
    setTyped("");
    setStarted(false);
    setFinished(false);
    setSecondsElapsed(0);
    setStats(null);
    startTimeRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const v = e.target.value;

    // Sound is now handled in onKeyDown for better responsiveness
    
    if (!started && v.length > 0) {
      setStarted(true);
      startTimeRef.current = Date.now();
    }
    setTyped(v);

    // finish when user typed all words and the last word is complete
    const tw = v.split(" ");
    if (tw.length >= words.length) {
      const lastIdx = words.length - 1;
      const lastTyped = tw[lastIdx] ?? "";
      // require the last word to match exactly
      if (lastTyped === words[lastIdx]) {
        // small delay so state settles
        setTimeout(() => finishTest(v), 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (finished) return;
    
    if (soundEnabled) {
      if (e.key === ' ') {
        playKeySound('space');
      } else if (e.key === 'Backspace') {
        playKeySound('backspace');
      } else if (e.key === 'Enter') {
        playKeySound('enter');
      } else if (e.key.length === 1) {
        playKeySound('default');
      }
    }
  };

  const typedWords = typed.split(" ");
  const currentIndex = Math.max(0, typedWords.length - 1);

  const renderedWords = useMemo(() => {
    return words.map((word, wIdx) => {
      const typedWord = typedWords[wIdx] ?? "";
      const isCurrent = wIdx === currentIndex && !finished;
      const isPast = wIdx < currentIndex;

      const letters = word.split("").map((ch, i) => {
        const tCh = typedWord[i];
        let cls = "text-word-pending";
        if (tCh != null) {
          cls = tCh === ch ? "text-word-correct" : "text-word-incorrect";
        }
        return (
          <span key={i} className={cn(cls, "transition-colors")}>
            {ch}
          </span>
        );
      });

      const extras = typedWord.length > word.length
        ? typedWord.slice(word.length).split("").map((ch, i) => (
            <span key={`x-${i}`} className="text-word-incorrect/80">{ch}</span>
          ))
        : null;

      const caretPos = typedWord.length;

      return (
        <span
          key={wIdx}
          className={cn(
            "inline-block mr-3 whitespace-nowrap",
            isPast && "opacity-95",
          )}
        >
          {isCurrent ? (
            <>
              {letters.map((node, i) => (
                <span key={i} className="relative">
                  {i === caretPos && <span className="typing-caret" />}
                  {node}
                </span>
              ))}
              {caretPos >= word.length && <span className="typing-caret" />}
              {extras}
            </>
          ) : (
            <>
              {letters}
              {extras}
            </>
          )}
        </span>
      );
    });
  }, [words, typedWords, currentIndex, finished]);

  const timerDisplay = String(secondsElapsed).padStart(2, "0");

  // live WPM (updates while typing)
  const liveWpm = useMemo(() => {
    if (!started) return 0;
    const elapsed = startTimeRef.current
      ? Math.max(1, (Date.now() - (startTimeRef.current ?? Date.now())) / 1000)
      : 1;
    // Re-derive from current typed/words quickly
    const live = computeStats(words, typed, Math.max(1, Math.round(elapsed)));
    return live.wpm;
  }, [started, typed, words, secondsElapsed]);
  return (
    <div className="h-screen w-full bg-transparent flex flex-col overflow-hidden relative">
      <div className="fixed top-4 right-6 sm:right-14 z-[99999] [-webkit-app-region:no-drag]">
        <WindowControls />
      </div>

      {/* Header - Fixed at top - Draggable in Electron */}
      <header className="w-full px-6 sm:px-14 pt-10 pb-4 max-w-[1400px] mx-auto shrink-0 flex items-center justify-between [zoom:1] [-webkit-app-region:drag] relative">
        <div className="flex items-center gap-4 [-webkit-app-region:no-drag]">
          <div className="leading-tight">
            <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
              Typex
            </div>
            <div className="text-[11px] sm:text-xs font-medium tracking-[0.18em] text-primary mt-0.5 uppercase">
              Typing Test
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3 [-webkit-app-region:no-drag] mr-32">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full glass hover:bg-white/10 transition-colors text-foreground/70 hover:text-primary"
            title={soundEnabled ? "Disable Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <ThemeToggle />
          <Link
            to="/practice"
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       glass text-muted-foreground text-sm font-medium
                       hover:bg-white/10 hover:text-primary transition-all group"
          >
            <Keyboard className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span className="hidden sm:inline">Practice Mode</span>
          </Link>
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

      {/* Main Content - Centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-14 overflow-y-auto">
        <div className="w-full max-w-[1000px] py-8 animate-in fade-in zoom-in-95 duration-700">
          {!finished ? (
            <>
              {/* Timer + Live WPM */}
              <div className="flex items-start justify-center gap-16 sm:gap-24 mb-16">
                <div className="flex flex-col items-center">
                  <div className="text-[11px] tracking-[0.32em] text-muted-foreground font-medium uppercase">
                    Timer
                  </div>
                  <div className="mt-3 text-5xl sm:text-6xl font-medium text-muted-foreground/70 tabular-nums">
                    {timerDisplay}
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[11px] tracking-[0.32em] text-primary font-medium uppercase">
                    WPM
                  </div>
                  <div className="mt-3 text-5xl sm:text-6xl font-medium text-primary/90 tabular-nums">
                    {String(liveWpm).padStart(2, "0")}
                  </div>
                </div>
              </div>

              {/* Words */}
              <div
                className="cursor-text select-none mb-12"
                onClick={() => inputRef.current?.focus()}
              >
                <p className="text-[26px] sm:text-[28px] leading-[2.3rem] sm:leading-[2.6rem] font-normal text-word-pending text-center">
                  {renderedWords}
                </p>
              </div>

              {/* Start Over / New Test */}
              <div className="flex justify-center gap-8">
                <button
                  type="button"
                  onClick={() => reset(false)}
                  className="flex items-center gap-3 text-foreground/80 hover:text-foreground transition-all transform hover:scale-105"
                >
                  <RotateCw className="w-5 h-5 text-warning" />
                  <span className="text-base font-medium">Start Over</span>
                </button>
                <button
                  type="button"
                  onClick={() => reset(true)}
                  className="flex items-center gap-3 text-foreground/80 hover:text-foreground transition-all transform hover:scale-105"
                >
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-base font-medium">New Test</span>
                </button>
              </div>
            </>
          ) : (
            stats && (
              <section
                ref={resultsRef}
                className="mx-auto w-full max-w-[800px] animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center"
              >
                {/* Dashboard Speedometer - Focused and Clean */}
                <div className="relative w-full max-w-[400px] flex flex-col items-center mb-10">
                  <div className="relative w-[320px] h-[160px] flex items-end justify-center">
                    <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
                      {/* Background Track */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-white/[0.03]"
                      />
                      {/* Progress Track */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray="251.3" /* PI * 80 */
                        strokeDashoffset={251.3 - (251.3 * Math.min(100, (stats.wpm / 150) * 100)) / 100}
                        className="text-primary transition-all duration-[2500ms] ease-out"
                        style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))' }}
                      />
                    </svg>
                    
                    {/* Needle - Precise and sleek */}
                    <div 
                      className="absolute bottom-[-2px] left-1/2 w-[3px] h-[120px] bg-primary origin-bottom -translate-x-1/2 transition-all duration-[2500ms] cubic-bezier(0.175, 0.885, 0.32, 1.275) shadow-[0_0_20px_hsl(var(--primary))]"
                      style={{ 
                        transform: `translateX(-50%) rotate(${Math.min(90, (stats.wpm / 150) * 180 - 90)}deg)`,
                        borderRadius: '4px 4px 0 0'
                      }}
                    />

                    {/* Center Hub */}
                    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-background border-[3px] border-primary shadow-2xl z-10 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>

                  {/* Digital Reading - Hero WPM */}
                  <div className="mt-8 flex flex-col items-center">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[90px] font-bold text-foreground leading-none tracking-tighter tabular-nums">
                        {stats.wpm}
                      </span>
                      <span className="text-sm font-bold text-primary tracking-widest uppercase">WPM</span>
                    </div>
                    <div className="h-px w-12 bg-primary/20 mt-2" />
                  </div>
                </div>

                {/* Simplified Stats Row - No bulky boxes */}
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 w-full mb-12">
                  <StatItem 
                    label="Accuracy" 
                    value={`${stats.accuracy}%`} 
                    icon={<Target className="w-4 h-4 text-primary" />}
                  />
                  <StatItem 
                    label="Time" 
                    value={`${stats.timeSeconds}s`} 
                    icon={<Clock className="w-4 h-4 text-warning" />}
                  />
                  <StatItem 
                    label="Characters" 
                    value={stats.totalChars} 
                    icon={<Zap className="w-4 h-4 text-blue-400" />}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => reset(true)}
                    className="px-10 py-3.5 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    New Test
                  </button>
                  <button
                    type="button"
                    onClick={() => reset(false)}
                    className="px-10 py-3.5 rounded-full glass text-foreground font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 active:scale-95 transition-all border border-white/5"
                  >
                    Retry
                  </button>
                </div>
              </section>
            )
          )}
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

      {/* Hidden input */}
      <input
        ref={inputRef}
        value={typed}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        aria-label="Typing input"
        className="sr-only"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        disabled={finished}
      />
    </div>
  );
};

const StatItem = ({ label, value, icon }: any) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2">
      {icon}
      {label}
    </div>
    <div className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{value}</div>
  </div>
);

const DashboardCard = ({ label, value, sub, icon }: any) => (
  <div className="glass rounded-[2rem] p-5 flex flex-col items-center text-center group hover:bg-white/10 transition-all border border-white/5">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-2xl font-bold text-foreground mb-0.5">{value}</div>
    <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1.5 opacity-60">{label}</div>
    <div className="text-[10px] font-medium text-muted-foreground/40">{sub}</div>
  </div>
);

const ResultGauge = ({ value, max, label, icon, subtext, suffix = "" }: any) => {
  const percentage = Math.min(100, (value / max) * 100);
  const strokeDasharray = 251.2; // 2 * PI * r (r=40)
  const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

  return (
    <div className="glass rounded-3xl p-8 flex flex-col items-center relative overflow-hidden shadow-2xl group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
      
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={502.4}
            strokeDashoffset={502.4 - (502.4 * percentage) / 100}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
            style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.5))' }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-foreground tracking-tighter">
            {value}{suffix}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60 mt-1 flex items-center gap-1.5">
            {icon}
            {label.split(' ')[0]}
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-lg font-bold text-foreground/90">{label}</div>
        <div className="text-sm font-medium text-muted-foreground mt-1">{subtext}</div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }: any) => (
  <div className="glass rounded-2xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition-all cursor-default">
    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1.5">
      {icon}
      {label}
    </div>
    <div className="text-xl font-bold text-foreground tabular-nums">{value}</div>
  </div>
);

const PlainStat = ({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex flex-col items-center">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium text-muted-foreground">
      {icon}
      {label}
    </div>
    <div className="mt-1.5 text-2xl font-medium tabular-nums text-foreground">{value}</div>
  </div>
);

export default TypingTest;
