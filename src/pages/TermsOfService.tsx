import { Link } from "react-router-dom";
import { FileText, Home, Copyright, GitBranch, Calendar, ShieldCheck } from "lucide-react";
import MetaTags, { createBreadcrumbSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";

const LAST_UPDATED = "May 3, 2026";

const TermsOfService = () => {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms-of-service" },
  ]);

  return (
    <>
      <MetaTags
        title="Terms of Service — Typex"
        description="Read our terms of service to understand the rules and guidelines for using Typex typing test service."
        canonical="/terms-of-service"
        ogTitle="Terms of Service — Typex"
        ogDescription="Read our terms of service to understand the rules and guidelines for using Typex typing test service."
        ogUrl="/terms-of-service"
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
                Terms of Service
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
                <FileText className="w-3.5 h-3.5" />
                Legal
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.1] mb-4">
                Terms of Service
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
              <p>
                Please read these Terms of Service (&quot;Terms&quot;) carefully before using Typex (the &quot;Service&quot;). By accessing or using the Service, you agree to be bound by these Terms.
              </p>

              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Typex, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Typex is a free online typing speed test web application. The Service allows users to test and practice their typing speed and accuracy. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
              </p>

              <h2>3. User Conduct</h2>
              <p>
                You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul>
                <li>Use automated systems, bots, or scripts to interact with the Service</li>
                <li>Use scraping tools or data extraction software to collect data from the Service</li>
                <li>Attempt to cheat or manipulate leaderboards, scores, or results</li>
                <li>Use the Service in any way that violates applicable laws or regulations</li>
                <li>Attempt to interfere with the proper functioning of the Service</li>
                <li>Introduce malicious code, viruses, or harmful material</li>
                <li>Impersonate any person or entity</li>
                <li>Engage in any activity that disrupts or interferes with the Service</li>
              </ul>

              <h2>4. Intellectual Property</h2>
              <p>
                All Typex content, code, design, and functionality are owned by [Your Name/Company] and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without our express written permission.
              </p>
              <p>
                The Typex name, logo, and branding are trademarks of [Your Name/Company]. Unauthorized use is strictly prohibited.
              </p>

              <h2>5. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL TYPEX OR [YOUR NAME/COMPANY] BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
              </p>
              <p>
                We are not liable for any damages arising from your use of the site, even if we have been advised of the possibility of such damages. Our total liability shall not exceed the amount you paid to use the Service (which is zero).
              </p>

              <h2>7. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions. Any legal action arising out of these Terms shall be filed only in the courts located in [Your Jurisdiction].
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page with an updated date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>

              <h2>9. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:{" "}
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

export default TermsOfService;
