import { Link } from "react-router-dom";
import { Copyright, Mail } from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-background/50 backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-14 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="text-xl font-medium tracking-tight text-foreground">
              Typex
            </div>
            <span className="text-xs text-muted-foreground/60">
              Free typing speed test
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </Link>
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors">
              Disclaimer
            </Link>
          </nav>

          {/* Contact Email */}
          <a 
            href="mailto:contact@typex.arkio.in" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            contact@typex.arkio.in
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
            <Copyright className="w-3.5 h-3.5" />
            <span>{CURRENT_YEAR} Typex. All rights reserved.</span>
          </div>
          
          <p className="text-xs text-muted-foreground/40 text-center">
            This site uses cookies to improve your experience and show relevant ads.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
