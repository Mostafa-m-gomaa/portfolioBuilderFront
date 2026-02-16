import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Privacy = () => {
  const { t, lang } = useLanguage();

  const content = lang === 'ar'
    ? [
        { title: 'جمع البيانات', text: 'نجمع فقط البيانات الضرورية لتقديم خدماتنا، بما في ذلك الاسم والبريد الإلكتروني ومعلومات الملف الشخصي.' },
        { title: 'استخدام البيانات', text: 'نستخدم بياناتك لتحسين تجربتك على المنصة وتقديم خدمات مخصصة. لن نشارك بياناتك مع أطراف ثالثة دون موافقتك.' },
        { title: 'أمان البيانات', text: 'نستخدم تقنيات تشفير متقدمة لحماية بياناتك الشخصية وضمان سريتها.' },
        { title: 'حقوقك', text: 'لديك الحق في الوصول إلى بياناتك وتعديلها أو حذفها في أي وقت من خلال إعدادات حسابك.' },
      ]
    : [
        { title: 'Data Collection', text: 'We only collect data necessary to provide our services, including name, email, and profile information.' },
        { title: 'Data Usage', text: 'We use your data to improve your platform experience and provide personalized services. We will not share your data with third parties without your consent.' },
        { title: 'Data Security', text: 'We use advanced encryption technologies to protect your personal data and ensure its confidentiality.' },
        { title: 'Your Rights', text: 'You have the right to access, modify, or delete your data at any time through your account settings.' },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
            {t('privacy.title')}
          </motion.h1>
          <div className="space-y-8">
            {content.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-strong rounded-2xl p-6">
                <h2 className="font-heading font-semibold text-xl text-foreground mb-3">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
