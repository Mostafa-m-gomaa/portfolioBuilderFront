import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import HowItWorksSection from '@/components/landing/HowItWorksSection';

const GetStarted = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default GetStarted;
