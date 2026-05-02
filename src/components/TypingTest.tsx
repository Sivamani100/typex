import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Home, RotateCw, Copyright, GitBranch, Calendar, ShieldCheck, Zap, Target, CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

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

const TEST_WORD_COUNT = 50;
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
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const [stats, setStats] = useState<Stats | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // helper to finalize the test and compute stats
  const finishTest = useCallback((finalTyped: string) => {
    const elapsed = startTimeRef.current
      ? Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
      : TIMER_SECONDS - secondsLeft;
    const s = computeStats(words, finalTyped, elapsed);
    setStats(s);
    setFinished(true);
    // scroll results into view
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, [words, secondsLeft]);

  // timer
  useEffect(() => {
    if (!started || finished) return;
    if (secondsLeft <= 0) {
      finishTest(typed);
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [started, finished, secondsLeft, finishTest, typed]);

  const reset = useCallback((newWords = true) => {
    if (newWords) setWords(generateWords());
    setTyped("");
    setStarted(false);
    setFinished(false);
    setSecondsLeft(TIMER_SECONDS);
    setStats(null);
    startTimeRef.current = null;
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const v = e.target.value;
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

  const timerDisplay = String(secondsLeft).padStart(2, "0");

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <div className="w-full flex-1 flex flex-col px-6 sm:px-14 pt-8 pb-0 max-w-[1400px] mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="leading-tight">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Typex
            </div>
            <div className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-primary mt-0.5">
              Typing Test
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => reset(true)}
            >
              Practice Mode
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-secondary/70 text-primary text-sm font-medium
                         hover:bg-secondary transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
          </nav>
        </header>

        {/* Timer */}
        <div className="mt-12 sm:mt-16 flex flex-col items-center">
          <div className="text-[11px] tracking-[0.32em] text-muted-foreground font-medium">
            TIMER
          </div>
          <div className="mt-3 text-5xl sm:text-6xl font-light text-muted-foreground/70 tabular-nums">
            {timerDisplay}
          </div>
        </div>

        {/* Words */}
        <div
          className="mt-8 sm:mt-12 mx-auto w-full max-w-[900px] cursor-text select-none"
          onClick={() => inputRef.current?.focus()}
        >
          <p className={cn(
            "text-2xl sm:text-[26px] leading-[2.1rem] sm:leading-[2.4rem] font-normal text-word-pending",
            finished && "opacity-60",
          )}>
            {renderedWords}
          </p>
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          value={typed}
          onChange={onChange}
          aria-label="Typing input"
          className="sr-only"
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={finished}
        />

        {/* Start Over / New Test */}
        <div className="mt-8 sm:mt-12 flex justify-center gap-6">
          <button
            type="button"
            onClick={() => reset(false)}
            className="flex items-center gap-3 text-foreground/90 hover:text-foreground transition-colors"
          >
            <RotateCw className="w-5 h-5 text-warning" />
            <span className="text-base">Start Over</span>
          </button>
          <button
            type="button"
            onClick={() => reset(true)}
            className="flex items-center gap-3 text-foreground/90 hover:text-foreground transition-colors"
          >
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-base">New Test</span>
          </button>
        </div>

        {/* RESULTS PANEL */}
        {finished && stats && (
          <section
            ref={resultsRef}
            className="mt-14 mx-auto w-full max-w-[1100px] animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="rounded-2xl border border-border/60 bg-secondary/30 p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Test Results</h2>
                  <p className="text-xs text-muted-foreground">Here's how you performed</p>
                </div>
              </div>

              {/* Big WPM + Accuracy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <StatBig
                  icon={<Zap className="w-5 h-5" />}
                  label="Words per minute"
                  value={stats.wpm.toString()}
                  hint={`Raw: ${stats.rawWpm} WPM`}
                  accent="primary"
                />
                <StatBig
                  icon={<Target className="w-5 h-5" />}
                  label="Accuracy"
                  value={`${stats.accuracy}%`}
                  hint={`${stats.correctWords}/${stats.totalWords} words correct`}
                  accent="primary"
                />
              </div>

              {/* Detailed metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatSmall
                  icon={<CheckCircle2 className="w-4 h-4 text-word-correct" />}
                  label="Correct chars"
                  value={stats.correctChars.toString()}
                />
                <StatSmall
                  icon={<XCircle className="w-4 h-4 text-word-incorrect" />}
                  label="Incorrect chars"
                  value={stats.incorrectChars.toString()}
                />
                <StatSmall
                  icon={<Clock className="w-4 h-4 text-warning" />}
                  label="Time"
                  value={`${stats.timeSeconds}s`}
                />
                <StatSmall
                  icon={<Zap className="w-4 h-4 text-primary" />}
                  label="Total chars"
                  value={stats.totalChars.toString()}
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => reset(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                             bg-primary text-primary-foreground text-sm font-semibold
                             hover:bg-primary/90 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Start a new test
                </button>
                <button
                  type="button"
                  onClick={() => reset(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                             bg-secondary text-foreground text-sm font-medium
                             hover:bg-secondary/80 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                  Retry same words
                </button>
              </div>
            </div>
          </section>
        )}

        <div className="flex-1 min-h-[40px] sm:min-h-[80px]" />

        <footer className="mt-10 border-t border-border/60 py-5 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Copyright className="w-4 h-4" />
            <span>Copyright @ Typex</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>App Version: 1.2.1</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Release Date: 02/03/2021</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Privacy policy and terms of use</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

const StatBig = ({
  icon, label, value, hint,
}: { icon: React.ReactNode; label: string; value: string; hint?: string; accent?: string }) => (
  <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-6">
    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-[0.18em]">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
    <div className="mt-2 text-4xl sm:text-5xl font-semibold tabular-nums text-foreground">
      {value}
    </div>
    {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
  </div>
);

const StatSmall = ({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-lg border border-border/50 bg-card/60 p-4">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
      {icon}
      {label}
    </div>
    <div className="mt-1.5 text-xl font-semibold tabular-nums text-foreground">{value}</div>
  </div>
);

export default TypingTest;
