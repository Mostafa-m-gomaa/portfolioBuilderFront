import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Globe, Menu, X, UserRound, LogOut, LayoutDashboard, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50">
      <div className="mx-4 mt-4">
        <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg-full flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">P</span>
            </div>
            <span className="font-heading font-bold text-lg text-foreground">Portfolia</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.to
                    ? 'text-primary glass'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="glass rounded-xl p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Switch language"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs ms-1">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="glass rounded-xl p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="glass rounded-xl p-2.5 text-foreground hover:text-primary transition-colors" aria-label="Open profile menu">
                    <UserRound className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong border-white/20">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name || 'My Account'}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCog className="w-4 h-4 me-2" />
                      Profile Data
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 me-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 me-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="gradient-bg px-4 py-2 rounded-xl text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden glass rounded-xl p-2 text-foreground"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-4 mt-2"
          >
            <div className="glass-strong rounded-2xl p-4 flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary glass'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 mt-2 px-4">
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="glass rounded-xl p-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                </button>
                <button onClick={toggleTheme} className="glass rounded-xl p-2 text-muted-foreground">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium glass text-foreground"
                  >
                    Profile Data
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium gradient-bg text-primary-foreground"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full text-center px-4 py-3 rounded-xl text-sm font-medium glass text-destructive"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 rounded-xl text-sm font-medium glass text-foreground">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-4 py-3 rounded-xl text-sm font-medium gradient-bg text-primary-foreground">
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
