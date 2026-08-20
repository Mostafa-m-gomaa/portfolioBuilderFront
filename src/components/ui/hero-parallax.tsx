import React, { type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCinematicScrollEnabled } from '@/hooks/useCinematicScrollEnabled';

export type HeroParallaxProduct = {
  title: string;
  link: string;
  thumbnail: string;
};

type HeroParallaxProps = {
  products: HeroParallaxProduct[];
  header?: ReactNode;
};

const MobileProductCard = ({ product }: { product: HeroParallaxProduct }) => (
  <div className="group/product relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-2xl sm:h-56">
    <a
      href={product.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full"
    >
      <img
        src={product.thumbnail}
        height={400}
        width={400}
        className="h-full w-full object-cover object-left-top"
        alt={product.title}
        loading="lazy"
        decoding="async"
      />
    </a>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
      <h2 className="font-heading text-sm font-semibold text-white">{product.title}</h2>
    </div>
  </div>
);

const MobileTemplateGrid = ({
  products,
  header,
}: {
  products: HeroParallaxProduct[];
  header?: ReactNode;
}) => {
  const { t } = useLanguage();
  const visibleProducts = products.slice(0, 8);

  return (
    <div className="relative overflow-x-clip py-12 sm:py-16">
      {header ?? <Header compact />}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 sm:px-6">
        {visibleProducts.map((product) => (
          <MobileProductCard key={product.title} product={product} />
        ))}
      </div>
      {products.length > visibleProducts.length ? (
        <div className="mt-8 text-center">
          <Link
            to="/templates"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t('templateShowcase.viewAll')}
          </Link>
        </div>
      ) : null}
    </div>
  );
};

const DesktopHeroParallax = ({
  products,
  header,
}: HeroParallaxProps) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig,
  );
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig,
  );

  return (
    <div
      ref={ref}
      className="relative flex h-[300vh] flex-col self-auto overflow-hidden py-40 antialiased [perspective:1000px] [transform-style:preserve-3d]"
    >
      {header ?? <Header />}
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <div dir="ltr">
          <motion.div className="mb-20 flex flex-row-reverse space-x-20 space-x-reverse">
            {firstRow.map((product) => (
              <ProductCard product={product} translate={translateX} key={`${product.title}-1`} />
            ))}
          </motion.div>
          <motion.div className="mb-20 flex flex-row space-x-20">
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={`${product.title}-2`}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row-reverse space-x-20 space-x-reverse">
            {thirdRow.map((product) => (
              <ProductCard product={product} translate={translateX} key={`${product.title}-3`} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export const HeroParallax = ({ products, header }: HeroParallaxProps) => {
  const cinematic = useCinematicScrollEnabled();

  if (!cinematic) {
    return <MobileTemplateGrid products={products} header={header} />;
  }

  return <DesktopHeroParallax products={products} header={header} />;
};

export const Header = ({
  title,
  subtitle,
  compact = false,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  compact?: boolean;
} = {}) => {
  return (
    <div
      className={`relative left-0 top-0 mx-auto w-full max-w-7xl px-4 ${compact ? 'py-8 sm:py-12' : 'py-20 md:py-40'}`}
    >
      <h1 className="font-heading text-2xl font-bold text-foreground md:text-7xl">
        {title ?? (
          <>
            The Ultimate <br /> development studio
          </>
        )}
      </h1>
      <p className="mt-8 max-w-2xl text-base text-muted-foreground md:text-xl">
        {subtitle ??
          'We build beautiful products with the latest technologies and frameworks. We are a team of passionate developers and designers that love to build amazing products.'}
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroParallaxProduct;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      key={product.title}
      className="group/product relative h-96 w-[30rem] shrink-0"
    >
      <a
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height={600}
          width={600}
          className="absolute inset-0 h-full w-full object-cover object-left-top"
          alt={product.title}
          loading="lazy"
        decoding="async"
        />
      </a>
      <div className="pointer-events-none absolute inset-0 h-full w-full bg-black opacity-0 group-hover/product:opacity-80" />
      <h2 className="absolute bottom-4 left-4 font-heading text-white opacity-0 group-hover/product:opacity-100">
        {product.title}
      </h2>
    </motion.div>
  );
};
