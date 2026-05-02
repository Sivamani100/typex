import { Minus, Square, X } from "lucide-react";

const WindowControls = () => {
  const isElectron = (process.env as any).IS_ELECTRON;

  if (!isElectron) return null;

  const handleMinimize = () => (window as any).ipcRenderer.minimize();
  const handleMaximize = () => (window as any).ipcRenderer.maximize();
  const handleClose = () => (window as any).ipcRenderer.close();

  return (
    <div className="fixed top-0 right-0 p-2 flex items-center gap-1 z-[10000] no-drag">
      <button
        onClick={handleMinimize}
        className="w-8 h-8 flex items-center justify-center rounded-lg liquid-glass hover:bg-white/10 transition-all group"
        title="Minimize"
      >
        <Minus className="w-3.5 h-3.5 text-foreground/50 group-hover:text-foreground" />
      </button>
      <button
        onClick={handleMaximize}
        className="w-8 h-8 flex items-center justify-center rounded-lg liquid-glass hover:bg-white/10 transition-all group"
        title="Maximize"
      >
        <Square className="w-3 h-3 text-foreground/50 group-hover:text-foreground" />
      </button>
      <button
        onClick={handleClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg liquid-glass hover:bg-destructive/20 hover:border-destructive/40 transition-all group"
        title="Close"
      >
        <X className="w-3.5 h-3.5 text-foreground/50 group-hover:text-destructive" />
      </button>
    </div>
  );
};

export default WindowControls;
