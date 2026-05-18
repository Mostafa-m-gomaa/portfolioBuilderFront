import { templateCatalog } from "@/constants/templateCatalog";

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

export const prettyTemplateName = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const templatePreviewUrl = (templateName: string) =>
  `https://${templateName}.getsirty.com`;

export const categoryLabel = (category: string, isAr: boolean) => {
  if (!isAr) {
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
