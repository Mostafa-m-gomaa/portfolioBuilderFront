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
    { to: '/quickstart', label: lang === 'ar' ? 'خطوات انشاء ويبسايت في دقايق' : 'Website in Minutes' },
    { to: '/about', label: t('nav.about') },
    { to: '/services', label: t('nav.services') },
    { to: '/templates', label: t('nav.templates') },
    { to: '/pricing', label: t('nav.pricing') },
    { to: '/contact', label: t('nav.contact') },
    ...(isAuthenticated ? [{ to: '/dashboard', label: t('nav.dashboard') }] : []),
  ];

  return (
    <nav className="fixed inset-x-0 top-0 z-50 overflow-x-clip">
      <div className="mx-4 mt-4 max-w-[calc(100%-2rem)]">
        <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-2 rounded-2xl border border-white/30 bg-background/65 px-4 py-3 shadow-xl shadow-foreground/5 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/55 sm:px-6 dark:border-white/10 dark:bg-background/45">
          {/* Logo */}
          <Link to="/" className="group flex min-w-0 shrink items-center gap-2 sm:gap-3">
            <img src={logo} alt={t('brand.logoAlt')} className="w-12 h-12 rounded-xl object-contain" />
            <span
              className={`truncate bg-gradient-to-br from-foreground via-primary to-foreground bg-clip-text font-heading font-black leading-none text-transparent transition group-hover:from-primary group-hover:via-primary group-hover:to-secondary ${
                lang === 'ar'
                  ? 'text-xl tracking-[-0.045em] sm:text-[1.35rem]'
                  : 'text-xl tracking-[-0.055em] sm:text-[1.45rem]'
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
                  ? 'bg-primary/12 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-background/45 hover:text-foreground'
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
              className="flex rounded-xl border border-white/25 bg-card/60 p-2 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground dark:border-white/10"
              aria-label={t('a11y.switchLanguage')}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs ms-1">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="rounded-xl border border-white/25 bg-card/60 p-2 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground dark:border-white/10"
              aria-label={t('a11y.toggleTheme')}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-xl border border-white/25 bg-card/60 p-2.5 text-foreground shadow-sm backdrop-blur transition-colors hover:text-primary dark:border-white/10" aria-label={t('a11y.openProfileMenu')}>
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
                  className="rounded-xl bg-gradient-to-r from-primary via-secondary to-sky-400 px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:opacity-95"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden rounded-xl border border-white/25 bg-card/60 p-2 text-foreground shadow-sm backdrop-blur dark:border-white/10"
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
            <div className="flex flex-col gap-2 rounded-2xl border border-white/25 bg-background/70 p-4 shadow-xl shadow-foreground/10 backdrop-blur-2xl dark:border-white/10 dark:bg-background/55">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:bg-background/45 hover:text-foreground'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 mt-2 px-4">
                <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="rounded-xl border border-white/25 bg-card/60 p-2 text-muted-foreground backdrop-blur dark:border-white/10">
                  <Globe className="w-4 h-4" />
                </button>
                <button onClick={toggleTheme} className="rounded-xl border border-white/25 bg-card/60 p-2 text-muted-foreground backdrop-blur dark:border-white/10">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl border border-white/25 bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground backdrop-blur dark:border-white/10"
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-xl border border-white/25 bg-card/60 px-4 py-3 text-center text-sm font-medium text-destructive backdrop-blur dark:border-white/10"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-white/25 bg-card/60 px-4 py-3 text-center text-sm font-medium text-foreground backdrop-blur dark:border-white/10">
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-gradient-to-r from-primary via-secondary to-sky-400 px-4 py-3 text-center text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
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
