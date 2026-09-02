import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ImagePlus, Loader2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ColorBendsBackground from '@/components/ColorBendsBackground';
import RedirectToEmailVerification from '@/components/RedirectToEmailVerification';
import { resolveApiAssetUrl } from '@/api/axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import {
  useMyPortfolio,
  usePortfolioBootstrap,
  usePortfolioActions,
  useSection,
} from '@/hooks/usePortfolio';
import {
  hasPendingSiteContent,
  isConfiguredSubdomain,
  clearPendingSiteContent,
  hasPendingSiteReady,
} from '@/lib/authRouting';
import { isUserEmailVerified } from '@/lib/authVerification';
import { primaryButtonMdClass } from '@/lib/buttonStyles';
import { cn } from '@/lib/utils';
import { COUNTRY_OPTIONS, sortCountriesForDisplay } from '@/constants/countries';
import {
  buildWhatsAppLink,
  normalizeLocalPhoneDigits,
  parseWhatsAppUrlToPhone,
  validateWhatsappNumber,
} from '@/lib/whatsappPhone';

type LanguageMode = 'ar' | 'en' | 'both';
type SetupStep = 1 | 2 | 3;
type JsonRecord = Record<string, unknown>;
type LocalizedForm = { ar: string; en: string };

const emptyLocalized = (): LocalizedForm => ({ ar: '', en: '' });

const isObject = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const stripSectionMeta = (section: JsonRecord | null | undefined): JsonRecord => {
  if (!section || !isObject(section)) return {};
  const clone = { ...section };
  delete clone._id;
  delete clone.id;
  return clone;
};

const readLocalizedForm = (value: unknown): LocalizedForm => {
  if (typeof value === 'string') return { ar: value, en: value };
  if (!isObject(value)) return emptyLocalized();
  return {
    ar: typeof value.ar === 'string' ? value.ar : '',
    en: typeof value.en === 'string' ? value.en : '',
  };
};

/** For single-language mode, fall back to the other locale when the preferred one is empty. */
const readLocalizedFormForMode = (value: unknown, mode: LanguageMode): LocalizedForm => {
  const form = readLocalizedForm(value);
  const ar = form.ar.trim();
  const en = form.en.trim();

  if (mode === 'ar' && !ar && en) {
    return { ar: en, en: '' };
  }
  if (mode === 'en' && !en && ar) {
    return { ar: '', en: ar };
  }
  return form;
};

const buildLocalizedPayloadIfFilled = (
  form: LocalizedForm,
  mode: LanguageMode,
): { ar?: string; en?: string } | null => {
  if (mode === 'ar') {
    const ar = form.ar.trim();
    return ar ? { ar } : null;
  }
  if (mode === 'en') {
    const en = form.en.trim();
    return en ? { en } : null;
  }
  const ar = form.ar.trim();
  const en = form.en.trim();
  if (!ar && !en) return null;
  return {
    ...(ar ? { ar } : {}),
    ...(en ? { en } : {}),
  };
};

const applyOptionalLocalizedField = (
  payload: JsonRecord,
  key: string,
  form: LocalizedForm,
  mode: LanguageMode,
) => {
  const value = buildLocalizedPayloadIfFilled(form, mode);
  if (value) payload[key] = value;
};

const copyOptionalHeroScalars = (payload: JsonRecord, existing: JsonRecord) => {
  if (typeof existing.image === 'string' && existing.image.trim()) {
    payload.image = existing.image;
  }
  if (typeof existing.email === 'string' && existing.email.trim()) {
    payload.email = existing.email;
  }
};

const inputClass =
  'w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15';

const textareaClass = cn(inputClass, 'resize-y min-h-[96px]');

type StepperProps = {
  step: SetupStep;
  labels: [string, string, string];
};

const Stepper = ({ step, labels }: StepperProps) => (
  <ol className="mb-6 flex items-center gap-2">
    {labels.map((label, index) => {
      const stepNumber = (index + 1) as SetupStep;
      const isActive = step === stepNumber;
      const isDone = step > stepNumber;
      return (
        <li key={label} className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              isDone && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
              isActive && 'gradient-bg text-primary-foreground',
              !isActive && !isDone && 'border border-border bg-background text-muted-foreground',
            )}
          >
            {stepNumber}
          </span>
          <span
            className={cn(
              'hidden truncate text-xs font-medium sm:block',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            {label}
          </span>
          {index < labels.length - 1 ? (
            <span className="ms-auto hidden h-px flex-1 bg-border sm:block" aria-hidden />
          ) : null}
        </li>
      );
    })}
  </ol>
);

type UploadFieldProps = {
  id: string;
  label: string;
  hint: string;
  emptyLabel: string;
  uploadLabel: string;
  imagePath?: string | null;
  previewUrl?: string | null;
  isUploading?: boolean;
  onUpload: (file: File) => Promise<void>;
};

const UploadField = ({
  id,
  label,
  hint,
  emptyLabel,
  uploadLabel,
  imagePath,
  previewUrl,
  isUploading,
  onUpload,
}: UploadFieldProps) => {
  const displaySrc = previewUrl || (imagePath ? resolveApiAssetUrl(imagePath) : '');

  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await onUpload(file);
    } finally {
      event.currentTarget.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <div className="mb-3">
        <p className="font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-dashed border-border bg-card/50">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt=""
            className="h-36 w-full object-contain bg-background/40 p-3"
          />
        ) : (
          <div className="flex h-36 flex-col items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground">
            <ImagePlus className="h-7 w-7 opacity-60" aria-hidden />
            {emptyLabel}
          </div>
        )}
      </div>
      <label
        htmlFor={id}
        className={cn(
          primaryButtonMdClass,
          'mt-3 w-full cursor-pointer text-center',
          isUploading && 'pointer-events-none opacity-60',
        )}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <UploadCloud className="h-4 w-4" aria-hidden />
        )}
        {uploadLabel}
        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isUploading}
          onChange={(event) => void onChange(event)}
        />
      </label>
    </div>
  );
};

type LocalizedFieldProps = {
  idPrefix: string;
  label: string;
  hint?: string;
  value: LocalizedForm;
  languageMode: LanguageMode;
  multiline?: boolean;
  placeholderAr?: string;
  placeholderEn?: string;
  onChange: (next: LocalizedForm) => void;
  arLabel: string;
  enLabel: string;
};

const LocalizedField = ({
  idPrefix,
  label,
  hint,
  value,
  languageMode,
  multiline = false,
  placeholderAr,
  placeholderEn,
  onChange,
  arLabel,
  enLabel,
}: LocalizedFieldProps) => {
  const FieldTag = multiline ? 'textarea' : 'input';

  const renderInput = (langKey: 'ar' | 'en', fieldLabel: string, placeholder?: string) => (
    <div key={langKey}>
      <label htmlFor={`${idPrefix}-${langKey}`} className="text-xs font-medium text-muted-foreground">
        {fieldLabel}
      </label>
      <FieldTag
        id={`${idPrefix}-${langKey}`}
        value={value[langKey]}
        onChange={(event) => onChange({ ...value, [langKey]: event.target.value })}
        placeholder={placeholder}
        rows={multiline ? 3 : undefined}
        className={cn('mt-1.5', multiline ? textareaClass : inputClass)}
        dir={langKey === 'ar' ? 'rtl' : 'ltr'}
      />
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4">
      <p className="font-medium text-foreground">{label}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      <div className={cn('mt-3 space-y-3', languageMode === 'both' && 'space-y-4')}>
        {languageMode === 'ar' && renderInput('ar', arLabel, placeholderAr)}
        {languageMode === 'en' && renderInput('en', enLabel, placeholderEn)}
        {languageMode === 'both' && (
          <>
            {renderInput('ar', arLabel, placeholderAr)}
            {renderInput('en', enLabel, placeholderEn)}
          </>
        )}
      </div>
    </div>
  );
};

const SetupSiteContent = () => {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const navigate = useNavigate();
  const { isAuthenticated, user, updateLogoMutation, updateProfileMutation } = useAuth();
  const bootstrapMutation = usePortfolioBootstrap();
  const { data: portfolio } = useMyPortfolio();
  const { data: heroSection, isFetched: heroFetched } = useSection('hero');
  const { data: aboutSection, isFetched: aboutFetched } = useSection('about');
  const {
    uploadSingleMutation,
    upsertSectionMutation,
    updateLanguageModeMutation,
    updateDefaultLanguageMutation,
  } = usePortfolioActions();

  const [step, setStep] = useState<SetupStep>(1);
  const [languageMode, setLanguageMode] = useState<LanguageMode | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);
  const [heroForm, setHeroForm] = useState({
    name: emptyLocalized(),
    title: emptyLocalized(),
    desc: emptyLocalized(),
    anotherDesc: emptyLocalized(),
  });
  const [aboutForm, setAboutForm] = useState({
    desc: emptyLocalized(),
  });
  const [isSaving, setIsSaving] = useState(false);
  const [heroFormHydrated, setHeroFormHydrated] = useState(false);
  const [aboutFormHydrated, setAboutFormHydrated] = useState(false);
  const [whatsappCountry, setWhatsappCountry] = useState('EG');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const sortedCountries = useMemo(() => sortCountriesForDisplay(lang), [lang]);

  useEffect(() => {
    if (isAuthenticated) {
      bootstrapMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  useEffect(() => {
    const existing = (user?.whatsapp || user?.WhatsApp || '').trim();
    const parsed = parseWhatsAppUrlToPhone(existing);
    if (!parsed) return;
    setWhatsappCountry(parsed.countryIso2);
    setWhatsappNumber(parsed.localNumber);
  }, [user?.WhatsApp, user?.whatsapp]);

  useEffect(() => {
    const mode = portfolio?.languageMode;
    if (mode === 'ar' || mode === 'en' || mode === 'both') {
      setLanguageMode(mode);
    }
  }, [portfolio?.languageMode]);

  useEffect(() => {
    if (step === 1) {
      setHeroFormHydrated(false);
    }
  }, [step]);

  useEffect(() => {
    if (step !== 2 || !heroFetched || !languageMode) return;

    if (heroSection && isObject(heroSection)) {
      setHeroForm({
        name: readLocalizedFormForMode(heroSection.name, languageMode),
        title: readLocalizedFormForMode(heroSection.title, languageMode),
        desc: readLocalizedFormForMode(heroSection.desc, languageMode),
        anotherDesc: readLocalizedFormForMode(heroSection.anotherDesc, languageMode),
      });
    }
    setHeroFormHydrated(true);
  }, [heroFetched, heroSection, languageMode, step]);

  useEffect(() => {
    if (step === 2) {
      setAboutFormHydrated(false);
    }
  }, [step]);

  useEffect(() => {
    if (step !== 3 || !aboutFetched || !languageMode) return;

    if (aboutSection && isObject(aboutSection)) {
      setAboutForm({
        desc: readLocalizedFormForMode(aboutSection.desc, languageMode),
      });
    }
    setAboutFormHydrated(true);
  }, [aboutFetched, aboutSection, languageMode, step]);

  const stepLabels = useMemo(
    () =>
      [
        t('onboarding.siteContent.stepLanguage'),
        t('onboarding.siteContent.stepHero'),
        t('onboarding.siteContent.stepAbout'),
      ] as [string, string, string],
    [t],
  );

  const heroImagePath =
    heroSection && isObject(heroSection) && typeof heroSection.image === 'string'
      ? heroSection.image
      : null;

  const aboutImages =
    aboutSection && isObject(aboutSection) && Array.isArray(aboutSection.images)
      ? aboutSection.images.filter((entry): entry is string => typeof entry === 'string')
      : [];

  const aboutImagePath = aboutImages[0] ?? null;

  const activeLanguageMode = languageMode ?? 'both';

  const uploadLogo = useCallback(
    async (file: File) => {
      setLogoPreview(URL.createObjectURL(file));
      await updateLogoMutation.mutateAsync(file);
    },
    [updateLogoMutation],
  );

  const upsertHeroImage = useCallback(
    async (file: File) => {
      setHeroPreview(URL.createObjectURL(file));
      const result = await uploadSingleMutation.mutateAsync(file);
      const path = result.filePath || result.url || '';
      if (!path) return;

      const existing = stripSectionMeta(
        heroSection && isObject(heroSection) ? heroSection : null,
      );
      const active =
        heroSection && isObject(heroSection) && typeof heroSection.active === 'boolean'
          ? heroSection.active
          : true;

      await upsertSectionMutation.mutateAsync({
        sectionName: 'hero',
        payload: { ...existing, image: path, active },
      });
    },
    [heroSection, uploadSingleMutation, upsertSectionMutation],
  );

  const upsertAboutImage = useCallback(
    async (file: File) => {
      setAboutPreview(URL.createObjectURL(file));
      const result = await uploadSingleMutation.mutateAsync(file);
      const path = result.filePath || result.url || '';
      if (!path) return;

      const existing = stripSectionMeta(
        aboutSection && isObject(aboutSection) ? aboutSection : null,
      );
      const active =
        aboutSection && isObject(aboutSection) && typeof aboutSection.active === 'boolean'
          ? aboutSection.active
          : true;
      const images = aboutImages.includes(path) ? aboutImages : [path, ...aboutImages];

      await upsertSectionMutation.mutateAsync({
        sectionName: 'about',
        payload: { ...existing, images, active },
      });
    },
    [aboutImages, aboutSection, uploadSingleMutation, upsertSectionMutation],
  );

  const saveLanguageMode = async () => {
    if (!languageMode) {
      toast.error(t('onboarding.siteContent.languageRequired'));
      return false;
    }

    const currentMode = portfolio?.languageMode;
    if (currentMode !== languageMode) {
      await updateLanguageModeMutation.mutateAsync(languageMode);
    }

    if (languageMode === 'both') {
      const defaultLanguage = portfolio?.defaultLanguage;
      const desiredDefault = lang === 'ar' ? 'ar' : 'en';
      if (defaultLanguage !== desiredDefault) {
        await updateDefaultLanguageMutation.mutateAsync(desiredDefault);
      }
    }

    return true;
  };

  const saveWhatsappIfProvided = async () => {
    setWhatsappError('');
    const normalizedNumber = normalizeLocalPhoneDigits(whatsappNumber);
    if (!normalizedNumber) return true;

    const phoneError = validateWhatsappNumber(whatsappNumber, isAr);
    if (phoneError) {
      setWhatsappError(phoneError);
      return false;
    }

    const selectedCountry =
      COUNTRY_OPTIONS.find((c) => c.iso2 === whatsappCountry) || COUNTRY_OPTIONS[0];

    await updateProfileMutation.mutateAsync({
      allowWhatsapp: true,
      whatsapp: buildWhatsAppLink(selectedCountry.dialCode, normalizedNumber),
    });

    return true;
  };

  const saveHeroSection = async () => {
    const mode = activeLanguageMode;
    const existing = stripSectionMeta(
      heroSection && isObject(heroSection) ? heroSection : null,
    );
    const active =
      heroSection && isObject(heroSection) && typeof heroSection.active === 'boolean'
        ? heroSection.active
        : true;

    const payload: JsonRecord = { active };
    copyOptionalHeroScalars(payload, existing);
    applyOptionalLocalizedField(payload, 'name', heroForm.name, mode);
    applyOptionalLocalizedField(payload, 'title', heroForm.title, mode);
    applyOptionalLocalizedField(payload, 'desc', heroForm.desc, mode);
    applyOptionalLocalizedField(payload, 'anotherDesc', heroForm.anotherDesc, mode);

    const hasEditableFields = ['name', 'title', 'desc', 'anotherDesc', 'image', 'email'].some(
      (key) => key in payload,
    );
    if (!hasEditableFields) return;

    await upsertSectionMutation.mutateAsync({
      sectionName: 'hero',
      payload,
    });
  };

  const saveAboutSection = async () => {
    const mode = activeLanguageMode;
    const existing = stripSectionMeta(
      aboutSection && isObject(aboutSection) ? aboutSection : null,
    );
    const active =
      aboutSection && isObject(aboutSection) && typeof aboutSection.active === 'boolean'
        ? aboutSection.active
        : true;

    const payload: JsonRecord = { active };
    if (aboutImages.length > 0) payload.images = aboutImages;
    applyOptionalLocalizedField(payload, 'desc', aboutForm.desc, mode);

    const hasEditableFields = 'desc' in payload || 'images' in payload;
    if (!hasEditableFields) return;

    await upsertSectionMutation.mutateAsync({
      sectionName: 'about',
      payload,
    });
  };

  const isUploading =
    uploadSingleMutation.isPending ||
    updateLogoMutation.isPending ||
    updateLanguageModeMutation.isPending ||
    updateProfileMutation.isPending;

  const onNext = async () => {
    if (isUploading || isSaving) {
      toast.message(t('onboarding.siteContent.waitUpload'));
      return;
    }

    setIsSaving(true);
    try {
      if (step === 1) {
        const languageOk = await saveLanguageMode();
        if (!languageOk) return;
        const whatsappOk = await saveWhatsappIfProvided();
        if (!whatsappOk) return;
        setStep(2);
        return;
      }

      if (step === 2) {
        await saveHeroSection();
        setStep(3);
        return;
      }

      await saveAboutSection();
      clearPendingSiteContent();
      navigate('/site-ready');
    } catch {
      toast.error(t('onboarding.siteContent.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const onBack = () => {
    if (step === 1) return;
    setStep((current) => (current === 2 ? 1 : 2));
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email && !isUserEmailVerified(user)) {
    return <RedirectToEmailVerification email={user.email} />;
  }

  if (!isConfiguredSubdomain(user?.subdomain)) {
    return <Navigate to="/choose-subdomain" replace />;
  }

  if (!hasPendingSiteContent()) {
    if (hasPendingSiteReady()) {
      return <Navigate to="/site-ready" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const languageOptions: Array<{ value: LanguageMode; title: string; desc: string }> = [
    {
      value: 'ar',
      title: t('onboarding.languageMode.arTitle'),
      desc: t('onboarding.languageMode.arDesc'),
    },
    {
      value: 'en',
      title: t('onboarding.languageMode.enTitle'),
      desc: t('onboarding.languageMode.enDesc'),
    },
    {
      value: 'both',
      title: t('onboarding.languageMode.bothTitle'),
      desc: t('onboarding.languageMode.bothDesc'),
    },
  ];

  const onSkip = () => {
    if (isUploading || isSaving) {
      toast.message(t('onboarding.siteContent.waitUpload'));
      return;
    }
    clearPendingSiteContent();
    navigate('/site-ready');
  };

  const stepTitle =
    step === 1
      ? t('onboarding.siteContent.languageStepTitle')
      : step === 3
        ? t('onboarding.siteContent.aboutStepTitle')
        : t('onboarding.siteContent.title');

  const stepSubtitle =
    step === 1
      ? t('onboarding.siteContent.subtitle')
      : step === 3
        ? t('onboarding.siteContent.aboutStepSubtitle')
        : t('onboarding.siteContent.subtitle');

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <ColorBendsBackground />
      <Navbar />
      <main className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 pb-16 pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong glow-border w-full rounded-3xl p-6 md:p-8"
        >
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={onSkip}
              disabled={isUploading || isSaving}
              className="text-sm font-medium text-muted-foreground transition hover:text-primary disabled:opacity-60"
            >
              {t('onboarding.siteContent.skip')}
            </button>
          </div>

          <Stepper step={step} labels={stepLabels} />

          <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{stepTitle}</h1>
          <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">{stepSubtitle}</p>

          {step === 1 ? (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {languageOptions.map((option) => {
                const isSelected = languageMode === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLanguageMode(option.value)}
                    disabled={updateLanguageModeMutation.isPending}
                    className={cn(
                      'rounded-2xl px-3 py-4 text-start transition-colors disabled:opacity-60',
                      isSelected
                        ? 'gradient-bg text-primary-foreground'
                        : 'border border-border bg-background/60 text-foreground hover:bg-foreground/5',
                    )}
                  >
                    <p className="text-sm font-semibold">{option.title}</p>
                    <p
                      className={cn(
                        'mt-1 text-xs',
                        isSelected ? 'text-primary-foreground/85' : 'text-muted-foreground',
                      )}
                    >
                      {option.desc}
                    </p>
                  </button>
                );
              })}
              </div>

              <p className="text-base font-medium leading-7 text-white md:text-lg">
                {t('onboarding.siteContent.whatsappIntro')}
              </p>

              <div className="rounded-2xl border border-border bg-background/60 p-4">
                <p className="font-medium text-foreground">
                  {t('onboarding.siteContent.whatsappLabel')}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t('onboarding.siteContent.whatsappHint')}
                </p>
                <label className="mt-3 block text-xs font-medium text-muted-foreground">
                  {t('onboarding.siteContent.whatsappCountryLabel')}
                </label>
                <select
                  value={whatsappCountry}
                  onChange={(event) => setWhatsappCountry(event.target.value)}
                  className={cn(inputClass, 'mt-1.5')}
                >
                  {sortedCountries.map((option) => (
                    <option key={option.iso2} value={option.iso2}>
                      {isAr ? option.nameAr : option.nameEn} (+{option.dialCode})
                    </option>
                  ))}
                </select>
                <label className="mt-3 block text-xs font-medium text-muted-foreground">
                  {t('onboarding.siteContent.whatsappNumberLabel')}
                </label>
                <input
                  value={whatsappNumber}
                  onChange={(event) => {
                    setWhatsappNumber(event.target.value);
                    if (whatsappError) setWhatsappError('');
                  }}
                  placeholder={t('onboarding.siteContent.whatsappPlaceholder')}
                  inputMode="tel"
                  className={cn(inputClass, 'mt-1.5')}
                />
                {whatsappError ? (
                  <p className="mt-2 text-xs text-destructive">{whatsappError}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            !heroFormHydrated ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
                {t('onboarding.siteContent.loadingSection')}
              </div>
            ) : (
            <div className="mt-6 space-y-4">
              <UploadField
                id="setup-logo"
                label={t('onboarding.siteContent.logoLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                emptyLabel={t('onboarding.siteContent.logoEmpty')}
                uploadLabel={t('onboarding.siteContent.logoUpload')}
                imagePath={user?.logo}
                previewUrl={logoPreview}
                isUploading={updateLogoMutation.isPending}
                onUpload={uploadLogo}
              />

              <UploadField
                id="setup-hero"
                label={t('onboarding.siteContent.heroLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                emptyLabel={t('onboarding.siteContent.heroEmpty')}
                uploadLabel={t('onboarding.siteContent.heroUpload')}
                imagePath={heroImagePath}
                previewUrl={heroPreview}
                isUploading={uploadSingleMutation.isPending}
                onUpload={upsertHeroImage}
              />

              <LocalizedField
                idPrefix="hero-name"
                label={t('onboarding.siteContent.heroNameLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                value={heroForm.name}
                languageMode={activeLanguageMode}
                onChange={(name) => setHeroForm((prev) => ({ ...prev, name }))}
                arLabel={t('onboarding.siteContent.inputArabic')}
                enLabel={t('onboarding.siteContent.inputEnglish')}
                placeholderAr={t('onboarding.siteContent.heroNamePlaceholder')}
                placeholderEn={t('onboarding.siteContent.heroNamePlaceholder')}
              />

              <LocalizedField
                idPrefix="hero-title"
                label={t('onboarding.siteContent.heroTitleLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                value={heroForm.title}
                languageMode={activeLanguageMode}
                onChange={(title) => setHeroForm((prev) => ({ ...prev, title }))}
                arLabel={t('onboarding.siteContent.inputArabic')}
                enLabel={t('onboarding.siteContent.inputEnglish')}
                placeholderAr={t('onboarding.siteContent.heroTitlePlaceholder')}
                placeholderEn={t('onboarding.siteContent.heroTitlePlaceholder')}
              />

              <LocalizedField
                idPrefix="hero-desc"
                label={t('onboarding.siteContent.heroDescLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                value={heroForm.desc}
                languageMode={activeLanguageMode}
                multiline
                onChange={(desc) => setHeroForm((prev) => ({ ...prev, desc }))}
                arLabel={t('onboarding.siteContent.inputArabic')}
                enLabel={t('onboarding.siteContent.inputEnglish')}
                placeholderAr={t('onboarding.siteContent.heroDescPlaceholder')}
                placeholderEn={t('onboarding.siteContent.heroDescPlaceholder')}
              />

              <LocalizedField
                idPrefix="hero-another-desc"
                label={t('onboarding.siteContent.heroAnotherDescLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                value={heroForm.anotherDesc}
                languageMode={activeLanguageMode}
                multiline
                onChange={(anotherDesc) => setHeroForm((prev) => ({ ...prev, anotherDesc }))}
                arLabel={t('onboarding.siteContent.inputArabic')}
                enLabel={t('onboarding.siteContent.inputEnglish')}
                placeholderAr={t('onboarding.siteContent.heroAnotherDescPlaceholder')}
                placeholderEn={t('onboarding.siteContent.heroAnotherDescPlaceholder')}
              />
            </div>
            )
          ) : null}

          {step === 3 ? (
            !aboutFormHydrated ? (
              <div className="mt-8 flex flex-col items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
                {t('onboarding.siteContent.loadingSection')}
              </div>
            ) : (
            <div className="mt-6 space-y-4">
              <UploadField
                id="setup-about-image"
                label={t('onboarding.siteContent.aboutImageLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                emptyLabel={t('onboarding.siteContent.aboutImageEmpty')}
                uploadLabel={t('onboarding.siteContent.aboutImageUpload')}
                imagePath={aboutImagePath}
                previewUrl={aboutPreview}
                isUploading={uploadSingleMutation.isPending}
                onUpload={upsertAboutImage}
              />

              <LocalizedField
                idPrefix="about-desc"
                label={t('onboarding.siteContent.aboutDescLabel')}
                hint={t('onboarding.siteContent.optionalHint')}
                value={aboutForm.desc}
                languageMode={activeLanguageMode}
                multiline
                onChange={(desc) => setAboutForm((prev) => ({ ...prev, desc }))}
                arLabel={t('onboarding.siteContent.inputArabic')}
                enLabel={t('onboarding.siteContent.inputEnglish')}
                placeholderAr={t('onboarding.siteContent.aboutDescPlaceholder')}
                placeholderEn={t('onboarding.siteContent.aboutDescPlaceholder')}
              />
            </div>
            )
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            {step > 1 ? (
              <button
                type="button"
                onClick={onBack}
                disabled={isSaving || isUploading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-60"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {t('onboarding.siteContent.back')}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => void onNext()}
              disabled={
                isUploading ||
                isSaving ||
                (step === 1 && !languageMode) ||
                (step === 2 && !heroFormHydrated) ||
                (step === 3 && !aboutFormHydrated)
              }
              className={cn(primaryButtonMdClass, 'flex-1')}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {t('onboarding.siteContent.continue')}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SetupSiteContent;
