import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/landing/HeroSection';
import LazyWhenVisible from '@/components/LazyWhenVisible';

const TemplateShowcaseSection = lazy(() => import('@/components/landing/TemplateShowcaseSection'));
const FeaturesSection = lazy(() => import('@/components/landing/FeaturesSection'));
const HowItWorksSection = lazy(() => import('@/components/landing/HowItWorksSection'));
const PricingPreview = lazy(() => import('@/components/landing/PricingPreview'));
const TestimonialsSection = lazy(() => import('@/components/landing/TestimonialsSection'));
const CTASection = lazy(() => import('@/components/landing/CTASection'));

const SectionFallback = ({ minHeight = '16rem' }: { minHeight?: string }) => (
  <div aria-hidden style={{ minHeight }} />
);

const Index = () => {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <Navbar />
      <main className="relative overflow-x-clip">
        <HeroSection />
        <LazyWhenVisible minHeight="24rem">
          <Suspense fallback={<SectionFallback minHeight="24rem" />}>
            <TemplateShowcaseSection />
          </Suspense>
        </LazyWhenVisible>
        <LazyWhenVisible minHeight="20rem">
          <Suspense fallback={<SectionFallback minHeight="20rem" />}>
            <FeaturesSection />
          </Suspense>
        </LazyWhenVisible>
        <LazyWhenVisible minHeight="20rem">
          <Suspense fallback={<SectionFallback minHeight="20rem" />}>
            <HowItWorksSection />
          </Suspense>
        </LazyWhenVisible>
        <LazyWhenVisible minHeight="24rem">
          <Suspense fallback={<SectionFallback minHeight="24rem" />}>
            <PricingPreview />
          </Suspense>
        </LazyWhenVisible>
        <LazyWhenVisible minHeight="18rem">
          <Suspense fallback={<SectionFallback minHeight="18rem" />}>
            <TestimonialsSection />
          </Suspense>
        </LazyWhenVisible>
        <LazyWhenVisible minHeight="14rem">
          <Suspense fallback={<SectionFallback minHeight="14rem" />}>
            <CTASection />
          </Suspense>
        </LazyWhenVisible>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
