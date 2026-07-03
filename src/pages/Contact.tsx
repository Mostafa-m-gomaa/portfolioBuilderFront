import { useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SocialLinks from '@/components/SocialLinks';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import { EmailInput, type EmailInputHandle } from '@/components/auth/EmailInput';
import { trackLead } from '@/lib/metaPixel';
import { primaryButton } from '@/lib/buttonStyles';

const Contact = () => {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const emailRef = useRef<EmailInputHandle>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRef.current?.validate()) return;
    trackLead();
    // TODO: wire contact API when available
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-4">{t('contact.title')}</h1>
            <p className="text-muted-foreground text-lg">{t('contact.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {[
                { icon: Mail, text: 'info@getsirty.com' },
                { icon: Phone, text: '+201091469974' },
                { icon: MapPin, text: lang === 'ar' ? 'القاهرة، مصر' : 'Cairo, Egypt' },
              ].map((item, i) => (
                <div key={i} className="glass-strong rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-foreground text-sm">{item.text}</span>
                </div>
              ))}
              <div className="glass-strong rounded-2xl p-4">
                <SocialLinks showLabel />
              </div>
            </motion.div>
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-strong rounded-2xl p-6 glow-border space-y-4" onSubmit={handleSubmit} noValidate>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent"
                placeholder={t('auth.name')}
              />
              <EmailInput
                ref={emailRef}
                required
                value={form.email}
                onChange={(email) => setForm({ ...form, email })}
                placeholder={t('auth.email')}
              />
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full glass rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 bg-transparent resize-none"
                placeholder={t('contact.message')}
              />
              <button type="submit" className={primaryButton('w-full')}>
                {t('contact.send')}
              </button>
            </motion.form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
