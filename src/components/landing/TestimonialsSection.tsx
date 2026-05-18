import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();

  const testimonials = lang === 'ar' ? [
    { name: 'سارة أحمد', role: 'مصممة جرافيك', text: 'قدرت أرتب أعمالي وخدماتي في صفحة واحدة شكلها واضح للعملاء.', rating: 5 },
    { name: 'محمد علي', role: 'مطور ويب', text: 'القوالب اختصرت وقت كبير، والتعديل على المحتوى كان مباشر وسهل.', rating: 5 },
    { name: 'نور حسن', role: 'مصورة', text: 'الموقع ساعدني أعرض الصور بطريقة أنضف وأرسل الرابط بدل ملفات متفرقة.', rating: 5 },
  ] : [
    { name: 'Sarah Ahmed', role: 'Graphic Designer', text: 'I was able to organize my work and services in one clear page for clients.', rating: 5 },
    { name: 'Mohamed Ali', role: 'Web Developer', text: 'The templates saved a lot of time, and editing the content felt straightforward.', rating: 5 },
    { name: 'Nour Hassan', role: 'Photographer', text: 'The site helped me present photos more cleanly and send one link instead of scattered files.', rating: 5 },
  ];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">{t('testimonials.kicker')}</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">{t('testimonials.title')}</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{t('testimonials.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground text-sm mb-6">"{item.text}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
