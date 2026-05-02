import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Home, RotateCw, Copyright, GitBranch, Calendar, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const WORD_POOL = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
  "he", "was", "for", "on", "are", "as", "with", "his", "they", "I",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word",
  "but", "not", "what", "all", "were", "we", "when", "your", "can", "said",
  "there", "use", "an", "each", "which", "she", "do", "how", "their", "if",
  "will", "up", "other", "about", "out", "many", "then", "them", "these", "so",
  "some", "her", "would", "make", "like", "him", "into", "time", "has", "look",
  "two", "more", "write", "go", "see", "number", "no", "way", "could", "people",
  "my", "than", "first", "water", "been", "call", "who", "its", "now", "find",
  "long", "down", "day", "did", "get", "come", "made", "may", "part", "over",
  "new", "sound", "take", "only", "little", "work", "know", "place", "year", "live",
  "me", "back", "give", "most", "very", "after", "thing", "our", "just", "name",
  "good", "sentence", "man", "think", "say", "great", "where", "help", "through",
  "much", "before", "line", "right", "too", "mean", "old", "any", "same", "tell",
  "boy", "follow", "came", "want", "show", "also", "around", "form", "three", "small",
  "set", "put", "end", "why", "again", "turn", "here", "off", "went", "old",
  "number", "no", "way", "could", "people", "between", "against", "develop", "without",
  "become", "those", "open", "move", "during", "both", "must",
];

function generateWords(count = 40) {
  const arr: string[] = [];
  for (let i = 0; i < count; i++) {
    arr.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
  }
  return arr;
}

const TIMER_SECONDS = 60;

export const TypingTest = () => {
  const [words, setWords] = useState<string[]>(() => generateWords(50));
  const [typed, setTyped] = useState<string>("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TIMER_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!started || finished) return;
    if (secondsLeft <= 0) {
      setFinished(true);
      return;
    }
    const id = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [started, finished, secondsLeft]);

  const reset = useCallback(() => {
    setWords(generateWords(50));
    setTyped("");
    setStarted(false);
    setFinished(false);
    setSecondsLeft(TIMER_SECONDS);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (finished) return;
    const v = e.target.value;
    if (!started && v.length > 0) setStarted(true);
    setTyped(v);
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
        <header className="flex items-center justify-between">
          <div className="leading-tight">
            <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Centerville
            </div>
            <div className="text-[11px] sm:text-xs font-semibold tracking-[0.18em] text-primary mt-0.5">
              Typing Test
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={reset}
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

        <div className="mt-16 sm:mt-20 flex flex-col items-center">
          <div className="text-[11px] tracking-[0.32em] text-muted-foreground font-medium">
            TIMER
          </div>
          <div className="mt-3 text-5xl sm:text-6xl font-light text-muted-foreground/70 tabular-nums">
            {timerDisplay}
          </div>
        </div>

        <div
          className="mt-10 sm:mt-14 mx-auto w-full max-w-[900px] cursor-text select-none"
          onClick={() => inputRef.current?.focus()}
        >
          <p className="text-2xl sm:text-[26px] leading-[2.1rem] sm:leading-[2.4rem] font-normal text-word-pending">
            {renderedWords}
          </p>
        </div>

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
        />

        <div className="mt-10 sm:mt-14 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-3 text-foreground/90 hover:text-foreground transition-colors"
          >
            <RotateCw className="w-5 h-5 text-warning" />
            <span className="text-base">Start Over</span>
          </button>
        </div>

        <div className="flex-1 min-h-[60px] sm:min-h-[100px]" />

        <footer className="mt-10 border-t border-border/60 py-5 grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Copyright className="w-4 h-4" />
            <span>Copyright @ Intelliante type test</span>
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

export default TypingTest;
