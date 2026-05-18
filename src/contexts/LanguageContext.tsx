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
    'nav.templates': 'القوالب',
    'nav.pricing': 'الأسعار',
    'nav.contact': 'تواصل معنا',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.getStarted': 'ابدأ الآن',

    // Hero
    'hero.badge': 'موقع شخصي جاهز للنشر بدون تعقيد',
    'hero.title': 'ابني موقعك الشخصي',
    'hero.titleHighlight': 'بشكل احترافي',
    'hero.subtitle': 'سيرتي يساعدك تعرض خبرتك، أعمالك، وطرق التواصل معك في موقع سريع ومنظم، مناسب للمستقلين والمهنيين وأصحاب الخدمات.',
    'hero.cta1': 'ابدأ إنشاء موقعك',
    'hero.cta2': 'تصفح القوالب',
    'hero.bullet1': 'قوالب مرتبة حسب المجال',
    'hero.bullet2': 'تعديل المحتوى بسهولة',
    'hero.bullet3': 'صفحات متجاوبة مع الموبايل',
    'hero.stat1.value': '+20',
    'hero.stat1.label': 'قالب جاهز',
    'hero.stat2.value': '3',
    'hero.stat2.label': 'خطوات للنشر',
    'hero.stat3.value': '24/7',
    'hero.stat3.label': 'موقعك متاح',
    'hero.previewTitle': 'لوحة موقعك',
    'hero.previewSubtitle': 'تحكم في المحتوى والقالب',
    'hero.trust': 'تصميم هادئ، سرعة تحميل جيدة، وتجربة مناسبة للزائر.',
    'hero.mockCaption': 'معاينة واقعية قبل النشر',

    // Features
    'features.kicker': 'المميزات',
    'features.title': 'كل ما تحتاجه لعرض شغلك بوضوح',
    'features.subtitle': 'واجهة بسيطة، قوالب عملية، وإعدادات كافية لتطلع بموقع شكله مهني من غير وقت طويل.',
    'features.1.title': 'قوالب لمجالات مختلفة',
    'features.1.desc': 'ابدأ من تصميم مناسب لمجالك بدل بناء كل شيء من الصفر.',
    'features.2.title': 'تحكم في المحتوى',
    'features.2.desc': 'أضف نبذة، خدمات، مشاريع، صور، وروابط تواصل بطريقة منظمة.',
    'features.3.title': 'نشر فوري',
    'features.3.desc': 'جهّز موقعك وشاركه بسرعة مع العملاء أو جهات التوظيف.',
    'features.4.title': 'تجربة مستقرة',
    'features.4.desc': 'تصميم متجاوب وصفحات خفيفة تساعد الزائر يوصل للمعلومة بسرعة.',

    // How it works
    'how.kicker': 'طريقة العمل',
    'how.title': 'من أول قالب لحد النشر في خطوات واضحة',
    'how.subtitle': 'ابدأ بالاختيار، عدّل بياناتك، وانشر رابطك لما يكون جاهز.',
    'how.1.title': 'اختر قالباً',
    'how.1.desc': 'اختار قالب قريب من مجالك وطريقة عرضك المفضلة.',
    'how.2.title': 'أضف بياناتك',
    'how.2.desc': 'اكتب نبذة مختصرة، أضف أعمالك، وحدد طرق التواصل.',
    'how.3.title': 'انشر وشارك',
    'how.3.desc': 'راجع الشكل النهائي، وبعدها شارك الرابط مع جمهورك أو عملائك.',

    // Pricing
    'pricing.kicker': 'الأسعار',
    'pricing.title': 'خطط واضحة بدون تعقيد',
    'pricing.subtitle': 'اختار المدة المناسبة لك وابدأ بموقع جاهز للاستخدام.',
    'pricing.free': 'مجاني',
    'pricing.pro': 'احترافي',
    'pricing.business': 'أعمال',
    'pricing.month': '/شهر',
    'pricing.cta': 'ابدأ الآن',
    'pricing.popular': 'الأكثر شعبية',
    'pricing.loading': 'جاري تحميل الباقات…',
    'pricing.retry': 'إعادة المحاولة',
    'pricing.loadError': 'تعذر تحميل الباقات. تحقق من الاتصال وحاول مرة أخرى.',
    'pricing.empty': 'مفيش باقات متاحة حالياً',
    'pricing.chooseCurrency': 'اختر العملة',
    'package.details': 'التفاصيل',
    'package.back': 'العودة للأسعار',
    'package.missingId': 'معرّف الباقة غير صالح.',

    'subscription.kicker': 'الاشتراك',
    'subscription.title': 'اختر خطتك أو ابدأ بتجربة مجانية',
    'subscription.subtitle': 'لتفعيل حسابك وإكمال إعداد الموقع، اختر باقة مدفوعة أو جرّب كل الميزات لمدة 4 أيام بدون تكلفة.',
    'subscription.freeTrial.heading': 'تجربة مجانية',
    'subscription.freeTrial.badge': '4 أيام',
    'subscription.freeTrial.cardPrice': 'مجاني',
    'subscription.freeTrial.title': 'Free Trial',
    'subscription.freeTrial.duration': 'مدة التجربة: 4 أيام',
    'subscription.freeTrial.description': 'احصل على نفس مميزات الباقات المتاحة لفترة محدودة، ثم أكمل باختيار الدومين وإعداد موقعك.',
    'subscription.freeTrial.fallback1': 'كل ميزات الباقات المتاحة على المنصة',
    'subscription.freeTrial.fallback2': 'تعديل المحتوى والقالب أثناء التجربة',
    'subscription.freeTrial.fallback3': 'نشر تجريبي وفق سياسة المنصة',
    'subscription.freeTrial.fallback4': 'بدون بطاقة دفع للبدء',
    'subscription.freeTrial.cta': 'اشترك في التجربة المجانية',
    'subscription.freeTrial.pending': 'جاري التفعيل…',
    'subscription.freeTrial.success': 'تم تفعيل التجربة المجانية بنجاح.',
    'subscription.paidPlans.heading': 'الباقات المدفوعة',
    'subscription.paidPlans.viewDetails': 'عرض التفاصيل',
    'subscription.error.generic': 'تعذر تفعيل التجربة. حاول مرة أخرى.',
    'subscription.error.freeTrialAlreadyUsed': 'تم استخدام التجربة المجانية مسبقاً لهذا الحساب.',
    'payment.subscribe': 'اشترك الآن',
    'payment.redirecting': 'جاري التوجيه للدفع…',
    'payment.checkoutError': 'تعذر بدء عملية الدفع. حاول مرة أخرى.',
    'payment.coupon.sectionTitle': 'كوبون خصم',
    'payment.coupon.placeholder': 'أدخل الكود',
    'payment.coupon.apply': 'تطبيق',
    'payment.coupon.applying': 'جاري التحقق…',
    'payment.coupon.appliedBadge': 'تم تطبيق الكوبون',
    'payment.coupon.original': 'السعر الأصلي',
    'payment.coupon.discount': 'الخصم',
    'payment.coupon.final': 'المبلغ المستحق',
    'payment.coupon.remove': 'إزالة الكوبون',
    'payment.coupon.applyError': 'تعذر تطبيق الكوبون.',
    'subscription.banner.freeTrialExpired.title': 'انتهت التجربة المجانية',
    'subscription.banner.freeTrialExpired.description': 'بياناتك محفوظة، لكن البورتفوليو متوقف لحد ما تشترك في خطة مناسبة.',
    'subscription.banner.freeTrialExpired.cta': 'عرض الباقات والاشتراك',
    'subscription.summary.loading': 'جاري تحميل حالة الاشتراك…',
    'subscription.summary.activeBadge': 'اشتراك نشط',
    'subscription.summary.status': 'الحالة',
    'subscription.summary.endsAt': 'ينتهي في',
    'subscription.summary.daysLeft': 'الأيام المتبقية',
    'subscription.summary.viewPlans': 'عرض الباقات',
    'subscription.summary.trialTitle': 'أنت في التجربة المجانية',
    'subscription.summary.trialEnds': 'تنتهي التجربة في',
    'subscription.summary.inactive.EXPIRED': 'انتهى اشتراكك السابق. يمكنك اختيار باقة جديدة للمتابعة.',
    'subscription.summary.inactive.CANCELLED': 'تم إلغاء اشتراكك. يمكنك الاشتراك مرة أخرى من صفحة الأسعار.',
    'subscription.summary.syncing': 'جاري مزامنة حالة الاشتراك…',

    // Testimonials
    'testimonials.kicker': 'آراء العملاء',
    'testimonials.title': 'مستخدمون بنوا حضورهم بشكل أسرع',
    'testimonials.subtitle': 'نماذج من أصحاب أعمال ومهنيين احتاجوا موقع مرتب وسهل التحديث.',

    // CTA
    'cta.title': 'ابدأ بموقع يعرض شغلك بوضوح',
    'cta.subtitle': 'جهّز صفحتك، أضف أعمالك، وشارك الرابط مع العملاء في وقت قصير.',
    'cta.button': 'ابدأ الآن',

    // Footer
    'footer.description': 'منصة متقدمة لبناء مواقع البورتفوليو الاحترافية',
    'footer.links': 'روابط سريعة',
    'footer.legal': 'قانوني',
    'footer.terms': 'شروط الاستخدام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.refund': 'سياسة الاسترداد',
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
    'auth.accountType': 'نوع الحساب / المهنة',

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
    'nav.templates': 'Templates',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.login': 'Log In',
    'nav.signup': 'Sign Up',
    'nav.getStarted': 'Get Started',

    'hero.badge': 'A personal site ready to publish without complexity',
    'hero.title': 'Build your personal website',
    'hero.titleHighlight': 'professionally',
    'hero.subtitle': 'Sirty helps you present your experience, work, and contact details in a fast, organized website for freelancers, professionals, and service providers.',
    'hero.cta1': 'Start building',
    'hero.cta2': 'Browse templates',
    'hero.bullet1': 'Templates by profession',
    'hero.bullet2': 'Easy content editing',
    'hero.bullet3': 'Mobile-ready pages',
    'hero.stat1.value': '20+',
    'hero.stat1.label': 'Ready templates',
    'hero.stat2.value': '3',
    'hero.stat2.label': 'Steps to publish',
    'hero.stat3.value': '24/7',
    'hero.stat3.label': 'Site availability',
    'hero.previewTitle': 'Your site dashboard',
    'hero.previewSubtitle': 'Manage content and design',
    'hero.trust': 'Clean design, good loading speed, and a visitor-friendly experience.',
    'hero.mockCaption': 'A realistic preview before publishing',

    'features.kicker': 'Features',
    'features.title': 'Everything you need to present your work clearly',
    'features.subtitle': 'A simple interface, practical templates, and enough control to launch a professional-looking site quickly.',
    'features.1.title': 'Templates for different fields',
    'features.1.desc': 'Start from a layout that fits your profession instead of building from scratch.',
    'features.2.title': 'Control your content',
    'features.2.desc': 'Add your bio, services, projects, images, and contact links in an organized way.',
    'features.3.title': 'Instant Publishing',
    'features.3.desc': 'Prepare your site and share it quickly with clients or employers.',
    'features.4.title': 'Stable Experience',
    'features.4.desc': 'Responsive layouts and lightweight pages help visitors find what they need quickly.',

    'how.kicker': 'How it works',
    'how.title': 'How It Works',
    'how.subtitle': 'Pick a template, add your details, and publish your link when it is ready.',
    'how.1.title': 'Choose a Template',
    'how.1.desc': 'Choose a layout that matches your field and preferred presentation style.',
    'how.2.title': 'Add Your Details',
    'how.2.desc': 'Write a short bio, add your work, and define the best ways to contact you.',
    'how.3.title': 'Publish & Share',
    'how.3.desc': 'Review the final result, then share your link with clients or your audience.',

    'pricing.kicker': 'Pricing',
    'pricing.title': 'Clear plans without complexity',
    'pricing.subtitle': 'Choose the duration that fits you and start with a site ready to use.',
    'pricing.free': 'Free',
    'pricing.pro': 'Pro',
    'pricing.business': 'Business',
    'pricing.month': '/mo',
    'pricing.cta': 'Get Started',
    'pricing.popular': 'Most Popular',
    'pricing.loading': 'Loading plans…',
    'pricing.retry': 'Try again',
    'pricing.loadError': 'Could not load plans. Check your connection and try again.',
    'pricing.empty': 'No packages available at the moment.',
    'pricing.chooseCurrency': 'Choose currency',
    'package.details': 'Details',
    'package.back': 'Back to pricing',
    'package.missingId': 'Invalid package link.',

    'subscription.kicker': 'Subscription',
    'subscription.title': 'Choose a plan or start with a free trial',
    'subscription.subtitle': 'To activate your account and continue setup, pick a paid plan or try all features free for 4 days.',
    'subscription.freeTrial.heading': 'Free trial',
    'subscription.freeTrial.badge': '4 days',
    'subscription.freeTrial.cardPrice': 'Free',
    'subscription.freeTrial.title': 'Free trial',
    'subscription.freeTrial.duration': 'Trial length: 4 days',
    'subscription.freeTrial.description': 'Use the same capabilities as our paid plans for a limited time, then continue with your domain and site setup.',
    'subscription.freeTrial.fallback1': 'Full access to current platform features during the trial',
    'subscription.freeTrial.fallback2': 'Edit your content and template while trialing',
    'subscription.freeTrial.fallback3': 'Publishing subject to platform policy',
    'subscription.freeTrial.fallback4': 'No card required to start',
    'subscription.freeTrial.cta': 'Start free trial',
    'subscription.freeTrial.pending': 'Starting trial…',
    'subscription.freeTrial.success': 'Your free trial is active.',
    'subscription.paidPlans.heading': 'Paid plans',
    'subscription.paidPlans.viewDetails': 'View details',
    'subscription.error.generic': 'Could not start the trial. Please try again.',
    'subscription.error.freeTrialAlreadyUsed': 'Free trial has already been used for this account.',
    'payment.subscribe': 'Subscribe now',
    'payment.redirecting': 'Redirecting to payment…',
    'payment.checkoutError': 'Could not start payment. Please try again.',
    'payment.coupon.sectionTitle': 'Promo code',
    'payment.coupon.placeholder': 'Enter code',
    'payment.coupon.apply': 'Apply',
    'payment.coupon.applying': 'Checking…',
    'payment.coupon.appliedBadge': 'Code applied',
    'payment.coupon.original': 'Original price',
    'payment.coupon.discount': 'Discount',
    'payment.coupon.final': 'You pay',
    'payment.coupon.remove': 'Remove promo code',
    'payment.coupon.applyError': 'Could not apply this code.',
    'subscription.banner.freeTrialExpired.title': 'Your free trial has ended',
    'subscription.banner.freeTrialExpired.description': 'Your data is safe, but your portfolio stays paused until you subscribe to a plan.',
    'subscription.banner.freeTrialExpired.cta': 'View plans & subscribe',
    'subscription.summary.loading': 'Loading subscription status…',
    'subscription.summary.activeBadge': 'Active subscription',
    'subscription.summary.status': 'Status',
    'subscription.summary.endsAt': 'Renews / ends on',
    'subscription.summary.daysLeft': 'Days left',
    'subscription.summary.viewPlans': 'View plans',
    'subscription.summary.trialTitle': 'You are on the free trial',
    'subscription.summary.trialEnds': 'Trial ends on',
    'subscription.summary.inactive.EXPIRED': 'Your previous subscription has ended. Pick a new plan to continue.',
    'subscription.summary.inactive.CANCELLED': 'Your subscription was cancelled. You can subscribe again from pricing.',
    'subscription.summary.syncing': 'Syncing subscription status…',

    'testimonials.kicker': 'Testimonials',
    'testimonials.title': 'Users who built their presence faster',
    'testimonials.subtitle': 'Examples from professionals who needed a clean site they can update easily.',

    'cta.title': 'Start with a site that presents your work clearly',
    'cta.subtitle': 'Set up your page, add your work, and share the link with clients in less time.',
    'cta.button': 'Get Started',

    'footer.description': 'An advanced platform for building professional portfolio websites',
    'footer.links': 'Quick Links',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Use',
    'footer.privacy': 'Privacy Policy',
    'footer.refund': 'Refund Policy',
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
    'auth.accountType': 'Account type / profession',

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
