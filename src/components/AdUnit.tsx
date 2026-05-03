/**
 * AdUnit Component - Google AdSense Placeholder
 * 
 * This component renders ad placeholders. After AdSense approval,
 * replace the placeholder div with actual AdSense code.
 */

interface AdUnitProps {
  /** Ad slot ID from Google AdSense */
  slot?: string;
  /** Ad format: auto, rectangle, horizontal, vertical */
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  /** Custom className for styling */
  className?: string;
  /** Ad size variant */
  size?: "leaderboard" | "medium-rectangle" | "mobile-banner" | "responsive";
}

const sizeClasses = {
  leaderboard: "w-[728px] h-[90px]", // 728x90 - Desktop leaderboard
  "medium-rectangle": "w-[300px] h-[250px]", // 300x250 - Medium rectangle
  "mobile-banner": "w-[320px] h-[50px]", // 320x50 - Mobile banner
  responsive: "w-full min-h-[90px]", // Responsive
};

const AdUnit = ({ 
  slot, 
  format = "auto", 
  className = "",
  size = "responsive" 
}: AdUnitProps) => {
  const isDev = import.meta.env.DEV;

  // TODO: Replace with real AdSense code after approval
  // AdSense code template:
  /*
  <ins
    className="adsbygoogle"
    style={{ display: "block" }}
    data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
    data-ad-slot={slot}
    data-ad-format={format}
    data-full-width-responsive="true"
  />
  <script>
    (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
  */

  if (isDev) {
    // Show placeholder in development mode
    return (
      <div
        className={`
          relative flex items-center justify-center
          border-2 border-dashed border-white/20 
          bg-white/5 rounded-lg
          ${sizeClasses[size]}
          ${className}
        `}
        aria-label="Advertisement placeholder"
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground/50 uppercase tracking-wider">
            Advertisement
          </p>
          <p className="text-[10px] text-muted-foreground/30 mt-1">
            {sizeClasses[size].replace(/[^0-9x]/g, "")}
          </p>
          {slot && (
            <p className="text-[9px] text-muted-foreground/20 mt-0.5">
              Slot: {slot}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Production: Render nothing until AdSense is approved and configured
  // After approval, replace this with actual AdSense ins element
  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ display: "none" }}
      aria-hidden="true"
    >
      {/* AdSense will be injected here after approval */}
    </div>
  );
};

export default AdUnit;
