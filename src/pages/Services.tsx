import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Layout, Paintbrush, Globe, BarChart3, Shield, Headphones } from 'lucide-react';

const Services = () => {
  const { t, lang } = useLanguage();

  const services = lang === 'ar'
    ? [
        { icon: Layout, title: 'قوالب جاهزة', desc: 'مكتبة واسعة من القوالب المصممة بأعلى المعايير.' },
        { icon: Paintbrush, title: 'تخصيص متقدم', desc: 'أدوات تعديل مرنة لتخصيص كل تفصيلة في موقعك.' },
        { icon: Globe, title: 'دومين مخصص', desc: 'ربط اسم نطاق خاص بموقعك لحضور أكثر احترافية.' },
        { icon: BarChart3, title: 'تحليلات مفصلة', desc: 'تتبع أداء موقعك واحصل على تقارير شاملة.' },
        { icon: Shield, title: 'أمان متقدم', desc: 'حماية بيانات كاملة مع شهادة SSL مجانية.' },
        { icon: Headphones, title: 'دعم فني', desc: 'فريق دعم متخصص متاح على مدار الساعة.' },
      ]
    : [
        { icon: Layout, title: 'Ready Templates', desc: 'A wide library of professionally designed templates.' },
        { icon: Paintbrush, title: 'Advanced Customization', desc: 'Flexible editing tools to customize every detail.' },
        { icon: Globe, title: 'Custom Domain', desc: 'Connect your own domain for a more professional presence.' },
        { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track your site performance with comprehensive reports.' },
        { icon: Shield, title: 'Advanced Security', desc: 'Full data protection with free SSL certificate.' },
        { icon: Headphones, title: 'Technical Support', desc: 'Dedicated support team available 24/7.' },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">{t('services.title')}</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('services.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="glass-strong rounded-2xl p-6 glow-border"
              >
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
