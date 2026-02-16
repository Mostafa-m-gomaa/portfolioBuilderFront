import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingPreview from '@/components/landing/PricingPreview';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <PricingPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
