import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Terms = () => {
  const { t, lang } = useLanguage();

  const content = lang === 'ar'
    ? [
        { title: 'القبول بالشروط', text: 'باستخدامك لمنصة Portfolia، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.' },
        { title: 'استخدام المنصة', text: 'يجب استخدام المنصة فقط للأغراض المشروعة وبما يتوافق مع القوانين المعمول بها. يُحظر استخدام المنصة لأي نشاط غير قانوني أو ضار.' },
        { title: 'حقوق الملكية الفكرية', text: 'جميع المحتويات والتصاميم والشعارات والعلامات التجارية على المنصة هي ملكية حصرية لـ Portfolia أو مرخصة لها.' },
        { title: 'إخلاء المسؤولية', text: 'يتم تقديم المنصة "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نتحمل أي مسؤولية عن أي أضرار ناتجة عن استخدام المنصة.' },
      ]
    : [
        { title: 'Acceptance of Terms', text: 'By using Portfolia, you agree to be bound by these terms of use. If you do not agree to any of these terms, please do not use the platform.' },
        { title: 'Use of Platform', text: 'The platform must be used only for lawful purposes and in compliance with applicable laws. Use of the platform for any illegal or harmful activity is prohibited.' },
        { title: 'Intellectual Property', text: 'All content, designs, logos, and trademarks on the platform are the exclusive property of Portfolia or licensed to it.' },
        { title: 'Disclaimer', text: 'The platform is provided "as is" without any express or implied warranties. We are not liable for any damages resulting from the use of the platform.' },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
            {t('terms.title')}
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

export default Terms;
