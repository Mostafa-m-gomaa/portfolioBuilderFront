import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Users, Target, Lightbulb } from 'lucide-react';

const About = () => {
  const { t, lang } = useLanguage();

  const values = lang === 'ar'
    ? [
        { icon: Target, title: 'رؤيتنا', desc: 'تمكين كل مبدع من بناء حضور رقمي احترافي يعكس مواهبه الفريدة.' },
        { icon: Users, title: 'فريقنا', desc: 'فريق متنوع من المصممين والمطورين الشغوفين بصناعة أدوات إبداعية.' },
        { icon: Lightbulb, title: 'مهمتنا', desc: 'جعل بناء البورتفوليو الاحترافي في متناول الجميع بسهولة وسرعة.' },
      ]
    : [
        { icon: Target, title: 'Our Vision', desc: 'Empowering every creative to build a professional digital presence that reflects their unique talents.' },
        { icon: Users, title: 'Our Team', desc: 'A diverse team of designers and developers passionate about crafting creative tools.' },
        { icon: Lightbulb, title: 'Our Mission', desc: 'Making professional portfolio building accessible, easy, and fast for everyone.' },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">{t('about.title')}</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t('about.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-strong rounded-2xl p-6 glow-border">
                <v.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
