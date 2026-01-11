import { Link } from 'react-router-dom';
import { Mail, HelpCircle, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-heading text-2xl font-bold">SN</span>
              </div>
              <span className="font-heading text-2xl font-bold uppercase tracking-tight">
                Skill Navigator
              </span>
            </div>
            <p className="font-paragraph text-sm text-primary-foreground/80 leading-relaxed">
              Empowering youth and students with personalized skill assessments and learning pathways for career success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold uppercase mb-6 tracking-tight">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/dashboard"
                  className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/assessment"
                  className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Skill Assessment
                </Link>
              </li>
              <li>
                <Link
                  to="/roadmap"
                  className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Learning Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-heading text-lg font-bold uppercase mb-6 tracking-tight">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@skillnavigator.com"
                  className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  support@skillnavigator.com
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-xs text-primary-foreground/60 uppercase tracking-wider">
              © 2026 Skill Navigator. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#privacy"
                className="font-paragraph text-xs text-primary-foreground/60 hover:text-primary-foreground uppercase tracking-wider transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="font-paragraph text-xs text-primary-foreground/60 hover:text-primary-foreground uppercase tracking-wider transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
