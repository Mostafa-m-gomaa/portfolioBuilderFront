import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Globe, Menu, X, UserRound, LogOut, LayoutDashboard, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import logo from '@/assets/logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { resolveApiAssetUrl } from '@/api/axios';

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
    { to: '/templates', label: t('nav.templates') },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/contact', label: t('nav.contact') },
    ...(isAuthenticated ? [{ to: '/dashboard', label: t('nav.dashboard') }] : []),
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50">
      <div className="mx-4 mt-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border bg-background/90 px-6 py-3 shadow-sm backdrop-blur-xl">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <img src={logo} alt={t('brand.logoAlt')} className="w-12 h-12 rounded-xl object-contain" />
            <span
              className={`bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text font-heading font-black leading-none text-transparent transition group-hover:from-primary group-hover:via-primary group-hover:to-secondary ${
                lang === 'ar'
                  ? 'text-[1.35rem] tracking-[-0.045em]'
                  : 'text-[1.45rem] tracking-[-0.055em]'
              }`}
            >
              {t('brand.name')}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.to
                  ? 'bg-primary/10 text-primary'
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
              className="flex rounded-xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t('a11y.switchLanguage')}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs ms-1">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t('a11y.toggleTheme')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-xl border border-border bg-card p-2.5 text-foreground transition-colors hover:text-primary" aria-label={t('a11y.openProfileMenu')}>
                    {user?.logo ? (
                      <img
                        src={resolveApiAssetUrl(user.logo)}
                        alt={t('brand.logoAlt')}
                        className="w-5 h-5 rounded object-cover"
                      />
                    ) : (
                      <UserRound className="w-5 h-5" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong border-white/20">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name || t('nav.myAccount')}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCog className="w-4 h-4 me-2" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 me-2" />
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 me-2" />
                    {t('nav.logout')}
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
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-xl border border-border bg-card p-2 text-foreground"
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
            <div className="flex flex-col gap-2 rounded-2xl border border-border bg-background/95 p-4 shadow-sm backdrop-blur-xl">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 mt-2 px-4">
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="rounded-xl border border-border bg-card p-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                </button>
                <button onClick={toggleTheme} className="rounded-xl border border-border bg-card p-2 text-muted-foreground">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-medium text-destructive"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground">
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
