import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'ar' | 'en';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations: Record<Lang, Record<string, string>> = {
  ar: {
    // Navbar
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.services': 'خدماتنا',
    'nav.pricing': 'الأسعار',
    'nav.contact': 'تواصل معنا',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.getStarted': 'ابدأ الآن',

    // Hero
    'hero.title': 'أنشئ بورتفوليو مذهل',
    'hero.titleHighlight': 'في دقائق',
    'hero.subtitle': 'منصة متقدمة لبناء مواقع البورتفوليو الاحترافية بسهولة تامة. صمم، خصّص، وانشر موقعك بأسلوب فريد.',
    'hero.cta1': 'ابدأ مجاناً',
    'hero.cta2': 'شاهد العرض',

    // Features
    'features.title': 'ما نقدمه لك',
    'features.subtitle': 'أدوات متقدمة لبناء بورتفوليو استثنائي',
    'features.1.title': 'تصاميم مذهلة',
    'features.1.desc': 'قوالب احترافية مصممة بعناية لتناسب جميع المجالات الإبداعية.',
    'features.2.title': 'تخصيص كامل',
    'features.2.desc': 'عدّل كل عنصر ليعكس هويتك الفريدة بسهولة تامة.',
    'features.3.title': 'نشر فوري',
    'features.3.desc': 'انشر موقعك بنقرة واحدة مع دومين مخصص وأداء عالي.',
    'features.4.title': 'تحليلات ذكية',
    'features.4.desc': 'تتبع زوارك واحصل على رؤى قيمة لتحسين حضورك الرقمي.',

    // How it works
    'how.title': 'كيف يعمل؟',
    'how.subtitle': 'ثلاث خطوات بسيطة لإنشاء بورتفوليو احترافي',
    'how.1.title': 'اختر قالباً',
    'how.1.desc': 'تصفح مكتبة القوالب واختر التصميم المناسب لمجالك.',
    'how.2.title': 'خصّص المحتوى',
    'how.2.desc': 'أضف مشاريعك وخبراتك وعدّل التصميم حسب ذوقك.',
    'how.3.title': 'انشر وشارك',
    'how.3.desc': 'انشر موقعك بنقرة واحدة وشاركه مع العالم.',

    // Pricing
    'pricing.title': 'خطط الأسعار',
    'pricing.subtitle': 'اختر الخطة المناسبة لاحتياجاتك',
    'pricing.free': 'مجاني',
    'pricing.pro': 'احترافي',
    'pricing.business': 'أعمال',
    'pricing.month': '/شهر',
    'pricing.cta': 'ابدأ الآن',
    'pricing.popular': 'الأكثر شعبية',

    // Testimonials
    'testimonials.title': 'ماذا يقول عملاؤنا',
    'testimonials.subtitle': 'آراء حقيقية من مستخدمين حقيقيين',

    // CTA
    'cta.title': 'جاهز لبناء بورتفوليو أحلامك؟',
    'cta.subtitle': 'انضم لآلاف المبدعين الذين يثقون بمنصتنا',
    'cta.button': 'ابدأ مجاناً الآن',

    // Footer
    'footer.description': 'منصة متقدمة لبناء مواقع البورتفوليو الاحترافية',
    'footer.links': 'روابط سريعة',
    'footer.legal': 'قانوني',
    'footer.terms': 'شروط الاستخدام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.rights': 'جميع الحقوق محفوظة',

    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم الكامل',
    'auth.google': 'المتابعة مع جوجل',
    'auth.or': 'أو',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',

    // Pages
    'about.title': 'من نحن',
    'about.subtitle': 'نحن فريق شغوف بتمكين المبدعين من عرض أعمالهم بأفضل صورة',
    'services.title': 'خدماتنا',
    'services.subtitle': 'نقدم مجموعة شاملة من الأدوات والخدمات',
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'نسعد بالإجابة على استفساراتك',
    'contact.send': 'إرسال الرسالة',
    'contact.message': 'رسالتك',
    'getStarted.title': 'كيف تبدأ',
    'getStarted.subtitle': 'دليلك الشامل للبدء في بناء بورتفوليو احترافي',
    'terms.title': 'شروط الاستخدام',
    'privacy.title': 'سياسة الخصوصية',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    'nav.getStarted': 'Get Started',

    'hero.title': 'Build a Stunning Portfolio',
    'hero.titleHighlight': 'in Minutes',
    'hero.subtitle': 'An advanced platform to build professional portfolio websites effortlessly. Design, customize, and publish your unique site.',
    'hero.cta1': 'Start for Free',
    'hero.cta2': 'Watch Demo',

    'features.title': 'What We Offer',
    'features.subtitle': 'Advanced tools to build an exceptional portfolio',
    'features.1.title': 'Stunning Designs',
    'features.1.desc': 'Professional templates crafted to suit all creative fields.',
    'features.2.title': 'Full Customization',
    'features.2.desc': 'Modify every element to reflect your unique identity with ease.',
    'features.3.title': 'Instant Publishing',
    'features.3.desc': 'Publish your site with one click, with a custom domain and high performance.',
    'features.4.title': 'Smart Analytics',
    'features.4.desc': 'Track your visitors and get valuable insights to improve your digital presence.',

    'how.title': 'How It Works',
    'how.subtitle': 'Three simple steps to create a professional portfolio',
    'how.1.title': 'Choose a Template',
    'how.1.desc': 'Browse the template library and pick the design that suits your field.',
    'how.2.title': 'Customize Content',
    'how.2.desc': 'Add your projects and experiences, and adjust the design to your taste.',
    'how.3.title': 'Publish & Share',
    'how.3.desc': 'Publish your site with one click and share it with the world.',

    'pricing.title': 'Pricing Plans',
    'pricing.subtitle': 'Choose the plan that fits your needs',
    'pricing.free': 'Free',
    'pricing.pro': 'Pro',
    'pricing.business': 'Business',
    'pricing.month': '/mo',
    'pricing.cta': 'Get Started',
    'pricing.popular': 'Most Popular',

    'testimonials.title': 'What Our Users Say',
    'testimonials.subtitle': 'Real reviews from real users',

    'cta.title': 'Ready to Build Your Dream Portfolio?',
    'cta.subtitle': 'Join thousands of creatives who trust our platform',
    'cta.button': 'Start Free Now',

    'footer.description': 'An advanced platform for building professional portfolio websites',
    'footer.links': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Use',
    'footer.privacy': 'Privacy Policy',
    'footer.rights': 'All rights reserved',

    'auth.login': 'Log In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.google': 'Continue with Google',
    'auth.or': 'or',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.forgotPassword': 'Forgot password?',

    'about.title': 'About Us',
    'about.subtitle': "We're a passionate team empowering creatives to showcase their work beautifully",
    'services.title': 'Our Services',
    'services.subtitle': 'A comprehensive set of tools and services',
    'contact.title': 'Contact Us',
    'contact.subtitle': "We'd love to hear from you",
    'contact.send': 'Send Message',
    'contact.message': 'Your Message',
    'getStarted.title': 'Get Started',
    'getStarted.subtitle': 'Your comprehensive guide to building a professional portfolio',
    'terms.title': 'Terms of Use',
    'privacy.title': 'Privacy Policy',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('ar');

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
