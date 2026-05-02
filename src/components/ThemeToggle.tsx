import { useEffect, useState } from "react";
import { Palette, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { name: "Pitch Black", url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" },
  { name: "Midnight", url: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop" },
  { name: "Forest", url: "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1932&auto=format&fit=crop" }
];

export const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("typex-theme") || "Pitch Black";
  });

  useEffect(() => {
    const theme = THEMES.find((t) => t.name === currentTheme) || THEMES[0];
    document.documentElement.style.setProperty("--bg-image", `url('${theme.url}')`);
    document.documentElement.setAttribute("data-theme", currentTheme === "Pure White" ? "light" : "dark");
    localStorage.setItem("typex-theme", currentTheme);
  }, [currentTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-foreground hover:bg-white/10 transition-all outline-none">
          <Palette className="w-4 h-4 text-primary" />
          <span>{currentTheme}</span>
          <ChevronDown className="w-3.5 h-3.5 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass border-white/10 text-foreground">
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => setCurrentTheme(theme.name)}
            className={cn(
              "flex items-center gap-2 cursor-pointer hover:bg-white/10 focus:bg-white/10",
              currentTheme === theme.name && "text-primary font-bold"
            )}
          >
            <div 
              className="w-3 h-3 rounded-full border border-white/20" 
              style={{ backgroundImage: `url('${theme.url}')`, backgroundSize: 'cover' }}
            />
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
