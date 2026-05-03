import { Link } from "react-router-dom";
import { AlertTriangle, Home, Copyright, GitBranch, Calendar, ShieldCheck } from "lucide-react";
import MetaTags, { createBreadcrumbSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";

const LAST_UPDATED = "May 3, 2026";

const Disclaimer = () => {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Disclaimer", url: "/disclaimer" },
  ]);

  return (
    <>
      <MetaTags
        title="Disclaimer — Typex"
        description="Important disclaimers regarding the use of Typex typing test service. Read about limitations and liability."
        canonical="/disclaimer"
        ogTitle="Disclaimer — Typex"
        ogDescription="Important disclaimers regarding the use of Typex typing test service. Read about limitations and liability."
        ogUrl="/disclaimer"
        jsonLd={breadcrumbSchema}
      />

      <div className="min-h-screen w-full bg-background flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="w-full px-6 sm:px-14 pt-10 pb-4 max-w-[1400px] mx-auto shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="leading-tight">
              <div className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground">
                Typex
              </div>
              <div className="text-[11px] sm:text-xs font-medium tracking-[0.18em] text-primary mt-0.5 uppercase">
                Disclaimer
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3 mr-32">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full glass text-primary text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-14">
          <div className="w-full max-w-[800px] mx-auto py-12">
            {/* Hero */}
            <section className="mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase mb-6">
                <AlertTriangle className="w-3.5 h-3.5" />
                Legal
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.1] mb-4">
                Disclaimer
              </h1>
              <p className="text-lg text-muted-foreground/80">
                Last updated: December 2024
              </p>
            </section>

            {/* Content */}
            <div className="prose prose-invert prose-primary max-w-none
              prose-headings:text-foreground prose-headings:font-medium
              prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
              prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-5
              prose-li:mb-2
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
              
              <h2>1. General Disclaimer</h2>
              <p>
                The typing speed results provided by Typex are for informational and educational purposes only. They should not be used as the sole basis for employment decisions, professional certifications, or academic evaluations. Always verify your typing speed using multiple methods before making important decisions.
              </p>

              <h2>2. Advertising Disclaimer</h2>
              <p>
                This site displays advertisements served by Google AdSense. We may receive compensation when you click on ads. This does not affect our content, reviews, or recommendations. The presence of ads does not constitute an endorsement of the advertised products or services.
              </p>
              <p>
                Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
              </p>

              <h2>3. Affiliate Disclaimer</h2>
              <p>
                Some links on this website may be affiliate links. This means that if you click on the link and make a purchase, we may receive a small commission at no additional cost to you. This helps support our free typing test service. We only recommend products or services that we believe will add value to our users.
              </p>
              <p>
                We are not currently using affiliate links, but this disclaimer is provided for future transparency. Any affiliate relationships will be clearly disclosed.
              </p>

              <h2>4. Accuracy Disclaimer</h2>
              <p>
                While we strive to provide accurate WPM (Words Per Minute) and accuracy measurements, we make no guarantees about the accuracy of calculations. Results may vary based on:
              </p>
              <ul>
                <li>Device performance and browser behavior</li>
                <li>Network conditions and latency</li>
                <li>Variations in word lists and timing mechanisms</li>
                <li>Different calculation methods used by other typing tests</li>
              </ul>
              <p>
                Our typing test uses standard industry formulas: WPM = (characters typed / 5) / time in minutes. However, actual results may differ from other typing tests due to various factors.
              </p>

              <h2>5. External Links</h2>
              <p>
                Our website may contain links to external websites. We have no control over the content and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them.
              </p>

              <h2>6. Service Availability</h2>
              <p>
                We do not guarantee that our service will be available at all times. We may experience hardware or software problems, or need to perform maintenance, which may result in interruptions, delays, or errors. We reserve the right to change, suspend, or discontinue all or any part of the Service at any time without notice.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                Typex and its operators shall not be held liable for any damages arising from the use or inability to use our service, including but not limited to:
              </p>
              <ul>
                <li>Direct, indirect, incidental, or consequential damages</li>
                <li>Loss of data or productivity</li>
                <li>Employment opportunities missed due to test results</li>
                <li>Physical strain or injury from extended typing sessions</li>
                <li>Any errors in WPM or accuracy calculations</li>
              </ul>

              <h2>8. Typing Health</h2>
              <p>
                Extended typing sessions can cause physical strain. We encourage users to:
              </p>
              <ul>
                <li>Take regular breaks (follow the 20-20-20 rule)</li>
                <li>Maintain proper posture and ergonomics</li>
                <li>Stop immediately if experiencing pain or discomfort</li>
                <li>Consult a healthcare professional for persistent issues</li>
              </ul>
              <p>
                We are not responsible for any health issues arising from the use of our typing test.
              </p>

              <h2>9. Contact Us</h2>
              <p>
                If you have any questions about this Disclaimer, please contact us at:{" "}
                <a href="mailto:contact@typex.arkio.in">contact@typex.arkio.in</a>.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-sm text-muted-foreground/60">
                Last updated: {LAST_UPDATED}
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
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
            <Link to="/privacy-policy" className="flex items-center gap-2 group cursor-default hover:text-muted-foreground/60 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
              <span>Privacy & Terms</span>
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Disclaimer;
