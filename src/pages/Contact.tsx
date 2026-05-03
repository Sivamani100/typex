import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Home, Send, MessageSquare, Copyright, GitBranch, Calendar, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import MetaTags, { createBreadcrumbSchema } from "@/seo/MetaTags";
import { ThemeToggle } from "@/components/ThemeToggle";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Question",
    message: "",
  });

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Contact", url: "/contact" },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error("EmailJS environment variables not set");
        setError(true);
        setLoading(false);
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        publicKey
      );

      setSubmitted(true);
    } catch (err) {
      console.error("EmailJS error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MetaTags
        title="Contact Typex — Get Support or Share Feedback"
        description="Get in touch with the Typex team. We&apos;d love to hear your feedback, suggestions, or questions about our typing test."
        canonical="/contact"
        ogTitle="Contact Typex — Get Support or Share Feedback"
        ogDescription="Get in touch with the Typex team. We&apos;d love to hear your feedback, suggestions, or questions about our typing test."
        ogUrl="/contact"
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
                Contact
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
          <div className="w-full max-w-[600px] mx-auto py-12">
            {/* Hero */}
            <section className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wider uppercase mb-6">
                <MessageSquare className="w-3.5 h-3.5" />
                Get in Touch
              </div>
              <h1 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground leading-[1.1] mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-muted-foreground/80 font-medium">
                Have feedback, suggestions, or questions? We&apos;d love to hear from you.
              </p>
            </section>

            {/* Contact Form or Success Message */}
            {submitted ? (
              <div className="glass rounded-2xl p-8 border border-white/5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Thank You!</h2>
                <p className="text-muted-foreground mb-6">
                  We&apos;ll respond within 24 hours.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Return Home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 border border-white/5 space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Something went wrong.</p>
                      <p>Please email us directly at <a href="mailto:contact@typex.arkio.in" className="underline">contact@typex.arkio.in</a></p>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Sending..." : "Send Message"}
                </button>

                <div className="text-center space-y-2">
                  <p className="text-[11px] text-muted-foreground/50">
                    Or email us directly at{" "}
                    <a href="mailto:contact@typex.arkio.in" className="text-primary hover:underline">
                      contact@typex.arkio.in
                    </a>
                  </p>
                </div>
              </form>
            )}
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

export default Contact;
