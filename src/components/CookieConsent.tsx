import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("cookieConsent") === "true";
    if (!hasConsented) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
        // Small delay for animation
        setTimeout(() => setIsVisible(true), 50);
      }, 1000);
      return () => clearTimeout(timer);
    }
    // Analytics will be initialized via analytics.ts after consent
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
    
    // Initialize Google Analytics after consent
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId && measurementId !== "G-XXXXXXXXXX") {
      // Analytics will be initialized here
      console.log("Analytics would be initialized with:", measurementId);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-300 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4 sm:p-6">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Content */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-foreground mb-1">
                We use cookies to improve your experience and show relevant ads.
              </p>
              <p className="text-xs text-muted-foreground">
                By continuing, you accept our{" "}
                <Link to="/privacy-policy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/privacy-policy"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn More
            </Link>
            <button
              onClick={handleAccept}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Accept
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
