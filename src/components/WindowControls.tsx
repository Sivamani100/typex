import { Minus, Square, X } from "lucide-react";

const WindowControls = () => {
  // More robust Electron detection
  const isElectron = 
    typeof window !== 'undefined' && 
    (window.navigator.userAgent.toLowerCase().includes('electron') || (window as any).ipcRenderer);

  if (!isElectron) return null;

  const handleMinimize = () => {
    console.log("Minimizing...");
    if ((window as any).ipcRenderer?.minimize) {
      (window as any).ipcRenderer.minimize();
    } else {
      console.warn("ipcRenderer.minimize not found");
    }
  };

  const handleMaximize = () => {
    console.log("Maximizing...");
    if ((window as any).ipcRenderer?.maximize) {
      (window as any).ipcRenderer.maximize();
    } else {
      console.warn("ipcRenderer.maximize not found");
    }
  };

  const handleClose = () => {
    console.log("Closing...");
    if ((window as any).ipcRenderer?.close) {
      (window as any).ipcRenderer.close();
    } else {
      console.warn("ipcRenderer.close not found");
    }
  };

  return (
    <div 
      className="fixed top-0 right-0 p-2 flex items-center gap-1 z-[99999] no-drag"
      style={{ WebkitAppRegion: 'no-drag' } as any}
    >
      <button
        onClick={handleMinimize}
        className="w-8 h-8 flex items-center justify-center rounded-lg liquid-glass hover:bg-white/10 transition-all group pointer-events-auto"
        title="Minimize"
      >
        <Minus className="w-3.5 h-3.5 text-foreground/50 group-hover:text-foreground" />
      </button>
      <button
        onClick={handleMaximize}
        className="w-8 h-8 flex items-center justify-center rounded-lg liquid-glass hover:bg-white/10 transition-all group pointer-events-auto"
        title="Maximize"
      >
        <Square className="w-3 h-3 text-foreground/50 group-hover:text-foreground" />
      </button>
      <button
        onClick={handleClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg liquid-glass hover:bg-destructive/20 hover:border-destructive/40 transition-all group pointer-events-auto"
        title="Close"
      >
        <X className="w-3.5 h-3.5 text-foreground/50 group-hover:text-destructive" />
      </button>
    </div>
  );
};

export default WindowControls;
