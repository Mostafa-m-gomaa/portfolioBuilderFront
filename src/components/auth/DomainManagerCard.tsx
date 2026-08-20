import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useDomainAvailability, useSubdomainAvailability } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { primaryButtonFullClass } from '@/lib/buttonStyles';
import {
  isValidCustomDomain,
  sanitizeCustomDomainInput,
  sanitizeSubdomainPart,
} from '@/lib/customDomain';

type DomainManagerCardProps = {
  currentSubdomain?: string | null;
  customDomainEnabled?: boolean;
};

const DomainManagerCard = ({
  currentSubdomain,
  customDomainEnabled = false,
}: DomainManagerCardProps) => {
  const { updateSubdomainMutation } = useAuth();
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  const [showEnableForm, setShowEnableForm] = useState(false);
  const [showRevertForm, setShowRevertForm] = useState(false);
  const [customDomain, setCustomDomain] = useState(
    customDomainEnabled ? currentSubdomain || '' : '',
  );
  const [revertSubdomain, setRevertSubdomain] = useState('');
  const domainInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showEnableForm) return;
    const timer = window.setTimeout(() => {
      domainInputRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [showEnableForm]);

  useEffect(() => {
    setCustomDomain(customDomainEnabled ? currentSubdomain || '' : '');
    if (customDomainEnabled) {
      setShowEnableForm(false);
      setShowRevertForm(false);
      setRevertSubdomain('');
    }
  }, [customDomainEnabled, currentSubdomain]);

  const cleanDomain = useMemo(() => sanitizeCustomDomainInput(customDomain), [customDomain]);
  const cleanRevertSubdomain = useMemo(
    () => sanitizeSubdomainPart(revertSubdomain),
    [revertSubdomain],
  );
  const cleanCurrentDomain = useMemo(
    () => sanitizeCustomDomainInput(customDomainEnabled ? currentSubdomain || '' : ''),
    [customDomainEnabled, currentSubdomain],
  );

  const switchChecked = customDomainEnabled && !showRevertForm;

  const handleToggleChange = (checked: boolean) => {
    if (checked) {
      if (showRevertForm) {
        setShowRevertForm(false);
        setRevertSubdomain('');
        return;
      }
      if (customDomainEnabled) return;
      if (showEnableForm) {
        setShowEnableForm(false);
        setCustomDomain('');
        return;
      }
      setShowEnableForm(true);
      setShowRevertForm(false);
      setCustomDomain('');
      return;
    }

    if (showEnableForm) {
      setShowEnableForm(false);
      setCustomDomain('');
      return;
    }

    if (customDomainEnabled) {
      setShowRevertForm(true);
      setRevertSubdomain('');
    }
  };

  const showDomainForm = customDomainEnabled || showEnableForm;

  const domainAvailability = useDomainAvailability(
    cleanDomain,
    showDomainForm && !showRevertForm && isValidCustomDomain(cleanDomain),
  );
  const subdomainAvailability = useSubdomainAvailability(
    showRevertForm ? cleanRevertSubdomain : '',
  );

  const domainFormatValid = isValidCustomDomain(cleanDomain);
  const isCurrentDomain = domainFormatValid && cleanDomain === cleanCurrentDomain;
  const domainChanged = cleanDomain !== cleanCurrentDomain;
  const canSaveDomain =
    showDomainForm &&
    !showRevertForm &&
    domainFormatValid &&
    (showEnableForm ? cleanDomain.length > 0 : domainChanged) &&
    domainAvailability.data?.available === true &&
    (!customDomainEnabled || !isCurrentDomain);

  const canSaveSubdomain =
    showRevertForm &&
    cleanRevertSubdomain.length >= 3 &&
    subdomainAvailability.data?.available === true;

  const domainAvailabilityText = !showDomainForm || showRevertForm
    ? ''
    : cleanDomain.length === 0
      ? t('domainManager.domain.empty')
      : cleanDomain.includes('www.')
        ? t('domainManager.domain.noWww')
        : !domainFormatValid
          ? t('domainManager.domain.invalid')
          : isCurrentDomain
            ? t('domainManager.domain.current')
            : domainAvailability.isFetching
              ? t('domainManager.checking')
              : domainAvailability.data?.available
                ? t('domainManager.domain.available')
                : t('domainManager.domain.unavailable');

  const subdomainAvailabilityText = !showRevertForm
    ? ''
    : cleanRevertSubdomain.length === 0
      ? t('domainManager.subdomain.empty')
      : cleanRevertSubdomain.length < 3
        ? t('domainManager.subdomain.minLength')
        : subdomainAvailability.isFetching
          ? t('domainManager.checking')
          : subdomainAvailability.data?.available
            ? t('domainManager.subdomain.available')
            : t('domainManager.subdomain.unavailable');

  const domainAvailabilityClassName =
    !showDomainForm || cleanDomain.length === 0 || domainAvailability.isFetching
      ? 'text-muted-foreground'
      : cleanDomain.includes('www.') || !domainFormatValid
        ? 'text-destructive'
        : isCurrentDomain || domainAvailability.data?.available
          ? 'text-emerald-500'
          : 'text-destructive';

  const subdomainAvailabilityClassName =
    !showRevertForm || cleanRevertSubdomain.length < 3 || subdomainAvailability.isFetching
      ? 'text-muted-foreground'
      : subdomainAvailability.data?.available
        ? 'text-emerald-500'
        : 'text-destructive';

  const toggleLabel = switchChecked
    ? t('domainManager.toggle.off')
    : t('domainManager.toggle.on');

  const handleDomainSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSaveDomain) return;
    try {
      await updateSubdomainMutation.mutateAsync({
        subdomain: cleanDomain,
        domain: true,
      });
      setShowEnableForm(false);
    } catch {
      // Error handled in mutation hook.
    }
  };

  const handleSubdomainSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSaveSubdomain) return;
    try {
      await updateSubdomainMutation.mutateAsync({
        subdomain: cleanRevertSubdomain,
        domain: false,
      });
      setShowRevertForm(false);
      setRevertSubdomain('');
    } catch {
      // Error handled in mutation hook.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">{t('domainManager.title')}</h3>
      <p className="mt-1 mb-5 text-sm text-muted-foreground">{t('domainManager.description')}</p>

      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{toggleLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {showRevertForm ? t('domainManager.toggle.revertingHint') : t('domainManager.toggle.hint')}
          </p>
        </div>
        <Switch
          checked={switchChecked}
          onCheckedChange={handleToggleChange}
          aria-label={t('domainManager.toggle.aria')}
        />
      </div>

      {showRevertForm ? (
        <form onSubmit={handleSubdomainSubmit} className="space-y-4">
          <p
            role="alert"
            className="rounded-xl border-2 border-destructive/50 bg-destructive/10 px-4 py-4 text-center text-base font-bold leading-relaxed text-destructive sm:text-lg"
          >
            {t('domainManager.revert.description')}
          </p>
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              {t('domainManager.subdomain.label')}
            </label>
            <div
              className={`glass flex items-center gap-1 rounded-xl px-3 py-2 ${isAr ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <input
                value={revertSubdomain}
                onChange={(event) => setRevertSubdomain(sanitizeSubdomainPart(event.target.value))}
                placeholder={isAr ? 'اسمك' : 'yourname'}
                className="flex-1 bg-transparent text-sm focus:outline-none"
                autoComplete="off"
              />
              <span className="text-xs text-muted-foreground">getsirty.com</span>
            </div>
            <p className={`mt-2 text-xs ${subdomainAvailabilityClassName}`}>{subdomainAvailabilityText}</p>
          </div>

          {canSaveSubdomain ? (
            <button
              type="submit"
              disabled={updateSubdomainMutation.isPending}
              className={primaryButtonFullClass}
            >
              {updateSubdomainMutation.isPending ? t('domainManager.saving') : t('domainManager.revert.save')}
            </button>
          ) : null}
        </form>
      ) : showDomainForm ? (
        <form onSubmit={handleDomainSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-muted-foreground">
              {t('domainManager.domain.label')}
            </label>
            <div
              className={cn(
                'glass rounded-xl border border-transparent px-3 py-2 transition-all duration-300',
                showEnableForm &&
                'border-emerald-500/60 ring-2 ring-emerald-500/80 shadow-[0_0_0_4px_rgba(16,185,129,0.12),0_0_28px_rgba(16,185,129,0.35)]',
              )}
            >
              <input
                ref={domainInputRef}
                value={customDomain}
                onChange={(event) =>
                  setCustomDomain(sanitizeCustomDomainInput(event.target.value))
                }
                placeholder={isAr ? 'ahmed.com' : 'yourname.com'}
                className="w-full bg-transparent text-sm focus:outline-none"
                inputMode="url"
                autoComplete="off"
              />
            </div>
            <p className={`mt-2 text-xs ${domainAvailabilityClassName}`}>{domainAvailabilityText}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('domainManager.domain.formatHint')}</p>
            {cleanCurrentDomain ? (
              <p className="mt-1 text-xs text-muted-foreground">
                {t('domainManager.domain.currentValue')}: {cleanCurrentDomain}
              </p>
            ) : null}
          </div>

          {canSaveDomain ? (
            <button
              type="submit"
              disabled={updateSubdomainMutation.isPending}
              className={primaryButtonFullClass}
            >
              {updateSubdomainMutation.isPending ? t('domainManager.saving') : t('domainManager.save')}
            </button>
          ) : null}
        </form>
      ) : (
        <div className="rounded-2xl border border-border bg-card/60 px-4 py-4 text-sm text-muted-foreground">
          {t('domainManager.inactiveHint')}
        </div>
      )}
    </motion.div>
  );
};

export default DomainManagerCard;
