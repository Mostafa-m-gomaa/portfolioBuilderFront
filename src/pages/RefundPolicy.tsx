import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const content = isAr
    ? [
        {
          title: 'ملخص السياسة',
          text: 'توضح هذه السياسة متى يمكن استرداد المبالغ المدفوعة مقابل الاشتراكات أو الخدمات الرقمية على Portfolia.',
        },
        {
          title: 'معالجة الدفع عبر Paddle',
          text: 'يتم تحصيل المدفوعات بواسطة Paddle بصفتها التاجر المسجل (Merchant of Record). قد يظهر اسم Paddle في الفاتورة وكشف الحساب، وتخضع عملية الدفع أيضا لشروط المشتري الخاصة بـ Paddle.',
        },
        {
          title: 'أهلية الاسترداد',
          text: 'نراجع طلبات الاسترداد لكل حالة على حدة، خاصة في حالات الخصم غير المقصود أو الخطأ التقني الذي منع استخدام الخدمة. في الحالات التي يفرضها القانون المحلي، يتم تطبيق حقوق الاسترداد القانونية.',
        },
        {
          title: 'الاشتراكات والتجديد',
          text: 'الاشتراكات تتجدد تلقائيا ما لم يتم إلغاؤها قبل موعد التجديد. بعد التجديد، يمكن تقديم طلب استرداد خلال مدة معقولة وسنراجعه بناء على حالة الاستخدام والالتزامات القانونية.',
        },
        {
          title: 'كيفية طلب الاسترداد',
          text: 'لأي طلب استرداد، تواصل معنا عبر صفحة التواصل مع تضمين البريد الإلكتروني المستخدم في الشراء ورقم الفاتورة وسبب الطلب. نسعى للرد خلال 3-5 أيام عمل.',
        },
        {
          title: 'حالات عدم الاسترداد',
          text: 'قد لا يتم قبول الاسترداد في حالات إساءة الاستخدام أو طلبات متكررة بشكل غير منطقي أو عند وجود استخدام فعلي ومكثف للخدمة بعد الشراء، ما لم ينص القانون على خلاف ذلك.',
        },
      ]
    : [
        {
          title: 'Policy Summary',
          text: 'This policy explains when payments for subscriptions or digital services on Portfolia may be refunded.',
        },
        {
          title: 'Payments Processed by Paddle',
          text: 'Payments are processed by Paddle as Merchant of Record. Paddle may appear on invoices and card statements, and checkout is also subject to Paddle buyer terms.',
        },
        {
          title: 'Refund Eligibility',
          text: 'Refund requests are reviewed case by case, especially for accidental charges or technical issues that prevented service use. Where required by local law, statutory refund rights apply.',
        },
        {
          title: 'Subscriptions and Renewals',
          text: 'Subscriptions renew automatically unless canceled before renewal. After renewal, you may submit a refund request within a reasonable period and it will be reviewed based on usage and legal obligations.',
        },
        {
          title: 'How to Request a Refund',
          text: 'To request a refund, contact us through the Contact page and include the purchase email, invoice/receipt details, and reason for the request. We aim to respond within 3-5 business days.',
        },
        {
          title: 'Non-Refund Situations',
          text: 'Refunds may be denied in cases of abuse, repeated unreasonable requests, or substantial service usage after purchase, unless otherwise required by law.',
        },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
              {isAr ? 'معلومات قانونية' : 'Legal Information'}
            </p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
              {isAr ? 'سياسة الاسترداد' : 'Refund Policy'}
            </h1>
            <p className="text-sm text-muted-foreground mt-4">
              {isAr ? 'آخر تحديث: 2 أبريل 2026' : 'Last updated: April 2, 2026'}
            </p>
          </motion.div>

          <div className="space-y-6">
            {content.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="glass-strong rounded-2xl p-6 border border-white/10"
              >
                <h2 className="font-heading font-semibold text-xl text-foreground mb-3">
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{section.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
