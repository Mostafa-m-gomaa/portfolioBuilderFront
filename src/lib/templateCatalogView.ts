import { templateCatalog, type TemplateCatalogEntry } from "@/constants/templateCatalog";
import type { Lang } from "@/i18n/translations";

export const CATEGORY_ORDER = [
  "general",
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

const TEMPLATE_NAMES_AR: Record<string, string> = {
  developer: "مطور",
  designer: "مصمم",
  "futuristic-3d": "ثلاثي الأبعاد المستقبلي",
  "fitness-energy": "طاقة اللياقة",
  "personal-trainer": "مدرب شخصي",
  "medical-doctor": "طبيب",
  "corporate-institution": "مؤسسة شركات",
  "lawyer-personal": "محامٍ شخصي",
  "law-firm": "مكتب محاماة",
  "restaurant-cafe": "مطعم ومقهى",
  "photographer-creative": "مصور مبدع",
  "startup-saas": "شركة SaaS ناشئة",
  "universal-modern": "عصري شامل",
  "clean-white": "أبيض نظيف",
  "freelancer-pro": "مستقل محترف",
  "construction-modern": "إنشاءات عصري",
  "ai-growth": "نمو الذكاء الاصطناعي",
  "travel-modern": "سفر عصري",
  "medical-care-modern": "رعاية طبية عصرية",
  "liquid-glass-security": "زجاج سائل وأمن",
  "depth-motion": "عمق وحركة",
  "universal-joy": "فرح شامل",
  "contractor-onepage": "مقاول صفحة واحدة",
  "bright-modern": "عصري مشرق",
};

const SECTION_LABELS: Record<string, { ar: string; en: string }> = {
  hero: { ar: "الواجهة", en: "Hero" },
  about: { ar: "نبذة", en: "About" },
  services: { ar: "الخدمات", en: "Services" },
  portfolio: { ar: "الأعمال", en: "Portfolio" },
  projects: { ar: "المشاريع", en: "Projects" },
  contact: { ar: "التواصل", en: "Contact" },
  testimonials: { ar: "آراء العملاء", en: "Testimonials" },
  skills: { ar: "المهارات", en: "Skills" },
  experience: { ar: "الخبرة", en: "Experience" },
  education: { ar: "التعليم", en: "Education" },
  gallery: { ar: "المعرض", en: "Gallery" },
  blog: { ar: "المدونة", en: "Blog" },
  faq: { ar: "الأسئلة الشائعة", en: "FAQ" },
  team: { ar: "الفريق", en: "Team" },
  pricing: { ar: "الأسعار", en: "Pricing" },
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
  const key = sectionName.toLowerCase();
  const entry = SECTION_LABELS[key];
  if (entry) return lang === "ar" ? entry.ar : entry.en;
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

export const groupedTemplates = CATEGORY_ORDER.map((category) => ({
  category,
  templates: templateCatalog.filter(
    (template) => template.category === category,
  ),
})).filter((group) => group.templates.length > 0);
