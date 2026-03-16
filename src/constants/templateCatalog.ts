export type TemplateCatalogEntry = {
  templateName: string;
  image: string;
  desc: string;
};

const DEFAULT_TEMPLATE_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";

export const templateCatalog: TemplateCatalogEntry[] = [
  {
    templateName: "developer",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for developer template.",
  },
  {
    templateName: "designer",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for designer template.",
  },
  {
    templateName: "futuristic-3d",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for futuristic-3d template.",
  },
  {
    templateName: "fitness-energy",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for fitness-energy template.",
  },
  {
    templateName: "personal-trainer",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for personal-trainer template.",
  },
  {
    templateName: "medical-doctor",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for medical-doctor template.",
  },
  {
    templateName: "corporate-institution",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for corporate-institution template.",
  },
  {
    templateName: "lawyer-personal",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for lawyer-personal template.",
  },
  {
    templateName: "law-firm",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for law-firm template.",
  },
  {
    templateName: "restaurant-cafe",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for restaurant-cafe template.",
  },
  {
    templateName: "photographer-creative",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for photographer-creative template.",
  },
  {
    templateName: "startup-saas",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for startup-saas template.",
  },
  {
    templateName: "universal-modern",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for universal-modern template.",
  },
  {
    templateName: "clean-white",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for clean-white template.",
  },
  {
    templateName: "freelancer-pro",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for freelancer-pro template.",
  },
  {
    templateName: "construction-modern",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for construction-modern template.",
  },
  {
    templateName: "ai-growth",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for ai-growth template.",
  },
  {
    templateName: "travel-modern",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for travel-modern template.",
  },
  {
    templateName: "medical-care-modern",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for medical-care-modern template.",
  },
  {
    templateName: "liquid-glass-security",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for liquid-glass-security template.",
  },
  {
    templateName: "bento-fusion",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for bento-fusion template.",
  },
  {
    templateName: "depth-motion",
    image: DEFAULT_TEMPLATE_IMAGE,
    desc: "Default description for depth-motion template.",
  },
];
