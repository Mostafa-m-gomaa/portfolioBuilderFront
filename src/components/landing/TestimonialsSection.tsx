import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import LandingSection from '@/components/landing/LandingSection';
import LandingSectionHeader from '@/components/landing/LandingSectionHeader';
import { landingViewport, staggerContainer, staggerItem } from '@/lib/landingMotion';

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();

  const testimonials =
    lang === 'ar'
      ? [
          {
            name: 'سارة أحمد',
            role: 'مصممة جرافيك',
            text: 'قدرت أرتب أعمالي وخدماتي في صفحة واحدة شكلها واضح للعملاء.',
            rating: 5,
          },
          {
            name: 'محمد علي',
            role: 'مطور ويب',
            text: 'القوالب اختصرت وقت كبير، والتعديل على المحتوى كان مباشر وسهل.',
            rating: 5,
          },
          {
            name: 'نور حسن',
            role: 'مصورة',
            text: 'الموقع ساعدني أعرض الصور بطريقة أنضف وأرسل الرابط بدل ملفات متفرقة.',
            rating: 5,
          },
        ]
      : [
          {
            name: 'Sarah Ahmed',
            role: 'Graphic Designer',
            text: 'I was able to organize my work and services in one clear page for clients.',
            rating: 5,
          },
          {
            name: 'Mohamed Ali',
            role: 'Web Developer',
            text: 'The templates saved a lot of time, and editing the content felt straightforward.',
            rating: 5,
          },
          {
            name: 'Nour Hassan',
            role: 'Photographer',
            text: 'The site helped me present photos more cleanly and send one link instead of scattered files.',
            rating: 5,
          },
        ];

  return (
    <LandingSection variant="accent" alternate>
      <div className="mx-auto max-w-6xl px-6">
        <LandingSectionHeader
          kicker={t('testimonials.kicker')}
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
          className="max-w-2xl"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={landingViewport}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="rounded-2xl border border-border/80 bg-card/80 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-6 text-sm text-foreground">"{item.text}"</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </LandingSection>
  );
};

export default TestimonialsSection;
