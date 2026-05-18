/** Stored on user account (`type`) — English slug for API / filters; labels for UI. */
export const ACCOUNT_TYPE_OPTIONS = [
  { value: "freelancer", labelAr: "مستقل (عام)", labelEn: "Freelancer (general)" },
  { value: "agency", labelAr: "شركة / وكالة", labelEn: "Agency / Company" },
  { value: "developer", labelAr: "مبرمج / مطوّر برمجيات", labelEn: "Software developer" },
  { value: "designer", labelAr: "مصمم جرافيك / واجهات", labelEn: "Graphic / UI designer" },
  { value: "teacher", labelAr: "مدرّس / معلّم", labelEn: "Teacher / Instructor" },
  { value: "doctor", labelAr: "طبيب", labelEn: "Doctor (physician)" },
  { value: "dentist", labelAr: "طبيب أسنان", labelEn: "Dentist" },
  { value: "lawyer", labelAr: "محامٍ / محامية", labelEn: "Lawyer" },
  { value: "engineer", labelAr: "مهندس", labelEn: "Engineer" },
  { value: "architect", labelAr: "مهندس معماري", labelEn: "Architect" },
  { value: "nurse", labelAr: "ممرض / ممرضة", labelEn: "Nurse" },
  { value: "pharmacist", labelAr: "صيدلي", labelEn: "Pharmacist" },
  { value: "student", labelAr: "طالب / طالبة", labelEn: "Student" },
  { value: "clinic", labelAr: "عيادة / مركز طبي", labelEn: "Clinic / Medical center" },
  { value: "marketer", labelAr: "مسوّق / تسويق رقمي", labelEn: "Marketer / digital marketing" },
  { value: "media_buyer", labelAr: "ميديا باير / إعلانات مدفوعة", labelEn: "Media buyer (paid ads)" },
  { value: "photographer", labelAr: "مصوّر فوتوغرافي", labelEn: "Photographer" },
  { value: "video_editor", labelAr: "مونتير / مُحرّر فيديو", labelEn: "Video editor" },
  { value: "studio", labelAr: "استوديو (تصوير / إنتاج)", labelEn: "Studio (photo / production)" },
  { value: "restaurant", labelAr: "مطعم / كافيه", labelEn: "Restaurant / café" },
  { value: "chef", labelAr: "شيف / طاهٍ محترف", labelEn: "Chef" },
  { value: "accountant", labelAr: "محاسب / محاسبة", labelEn: "Accountant" },
  { value: "consultant", labelAr: "مستشار أعمال", labelEn: "Business consultant" },
  { value: "writer", labelAr: "كاتب / محرّر", labelEn: "Writer / editor" },
  { value: "content_creator", labelAr: "صانع محتوى", labelEn: "Content creator" },
  { value: "blogger", labelAr: "مدوّن", labelEn: "Blogger" },
  { value: "real_estate", labelAr: "عقارات / وسيط عقاري", labelEn: "Real estate agent" },
  { value: "fitness_trainer", labelAr: "مدرب لياقة / Personal trainer", labelEn: "Fitness / personal trainer" },
  { value: "beauty_salon", labelAr: "صالون تجميل / سبا", labelEn: "Beauty salon / spa" },
  { value: "retail", labelAr: "متجر / تجارة تجزئة", labelEn: "Retail store" },
  { value: "ecommerce", labelAr: "متجر إلكتروني / E‑commerce", labelEn: "E‑commerce" },
  { value: "hr", labelAr: "موارد بشرية / توظيف", labelEn: "HR / recruiting" },
  { value: "sales", labelAr: "مبيعات / مندوب مبيعات", labelEn: "Sales" },
  { value: "translator", labelAr: "مترجم", labelEn: "Translator" },
  { value: "musician", labelAr: "موسيقي / عازف", labelEn: "Musician / performer" },
  { value: "event_planner", labelAr: "منسّق فعاليات", labelEn: "Event planner" },
  { value: "interior_designer", labelAr: "مصمم ديكور داخلي", labelEn: "Interior designer" },
  { value: "data_analyst", labelAr: "محلل بيانات", labelEn: "Data analyst" },
  { value: "project_manager", labelAr: "مدير مشاريع", labelEn: "Project manager" },
  { value: "coach", labelAr: "كوتش / مدرب حياة", labelEn: "Coach / life coach" },
  { value: "psychologist", labelAr: "أخصائي نفسي / معالج", labelEn: "Psychologist / therapist" },
  { value: "veterinarian", labelAr: "طبيب بيطري", labelEn: "Veterinarian" },
  { value: "contractor", labelAr: "مقاول / بناء وتشييد", labelEn: "Contractor / construction" },
  { value: "electrician", labelAr: "كهربائي", labelEn: "Electrician" },
  { value: "plumber", labelAr: "سبّاك", labelEn: "Plumber" },
  { value: "driver", labelAr: "سائق / توصيل", labelEn: "Driver / delivery" },
  { value: "other", labelAr: "أخرى", labelEn: "Other" },
] as const;

export type AccountTypeValue = (typeof ACCOUNT_TYPE_OPTIONS)[number]["value"];

type Lang = "ar" | "en";

/** Label for profile / tables; falls back to raw value or generic creator label. */
export function getAccountTypeLabel(
  value: string | null | undefined,
  lang: Lang,
): string {
  const raw = value?.trim();
  if (!raw) return lang === "ar" ? "منشئ" : "Creator";
  const key = raw.toLowerCase();
  const found = ACCOUNT_TYPE_OPTIONS.find((o) => o.value === key);
  if (found) return lang === "ar" ? found.labelAr : found.labelEn;
  return raw;
}
