/**
 * AdNetwork Component - Multi-Network Ad Integration
 * 
 * Supports: ProfitableCPMRateNetwork, HighPerformanceFormat
 * All ads are gated by cookie consent for GDPR compliance
 */

import { useEffect, useRef, useState } from "react";

export type AdNetworkType = 
  | "profitable-cpm-banner"      // 468x60
  | "profitable-cpm-leaderboard" // 728x90  
  | "profitable-cpm-skyscraper"  // 160x300
  | "profitable-cpm-mobile"      // 320x50
  | "profitable-cpm-rectangle"   // 300x250
  | "profitable-cpm-direct"      // Direct link popup
  | "profitable-cpm-script";     // Generic script

interface AdNetworkProps {
  type: AdNetworkType;
  className?: string;
}

// Ad configurations
const adConfigs: Record<AdNetworkType, { width: number; height: number; script?: string; containerId?: string }> = {
  "profitable-cpm-banner": {
    width: 468,
    height: 60,
    script: "https://www.highperformanceformat.com/20a9b6a34dc2021956d1d535e46aa166/invoke.js",
  },
  "profitable-cpm-leaderboard": {
    width: 728,
    height: 90,
    script: "https://www.highperformanceformat.com/431c546129fad085889710a6ff4ca3dd/invoke.js",
  },
  "profitable-cpm-skyscraper": {
    width: 160,
    height: 300,
    script: "https://www.highperformanceformat.com/b665a3f15729230e30f42bf8c1745f78/invoke.js",
  },
  "profitable-cpm-mobile": {
    width: 320,
    height: 50,
    script: "https://www.highperformanceformat.com/98001960bebee4264fb2b04c3a690655/invoke.js",
  },
  "profitable-cpm-rectangle": {
    width: 300,
    height: 250,
    script: "https://www.highperformanceformat.com/8a446b5b3aa42815e2a7c3b8b56f633e/invoke.js",
  },
  "profitable-cpm-direct": {
    width: 0,
    height: 0,
    script: "https://pl29323282.profitablecpmratenetwork.com/6f/d5/82/6fd5822c3bbdced66f4470ccd7c95263.js",
  },
  "profitable-cpm-script": {
    width: 0,
    height: 0,
    script: "https://pl29323279.profitablecpmratenetwork.com/71/3a/b0/713ab05330f74fd8faf1cdf84de23038.js",
  },
};

const AdNetwork = ({ type, className = "" }: AdNetworkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for cookie consent initially
    const checkConsent = () => {
      const consent = localStorage.getItem("cookieConsent");
      setHasConsent(consent === "true");
    };
    
    checkConsent();
    
    // Listen for storage changes (when user accepts cookies)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookieConsent") {
        checkConsent();
      }
    };
    
    // Also check periodically for changes
    const interval = setInterval(checkConsent, 1000);
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!hasConsent || isLoaded) return;

    const config = adConfigs[type];
    if (!config.script) return;

    // For iframe-based ads (highperformanceformat)
    if (type !== "profitable-cpm-script" && type !== "profitable-cpm-direct") {
      const optionsKey = type === "profitable-cpm-banner" ? "20a9b6a34dc2021956d1d535e46aa166" :
                        type === "profitable-cpm-leaderboard" ? "431c546129fad085889710a6ff4ca3dd" :
                        type === "profitable-cpm-skyscraper" ? "b665a3f15729230e30f42bf8c1745f78" :
                        type === "profitable-cpm-mobile" ? "98001960bebee4264fb2b04c3a690655" :
                        "8a446b5b3aa42815e2a7c3b8b56f633e";

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).atOptions = {
        key: optionsKey,
        format: "iframe",
        height: config.height,
        width: config.width,
        params: {},
      };
    }

    // Load the script
    const script = document.createElement("script");
    script.src = config.script;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    
    script.onload = () => setIsLoaded(true);
    
    if (type === "profitable-cpm-script" || type === "profitable-cpm-direct") {
      document.body.appendChild(script);
    } else if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      // Cleanup handled by component unmount
    };
  }, [hasConsent, type, isLoaded]);

  // Development mode or no consent - show placeholder
  const isDev = import.meta.env.DEV;
  if (isDev || !hasConsent) {
    const config = adConfigs[type];
    return (
      <div
        className={`
          relative flex items-center justify-center
          border-2 border-dashed border-white/20 
          bg-white/5 rounded-lg overflow-hidden
          ${className}
        `}
        style={{
          width: config.width > 0 ? config.width : "auto",
          height: config.height > 0 ? config.height : type === "profitable-cpm-script" ? "auto" : 60,
          minWidth: config.width > 0 ? config.width : 300,
        }}
        aria-label={hasConsent ? "Advertisement" : "Advertisement - Accept cookies to view"}
      >
        <div className="text-center px-4">
          <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">
            {hasConsent ? "Advertisement" : "Advertisement (Accept Cookies)"}
          </p>
          {config.width > 0 && (
            <p className="text-[10px] text-muted-foreground/30 mt-1">
              {config.width}x{config.height}
            </p>
          )}
          <p className="text-[9px] text-muted-foreground/20 mt-0.5 capitalize">
            {type.replace(/-/g, " ")}
          </p>
        </div>
      </div>
    );
  }

  // Production with consent
  const config = adConfigs[type];
  
  if (type === "profitable-cpm-script" || type === "profitable-cpm-direct") {
    // These are global scripts, render nothing visible
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      style={{
        width: config.width,
        height: config.height,
        maxWidth: "100%",
      }}
      data-ad-type={type}
    />
  );
};

// Special container for the invoke.js ads
export const AdContainer = ({ 
  containerId, 
  className = "" 
}: { 
  containerId: string; 
  className?: string;
}) => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("cookieConsent");
      setHasConsent(consent === "true");
    };
    
    checkConsent();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookieConsent") {
        checkConsent();
      }
    };
    
    const interval = setInterval(checkConsent, 1000);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isDev = import.meta.env.DEV;
  
  if (isDev || !hasConsent) {
    return (
      <div
        id={containerId}
        className={`
          relative flex items-center justify-center
          border-2 border-dashed border-white/20 
          bg-white/5 rounded-lg
          min-w-[300px] min-h-[250px]
          ${className}
        `}
        aria-label={hasConsent ? "Advertisement" : "Advertisement - Accept cookies to view"}
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">
            {hasConsent ? "Advertisement" : "Advertisement (Accept Cookies)"}
          </p>
          <p className="text-[9px] text-muted-foreground/20 mt-1">ID: {containerId}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      id={containerId} 
      className={className}
      style={{ maxWidth: "100%" }}
    />
  );
};

// Ad script loader for global scripts (placed in document head/body)
export const AdScriptLoader = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const scriptsLoaded = useRef(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("cookieConsent");
      setHasConsent(consent === "true");
      
      if (consent === "true" && !scriptsLoaded.current && !import.meta.env.DEV) {
        scriptsLoaded.current = true;
        
        // Load main profitablecpm script
        const script1 = document.createElement("script");
        script1.src = "https://pl29323279.profitablecpmratenetwork.com/71/3a/b0/713ab05330f74fd8faf1cdf84de23038.js";
        script1.async = true;
        document.body.appendChild(script1);

        // Load invoke script
        const script2 = document.createElement("script");
        script2.async = true;
        script2.setAttribute("data-cfasync", "false");
        script2.src = "https://pl29323280.profitablecpmratenetwork.com/0bb4c5329cf485af7b48c6ba21661f31/invoke.js";
        document.body.appendChild(script2);

        // Load direct link script
        const script3 = document.createElement("script");
        script3.src = "https://pl29323282.profitablecpmratenetwork.com/6f/d5/82/6fd5822c3bbdced66f4470ccd7c95263.js";
        script3.async = true;
        document.body.appendChild(script3);
        
        console.log("[AdScriptLoader] Ad scripts loaded");
      }
    };
    
    checkConsent();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookieConsent") {
        checkConsent();
      }
    };
    
    const interval = setInterval(checkConsent, 1000);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // This component renders nothing visible
  return null;
};

// Direct link ad (opens in new tab)
export const AdDirectLink = ({ className = "" }: { className?: string }) => {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem("cookieConsent");
      setHasConsent(consent === "true");
    };
    
    checkConsent();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cookieConsent") {
        checkConsent();
      }
    };
    
    const interval = setInterval(checkConsent, 1000);
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleClick = () => {
    if (hasConsent) {
      window.open("https://www.profitablecpmratenetwork.com/w8zkath98?key=5d34a2474c0f7f69fab5585f3249cb7b", "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={!hasConsent}
      className={`
        px-4 py-2 text-sm
        ${hasConsent 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-muted text-muted-foreground cursor-not-allowed"
        }
        rounded-lg transition-colors
        ${className}
      `}
    >
      {hasConsent ? "Special Offer" : "Enable Ads to View Offers"}
    </button>
  );
};

export default AdNetwork;
