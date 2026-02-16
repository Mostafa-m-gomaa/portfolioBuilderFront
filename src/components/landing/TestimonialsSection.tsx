import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const { t, lang } = useLanguage();

  const testimonials = lang === 'ar' ? [
    { name: 'سارة أحمد', role: 'مصممة جرافيك', text: 'منصة رائعة! ساعدتني في بناء بورتفوليو احترافي في وقت قياسي.', rating: 5 },
    { name: 'محمد علي', role: 'مطور ويب', text: 'التصاميم مذهلة والتخصيص سهل جداً. أنصح بها بشدة.', rating: 5 },
    { name: 'نور حسن', role: 'مصورة', text: 'أفضل منصة لعرض أعمالي الفوتوغرافية. النتيجة فاقت توقعاتي.', rating: 5 },
  ] : [
    { name: 'Sarah Ahmed', role: 'Graphic Designer', text: 'Amazing platform! Helped me build a professional portfolio in record time.', rating: 5 },
    { name: 'Mohamed Ali', role: 'Web Developer', text: 'Stunning designs and super easy customization. Highly recommended.', rating: 5 },
    { name: 'Nour Hassan', role: 'Photographer', text: 'Best platform to showcase my photography work. Results exceeded expectations.', rating: 5 },
  ];

  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">{t('testimonials.title')}</h2>
          <p className="text-muted-foreground text-lg">{t('testimonials.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-6 glow-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: item.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
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
