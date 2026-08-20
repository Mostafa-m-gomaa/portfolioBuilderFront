import { useEffect, useRef, useState, type ReactNode } from 'react';

type LazyWhenVisibleProps = {
  children: ReactNode;
  /** Minimum height placeholder while waiting to enter viewport */
  minHeight?: string;
  rootMargin?: string;
};

/** Mount children only when the placeholder nears the viewport. */
const LazyWhenVisible = ({
  children,
  minHeight = '12rem',
  rootMargin = '200px 0px',
}: LazyWhenVisibleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
};

export default LazyWhenVisible;
