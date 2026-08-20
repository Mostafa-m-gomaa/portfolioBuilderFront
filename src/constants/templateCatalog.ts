export type TemplateCatalogEntry = {
  templateName: string;
  image: string;
  desc: string;
  descAr: string;
  category:
    | "general"
    | "education"
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

const templatePreviewScreenshot = (templateName: string) =>
  `https://image.thum.io/get/width/800/noanimate/https://${templateName}.getsirty.com`;

export const templateCatalog: TemplateCatalogEntry[] = [
  {
    templateName: "bloom-fluid",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1784654574/Screenshot_2026-07-21_at_8.22.33_PM_dn5gd3.png",
    desc: "A fluid dark portfolio with soft bloom light and bold centered typography.",
    descAr: "بورتفوليو داكن بانسياب ضوئي ناعم وخطوط عريضة في المنتصف.",
    category: "creative",
  },
  {
    templateName: "bloom-aura",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1784654715/Screenshot_2026-07-21_at_8.24.38_PM_xupebc.png",
    desc: "A dark aura layout with glowing accents and a focused hero portrait.",
    descAr: "تصميم هالة داكنة مع لمسات مضيئة وصورة بطولية مركّزة.",
    category: "creative",
  },
  {
    templateName: "bloom-silk",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1784654808/Screenshot_2026-07-21_at_8.25.24_PM_grwbuq.png",
    desc: "A silk-dark creative template with smoky light trails and premium polish.",
    descAr: "قالب إبداعي داكن حريري بمسارات ضوء دخانية ولمسة فاخرة.",
    category: "creative",
  },
  {
    templateName: "bloom-studio",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1784654844/Screenshot_2026-07-21_at_8.26.32_PM_kzj7e5.png",
    desc: "A light studio portfolio with grid atmosphere and purple accent details.",
    descAr: "بورتفوليو استوديو فاتح بخلفية شبكية وتفاصيل بنفسجية.",
    category: "creative",
  },
  {
    templateName: "nova-prime",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1784654975/Screenshot_2026-07-21_at_8.28.52_PM_budv8y.png",
    desc: "A premium dark showcase with flowing color bends and cinematic depth.",
    descAr: "عرض فاخر داكن بألوان منسابة وعمق سينمائي.",
    category: "creative",
  },
  {
    templateName: "story-studio",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1784655137/Screenshot_2026-07-21_at_8.30.55_PM_mm7m61.png",
    desc: "An elegant light editorial template with serif headlines and calm whitespace.",
    descAr: "قالب تحريري أنيق بخطوط سيريف ومساحات هادئة.",
    category: "creative",
  },
  {
    templateName: "developer",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455734/developer_fvkldc.png",
    desc: "A practical portfolio for developers, engineers, and technical freelancers.",
    descAr: "بورتفوليو عملي للمطورين والمهندسين والمستقلين التقنيين.",
    category: "general",
  },
  {
    templateName: "designer",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455668/designer_v29npv.png",
    desc: "A visual portfolio for designers who need to highlight selected work clearly.",
    descAr: "بورتفوليو بصري للمصممين لعرض الأعمال المختارة بوضوح.",
    category: "creative",
  },
  {
    templateName: "futuristic-3d",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455728/futuristic-3d_wojbxe.png",
    desc: "A bold technology layout for modern products, AI tools, and digital services.",
    descAr:
      "تصميم تقني جريء للمنتجات الحديثة وأدوات الذكاء الاصطناعي والخدمات الرقمية.",
    category: "technology",
  },
  {
    templateName: "fitness-energy",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456029/fitness-energy_d5btkr.png",
    desc: "An energetic template for gyms, coaches, and fitness programs.",
    descAr: "قالب نشيط للصالات الرياضية والمدربين وبرامج اللياقة.",
    category: "fitness",
  },
  {
    templateName: "personal-trainer",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455904/personal-trainer_y1ll66.png",
    desc: "A focused personal trainer site with services, results, and contact details.",
    descAr: "موقع مركّز لمدرب شخصي مع الخدمات والنتائج وبيانات التواصل.",
    category: "fitness",
  },
  {
    templateName: "medical-doctor",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455986/medical-doctor_mx7ncx.png",
    desc: "A clean medical profile for doctors, clinics, and healthcare specialists.",
    descAr: "ملف طبي نظيف للأطباء والعيادات والمتخصصين في الرعاية الصحية.",
    category: "medical",
  },
  {
    templateName: "corporate-institution",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455693/corporate-institution_q0cdf5.png",
    desc: "A structured corporate template for companies, institutions, and service teams.",
    descAr: "قالب مؤسسي منظم للشركات والمؤسسات وفرق الخدمات.",
    category: "business",
  },
  {
    templateName: "lawyer-personal",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455806/lawyer-personal_evkg5t.png",
    desc: "A professional profile for lawyers and legal consultants.",
    descAr: "ملف مهني للمحامين والمستشارين القانونيين.",
    category: "legal",
  },
  {
    templateName: "law-firm",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455930/law-firm_ohntbg.png",
    desc: "A polished firm website for legal services, practice areas, and contact requests.",
    descAr:
      "موقع مكتب محاماة أنيق للخدمات القانونية ومجالات الممارسة وطلبات التواصل.",
    category: "legal",
  },
  {
    templateName: "restaurant-cafe",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456219/restaurant-cafe_yzz1vf.png",
    desc: "A warm restaurant and cafe layout for menus, atmosphere, and reservations.",
    descAr: "تصميم دافئ للمطاعم والكافيهات مع القوائم والأجواء والحجوزات.",
    category: "restaurant",
  },
  {
    templateName: "photographer-creative",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456137/photographer-creative_vhw1mt.png",
    desc: "A portfolio-first template for photographers and visual creators.",
    descAr: "قالب يبرز الأعمال للمصورين والمبدعين البصريين.",
    category: "creative",
  },
  {
    templateName: "startup-saas",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456134/startup-saas_gzpupy.png",
    desc: "A SaaS landing template for startups, product launches, and software services.",
    descAr: "صفحة هبوط لشركات SaaS والمنتجات الناشئة وخدمات البرمجيات.",
    category: "technology",
  },
  {
    templateName: "universal-modern",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455981/universal-modern_wrsp7f.png",
    desc: "A flexible modern layout that works for many personal and business profiles.",
    descAr: "تصميم عصري مرن يناسب ملفات شخصية وأعمال متعددة.",
    category: "general",
  },
  {
    templateName: "clean-white",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456064/clean-white_pikopj.png",
    desc: "A minimal clean template for simple, direct professional presentation.",
    descAr: "قالب بسيط ونظيف لعرض مهني مباشر.",
    category: "general",
  },
  {
    templateName: "freelancer-pro",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455826/freelancer-pro_x9m7tk.png",
    desc: "A freelancer profile designed to present services, work samples, and contact options.",
    descAr: "ملف مستقل لعرض الخدمات ونماذج الأعمال وخيارات التواصل.",
    category: "general",
  },
  {
    templateName: "construction-modern",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455656/construction-modern_zfevyp.png",
    desc: "A strong construction layout for contractors, projects, and company information.",
    descAr: "تصميم قوي للمقاولين والمشاريع ومعلومات الشركة.",
    category: "construction",
  },
  {
    templateName: "ai-growth",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455954/ai-growth_hqjslc.png",
    desc: "A technology growth template for AI, automation, and consulting services.",
    descAr: "قالب نمو تقني لخدمات الذكاء الاصطناعي والأتمتة والاستشارات.",
    category: "technology",
  },
  {
    templateName: "travel-modern",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455945/travel-modern_va1opg.png",
    desc: "A modern travel layout for agencies, guides, and destination-based services.",
    descAr: "تصميم سفر عصري للوكالات والمرشدين وخدمات الوجهات.",
    category: "travel",
  },
  {
    templateName: "medical-care-modern",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456172/medical-care-modern_u3nm8a.png",
    desc: "A healthcare service template for clinics, care centers, and medical teams.",
    descAr: "قالب رعاية صحية للعيادات ومراكز الرعاية والفرق الطبية.",
    category: "medical",
  },
  {
    templateName: "liquid-glass-security",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455439/liquid-glass_xxxpwp.png",
    desc: "A sleek technology template for security, infrastructure, and software services.",
    descAr: "قالب تقني أنيق للأمن والبنية التحتية وخدمات البرمجيات.",
    category: "technology",
  },
  {
    templateName: "depth-motion",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779455660/depth-motion_owknfv.png",
    desc: "A premium visual layout for creators, consultants, and modern service brands.",
    descAr: "تصميم بصري راقٍ للمبدعين والمستشارين والعلامات الحديثة.",
    category: "general",
  },
  {
    templateName: "universal-joy",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456419/Screenshot_2026-05-22_at_4.26.32_PM_igscx9.png",
    desc: "A premium visual layout for creators, consultants, and modern service brands.",
    descAr: "تصميم عصري مرن يناسب ملفات شخصية وأعمال متعددة.",
    category: "general",
  },
  {
    templateName: "contractor-onepage",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456341/Screenshot_2026-05-22_at_4.24.45_PM_w9jryv.png",
    desc: "A premium visual layout for creators, consultants, and modern service brands.",
    descAr: "صفحة واحدة للمقاولين لعرض الخدمات والمشاريع والتواصل.",
    category: "construction",
  },
  {
    templateName: "bright-modern",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1779456584/Screenshot_2026-05-22_at_4.29.12_PM_vuk3jn.png",
    desc: "A premium visual layout for creators, consultants, and modern service brands.",
    descAr: "تصميم مشرق وعصري لعرض مهني واضح وجذاب.",
    category: "general",
  },
  {
    templateName: "academy-future",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781024140/Screenshot_2026-06-09_at_7.54.00_PM_hilqdr.png",
    desc: "A future-forward education template for academies, teachers, and training centers.",
    descAr: "قالب تعليمي عصري للأكاديميات والمدرسين ومراكز التدريب.",
    category: "education",
  },
  {
    templateName: "edu-mon",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781024117/Screenshot_2026-06-09_at_7.52.11_PM_gfulxk.png",
    desc: "A friendly education layout for Arabic centers and school support programs.",
    descAr: "قالب تعليمي ودود لمراكز اللغة العربية وبرامج الدعم المدرسي.",
    category: "education",
  },
  {
    templateName: "edu-vivid",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781024100/Screenshot_2026-06-09_at_7.51.43_PM_lvctyh.png",
    desc: "A vivid learning template for workshops, courses, and teacher-led programs.",
    descAr: "قالب تعليمي نابض لورش العمل والدورات والبرامج التعليمية.",
    category: "education",
  },
  {
    templateName: "edu-wave",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781024084/Screenshot_2026-06-09_at_7.51.29_PM_hffmhv.png",
    desc: "A modern institute template for structured courses and enrollment flows.",
    descAr: "قالب معهد تعليمي حديث للدورات المنظمة ومسارات التسجيل.",
    category: "education",
  },
  {
    templateName: "expo-showcase",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781024520/Screenshot_2026-06-09_at_8.01.24_PM_suxujp.png",
    desc: "An exhibition and events template for booths, conferences, and brand activations.",
    descAr: "قالب معارض وفعاليات للأجنحة والمؤتمرات والتنفيذ الميداني.",
    category: "business",
  },
  {
    templateName: "fund-glow",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781023935/Screenshot_2026-06-09_at_7.50.22_PM_jnphdj.png",
    desc: "A funding and growth advisory template for startups and investor readiness.",
    descAr: "قالب استشارات نمو وتمويل للشركات الناشئة والاستعداد للمستثمرين.",
    category: "business",
  },
  {
    templateName: "estate-luxe",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781023897/Screenshot_2026-06-09_at_7.50.05_PM_afutsp.png",
    desc: "A premium real estate template for developers, sales offices, and property listings.",
    descAr: "قالب عقاري فاخر للمطورين ومكاتب المبيعات وعروض الوحدات.",
    category: "business",
  },
  {
    templateName: "brand-curve",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781024068/Screenshot_2026-06-09_at_7.51.03_PM_hamygz.png",
    desc: "A curved brand studio layout for identities, packaging, and campaign design.",
    descAr: "قالب استوديو تصميم للهويات البصرية والتغليف والحملات الإبداعية.",
    category: "creative",
  },
  {
    templateName: "design-flow",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781023673/Screenshot_2026-06-09_at_7.47.29_PM_ccgtuq.png",
    desc: "A creative studio template for visual identity, campaigns, and modern brand work.",
    descAr:
      "قالب استوديو إبداعي للهوية البصرية والحملات وعمل العلامات الحديثة.",
    category: "creative",
  },
  {
    templateName: "avynor-dark",
    image:
      "https://res.cloudinary.com/dsv5ldoji/image/upload/v1781023967/Screenshot_2026-06-09_at_7.50.42_PM_xjeyyw.png",
    desc: "A dark technology template for product studios and engineering teams.",
    descAr: "قالب تقني داكن لاستوديوهات المنتجات وفرق الهندسة.",
    category: "technology",
  },
];
