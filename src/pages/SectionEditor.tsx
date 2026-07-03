import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ImagePlus, Plus, RotateCcw, Save, Trash2, UploadCloud } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useAllSections, useMyPortfolio, usePortfolioActions, useSection, useSectionItems } from '@/hooks/usePortfolio';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';
import { resolveApiAssetUrl } from '@/api/axios';
import { resolvePortfolioDisplayLang } from '@/lib/portfolioDisplayLang';
import { sectionLabel } from '@/lib/templateCatalogView';
import { primaryButtonCompactClass } from '@/lib/buttonStyles';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const isObject = (value: unknown): value is Record<string, JsonValue> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const AR_FIELD_LABELS: Record<string, string> = {
  title: 'العنوان',
  name: 'الاسم',
  desc: 'الوصف',
  description: 'الوصف',
  image: 'صورة',
  images: 'الصور',
  email: 'البريد الإلكتروني',
  phone: 'الهاتف',
  phone1: 'الهاتف 1',
  phone2: 'الهاتف 2',
  address: 'العنوان',
  addressUrl: 'رابط العنوان',
  link: 'الرابط',
  links: 'الروابط',
  country: 'الدولة',
  role: 'الدور',
  from: 'من',
  to: 'إلى',
  skills: 'المهارات',
  projects: 'المشاريع',
  experiences: 'الخبرات',
  services: 'الخدمات',
  certificates: 'الشهادات',
  products: 'المنتجات',
  courses: 'الدورات',
  packageName: 'اسم الباقة',
  packages: 'الباقات',
  menuLink: 'رابط القائمة',
  menus: 'عناصر القائمة',
  clients: 'العملاء',
  faqs: 'الأسئلة الشائعة',
  testimonials: 'آراء العملاء',
  gallery: 'المعرض',
  branches: 'الفروع',
  serviceCategory: 'فئة الخدمة (اختياري)',
  allowContactBtn: 'إظهار زر التواصل',
  contactLink: 'رابط التواصل',
};

const titleCase = (key: string, uiLang: UiLang = 'en') => {
  if (uiLang === 'ar' && AR_FIELD_LABELS[key]) return AR_FIELD_LABELS[key];
  return key === 'serviceCategory'
    ? 'Service Category (optional)'
    : key
      .replace(/([A-Z])/g, ' $1')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^./, (c) => c.toUpperCase());
};

const imageFromPath = (path: string) => resolveApiAssetUrl(path);


const looksLikeImage = (value: unknown) => {
  if (typeof value !== 'string') return false;
  return /(\.png|\.jpe?g|\.gif|\.webp|\.svg)$/i.test(value) || value.includes('/uploads/');
};

const isImageKey = (key: string) => /(image|img|photo|logo|avatar|thumbnail|banner|cover|icon)/i.test(key);

const isDateKey = (key: string) => /(date|from|to|start|end)/i.test(key);

const PLATFORM_OPTIONS = [
  'LinkedIn',
  'Facebook',
  'Instagram',
  'X',
  'Twitter',
  'YouTube',
  'TikTok',
  'GitHub',
  'GitLab',
  'Behance',
  'Dribbble',
  'WhatsApp',
  'Telegram',
  'Snapchat',
  'Pinterest',
  'Website',
] as const;

const fieldShellClass = (compact: boolean) =>
  compact
    ? 'rounded-2xl border border-border bg-background p-3'
    : 'rounded-2xl border border-border bg-card p-5 shadow-sm';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500';

const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary disabled:opacity-60';

const primaryButtonClass = primaryButtonCompactClass;

const ensureLocalized = (value?: unknown): JsonValue => {
  if (isObject(value) && ('ar' in value || 'en' in value)) return value;
  return { ar: '', en: '' };
};

type LanguageMode = 'ar' | 'en' | 'both';
type UiLang = 'ar' | 'en';

const HERO_ALLOWED_KEYS = ['name', 'title', 'image', 'desc', 'anotherDesc', 'country', 'email'] as const;
const HERO_LOCALIZED_KEYS = new Set(['name', 'title', 'desc', 'anotherDesc', 'country']);
const ABOUT_ALLOWED_KEYS = ['title', 'desc', 'images'] as const;
const ABOUT_LOCALIZED_KEYS = new Set(['title', 'desc']);
const SKILLS_ALLOWED_KEYS = ['title', 'desc', 'skills'] as const;
const SKILLS_LOCALIZED_KEYS = new Set(['title', 'desc']);
const PROJECTS_ALLOWED_KEYS = ['title', 'desc', 'projects'] as const;
const PROJECTS_LOCALIZED_KEYS = new Set(['title', 'desc']);
const EXPERIENCE_ALLOWED_KEYS = ['title', 'desc', 'experiences'] as const;
const EXPERIENCE_LOCALIZED_KEYS = new Set(['title', 'desc']);
const CONTACT_ALLOWED_KEYS = ['title', 'desc', 'image', 'phone1', 'phone2', 'address', 'addressUrl', 'email', 'links'] as const;
const CONTACT_LOCALIZED_KEYS = new Set(['title', 'desc', 'address']);
const SERVICES_ALLOWED_KEYS = ['title', 'desc', 'image', 'allowContactBtn', 'contactLink', 'services'] as const;
const SERVICES_LOCALIZED_KEYS = new Set(['title', 'desc']);
const CERTIFICATES_ALLOWED_KEYS = ['title', 'desc', 'certificates'] as const;
const CERTIFICATES_LOCALIZED_KEYS = new Set(['title', 'desc']);
const PRODUCTS_ALLOWED_KEYS = ['title', 'desc', 'products'] as const;
const PRODUCTS_LOCALIZED_KEYS = new Set(['title', 'desc']);
const COURSES_ALLOWED_KEYS = ['title', 'desc', 'courses'] as const;
const COURSES_LOCALIZED_KEYS = new Set(['title', 'desc']);
const ANNOUNCEMENT_ALLOWED_KEYS = ['title', 'desc', 'images', 'link'] as const;
const ANNOUNCEMENT_LOCALIZED_KEYS = new Set(['title', 'desc']);
const CLIENTS_ALLOWED_KEYS = ['title', 'desc', 'clients'] as const;
const CLIENTS_LOCALIZED_KEYS = new Set(['title', 'desc']);
const FAQ_ALLOWED_KEYS = ['title', 'desc', 'faqs'] as const;
const FAQ_LOCALIZED_KEYS = new Set(['title', 'desc']);
const TESTIMONIAL_ALLOWED_KEYS = ['title', 'desc', 'testimonials'] as const;
const TESTIMONIAL_LOCALIZED_KEYS = new Set(['title', 'desc']);
const GALLERY_ALLOWED_KEYS = ['title', 'desc', 'gallery'] as const;
const GALLERY_LOCALIZED_KEYS = new Set(['title', 'desc']);
const BRANCHES_ALLOWED_KEYS = ['title', 'desc', 'branches'] as const;
const BRANCHES_LOCALIZED_KEYS = new Set(['title', 'desc']);
const PACKAGES_ALLOWED_KEYS = ['title', 'desc', 'packages'] as const;
const PACKAGES_LOCALIZED_KEYS = new Set(['title', 'desc']);
const MENUS_ALLOWED_KEYS = ['title', 'desc', 'menuLink', 'menus'] as const;
const MENUS_LOCALIZED_KEYS = new Set(['title', 'desc']);

const RESTRICTED_ARRAY_KEYS = new Set([
  'images',
  'skills',
  'projects',
  'experiences',
  'links',
  'services',
  'certificates',
  'products',
  'courses',
  'clients',
  'faqs',
  'testimonials',
  'gallery',
  'branches',
  'packages',
  'menus',
]);

type RestrictedSectionConfig = {
  allowedKeys: readonly string[];
  localizedKeys: Set<string>;
};

const RESTRICTED_SECTION_CONFIGS: Record<string, RestrictedSectionConfig> = {
  hero: { allowedKeys: HERO_ALLOWED_KEYS, localizedKeys: HERO_LOCALIZED_KEYS },
  about: { allowedKeys: ABOUT_ALLOWED_KEYS, localizedKeys: ABOUT_LOCALIZED_KEYS },
  skills: { allowedKeys: SKILLS_ALLOWED_KEYS, localizedKeys: SKILLS_LOCALIZED_KEYS },
  projects: { allowedKeys: PROJECTS_ALLOWED_KEYS, localizedKeys: PROJECTS_LOCALIZED_KEYS },
  experience: { allowedKeys: EXPERIENCE_ALLOWED_KEYS, localizedKeys: EXPERIENCE_LOCALIZED_KEYS },
  contact: { allowedKeys: CONTACT_ALLOWED_KEYS, localizedKeys: CONTACT_LOCALIZED_KEYS },
  services: { allowedKeys: SERVICES_ALLOWED_KEYS, localizedKeys: SERVICES_LOCALIZED_KEYS },
  certificates: { allowedKeys: CERTIFICATES_ALLOWED_KEYS, localizedKeys: CERTIFICATES_LOCALIZED_KEYS },
  products: { allowedKeys: PRODUCTS_ALLOWED_KEYS, localizedKeys: PRODUCTS_LOCALIZED_KEYS },
  courses: { allowedKeys: COURSES_ALLOWED_KEYS, localizedKeys: COURSES_LOCALIZED_KEYS },
  announcement: { allowedKeys: ANNOUNCEMENT_ALLOWED_KEYS, localizedKeys: ANNOUNCEMENT_LOCALIZED_KEYS },
  clients: { allowedKeys: CLIENTS_ALLOWED_KEYS, localizedKeys: CLIENTS_LOCALIZED_KEYS },
  faq: { allowedKeys: FAQ_ALLOWED_KEYS, localizedKeys: FAQ_LOCALIZED_KEYS },
  testimonial: { allowedKeys: TESTIMONIAL_ALLOWED_KEYS, localizedKeys: TESTIMONIAL_LOCALIZED_KEYS },
  gallery: { allowedKeys: GALLERY_ALLOWED_KEYS, localizedKeys: GALLERY_LOCALIZED_KEYS },
  branches: { allowedKeys: BRANCHES_ALLOWED_KEYS, localizedKeys: BRANCHES_LOCALIZED_KEYS },
  packages: { allowedKeys: PACKAGES_ALLOWED_KEYS, localizedKeys: PACKAGES_LOCALIZED_KEYS },
  menus: { allowedKeys: MENUS_ALLOWED_KEYS, localizedKeys: MENUS_LOCALIZED_KEYS },
};

const localizedForMode = (value: unknown, mode: LanguageMode): JsonValue => {
  const source = isObject(value) ? value : {};
  if (mode === 'ar') return { ar: String(source.ar ?? '') };
  if (mode === 'en') return { en: String(source.en ?? '') };
  return { ar: String(source.ar ?? ''), en: String(source.en ?? '') };
};

const normalizeSkillItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    skillName: localizedForMode(source.skillName, mode),
    skillImage: typeof source.skillImage === 'string' ? source.skillImage : '',
    skillRate:
      typeof source.skillRate === 'number' && Number.isFinite(source.skillRate) ? source.skillRate : 0,
    skillCategory: localizedForMode(source.skillCategory, mode),
  };
};

const normalizeProjectItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    projectTitle: localizedForMode(source.projectTitle, mode),
    projectDesc: localizedForMode(source.projectDesc, mode),
    projectImages: Array.isArray(source.projectImages)
      ? source.projectImages.filter((entry): entry is string => typeof entry === 'string')
      : [],
    projectLink: typeof source.projectLink === 'string' ? source.projectLink : '',
    anotherProjectLink: typeof source.anotherProjectLink === 'string' ? source.anotherProjectLink : '',
    projectCategory: localizedForMode(source.projectCategory, mode),
  };
};

const normalizeExperienceItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    from: typeof source.from === 'string' ? source.from : '',
    to: typeof source.to === 'string' ? source.to : '',
    role: localizedForMode(source.role, mode),
    title: localizedForMode(source.title, mode),
    desc: localizedForMode(source.desc, mode),
  };
};

const normalizeContactLinkItem = (value: unknown): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    platform: typeof source.platform === 'string' ? source.platform : '',
    link: typeof source.link === 'string' ? source.link : '',
  };
};

const normalizeServiceItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    serviceTitle: localizedForMode(source.serviceTitle, mode),
    servicesDesc: localizedForMode(source.servicesDesc, mode),
    servicePrice:
      typeof source.servicePrice === 'number' && Number.isFinite(source.servicePrice) ? source.servicePrice : 0,
    priceType: typeof source.priceType === 'string' ? source.priceType : '',
    serviceCategory: typeof source.serviceCategory === 'string' ? source.serviceCategory : '',
    serviceImages: Array.isArray(source.serviceImages)
      ? source.serviceImages.filter((entry): entry is string => typeof entry === 'string')
      : [],
  };
};

const normalizeCertificateItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    title: localizedForMode(source.title, mode),
    description: localizedForMode(source.description, mode),
    date: typeof source.date === 'string' ? source.date : '',
    image: Array.isArray(source.image) ? source.image.filter((entry): entry is string => typeof entry === 'string') : [],
    link: typeof source.link === 'string' ? source.link : '',
  };
};

const normalizeCatalogItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    images: Array.isArray(source.images) ? source.images.filter((entry): entry is string => typeof entry === 'string') : [],
    title: localizedForMode(source.title, mode),
    desc: localizedForMode(source.desc, mode),
    price: typeof source.price === 'number' && Number.isFinite(source.price) ? source.price : 0,
    discount: typeof source.discount === 'number' && Number.isFinite(source.discount) ? source.discount : 0,
    features: Array.isArray(source.features) ? source.features.map((entry) => localizedForMode(entry, mode)) : [],
    link: typeof source.link === 'string' ? source.link : '',
  };
};

const normalizePackageItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    packageName: localizedForMode(source.packageName, mode),
    price: typeof source.price === 'number' && Number.isFinite(source.price) ? source.price : 0,
    features: Array.isArray(source.features) ? source.features.map((entry) => localizedForMode(entry, mode)) : [],
    image: typeof source.image === 'string' ? source.image : '',
  };
};

const normalizeMenuItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    title: localizedForMode(source.title, mode),
    description: localizedForMode(source.description, mode),
    image: typeof source.image === 'string' ? source.image : '',
  };
};

const normalizeClientItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    clientLogo: typeof source.clientLogo === 'string' ? source.clientLogo : '',
    clientName: localizedForMode(source.clientName, mode),
    link: typeof source.link === 'string' ? source.link : '',
  };
};

const normalizeFaqItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    ques: localizedForMode(source.ques, mode),
    answer: localizedForMode(source.answer, mode),
  };
};

const normalizeTestimonialItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    clientName: localizedForMode(source.clientName, mode),
    clientImage: typeof source.clientImage === 'string' ? source.clientImage : '',
    testimonialImages: Array.isArray(source.testimonialImages)
      ? source.testimonialImages.filter((entry): entry is string => typeof entry === 'string')
      : [],
  };
};

const normalizeGalleryItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    image: typeof source.image === 'string' ? source.image : '',
    desc: localizedForMode(source.desc, mode),
  };
};

const normalizeBranchItem = (value: unknown, mode: LanguageMode): Record<string, JsonValue> => {
  const source = isObject(value) ? value : {};
  return {
    name: localizedForMode(source.name, mode),
    desc: localizedForMode(source.desc, mode),
    locationAddress: localizedForMode(source.locationAddress, mode),
    locationLink: typeof source.locationLink === 'string' ? source.locationLink : '',
    image: typeof source.image === 'string' ? source.image : '',
  };
};

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];

const normalizeRestrictedArrayByKey = (key: string, value: unknown, mode: LanguageMode): JsonValue | null => {
  if (key === 'images') return normalizeStringArray(value);
  if (key === 'skills') return Array.isArray(value) ? value.map((entry) => normalizeSkillItem(entry, mode)) : [];
  if (key === 'projects') return Array.isArray(value) ? value.map((entry) => normalizeProjectItem(entry, mode)) : [];
  if (key === 'experiences') return Array.isArray(value) ? value.map((entry) => normalizeExperienceItem(entry, mode)) : [];
  if (key === 'links') return Array.isArray(value) ? value.map((entry) => normalizeContactLinkItem(entry)) : [];
  if (key === 'services') return Array.isArray(value) ? value.map((entry) => normalizeServiceItem(entry, mode)) : [];
  if (key === 'certificates') return Array.isArray(value) ? value.map((entry) => normalizeCertificateItem(entry, mode)) : [];
  if (key === 'products') return Array.isArray(value) ? value.map((entry) => normalizeCatalogItem(entry, mode)) : [];
  if (key === 'courses') return Array.isArray(value) ? value.map((entry) => normalizeCatalogItem(entry, mode)) : [];
  if (key === 'clients') return Array.isArray(value) ? value.map((entry) => normalizeClientItem(entry, mode)) : [];
  if (key === 'faqs') return Array.isArray(value) ? value.map((entry) => normalizeFaqItem(entry, mode)) : [];
  if (key === 'testimonials') return Array.isArray(value) ? value.map((entry) => normalizeTestimonialItem(entry, mode)) : [];
  if (key === 'gallery') return Array.isArray(value) ? value.map((entry) => normalizeGalleryItem(entry, mode)) : [];
  if (key === 'branches') return Array.isArray(value) ? value.map((entry) => normalizeBranchItem(entry, mode)) : [];
  if (key === 'packages') return Array.isArray(value) ? value.map((entry) => normalizePackageItem(entry, mode)) : [];
  if (key === 'menus') return Array.isArray(value) ? value.map((entry) => normalizeMenuItem(entry, mode)) : [];
  return null;
};

const defaultArrayItemForField = (fieldKey: string, mode: LanguageMode): JsonValue | null => {
  if (/(^|\.|\[)features(\]|$)/i.test(fieldKey)) return localizedForMode({}, mode);
  if (/(^|\.|\[)skills(\]|$)/i.test(fieldKey)) return normalizeSkillItem({}, mode);
  if (/(^|\.|\[)projects(\]|$)/i.test(fieldKey)) return normalizeProjectItem({}, mode);
  if (/(^|\.|\[)experiences(\]|$)/i.test(fieldKey)) return normalizeExperienceItem({}, mode);
  if (/(^|\.|\[)links(\]|$)/i.test(fieldKey)) return normalizeContactLinkItem({});
  if (/(^|\.|\[)services(\]|$)/i.test(fieldKey)) return normalizeServiceItem({}, mode);
  if (/(^|\.|\[)certificates(\]|$)/i.test(fieldKey)) return normalizeCertificateItem({}, mode);
  if (/(^|\.|\[)products(\]|$)/i.test(fieldKey)) return normalizeCatalogItem({}, mode);
  if (/(^|\.|\[)courses(\]|$)/i.test(fieldKey)) return normalizeCatalogItem({}, mode);
  if (/(^|\.|\[)clients(\]|$)/i.test(fieldKey)) return normalizeClientItem({}, mode);
  if (/(^|\.|\[)faqs(\]|$)/i.test(fieldKey)) return normalizeFaqItem({}, mode);
  if (/(^|\.|\[)testimonials(\]|$)/i.test(fieldKey)) return normalizeTestimonialItem({}, mode);
  if (/(^|\.|\[)gallery(\]|$)/i.test(fieldKey)) return normalizeGalleryItem({}, mode);
  if (/(^|\.|\[)branches(\]|$)/i.test(fieldKey)) return normalizeBranchItem({}, mode);
  if (/(^|\.|\[)packages(\]|$)/i.test(fieldKey)) return normalizePackageItem({}, mode);
  if (/(^|\.|\[)menus(\]|$)/i.test(fieldKey)) return normalizeMenuItem({}, mode);
  return null;
};

const defaultRestrictedFieldValue = (key: string, localizedKeys: Set<string>, mode: LanguageMode): JsonValue => {
  if (localizedKeys.has(key)) return localizedForMode(undefined, mode);
  if (RESTRICTED_ARRAY_KEYS.has(key)) return [];
  if (key === 'allowContactBtn') return false;
  return '';
};

const leafKeyFromFieldPath = (fieldKey: string): string => {
  const sanitized = fieldKey.replace(/\[\d+\]/g, '');
  const parts = sanitized.split('.');
  return parts[parts.length - 1] || sanitized;
};

const parentLeafKeyFromFieldPath = (fieldKey: string): string => {
  const sanitized = fieldKey.replace(/\[\d+\]/g, '');
  const parts = sanitized.split('.');
  return parts.length > 1 ? parts[parts.length - 2] : '';
};

const getInputPlaceholder = (fieldKey: string, label: string, uiLang: UiLang, inputType: 'text' | 'number' | 'date' | 'textarea') => {
  const leaf = leafKeyFromFieldPath(fieldKey);
  const parentLeaf = parentLeafKeyFromFieldPath(fieldKey);
  const key = leaf.toLowerCase();
  const parentKey = parentLeaf.toLowerCase();

  if (key === 'ar') return uiLang === 'ar' ? 'اكتب النص باللغة العربية' : 'Write Arabic content';
  if (key === 'en') return uiLang === 'ar' ? 'اكتب النص باللغة الإنجليزية' : 'Write English content';

  if (inputType === 'date') {
    if (key === 'from') return uiLang === 'ar' ? 'اختر تاريخ البداية' : 'Select start date';
    if (key === 'to') return uiLang === 'ar' ? 'اختر تاريخ النهاية' : 'Select end date';
    return uiLang === 'ar' ? 'اختر التاريخ' : 'Select date';
  }

  if (inputType === 'number') {
    if (key.includes('rate')) return uiLang === 'ar' ? 'ادخل نسبة المهارة (مثل 80)' : 'Enter skill rate (e.g. 80)';
    if (key.includes('price')) return uiLang === 'ar' ? 'ادخل السعر' : 'Enter price';
    if (key.includes('discount')) return uiLang === 'ar' ? 'ادخل نسبة الخصم' : 'Enter discount value';
    return uiLang === 'ar' ? `ادخل قيمة ${label}` : `Enter ${label} value`;
  }

  if (key.includes('image') || key.includes('images') || key.includes('logo') || key.includes('avatar')) {
    return uiLang === 'ar' ? 'الصق رابط الصورة أو ارفع صورة' : 'Paste image URL or upload an image';
  }
  if (key.includes('email')) return uiLang === 'ar' ? 'ادخل البريد الإلكتروني' : 'Enter email address';
  if (key.startsWith('phone')) return uiLang === 'ar' ? 'ادخل رقم الهاتف' : 'Enter phone number';
  if (key.includes('addressurl') || key === 'link' || key.includes('link') || key === 'menulink') {
    return uiLang === 'ar' ? 'الصق الرابط الكامل' : 'Paste full URL';
  }
  if (key.includes('address')) return uiLang === 'ar' ? 'اكتب العنوان' : 'Write address';
  if (key.includes('desc') || key.includes('description') || key.includes('answer')) {
    return uiLang === 'ar' ? 'اكتب وصفا واضحا ومختصرا' : 'Write a clear and concise description';
  }
  if (key.includes('title') || key.includes('name') || key.includes('role') || key.includes('category') || key.includes('ques')) {
    return uiLang === 'ar' ? `اكتب ${label}` : `Enter ${label}`;
  }
  if (key.includes('platform')) return uiLang === 'ar' ? 'اكتب اسم المنصة (مثل LinkedIn)' : 'Enter platform name (e.g. LinkedIn)';
  if (key.includes('pricetype')) return uiLang === 'ar' ? 'اكتب نوع السعر (ساعة، مشروع...)' : 'Enter price type (hourly, project...)';
  if (key.includes('feature') || parentKey.includes('feature')) {
    return uiLang === 'ar' ? 'اكتب ميزة واحدة' : 'Write one feature';
  }

  return inputType === 'textarea'
    ? uiLang === 'ar'
      ? `اكتب تفاصيل ${label}`
      : `Write details for ${label}`
    : uiLang === 'ar'
      ? `اكتب ${label}`
      : `Enter ${label}`;
};

const normalizeRestrictedSectionForm = (
  source: Record<string, JsonValue>,
  mode: LanguageMode,
  allowedKeys: readonly string[],
  localizedKeys: Set<string>,
): Record<string, JsonValue> => {
  const normalized: Record<string, JsonValue> = {};
  allowedKeys.forEach((key) => {
    const current = source[key];
    if (localizedKeys.has(key)) {
      normalized[key] = localizedForMode(current, mode);
      return;
    }
    const normalizedArray = normalizeRestrictedArrayByKey(key, current, mode);
    if (normalizedArray !== null) {
      normalized[key] = normalizedArray;
      return;
    }
    if (typeof current === 'boolean') {
      normalized[key] = current;
      return;
    }
    normalized[key] = typeof current === 'string' ? current : '';
  });
  return normalized;
};

const defaultItemTemplateBySection = (sectionName: string): Record<string, JsonValue> => {
  switch (sectionName.toLowerCase()) {
    case 'skills':
      return {
        skillName: ensureLocalized(),
        skillImage: '',
        skillRate: 0,
        skillCategory: ensureLocalized(),
      };
    case 'projects':
      return {
        title: ensureLocalized(),
        desc: ensureLocalized(),
        images: [],
      };
    case 'services':
      return {
        title: ensureLocalized(),
        desc: ensureLocalized(),
        image: '',
      };
    default:
      return {
        title: ensureLocalized(),
        desc: ensureLocalized(),
      };
  }
};

type DynamicFieldProps = {
  fieldKey: string;
  label: string;
  value: JsonValue;
  onChange: (next: JsonValue) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
  compact?: boolean;
  languageMode?: LanguageMode;
  uiLang?: UiLang;
  disabled?: boolean;
};

const DynamicField = ({
  fieldKey,
  label,
  value,
  onChange,
  onUploadImage,
  compact = false,
  languageMode = 'both',
  uiLang = 'en',
  disabled = false,
}: DynamicFieldProps) => {
  const shellClass = fieldShellClass(compact);
  const [uploading, setUploading] = useState(false);

  if (Array.isArray(value)) {
    const sample = value[0];
    const defaultNext: JsonValue =
      sample !== undefined
        ? typeof sample === 'object'
          ? deepClone(sample)
          : typeof sample === 'number'
            ? 0
            : typeof sample === 'boolean'
              ? false
              : ''
        : defaultArrayItemForField(fieldKey, languageMode) ?? '';

    const arrayIsImageList =
      isImageKey(fieldKey) &&
      value.every((entry) => typeof entry === 'string');

    if (arrayIsImageList) {
      return (
        <div className={shellClass}>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {uiLang === 'ar'
                  ? 'ارفع الصور وستظهر كمعاينات صغيرة هنا.'
                  : 'Upload images and review them as small previews here.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {onUploadImage && (
                <label className={`${ghostButtonClass} ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
                  <UploadCloud className="h-4 w-4" />
                  {uploading ? (uiLang === 'ar' ? 'جار الرفع...' : 'Uploading...') : uiLang === 'ar' ? 'رفع صورة' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading || disabled}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploading(true);
                        const path = await onUploadImage(file);
                        if (path) onChange([...value, path]);
                      } finally {
                        setUploading(false);
                        event.currentTarget.value = '';
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </div>

          {value.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
              <div>
                <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  {uiLang === 'ar' ? 'لا توجد صور بعد' : 'No images yet'}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {uiLang === 'ar' ? 'ابدأ برفع صورة.' : 'Start by uploading an image.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {value.map((item, index) => {
                const imagePath = String(item ?? '');
                return (
                  <div key={`${label}-${index}`} className="rounded-2xl border border-border bg-background p-3">
                    <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                      {imagePath ? (
                        <img
                          src={imageFromPath(imagePath)}
                          alt=""
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
                          {uiLang === 'ar' ? 'أضف رابط الصورة' : 'Add image URL'}
                        </div>
                      )}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {onUploadImage && (
                        <label className={`${ghostButtonClass} ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
                          <UploadCloud className="h-4 w-4" />
                          {uploading ? (uiLang === 'ar' ? 'جار الرفع...' : 'Uploading...') : imagePath ? (uiLang === 'ar' ? 'تغيير الصورة' : 'Change image') : (uiLang === 'ar' ? 'رفع صورة' : 'Upload image')}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploading || disabled}
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (!file) return;
                              try {
                                setUploading(true);
                                const path = await onUploadImage(file);
                                if (path) {
                                  const clone = [...value];
                                  clone[index] = path;
                                  onChange(clone);
                                }
                              } finally {
                                setUploading(false);
                                event.currentTarget.value = '';
                              }
                            }}
                          />
                        </label>
                      )}
                      <button
                        type="button"
                        onClick={() => onChange(value.filter((_, i) => i !== index))}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                        disabled={disabled}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {uiLang === 'ar' ? 'إزالة الصورة' : 'Remove image'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={shellClass}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange([...value, defaultNext])}
              className={ghostButtonClass}
              disabled={disabled}
            >
              <Plus className="w-4 h-4" />
              {uiLang === 'ar' ? 'إضافة' : 'Add'}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {value.map((item, index) => (
            <div key={`${label}-${index}`} className="rounded-2xl border border-border bg-background p-3">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  className="inline-flex items-center gap-1 rounded-lg border border-destructive/20 bg-destructive/5 px-2 py-1 text-xs text-destructive"
                  disabled={disabled}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {uiLang === 'ar' ? 'إزالة' : 'Remove'}
                </button>
              </div>
              <DynamicField
                fieldKey={`${fieldKey}[${index}]`}
                label={`${label} #${index + 1}`}
                value={item}
                compact
                onUploadImage={onUploadImage}
                languageMode={languageMode}
                uiLang={uiLang}
                disabled={disabled}
                onChange={(next) => {
                  const clone = [...value];
                  clone[index] = next;
                  onChange(clone);
                }}
              />
            </div>
          ))}
          {value.length === 0 && <p className="text-xs text-muted-foreground">{uiLang === 'ar' ? 'لا توجد عناصر بعد.' : 'No items yet.'}</p>}
        </div>
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className={shellClass}>
        <p className="mb-3 text-sm font-semibold text-foreground">{label}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(value).map(([key, nestedValue]) => (
            <DynamicField
              fieldKey={`${fieldKey}.${key}`}
              key={`${label}-${key}`}
              label={titleCase(key, uiLang)}
              value={nestedValue}
              compact
              onUploadImage={onUploadImage}
              languageMode={languageMode}
              uiLang={uiLang}
              disabled={disabled}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className={`${shellClass} flex items-center justify-between`}>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <Switch checked={value} disabled={disabled} onCheckedChange={(checked) => onChange(checked)} />
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className={shellClass}>
        <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          placeholder={getInputPlaceholder(fieldKey, label, uiLang, 'number')}
          className={inputClass}
          disabled={disabled}
        />
      </div>
    );
  }

  if (typeof value === 'string') {
    const imageLike = isImageKey(fieldKey) || looksLikeImage(value);
    const dateLike = isDateKey(fieldKey);
    const platformLike = leafKeyFromFieldPath(fieldKey).toLowerCase() === 'platform';
    const datalistId = `platform-options-${fieldKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
    const multiline = value.length > 80 || value.includes('\n');
    return (
      <div className={shellClass}>
        <label className="block text-sm font-semibold text-foreground mb-2">{label}</label>
        {imageLike ? (
          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted/30">
              {value ? (
                <img
                  src={imageFromPath(value)}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center p-4 text-center">
                  <div>
                    <ImagePlus className="mx-auto h-7 w-7 text-muted-foreground" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {uiLang === 'ar' ? 'لا توجد صورة' : 'No image'}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {onUploadImage && (
                <label className={`${ghostButtonClass} ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
                  <UploadCloud className="h-4 w-4" />
                  {uploading ? (uiLang === 'ar' ? 'جار الرفع...' : 'Uploading...') : value ? (uiLang === 'ar' ? 'تغيير الصورة' : 'Change image') : uiLang === 'ar' ? 'رفع صورة' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading || disabled}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        setUploading(true);
                        const path = await onUploadImage(file);
                        if (path) onChange(path);
                      } finally {
                        setUploading(false);
                        event.currentTarget.value = '';
                      }
                    }}
                  />
                </label>
              )}
              <p className="text-xs text-muted-foreground">
                {uiLang === 'ar' ? 'ارفع صورة جديدة لتغيير الصورة الحالية.' : 'Upload a new image to replace the current one.'}
              </p>
              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10"
                  disabled={disabled}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {uiLang === 'ar' ? 'إزالة الصورة' : 'Remove image'}
                </button>
              )}
            </div>
          </div>
        ) : dateLike ? (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getInputPlaceholder(fieldKey, label, uiLang, 'date')}
            className={inputClass}
            disabled={disabled}
          />
        ) : multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getInputPlaceholder(fieldKey, label, uiLang, 'textarea')}
            className={`${inputClass} min-h-28 resize-y`}
            disabled={disabled}
          />
        ) : platformLike ? (
          <>
            <input
              list={datalistId}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={getInputPlaceholder(fieldKey, label, uiLang, 'text')}
              className={inputClass}
              disabled={disabled}
            />
            <datalist id={datalistId}>
              {PLATFORM_OPTIONS.map((platform) => (
                <option key={platform} value={platform} />
              ))}
            </datalist>
          </>
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getInputPlaceholder(fieldKey, label, uiLang, 'text')}
            className={inputClass}
            disabled={disabled}
          />
        )}
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <p className="text-xs text-muted-foreground">{uiLang === 'ar' ? 'قيمة غير مدعومة' : 'Unsupported value'}</p>
    </div>
  );
};

const SectionEditor = () => {
  const { sectionName = '' } = useParams();
  const { isAuthenticated } = useAuth();
  const { lang, t } = useLanguage();
  const isAr = lang === 'ar';
  const { data: myPortfolio } = useMyPortfolio();

  const { data: allSectionsMeta } = useAllSections();
  const { data: sectionData, isLoading: sectionLoading } = useSection(sectionName);
  const { data: itemsData, isLoading: itemsLoading } = useSectionItems(sectionName);

  const {
    upsertSectionMutation,
    clearSectionMutation,
    setSectionActiveMutation,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
    uploadSingleMutation,
    uploadMultipleMutation,
    deleteUploadedImageMutation,
  } = usePortfolioActions(sectionName);

  const [sectionForm, setSectionForm] = useState<Record<string, JsonValue>>({});
  const [newItemForm, setNewItemForm] = useState<Record<string, JsonValue>>(defaultItemTemplateBySection(sectionName));
  const [editingItemId, setEditingItemId] = useState('');
  const [editingItemForm, setEditingItemForm] = useState<Record<string, JsonValue>>({});
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [pendingImageUploads, setPendingImageUploads] = useState(0);
  const sectionSlug = sectionName.toLowerCase();

  const beginImageUpload = useCallback(() => {
    setPendingImageUploads((count) => count + 1);
  }, []);

  const endImageUpload = useCallback(() => {
    setPendingImageUploads((count) => Math.max(0, count - 1));
  }, []);

  const isImageUploading =
    pendingImageUploads > 0 || uploadSingleMutation.isPending || uploadMultipleMutation.isPending;
  const sectionDisplayLang = useMemo(
    () => resolvePortfolioDisplayLang(myPortfolio, lang),
    [myPortfolio, lang],
  );
  const sectionTitle = sectionLabel(sectionName, lang);
  const restrictedSectionConfig = useMemo(
    () => RESTRICTED_SECTION_CONFIGS[sectionSlug] ?? null,
    [sectionSlug],
  );
  const isRestrictedSection = Boolean(restrictedSectionConfig);
  const languageMode: LanguageMode =
    myPortfolio?.languageMode === 'ar' || myPortfolio?.languageMode === 'en' || myPortfolio?.languageMode === 'both'
      ? myPortfolio.languageMode
      : 'both';

  const items = useMemo(
    () => (Array.isArray(itemsData) ? (itemsData as Record<string, JsonValue>[]) : []),
    [itemsData],
  );

  const sectionMeta = useMemo(() => {
    if (!allSectionsMeta || Array.isArray(allSectionsMeta) || !isObject(allSectionsMeta)) return null;
    const raw = allSectionsMeta[sectionName];
    return isObject(raw) ? raw : null;
  }, [allSectionsMeta, sectionName]);

  const requiredKeys = useMemo(() => {
    const candidate = sectionMeta?.required;
    if (!Array.isArray(candidate)) return [];
    return candidate.filter((k): k is string => typeof k === 'string');
  }, [sectionMeta]);

  const isSectionActive = Boolean(
    sectionData &&
    isObject(sectionData) &&
    'active' in sectionData &&
    typeof (sectionData as { active?: unknown }).active === 'boolean' &&
    (sectionData as { active: boolean }).active,
  );
  const isEditingLocked = !isSectionActive;

  useEffect(() => {
    if (!sectionData || !isObject(sectionData)) return;
    const cloned = deepClone(sectionData);
    delete cloned._id;
    if (restrictedSectionConfig) {
      setSectionForm(
        normalizeRestrictedSectionForm(
          cloned,
          languageMode,
          restrictedSectionConfig.allowedKeys,
          restrictedSectionConfig.localizedKeys,
        ),
      );
      return;
    }
    setSectionForm(cloned);
  }, [sectionData, restrictedSectionConfig, languageMode]);

  useEffect(() => {
    if (items.length === 0) {
      setNewItemForm(defaultItemTemplateBySection(sectionName));
      return;
    }
    const template = deepClone(items[0]);
    delete template.id;
    delete template._id;
    setNewItemForm(template);
  }, [items, sectionName]);

  const validateRequired = (payload: Record<string, JsonValue>) => {
    if (requiredKeys.length === 0) return true;
    const missing = requiredKeys.filter((key) => {
      const value = payload[key];
      if (value === undefined || value === null) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
    });
    if (missing.length > 0) {
      toast.error(isAr ? `الحقول المطلوبة مفقودة: ${missing.join(', ')}` : `Required fields missing: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const onSaveSection = async () => {
    if (isImageUploading) {
      toast.message(t('sectionEditor.waitingImageUpload'));
      return;
    }
    const basePayload = restrictedSectionConfig
      ? normalizeRestrictedSectionForm(
        sectionForm,
        languageMode,
        restrictedSectionConfig.allowedKeys,
        restrictedSectionConfig.localizedKeys,
      )
      : sectionForm;
    const payload = { ...basePayload, active: isSectionActive };
    if (!validateRequired(payload)) return;
    await upsertSectionMutation.mutateAsync({ sectionName, payload });
  };

  const onCreateItem = async () => {
    if (isImageUploading) {
      toast.message(t('sectionEditor.waitingImageUpload'));
      return;
    }
    await createItemMutation.mutateAsync({ sectionName, payload: newItemForm });
  };

  const onEditItem = (item: Record<string, JsonValue>) => {
    const itemId = String(item.id || item._id || '');
    setEditingItemId(itemId);
    const clone = deepClone(item);
    delete clone.id;
    delete clone._id;
    setEditingItemForm(clone);
  };

  const onUpdateItem = async () => {
    if (!editingItemId) return toast.error(isAr ? 'اختر عنصرا أولا.' : 'Choose an item first.');
    if (isImageUploading) {
      toast.message(t('sectionEditor.waitingImageUpload'));
      return;
    }
    await updateItemMutation.mutateAsync({
      sectionName,
      itemId: editingItemId,
      payload: editingItemForm,
    });
  };

  const appendUniquePath = (paths: string[]) => {
    setUploadedPaths((prev) => {
      const merged = [...prev];
      paths.forEach((path) => {
        if (path && !merged.includes(path)) merged.push(path);
      });
      return merged;
    });
  };

  const onUploadSingle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    beginImageUpload();
    try {
      const result = await uploadSingleMutation.mutateAsync(file);
      const path = result.filePath || result.url || '';
      appendUniquePath(path ? [path] : []);
    } finally {
      endImageUpload();
      event.currentTarget.value = '';
    }
  };

  const uploadImageAndGetPath = useCallback(
    async (file: File) => {
      beginImageUpload();
      try {
        const result = await uploadSingleMutation.mutateAsync(file);
        const path = result.filePath || result.url || '';
        return path || null;
      } finally {
        endImageUpload();
      }
    },
    [beginImageUpload, endImageUpload, uploadSingleMutation],
  );

  const onUploadMultiple = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    beginImageUpload();
    try {
      const result = await uploadMultipleMutation.mutateAsync(files);
      const paths = result.filePaths?.length ? result.filePaths : (result.urls ?? []);
      appendUniquePath(paths);
    } finally {
      endImageUpload();
      event.currentTarget.value = '';
    }
  };

  const addImageToSection = (path: string) => {
    setSectionForm((prev) => {
      const images = Array.isArray(prev.images) ? prev.images : [];
      if (images.includes(path)) return prev;
      return { ...prev, images: [...images, path] };
    });
  };

  const addImageToNewItem = (path: string) => {
    setNewItemForm((prev) => {
      const key = Object.keys(prev).find((k) => /image/i.test(k)) || 'image';
      const existing = prev[key];
      if (Array.isArray(existing)) {
        if (existing.includes(path)) return prev;
        return { ...prev, [key]: [...existing, path] };
      }
      return { ...prev, [key]: path };
    });
  };

  const removeImageFromSection = (path: string) => {
    setSectionForm((prev) => {
      const images = Array.isArray(prev.images) ? prev.images : [];
      return { ...prev, images: images.filter((img) => img !== path) };
    });
  };

  const deleteUploaded = async (path: string) => {
    await deleteUploadedImageMutation.mutateAsync(path);
    setUploadedPaths((prev) => prev.filter((p) => p !== path));
    removeImageFromSection(path);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-6 pb-16 pt-32">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {isAr ? 'محرر المحتوى' : 'Content editor'}
              </span>
              <h1 className="mt-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
                {isAr ? `تعديل قسم ${sectionTitle}` : `Edit ${sectionTitle} section`}
              </h1>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
                {isAr
                  ? 'املأ الحقول بالترتيب، ارفع الصور من مكانها داخل الحقل، ثم اضغط حفظ. كل خانة مكتوب فيها مثال يساعدك تعرف المطلوب.'
                  : 'Fill the fields in order, upload images directly inside their field, then save. Each input includes a helpful placeholder.'}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
              <Link to="/dashboard" className={ghostButtonClass}>
                <ArrowLeft className="h-4 w-4" />
                {isAr ? 'العودة للوحة التحكم' : 'Back to dashboard'}
              </Link>
              <div className="rounded-2xl border border-border bg-background p-3 text-sm">
                <p className="text-xs text-muted-foreground">{isAr ? 'القالب النشط' : 'Active template'}</p>
                <p className="mt-1 font-semibold text-foreground">
                  {String(myPortfolio?.templateName ?? (isAr ? 'لم يتم الاختيار بعد' : 'Not selected yet'))}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                {isAr ? 'بيانات القسم الأساسية' : 'Main section content'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAr ? 'هذه البيانات تظهر مباشرة داخل السيكشن في موقعك.' : 'These fields are shown directly inside this section on your site.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isImageUploading && (
                <p className="w-full text-xs font-medium text-amber-700 dark:text-amber-400">
                  {t('sectionEditor.waitingImageUpload')}
                </p>
              )}
              <button
                onClick={onSaveSection}
                disabled={upsertSectionMutation.isPending || isEditingLocked || isImageUploading}
                className={primaryButtonClass}
              >
                <Save className="h-4 w-4" />
                {upsertSectionMutation.isPending
                  ? t('sectionEditor.savingSection')
                  : isImageUploading
                    ? t('sectionEditor.waitingImageUpload')
                    : t('sectionEditor.saveSection')}
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {setSectionActiveMutation.isPending
                    ? isAr
                      ? 'جار التحديث...'
                      : 'Updating...'
                    : isAr
                      ? `ظهور القسم: ${isSectionActive ? 'مفتوح' : 'مغلق'}`
                      : `Visibility: ${isSectionActive ? 'Visible' : 'Hidden'}`}
                </span>
                <Switch
                  checked={isSectionActive}
                  disabled={setSectionActiveMutation.isPending}
                  onCheckedChange={(checked) => setSectionActiveMutation.mutate({ sectionName, active: checked })}
                />
              </div>
              <button
                onClick={() => clearSectionMutation.mutate(sectionName)}
                disabled={clearSectionMutation.isPending || isEditingLocked}
                className={ghostButtonClass}
              >
                <RotateCcw className="h-4 w-4" />
                {clearSectionMutation.isPending ? (isAr ? 'جار المسح...' : 'Clearing...') : isAr ? 'مسح القسم' : 'Clear section'}
              </button>
            </div>
          </div>

          {requiredKeys.length > 0 && (
            <div className="mb-5 flex items-start gap-2 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p>
                <span className="font-semibold text-foreground">{isAr ? 'حقول مطلوبة: ' : 'Required fields: '}</span>
                {requiredKeys.map((key) => titleCase(key, lang)).join(', ')}
              </p>
            </div>
          )}

          {isEditingLocked && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                {isAr
                  ? 'هذا السيكشن غير مفعّل حالياً. لتعديل الحقول أو البيانات، فعّل السيكشن أولاً من زر الظهور بالأعلى.'
                  : 'This section is currently inactive. Activate it from the visibility switch above before editing fields or data.'}
              </p>
            </div>
          )}

          {sectionLoading && <p className="text-xs text-muted-foreground mb-3">{isAr ? 'جار تحميل بيانات القسم...' : 'Loading section data...'}</p>}

          <div className="grid grid-cols-1 gap-4">
            {(restrictedSectionConfig
              ? restrictedSectionConfig.allowedKeys.map(
                (key) =>
                  [
                    key,
                    sectionForm[key] ??
                    defaultRestrictedFieldValue(key, restrictedSectionConfig.localizedKeys, languageMode),
                  ] as const,
              )
              : Object.entries(sectionForm)
            ).map(([key, value]) => (
              <DynamicField
                fieldKey={key}
                key={key}
                label={titleCase(key, lang)}
                value={value}
                onUploadImage={uploadImageAndGetPath}
                languageMode={languageMode}
                uiLang={lang}
                disabled={isEditingLocked}
                onChange={(next) => setSectionForm((prev) => ({ ...prev, [key]: next }))}
              />
            ))}
            {Object.keys(sectionForm).length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center">
                <p className="text-sm text-muted-foreground">{isAr ? 'لا توجد حقول للقسم بعد. اضغط حفظ للتهيئة.' : 'No section fields returned yet. Save to initialize.'}</p>
              </div>
            )}
          </div>

          {!isRestrictedSection && Array.isArray(sectionForm.images) && sectionForm.images.length > 0 && (
            <div className="mt-6 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-semibold text-foreground mb-3">{isAr ? 'صور القسم الحالية' : 'Current section images'}</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {sectionForm.images.map((imgPath, index) => (
                  <div key={`${imgPath}-${index}`} className="rounded-xl border border-border bg-card p-2">
                    <img src={imageFromPath(String(imgPath))} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImageFromSection(String(imgPath))}
                      className="w-full mt-2 rounded-lg border border-destructive/20 bg-destructive/5 py-1.5 text-xs font-semibold text-destructive"
                      disabled={isEditingLocked}
                    >
                      {isAr ? 'إزالة من القسم' : 'Remove from section'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {!isRestrictedSection && <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-2 border-b border-border pb-5">
            <h2 className="font-heading text-xl font-bold text-foreground">{isAr ? 'مكتبة الصور المؤقتة' : 'Temporary image library'}</h2>
            <p className="text-sm text-muted-foreground">
              {isAr
                ? 'ارفع الصور هنا لو عايز تستخدمها في القسم أو في عنصر من العناصر. الصور ستظهر ككروت صغيرة بدل ما تاخد عرض الصفحة.'
                : 'Upload images here if you want to reuse them in the section or an item. They appear as small cards instead of stretching across the page.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className={`${ghostButtonClass} ${isEditingLocked || isImageUploading ? 'pointer-events-none opacity-50' : ''}`}>
              <UploadCloud className="h-4 w-4" />
              {isImageUploading ? t('sectionEditor.uploadingImage') : isAr ? 'رفع صورة واحدة' : 'Upload one image'}
              <input type="file" accept="image/*" onChange={onUploadSingle} className="hidden" disabled={isEditingLocked || isImageUploading} />
            </label>
            <label className={`${ghostButtonClass} ${isEditingLocked || isImageUploading ? 'pointer-events-none opacity-50' : ''}`}>
              <ImagePlus className="h-4 w-4" />
              {isImageUploading ? t('sectionEditor.uploadingImage') : isAr ? 'رفع عدة صور' : 'Upload many images'}
              <input type="file" accept="image/*" multiple onChange={onUploadMultiple} className="hidden" disabled={isEditingLocked || isImageUploading} />
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {uploadedPaths.map((path) => (
              <div key={path} className="rounded-2xl border border-border bg-background p-2">
                <img src={imageFromPath(path)} alt="" className="w-full h-24 object-cover rounded-lg" />
                <div className="mt-2 flex flex-col gap-1">
                  <button onClick={() => addImageToSection(path)} className="rounded-lg border border-border bg-card py-1.5 text-xs font-semibold hover:text-primary disabled:opacity-50" disabled={isEditingLocked}>
                    {isAr ? 'استخدم في القسم' : 'Use in section'}
                  </button>
                  <button onClick={() => addImageToNewItem(path)} className="rounded-lg border border-border bg-card py-1.5 text-xs font-semibold hover:text-primary disabled:opacity-50" disabled={isEditingLocked}>
                    {isAr ? 'استخدم في العنصر' : 'Use in item'}
                  </button>
                  <button
                    onClick={() => deleteUploaded(path)}
                    className="rounded-lg border border-destructive/20 bg-destructive/5 py-1.5 text-xs font-semibold text-destructive"
                    disabled={deleteUploadedImageMutation.isPending || isEditingLocked}
                  >
                    {isAr ? 'حذف' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
            {uploadedPaths.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-background p-8 text-center">
                <ImagePlus className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">{isAr ? 'ارفع الصور وستظهر هنا كمعاينات صغيرة.' : 'Upload images and they will appear here as small previews.'}</p>
              </div>
            )}
          </div>
        </section>}

        {!isRestrictedSection && <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5 border-b border-border pb-5">
            <h2 className="font-heading text-xl font-bold text-foreground">{isAr ? 'عناصر القسم' : 'Section items'}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAr ? 'استخدم العناصر لما يكون السيكشن فيه أكثر من بطاقة، مشروع، خدمة، أو صورة.' : 'Use items when this section contains multiple cards, projects, services, or images.'}
            </p>
          </div>
          {itemsLoading && <p className="text-xs text-muted-foreground mb-3">{isAr ? 'جار تحميل العناصر...' : 'Loading items...'}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {items.map((item) => {
              const itemId = String(item.id || item._id || '');
              return (
                <div key={itemId} className="rounded-2xl border border-border bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">{isAr ? 'عنصر' : 'Item'} {itemId.slice(0, 8) || '#'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.keys(item)
                      .filter((k) => !['_id', 'id'].includes(k))
                      .slice(0, 4)
                      .map((k) => titleCase(k, lang))
                      .join(' | ') || (isAr ? 'لا توجد حقول' : 'No fields')}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => onEditItem(item)} className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold hover:text-primary disabled:opacity-50" disabled={isEditingLocked}>
                      {isAr ? 'تعديل' : 'Edit'}
                    </button>
                    <button
                      onClick={() => deleteItemMutation.mutate({ sectionName, itemId })}
                      disabled={deleteItemMutation.isPending || !itemId || isEditingLocked}
                      className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-1.5 text-xs font-semibold text-destructive disabled:opacity-50"
                    >
                      {isAr ? 'حذف' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center md:col-span-2">
                <p className="text-sm text-muted-foreground">{isAr ? 'لا توجد عناصر بعد. ابدأ بإضافة عنصر جديد من النموذج بالأسفل.' : 'No items yet. Start by adding a new item from the form below.'}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="font-heading text-lg font-bold text-foreground mb-3">{isAr ? 'إضافة عنصر جديد' : 'Add new item'}</h3>
              <div className="space-y-3">
                {Object.entries(newItemForm).map(([key, value]) => (
                  <DynamicField
                    fieldKey={key}
                    key={`new-${key}`}
                    label={titleCase(key, lang)}
                    value={value}
                    onUploadImage={uploadImageAndGetPath}
                    languageMode={languageMode}
                    uiLang={lang}
                    disabled={isEditingLocked}
                    onChange={(next) => setNewItemForm((prev) => ({ ...prev, [key]: next }))}
                  />
                ))}
              </div>
              <button
                onClick={onCreateItem}
                disabled={createItemMutation.isPending || isEditingLocked || isImageUploading}
                className={`${primaryButtonClass} mt-4`}
              >
                <Plus className="h-4 w-4" />
                {createItemMutation.isPending
                  ? t('sectionEditor.creatingItem')
                  : isImageUploading
                    ? t('sectionEditor.waitingImageUpload')
                    : t('sectionEditor.addItem')}
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <h3 className="font-heading text-lg font-bold text-foreground mb-3">{isAr ? 'تعديل العنصر المحدد' : 'Edit selected item'}</h3>
              <input
                value={editingItemId}
                onChange={(e) => setEditingItemId(e.target.value)}
                placeholder={isAr ? 'معرّف العنصر' : 'Item ID'}
                className={`${inputClass} mb-3 text-xs`}
                disabled={isEditingLocked}
              />
              <div className="space-y-3">
                {Object.entries(editingItemForm).map(([key, value]) => (
                  <DynamicField
                    fieldKey={key}
                    key={`edit-${key}`}
                    label={titleCase(key, lang)}
                    value={value}
                    onUploadImage={uploadImageAndGetPath}
                    languageMode={languageMode}
                    uiLang={lang}
                    disabled={isEditingLocked}
                    onChange={(next) => setEditingItemForm((prev) => ({ ...prev, [key]: next }))}
                  />
                ))}
                {Object.keys(editingItemForm).length === 0 && (
                  <p className="text-xs text-muted-foreground">{isAr ? 'اختر عنصرا من القائمة للتعديل.' : 'Select an item from the list to edit.'}</p>
                )}
              </div>
              <button
                onClick={onUpdateItem}
                disabled={updateItemMutation.isPending || !editingItemId || isEditingLocked || isImageUploading}
                className={`${primaryButtonClass} mt-4`}
              >
                <Save className="h-4 w-4" />
                {updateItemMutation.isPending
                  ? t('sectionEditor.updatingItem')
                  : isImageUploading
                    ? t('sectionEditor.waitingImageUpload')
                    : t('sectionEditor.updateItem')}
              </button>
            </div>
          </div>
        </section>}
      </main>
    </div>
  );
};

export default SectionEditor;

