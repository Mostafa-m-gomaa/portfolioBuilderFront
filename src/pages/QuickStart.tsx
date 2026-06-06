import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PlatformVideoSection from '@/components/shared/PlatformVideoSection';
import { useLanguage } from '@/contexts/LanguageContext';

const QuickStart = () => {
  const { lang } = useLanguage();

  const ar = {
    title: 'طريقة ويبسايت في دقايق',
    intro:
      'في الصفحة دي هتلاقي خطوات سريعة عشان تبني بورتفوليو ويبسايت وتعدّله بنفسك.',
    steps: [
      {
        title: '1. إنشاء الحساب',
        desc: 'سجّل بحساب جديد أو سجّل دخولك لو عندك حساب.'
      },
      {
        title: '2. اختر باقة أو جرّب نسخة تجريبية',
        desc: 'اختار باقة مناسبة أو ابدأ التجربة المجانية لو متاح.'
      },
      {
        title: '3. اضبط اسم الموقع (Subdomain)',
        desc: 'اختر اسم فرعي لموقعك ليصبح عنوانك العام.'
      },
      {
        title: '4. اختر قالب وابدأ التعديل',
        desc: 'اذهب لقسم القالب واختر واحد، بعد كده افتح محرر الأقسام لتعديل النصوص والصور.'
      },
      {
        title: '5. نشر الموقع',
        desc: 'بعد الانتهاء من التعديلات، اضغط علي اذهب الي موقعك و شارك اللينك الي هيظهرلك مع اي حد عايزه يشوف الويبسايت بتاعك.'
      },
      {
        title: 'نصائح سريعة',
        desc: 'اضف معلومات الاتصال، روابط الشبكات الاجتماعية، واعمل صورة شخصية احترافية.'
      },
    ],
  };

  const en = {
    title: 'Website in Minutes',
    intro: 'Quick step-by-step guide to create and edit your portfolio website.',
    steps: [
      { title: '1. Create an account', desc: 'Sign up or log in if you already have an account.' },
      { title: '2. Choose a plan or trial', desc: 'Pick a subscription or start the free trial if available.' },
      { title: '3. Configure your site subdomain', desc: 'Pick a short subdomain as your public site address.' },
      { title: '4. Pick a template and edit', desc: 'Select a template then open the section editor to change text and images.' },
      { title: '5. Publish your site', desc: 'When ready, hit publish to make your site public.' },
      { title: 'Quick tips', desc: 'Add contact details, social links and a professional profile image.' },
    ],
  };

  const copy = lang === 'ar' ? ar : en;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-3">{copy.title}</h1>
        <p className="text-muted-foreground mb-10">{copy.intro}</p>

        <PlatformVideoSection id="video" showQuickStartLink={false} className="mb-12" />

        <div className="space-y-4">
          {copy.steps.map((s, i) => (
            <section key={i} className="glass rounded-2xl p-6">
              <h2 className="font-semibold text-lg">{s.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuickStart;
