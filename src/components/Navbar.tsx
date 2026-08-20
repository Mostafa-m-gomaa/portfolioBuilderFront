import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Globe, Menu, X, UserRound, LogOut, LayoutDashboard, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/auth.store';
import BrandLogo from '@/components/BrandLogo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { resolveApiAssetUrl } from '@/api/axios';
import { primaryButtonSmClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLight = theme === 'light';

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

  const iconBtnClass = cn(
    'inline-flex items-center justify-center rounded-full border p-2 transition-colors backdrop-blur-xl',
    isLight
      ? 'border-border/80 bg-white/70 text-muted-foreground hover:bg-white hover:text-foreground'
      : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white',
  );

  return (
    <nav className="fixed inset-x-0 top-0 z-50 overflow-x-clip">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex h-20 min-w-0 items-center justify-between gap-3">
          <Link to="/" className="group flex min-w-0 shrink items-center">
            <BrandLogo />
          </Link>

          <div
            className={cn(
              'hidden items-center gap-0.5 rounded-full border p-1 backdrop-blur-xl lg:flex',
              isLight
                ? 'border-border/70 bg-foreground/[0.04]'
                : 'border-white/10 bg-white/5',
            )}
          >
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-sm font-medium transition-all',
                    active
                      ? isLight
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'bg-white/10 text-white'
                      : isLight
                        ? 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                        : 'text-white/75 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={iconBtnClass}
              aria-label={t('a11y.switchLanguage')}
            >
              <Globe className="h-4 w-4" />
              <span className="ms-1 text-xs">{lang === 'ar' ? 'EN' : 'AR'}</span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={iconBtnClass}
              aria-label={t('a11y.toggleTheme')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(iconBtnClass, 'p-2.5')}
                    aria-label={t('a11y.openProfileMenu')}
                  >
                    {user?.logo ? (
                      <img
                        src={resolveApiAssetUrl(user.logo)}
                        alt={t('brand.logoAlt')}
                        className="h-5 w-5 rounded object-cover"
                      />
                    ) : (
                      <UserRound className="h-5 w-5" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 glass-strong border-border dark:border-white/20">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name || t('nav.myAccount')}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <UserCog className="me-2 h-4 w-4" />
                      {t('nav.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="me-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="me-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isLight
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-white/80 hover:text-white',
                  )}
                >
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className={cn(primaryButtonSmClass, 'rounded-full')}>
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(iconBtnClass, 'lg:hidden')}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mt-2 lg:hidden"
          >
            <div
              className={cn(
                'flex flex-col gap-2 rounded-3xl border p-4 shadow-xl backdrop-blur-2xl',
                isLight
                  ? 'border-border bg-background/90 shadow-foreground/10'
                  : 'border-white/10 bg-black/55 shadow-black/30',
              )}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'rounded-full px-4 py-3 text-sm font-medium transition-colors',
                    location.pathname === link.to
                      ? isLight
                        ? 'bg-primary/12 text-primary'
                        : 'bg-white/10 text-white'
                      : isLight
                        ? 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                        : 'text-white/75 hover:bg-white/10 hover:text-white',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center gap-2 px-2">
                <button
                  type="button"
                  onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                  className={iconBtnClass}
                >
                  <Globe className="h-4 w-4" />
                </button>
                <button type="button" onClick={toggleTheme} className={iconBtnClass}>
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
              {isAuthenticated ? (
                <div className="mt-2 flex flex-col gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'w-full rounded-full border px-4 py-3 text-center text-sm font-medium backdrop-blur',
                      isLight
                        ? 'border-border bg-card text-foreground'
                        : 'border-white/10 bg-white/5 text-white',
                    )}
                  >
                    {t('nav.profile')}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className={cn(
                      'w-full rounded-full border px-4 py-3 text-center text-sm font-medium text-destructive backdrop-blur',
                      isLight ? 'border-border bg-card' : 'border-white/10 bg-white/5',
                    )}
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex-1 rounded-full border px-4 py-3 text-center text-sm font-medium backdrop-blur',
                      isLight
                        ? 'border-border bg-card text-foreground'
                        : 'border-white/10 bg-white/5 text-white',
                    )}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className={cn('flex-1 text-center', primaryButtonSmClass, 'rounded-full py-3')}
                  >
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
