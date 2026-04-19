import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const Terms = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const content = isAr
    ? [
        {
          title: 'قبول الشروط',
          text: 'باستخدامك Portfolia أو إنشاء حساب، فإنك توافق على شروط الاستخدام هذه. إذا كنت لا توافق عليها، يرجى عدم استخدام المنصة.',
        },
        {
          title: 'وصف الخدمة',
          text: 'Portfolia منصة لإنشاء وإدارة مواقع البورتفوليو. قد نقوم بتحديث الميزات أو تعديلها أو إيقاف أجزاء من الخدمة عند الحاجة التشغيلية.',
        },
        {
          title: 'الحساب والمسؤولية',
          text: 'أنت مسؤول عن سرية بيانات الدخول وعن كل نشاط يتم عبر حسابك. يجب تقديم معلومات صحيحة ومحدثة عند التسجيل والاستخدام.',
        },
        {
          title: 'الاشتراك والمدفوعات',
          text: 'قد تتطلب بعض الميزات اشتراكا مدفوعا. تتم معالجة المدفوعات بواسطة Paddle بصفتها التاجر المسجل (Merchant of Record)، وقد يظهر اسم Paddle في الفاتورة وكشف الحساب.',
        },
        {
          title: 'سياسة الإلغاء والاسترداد',
          text: 'يمكنك إلغاء الاشتراك قبل تاريخ التجديد. تفاصيل الاسترداد موضحة في سياسة الاسترداد الخاصة بنا، مع مراعاة الحقوق القانونية الإلزامية حسب بلدك.',
        },
        {
          title: 'الاستخدام المقبول',
          text: 'يُحظر استخدام المنصة في أي نشاط غير قانوني أو ضار، أو رفع محتوى ينتهك حقوق الملكية الفكرية أو الخصوصية أو القوانين المعمول بها.',
        },
        {
          title: 'الملكية الفكرية',
          text: 'المحتوى والتصميمات والعلامات الخاصة بالمنصة مملوكة لـ Portfolia أو مرخصة لها. يظل المحتوى الذي ترفعه أنت ملكا لك، وتمنحنا ترخيصا ضروريا لعرضه وتقديم الخدمة.',
        },
        {
          title: 'تحديد المسؤولية',
          text: 'تُقدَّم الخدمة "كما هي" دون ضمانات صريحة أو ضمنية. إلى الحد المسموح قانونا، لا نتحمل المسؤولية عن الأضرار غير المباشرة أو فقدان الأرباح أو البيانات.',
        },
        {
          title: 'التواصل والتعديلات',
          text: 'قد نقوم بتحديث هذه الشروط من وقت لآخر. استمرارك في الاستخدام بعد التحديث يعني قبولك للشروط المعدلة.',
        },
      ]
    : [
        {
          title: 'Acceptance of Terms',
          text: 'By using Portfolia or creating an account, you agree to these Terms of Service. If you do not agree, please do not use the platform.',
        },
        {
          title: 'Service Description',
          text: 'Portfolia is a platform for building and managing portfolio websites. We may update, modify, or discontinue parts of the service when operationally necessary.',
        },
        {
          title: 'Account and Responsibility',
          text: 'You are responsible for safeguarding your account credentials and for all activities under your account. You must provide accurate and up-to-date information.',
        },
        {
          title: 'Subscriptions and Payments',
          text: 'Some features may require a paid subscription. Payments are processed by Paddle as Merchant of Record, and Paddle may appear on invoices and billing statements.',
        },
        {
          title: 'Cancellation and Refunds',
          text: 'You may cancel your subscription before renewal. Refund details are described in our Refund Policy, subject to mandatory legal rights in your jurisdiction.',
        },
        {
          title: 'Acceptable Use',
          text: 'You may not use the platform for illegal or harmful activities, or upload content that infringes intellectual property, privacy rights, or applicable law.',
        },
        {
          title: 'Intellectual Property',
          text: 'Platform content, design, and branding are owned by or licensed to Portfolia. Content you upload remains yours, and you grant us the limited rights needed to provide the service.',
        },
        {
          title: 'Limitation of Liability',
          text: 'The service is provided "as is" without express or implied warranties. To the maximum extent permitted by law, we are not liable for indirect damages, lost profits, or data loss.',
        },
        {
          title: 'Changes and Contact',
          text: 'We may update these terms from time to time. Continued use after updates means acceptance of the revised terms.',
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
              {isAr ? 'شروط الخدمة' : 'Terms of Service'}
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

export default Terms;
