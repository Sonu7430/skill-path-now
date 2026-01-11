import { Link, useLocation } from 'react-router-dom';
import { useMember } from '@/integrations';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-primary/10">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading text-xl font-bold">SN</span>
            </div>
            <span className="font-heading text-xl font-bold text-primary uppercase tracking-tight hidden sm:block">
              Skill Navigator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className={`font-paragraph text-sm uppercase tracking-wider transition-colors ${
                isActive('/') ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`font-paragraph text-sm uppercase tracking-wider transition-colors ${
                    isActive('/dashboard') ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/assessment"
                  className={`font-paragraph text-sm uppercase tracking-wider transition-colors ${
                    isActive('/assessment') ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Assessment
                </Link>
                <Link
                  to="/roadmap"
                  className={`font-paragraph text-sm uppercase tracking-wider transition-colors ${
                    isActive('/roadmap') ? 'text-primary font-bold' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Roadmap
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-paragraph text-xs uppercase">
                      {member?.profile?.nickname || 'Profile'}
                    </span>
                  </Button>
                </Link>
                <Button
                  onClick={actions.logout}
                  variant="outline"
                  size="sm"
                  className="font-paragraph text-xs uppercase"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                onClick={actions.login}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph text-xs uppercase"
                size="sm"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-primary/10">
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-paragraph text-sm uppercase tracking-wider ${
                  isActive('/') ? 'text-primary font-bold' : 'text-foreground'
                }`}
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm uppercase tracking-wider ${
                      isActive('/dashboard') ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/assessment"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm uppercase tracking-wider ${
                      isActive('/assessment') ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    Assessment
                  </Link>
                  <Link
                    to="/roadmap"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm uppercase tracking-wider ${
                      isActive('/roadmap') ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    Roadmap
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-paragraph text-sm uppercase tracking-wider ${
                      isActive('/profile') ? 'text-primary font-bold' : 'text-foreground'
                    }`}
                  >
                    Profile
                  </Link>
                </>
              )}
              <div className="pt-4 border-t border-primary/10">
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      actions.logout();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full font-paragraph text-xs uppercase"
                  >
                    Sign Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      actions.login();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph text-xs uppercase"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
