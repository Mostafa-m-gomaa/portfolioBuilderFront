import type { Lang } from '@/i18n/translations';

export type CountryOption = {
  iso2: string;
  dialCode: string;
  nameAr: string;
  nameEn: string;
};

/** ISO-3166 alpha-2 codes with dial codes for signup, profile, and WhatsApp. */
export const COUNTRY_OPTIONS: CountryOption[] = [
  { iso2: 'AF', dialCode: '93', nameAr: 'أفغانستان', nameEn: 'Afghanistan' },
  { iso2: 'AL', dialCode: '355', nameAr: 'ألبانيا', nameEn: 'Albania' },
  { iso2: 'DZ', dialCode: '213', nameAr: 'الجزائر', nameEn: 'Algeria' },
  { iso2: 'AR', dialCode: '54', nameAr: 'الأرجنتين', nameEn: 'Argentina' },
  { iso2: 'AU', dialCode: '61', nameAr: 'أستراليا', nameEn: 'Australia' },
  { iso2: 'AT', dialCode: '43', nameAr: 'النمسا', nameEn: 'Austria' },
  { iso2: 'BH', dialCode: '973', nameAr: 'البحرين', nameEn: 'Bahrain' },
  { iso2: 'BD', dialCode: '880', nameAr: 'بنغلاديش', nameEn: 'Bangladesh' },
  { iso2: 'BE', dialCode: '32', nameAr: 'بلجيكا', nameEn: 'Belgium' },
  { iso2: 'BR', dialCode: '55', nameAr: 'البرازيل', nameEn: 'Brazil' },
  { iso2: 'BG', dialCode: '359', nameAr: 'بلغاريا', nameEn: 'Bulgaria' },
  { iso2: 'CA', dialCode: '1', nameAr: 'كندا', nameEn: 'Canada' },
  { iso2: 'CL', dialCode: '56', nameAr: 'تشيلي', nameEn: 'Chile' },
  { iso2: 'CN', dialCode: '86', nameAr: 'الصين', nameEn: 'China' },
  { iso2: 'CO', dialCode: '57', nameAr: 'كولومبيا', nameEn: 'Colombia' },
  { iso2: 'HR', dialCode: '385', nameAr: 'كرواتيا', nameEn: 'Croatia' },
  { iso2: 'CY', dialCode: '357', nameAr: 'قبرص', nameEn: 'Cyprus' },
  { iso2: 'CZ', dialCode: '420', nameAr: 'التشيك', nameEn: 'Czechia' },
  { iso2: 'DK', dialCode: '45', nameAr: 'الدنمارك', nameEn: 'Denmark' },
  { iso2: 'EG', dialCode: '20', nameAr: 'مصر', nameEn: 'Egypt' },
  { iso2: 'EE', dialCode: '372', nameAr: 'إستونيا', nameEn: 'Estonia' },
  { iso2: 'ET', dialCode: '251', nameAr: 'إثيوبيا', nameEn: 'Ethiopia' },
  { iso2: 'FI', dialCode: '358', nameAr: 'فنلندا', nameEn: 'Finland' },
  { iso2: 'FR', dialCode: '33', nameAr: 'فرنسا', nameEn: 'France' },
  { iso2: 'DE', dialCode: '49', nameAr: 'ألمانيا', nameEn: 'Germany' },
  { iso2: 'GH', dialCode: '233', nameAr: 'غانا', nameEn: 'Ghana' },
  { iso2: 'GR', dialCode: '30', nameAr: 'اليونان', nameEn: 'Greece' },
  { iso2: 'HK', dialCode: '852', nameAr: 'هونغ كونغ', nameEn: 'Hong Kong' },
  { iso2: 'HU', dialCode: '36', nameAr: 'المجر', nameEn: 'Hungary' },
  { iso2: 'IN', dialCode: '91', nameAr: 'الهند', nameEn: 'India' },
  { iso2: 'ID', dialCode: '62', nameAr: 'إندونيسيا', nameEn: 'Indonesia' },
  { iso2: 'IR', dialCode: '98', nameAr: 'إيران', nameEn: 'Iran' },
  { iso2: 'IQ', dialCode: '964', nameAr: 'العراق', nameEn: 'Iraq' },
  { iso2: 'IE', dialCode: '353', nameAr: 'أيرلندا', nameEn: 'Ireland' },
  { iso2: 'IT', dialCode: '39', nameAr: 'إيطاليا', nameEn: 'Italy' },
  { iso2: 'JP', dialCode: '81', nameAr: 'اليابان', nameEn: 'Japan' },
  { iso2: 'JO', dialCode: '962', nameAr: 'الأردن', nameEn: 'Jordan' },
  { iso2: 'KE', dialCode: '254', nameAr: 'كينيا', nameEn: 'Kenya' },
  { iso2: 'KW', dialCode: '965', nameAr: 'الكويت', nameEn: 'Kuwait' },
  { iso2: 'LB', dialCode: '961', nameAr: 'لبنان', nameEn: 'Lebanon' },
  { iso2: 'LY', dialCode: '218', nameAr: 'ليبيا', nameEn: 'Libya' },
  { iso2: 'MY', dialCode: '60', nameAr: 'ماليزيا', nameEn: 'Malaysia' },
  { iso2: 'MA', dialCode: '212', nameAr: 'المغرب', nameEn: 'Morocco' },
  { iso2: 'MX', dialCode: '52', nameAr: 'المكسيك', nameEn: 'Mexico' },
  { iso2: 'NL', dialCode: '31', nameAr: 'هولندا', nameEn: 'Netherlands' },
  { iso2: 'NZ', dialCode: '64', nameAr: 'نيوزيلندا', nameEn: 'New Zealand' },
  { iso2: 'NG', dialCode: '234', nameAr: 'نيجيريا', nameEn: 'Nigeria' },
  { iso2: 'NO', dialCode: '47', nameAr: 'النرويج', nameEn: 'Norway' },
  { iso2: 'OM', dialCode: '968', nameAr: 'عُمان', nameEn: 'Oman' },
  { iso2: 'PK', dialCode: '92', nameAr: 'باكستان', nameEn: 'Pakistan' },
  { iso2: 'PS', dialCode: '970', nameAr: 'فلسطين', nameEn: 'Palestine' },
  { iso2: 'PH', dialCode: '63', nameAr: 'الفلبين', nameEn: 'Philippines' },
  { iso2: 'PL', dialCode: '48', nameAr: 'بولندا', nameEn: 'Poland' },
  { iso2: 'PT', dialCode: '351', nameAr: 'البرتغال', nameEn: 'Portugal' },
  { iso2: 'QA', dialCode: '974', nameAr: 'قطر', nameEn: 'Qatar' },
  { iso2: 'RO', dialCode: '40', nameAr: 'رومانيا', nameEn: 'Romania' },
  { iso2: 'RU', dialCode: '7', nameAr: 'روسيا', nameEn: 'Russia' },
  { iso2: 'SA', dialCode: '966', nameAr: 'السعودية', nameEn: 'Saudi Arabia' },
  { iso2: 'SN', dialCode: '221', nameAr: 'السنغال', nameEn: 'Senegal' },
  { iso2: 'SG', dialCode: '65', nameAr: 'سنغافورة', nameEn: 'Singapore' },
  { iso2: 'ZA', dialCode: '27', nameAr: 'جنوب أفريقيا', nameEn: 'South Africa' },
  { iso2: 'KR', dialCode: '82', nameAr: 'كوريا الجنوبية', nameEn: 'South Korea' },
  { iso2: 'ES', dialCode: '34', nameAr: 'إسبانيا', nameEn: 'Spain' },
  { iso2: 'SD', dialCode: '249', nameAr: 'السودان', nameEn: 'Sudan' },
  { iso2: 'SE', dialCode: '46', nameAr: 'السويد', nameEn: 'Sweden' },
  { iso2: 'CH', dialCode: '41', nameAr: 'سويسرا', nameEn: 'Switzerland' },
  { iso2: 'SY', dialCode: '963', nameAr: 'سوريا', nameEn: 'Syria' },
  { iso2: 'TW', dialCode: '886', nameAr: 'تايوان', nameEn: 'Taiwan' },
  { iso2: 'TZ', dialCode: '255', nameAr: 'تنزانيا', nameEn: 'Tanzania' },
  { iso2: 'TH', dialCode: '66', nameAr: 'تايلاند', nameEn: 'Thailand' },
  { iso2: 'TN', dialCode: '216', nameAr: 'تونس', nameEn: 'Tunisia' },
  { iso2: 'TR', dialCode: '90', nameAr: 'تركيا', nameEn: 'Turkey' },
  { iso2: 'UG', dialCode: '256', nameAr: 'أوغندا', nameEn: 'Uganda' },
  { iso2: 'UA', dialCode: '380', nameAr: 'أوكرانيا', nameEn: 'Ukraine' },
  { iso2: 'AE', dialCode: '971', nameAr: 'الإمارات', nameEn: 'United Arab Emirates' },
  { iso2: 'GB', dialCode: '44', nameAr: 'المملكة المتحدة', nameEn: 'United Kingdom' },
  { iso2: 'US', dialCode: '1', nameAr: 'الولايات المتحدة', nameEn: 'United States' },
  { iso2: 'UY', dialCode: '598', nameAr: 'أوروغواي', nameEn: 'Uruguay' },
  { iso2: 'VE', dialCode: '58', nameAr: 'فنزويلا', nameEn: 'Venezuela' },
  { iso2: 'VN', dialCode: '84', nameAr: 'فيتنام', nameEn: 'Vietnam' },
  { iso2: 'YE', dialCode: '967', nameAr: 'اليمن', nameEn: 'Yemen' },
];

const countryByIso = new Map(COUNTRY_OPTIONS.map((country) => [country.iso2, country]));

export const getCountryOption = (iso2: string | null | undefined) =>
  countryByIso.get(String(iso2 ?? '').toUpperCase());

export const countryLabel = (iso2: string | null | undefined, lang: Lang) => {
  const country = getCountryOption(iso2);
  if (!country) return iso2 || '—';
  return lang === 'ar' ? country.nameAr : country.nameEn;
};

export const sortCountriesForDisplay = (lang: Lang) =>
  [...COUNTRY_OPTIONS].sort((a, b) => {
    const nameA = lang === 'ar' ? a.nameAr : a.nameEn;
    const nameB = lang === 'ar' ? b.nameAr : b.nameEn;
    return nameA.localeCompare(nameB, lang === 'ar' ? 'ar' : 'en', { sensitivity: 'base' });
  });
