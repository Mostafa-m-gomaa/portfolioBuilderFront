import { templateCatalog, type TemplateCatalogEntry } from "@/constants/templateCatalog";
import { translations, type Lang } from "@/i18n/translations";

export const CATEGORY_ORDER = [
  "general",
  "education",
  "technology",
  "business",
  "creative",
  "fitness",
  "medical",
  "legal",
  "restaurant",
  "construction",
  "travel",
] as const;

const NEWEST_TEMPLATE_PRIORITY = [
  "fund-glow",
  "estate-luxe",
  "avynor-dark",
  "academy-future",
  "expo-showcase",
  "edu-mon",
  "edu-vivid",
  "edu-wave",
  "brand-curve",
  "design-flow",
] as const;

const templateDisplayPriority = (templateName: string) => {
  const index = NEWEST_TEMPLATE_PRIORITY.indexOf(
    templateName as (typeof NEWEST_TEMPLATE_PRIORITY)[number],
  );
  return index === -1 ? NEWEST_TEMPLATE_PRIORITY.length : index;
};

const sortTemplatesNewestFirst = (templates: TemplateCatalogEntry[]) => {
  const catalogOrder = new Map(
    templateCatalog.map((template, index) => [template.templateName, index]),
  );

  return [...templates].sort((a, b) => {
    const priorityDiff =
      templateDisplayPriority(a.templateName) -
      templateDisplayPriority(b.templateName);
    if (priorityDiff !== 0) return priorityDiff;

    return (
      (catalogOrder.get(a.templateName) ?? 0) -
      (catalogOrder.get(b.templateName) ?? 0)
    );
  });
};

const TEMPLATE_NAMES_AR: Record<string, string> = {
  developer: "مطور تقني",
  designer: "مصمم جرافيك",
  "futuristic-3d": "تقني متقدم",
  "fitness-energy": "لياقة نشطة",
  "personal-trainer": "مدرب شخصي",
  "medical-doctor": "طبيب استشاري",
  "corporate-institution": "شركة مؤسسية",
  "lawyer-personal": "محامٍ",
  "law-firm": "مكتب محاماة",
  "restaurant-cafe": "مطعم وكافيه",
  "photographer-creative": "مصور محترف",
  "startup-saas": "شركة برمجيات",
  "universal-modern": "عصري شامل",
  "clean-white": "بسيط وأنيق",
  "freelancer-pro": "مستقل محترف",
  "construction-modern": "مقاولات عصرية",
  "ai-growth": "ذكاء اصطناعي",
  "travel-modern": "سفر وسياحة",
  "medical-care-modern": "رعاية صحية",
  "liquid-glass-security": "أمن رقمي",
  "depth-motion": "عرض ديناميكي",
  "universal-joy": "مرن وعصري",
  "contractor-onepage": "مقاول — صفحة واحدة",
  "bright-modern": "مشرق وعصري",
  "academy-future": "أكاديمية عصرية",
  "expo-showcase": "معارض وفعاليات",
  "edu-mon": "مركز دراسي",
  "edu-vivid": "تعليم تفاعلي",
  "edu-wave": "معهد حديث",
  "brand-curve": "هوية بصرية",
  "avynor-dark": "استوديو رقمي",
  "fund-glow": "استشارات تمويل",
  "estate-luxe": "عقارات فاخرة",
  "design-flow": "استوديو تصميم",
};

const SECTION_ALIASES: Record<string, string> = {
  testimonials: "testimonial",
};

const normalizeSectionKey = (sectionName: string) => {
  const key = sectionName.toLowerCase().trim().replace(/_/g, "-");
  return SECTION_ALIASES[key] ?? key;
};

export const prettyTemplateName = (value: string, lang: Lang = "en") => {
  if (lang === "ar" && TEMPLATE_NAMES_AR[value]) {
    return TEMPLATE_NAMES_AR[value];
  }
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export const templateDescription = (template: TemplateCatalogEntry, lang: Lang) =>
  lang === "ar" ? template.descAr : template.desc;

export const templateSelectorDescription = (
  template: TemplateCatalogEntry,
  category: string,
  lang: Lang,
) => {
  if (lang === "ar") {
    return `قالب ${prettyTemplateName(template.templateName, lang)} مناسب لفئة ${categoryLabel(category, lang)}.`;
  }
  return template.desc;
};

export const publicTemplateCardDescription = (category: string, lang: Lang, t: (key: string) => string) =>
  t("templates.cardDesc.public").replace("{category}", categoryLabel(category, lang));

export const sectionLabel = (sectionName: string, lang: Lang) => {
  const normalized = normalizeSectionKey(sectionName);
  const translationKey = `section.${normalized}`;
  const translated = translations[lang][translationKey];
  if (translated) return translated;

  const rawKey = `section.${sectionName.toLowerCase().trim().replace(/_/g, "-")}`;
  if (rawKey !== translationKey && translations[lang][rawKey]) {
    return translations[lang][rawKey];
  }

  const fallback = translations[lang]["section.fallback"];
  if (fallback) {
    return fallback.replace("{name}", prettyTemplateName(sectionName, lang));
  }

  return prettyTemplateName(sectionName, lang);
};

export const templatePreviewUrl = (templateName: string) =>
  `https://${templateName}.getsirty.com`;

export const categoryLabel = (category: string, lang: Lang) => {
  if (lang === "en") {
    return (
      (
        {
          general: "General",
          education: "Education",
          technology: "Technology",
          business: "Business",
          creative: "Creative",
          fitness: "Fitness",
          medical: "Medical",
          legal: "Legal",
          restaurant: "Restaurant & Cafe",
          construction: "Construction",
          travel: "Travel",
        } as Record<string, string>
      )[category] || category
    );
  }

  return (
    (
      {
        general: "عام",
        education: "تعليم",
        technology: "تقني",
        business: "أعمال",
        creative: "إبداعي",
        fitness: "لياقة",
        medical: "عيادات وطب",
        legal: "قانوني",
        restaurant: "مطاعم وكافيهات",
        construction: "إنشاءات",
        travel: "سفر",
      } as Record<string, string>
    )[category] || category
  );
};

export const showcaseTemplates = sortTemplatesNewestFirst(templateCatalog);

export const groupedTemplates = CATEGORY_ORDER.map((category) => ({
  category,
  templates: sortTemplatesNewestFirst(
    category === "general"
      ? templateCatalog
      : templateCatalog.filter((template) => template.category === category),
  ),
})).filter((group) => group.templates.length > 0);
