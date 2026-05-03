import { Link } from "react-router-dom";
import { Shield, Home, Copyright, GitBranch, Calendar, ShieldCheck } from "lucide-react";
import MetaTags, { createBreadcrumbSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";

const LAST_UPDATED = "May 3, 2026";

const PrivacyPolicy = () => {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  return (
    <>
      <MetaTags
        title="Privacy Policy — Typex"
        description="Read our privacy policy to understand how Typex handles your data. We respect your privacy and collect minimal information."
        canonical="/privacy-policy"
        ogTitle="Privacy Policy — Typex"
        ogDescription="Read our privacy policy to understand how Typex handles your data. We respect your privacy and collect minimal information."
        ogUrl="/privacy-policy"
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
                Privacy Policy
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
                <Shield className="w-3.5 h-3.5" />
                Legal
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.1] mb-4">
                Privacy Policy
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
              
              <h2>1. Introduction</h2>
              <p>
                Typex (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website typex.arkio.in (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, and protect your information when you use our typing test service.
              </p>
              <p>
                By using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                Typex is designed with privacy in mind. We collect minimal information:
              </p>
              <ul>
                <li><strong>Local Storage Data:</strong> We store your sound preference (on/off) and theme choice locally in your browser using localStorage. This data never leaves your device and is not transmitted to our servers.</li>
                <li><strong>Server Logs:</strong> Our servers automatically record basic information like IP address, browser type, and access times for security and performance purposes.</li>
              </ul>
              <p>
                <strong>We do NOT collect:</strong> Personal identification information (name, email, address), account information, payment information, or your typed content/keystroke patterns.
              </p>

              <h2>3. How We Use Your Information</h2>
              <p>
                Any information we collect is used solely for:
              </p>
              <ul>
                <li>Providing and maintaining the typing test service</li>
                <li>Improving website performance and user experience</li>
                <li>Analyzing aggregated usage patterns</li>
                <li>Showing relevant advertisements via Google AdSense</li>
                <li>Preventing abuse and ensuring security</li>
              </ul>

              <h2>4. Google AdSense and Cookies</h2>
              <p>
                We use Google AdSense to display advertisements on our website. Google uses cookies to serve ads based on your prior visits to our website and other websites.
              </p>
              <p>
                <strong>Cookie Usage:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to typex.arkio.in and/or other sites on the Internet.
              </p>
              <p>
                <strong>Opting Out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.
              </p>
              <p>
                We use Google AdSense to display advertisements. Google uses cookies to serve ads based on your prior visits to our website and other websites. You may opt out at www.google.com/settings/ads.
              </p>

              <h2>5. Google Analytics</h2>
              <p>
                We use Google Analytics to collect anonymous usage data about how visitors interact with our website. This includes information such as pages visited, time spent on site, and general geographic location (country/city level only).
              </p>
              <p>
                Google Analytics collects this data using cookies. The information is used to improve our website and user experience. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </p>

              <h2>6. Third-Party Links</h2>
              <p>
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>

              <h2>7. Children&apos;s Privacy</h2>
              <p>
                This site is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can remove such information.
              </p>

              <h2>8. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul>
                <li>Access your personal data (though we collect minimal data)</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of cookies and tracking</li>
                <li>Clear localStorage data through your browser settings</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the information below.
              </p>

              <h2>9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated &quot;Last updated&quot; date.
              </p>

              <h2>10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:contact@typex.arkio.in">contact@typex.arkio.in</a>
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

export default PrivacyPolicy;
