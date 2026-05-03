// Google Analytics 4 initialization and event tracking
// This module is loaded only after user cookie consent

interface GTagEvent {
  event_name: string;
  event_params?: Record<string, string | number | boolean>;
}

// Extend Window interface to include gtag
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: "config" | "event" | "js" | "consent",
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) => void;
  }
}

/**
 * Initialize Google Analytics 4
 * @param measurementId - GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 */
export function initAnalytics(measurementId: string): void {
  if (!measurementId || measurementId === "G-XXXXXXXXXX") {
    console.warn("Google Analytics Measurement ID not configured");
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: true,
    cookie_flags: "SameSite=None;Secure",
  });

  console.log("Google Analytics initialized");
}

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event
 * @param params - Event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window.gtag !== "function") {
    console.warn("Google Analytics not initialized");
    return;
  }

  window.gtag("event", eventName, params);
}

/**
 * Track typing test completion
 * @param wpm - Words per minute
 * @param accuracy - Accuracy percentage
 * @param duration - Test duration in seconds
 */
export function trackTestCompleted(
  wpm: number,
  accuracy: number,
  duration: number
): void {
  trackEvent("test_completed", {
    wpm,
    accuracy,
    duration,
  });
}

/**
 * Track typing test start
 * @param mode - Test mode (e.g., "words", "time")
 * @param duration - Test duration in seconds
 */
export function trackTestStarted(
  mode: string,
  duration: number
): void {
  trackEvent("test_started", {
    mode,
    duration,
  });
}

/**
 * Track page views manually (if not using send_page_view: true)
 * @param pagePath - Path of the page
 * @param pageTitle - Title of the page
 */
export function trackPageView(pagePath: string, pageTitle: string): void {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
    page_location: window.location.href,
  });
}
