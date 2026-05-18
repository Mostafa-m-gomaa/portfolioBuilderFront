export type TemplateCatalogEntry = {
  templateName: string;
  image: string;
  desc: string;
  category:
    | "general"
    | "fitness"
    | "medical"
    | "legal"
    | "business"
    | "restaurant"
    | "creative"
    | "construction"
    | "travel"
    | "technology";
};

const templateImage = (fileName: string) =>
  new URL(`../assets/templates/${fileName}`, import.meta.url).href;

export const templateCatalog: TemplateCatalogEntry[] = [
  {
    templateName: "developer",
    image: templateImage("developer.png"),
    desc: "A practical portfolio for developers, engineers, and technical freelancers.",
    category: "general",
  },
  {
    templateName: "designer",
    image: templateImage("designer.png"),
    desc: "A visual portfolio for designers who need to highlight selected work clearly.",
    category: "creative",
  },
  {
    templateName: "futuristic-3d",
    image: templateImage("futuristic-3d.png"),
    desc: "A bold technology layout for modern products, AI tools, and digital services.",
    category: "technology",
  },
  {
    templateName: "fitness-energy",
    image: templateImage("fitness-energy.png"),
    desc: "An energetic template for gyms, coaches, and fitness programs.",
    category: "fitness",
  },
  {
    templateName: "personal-trainer",
    image: templateImage("personal-trainer.png"),
    desc: "A focused personal trainer site with services, results, and contact details.",
    category: "fitness",
  },
  {
    templateName: "medical-doctor",
    image: templateImage("medical-doctor.png"),
    desc: "A clean medical profile for doctors, clinics, and healthcare specialists.",
    category: "medical",
  },
  {
    templateName: "corporate-institution",
    image: templateImage("corporate-institution.png"),
    desc: "A structured corporate template for companies, institutions, and service teams.",
    category: "business",
  },
  {
    templateName: "lawyer-personal",
    image: templateImage("lawyer-personal.png"),
    desc: "A professional profile for lawyers and legal consultants.",
    category: "legal",
  },
  {
    templateName: "law-firm",
    image: templateImage("law-firm.png"),
    desc: "A polished firm website for legal services, practice areas, and contact requests.",
    category: "legal",
  },
  {
    templateName: "restaurant-cafe",
    image: templateImage("restaurant-cafe.png"),
    desc: "A warm restaurant and cafe layout for menus, atmosphere, and reservations.",
    category: "restaurant",
  },
  {
    templateName: "photographer-creative",
    image: templateImage("photographer-creative.png"),
    desc: "A portfolio-first template for photographers and visual creators.",
    category: "creative",
  },
  {
    templateName: "startup-saas",
    image: templateImage("startup-saas.png"),
    desc: "A SaaS landing template for startups, product launches, and software services.",
    category: "technology",
  },
  {
    templateName: "universal-modern",
    image: templateImage("universal-modern.png"),
    desc: "A flexible modern layout that works for many personal and business profiles.",
    category: "general",
  },
  {
    templateName: "clean-white",
    image: templateImage("clean-white.png"),
    desc: "A minimal clean template for simple, direct professional presentation.",
    category: "general",
  },
  {
    templateName: "freelancer-pro",
    image: templateImage("freelancer-pro.png"),
    desc: "A freelancer profile designed to present services, work samples, and contact options.",
    category: "general",
  },
  {
    templateName: "construction-modern",
    image: templateImage("construction-modern.png"),
    desc: "A strong construction layout for contractors, projects, and company information.",
    category: "construction",
  },
  {
    templateName: "ai-growth",
    image: templateImage("ai-growth.png"),
    desc: "A technology growth template for AI, automation, and consulting services.",
    category: "technology",
  },
  {
    templateName: "travel-modern",
    image: templateImage("travel-modern.png"),
    desc: "A modern travel layout for agencies, guides, and destination-based services.",
    category: "travel",
  },
  {
    templateName: "medical-care-modern",
    image: templateImage("medical-care-modern.png"),
    desc: "A healthcare service template for clinics, care centers, and medical teams.",
    category: "medical",
  },
  {
    templateName: "liquid-glass-security",
    image: templateImage("liquid-glass-security.png"),
    desc: "A sleek technology template for security, infrastructure, and software services.",
    category: "technology",
  },
  {
    templateName: "depth-motion",
    image: templateImage("depth-motion.png"),
    desc: "A premium visual layout for creators, consultants, and modern service brands.",
    category: "general",
  },
];
