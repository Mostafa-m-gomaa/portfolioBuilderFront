import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Privacy = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const content = isAr
    ? [
        {
          title: 'نطاق السياسة',
          text: 'توضح هذه السياسة كيف نقوم بجمع بياناتك الشخصية واستخدامها وحمايتها عند استخدامك منصة سيرتي.',
        },
        {
          title: 'البيانات التي نجمعها',
          text: 'قد نجمع بيانات مثل الاسم والبريد الإلكتروني ومعلومات الحساب والمحتوى الذي ترفعه وبيانات تقنية مثل عنوان IP ونوع المتصفح.',
        },
        {
          title: 'أغراض الاستخدام',
          text: 'نستخدم بياناتك لتشغيل المنصة، إدارة الحسابات، تقديم الدعم، تحسين الأداء، الحماية من الاحتيال، والالتزام بالمتطلبات القانونية.',
        },
        {
          title: 'المدفوعات ومقدمو الخدمة',
          text: 'عند الاشتراك في خطط مدفوعة، تتم معالجة بيانات الدفع بواسطة Paddle بصفتها التاجر المسجل (Merchant of Record). قد تتم مشاركة البيانات الضرورية لإتمام الدفع ومكافحة الاحتيال.',
        },
        {
          title: 'الكوكيز والتتبع',
          text: 'قد نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتحسين تجربة الاستخدام، حفظ التفضيلات، وقياس أداء المنصة.',
        },
        {
          title: 'الاحتفاظ بالبيانات',
          text: 'نحتفظ بالبيانات طالما كان ذلك ضروريا لتقديم الخدمة أو للامتثال للالتزامات القانونية، ثم نقوم بحذفها أو إخفاء هويتها بشكل آمن.',
        },
        {
          title: 'حقوقك',
          text: 'حسب منطقتك، قد يكون لك حق الوصول إلى بياناتك أو تصحيحها أو حذفها أو الاعتراض على بعض المعالجات. يمكنك التواصل معنا لطلب ممارسة هذه الحقوق.',
        },
        {
          title: 'أمان البيانات',
          text: 'نطبق إجراءات تقنية وتنظيمية مناسبة لحماية البيانات، لكن لا يمكن ضمان أمان أي نقل عبر الإنترنت بشكل مطلق.',
        },
      ]
    : [
        {
          title: 'Policy Scope',
          text: 'This policy explains how we collect, use, and protect your personal data when you use سيرتي.',
        },
        {
          title: 'Data We Collect',
          text: 'We may collect data such as your name, email, account information, content you upload, and technical data like IP address and browser type.',
        },
        {
          title: 'How We Use Data',
          text: 'We use your data to operate the platform, manage accounts, provide support, improve performance, prevent fraud, and comply with legal obligations.',
        },
        {
          title: 'Payments and Service Providers',
          text: 'For paid plans, payment data is processed by Paddle as Merchant of Record. Necessary information may be shared to complete transactions and fraud checks.',
        },
        {
          title: 'Cookies and Tracking',
          text: 'We may use cookies and similar technologies to improve user experience, remember preferences, and measure platform performance.',
        },
        {
          title: 'Data Retention',
          text: 'We retain data as long as needed to provide the service or meet legal obligations, then delete or anonymize it securely.',
        },
        {
          title: 'Your Rights',
          text: 'Depending on your region, you may have rights to access, correct, delete, or object to certain processing of your data. You can contact us to exercise these rights.',
        },
        {
          title: 'Security',
          text: 'We apply appropriate technical and organizational safeguards, but no internet transmission or storage system can be guaranteed 100% secure.',
        },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
              {isAr ? 'معلومات قانونية' : 'Legal Information'}
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-sm text-muted-foreground mt-4">
              {isAr ? 'آخر تحديث: 2 أبريل 2026' : 'Last updated: April 2, 2026'}
            </p>
          </motion.div>
          <div className="space-y-8">
            {content.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-strong rounded-2xl p-6 border border-white/10">
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
