import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-md py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Code2 className="h-6 w-6 text-primary" />
              <span>Smart<span className="text-primary">AI</span></span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Advanced ML-Based System for Automatic XML Schema Inference and Adaptive Parsing. Reconstructing data integrity with neural precision.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/lingalasampath89" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">B2B Services</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground font-medium">
              <li><Link to="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/schema-library" className="hover:text-primary transition-colors">Schema Library</Link></li>
              <li><Link to="/api-reference" className="hover:text-primary transition-colors">API Reference</Link></li>
              <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Newsletter/Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">Stay Updated</h4>
            <p className="text-xs text-muted-foreground mb-4">Subscribe to our newsletter for the latest AI updates.</p>
            <div className="flex bg-muted rounded-xl p-1 overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="bg-transparent text-xs px-3 py-2 outline-none flex-1 text-foreground border-none focus:ring-0"
              />
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            © 2026 SmartAI. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
            <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> System Online</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
