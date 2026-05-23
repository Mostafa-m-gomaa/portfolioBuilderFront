import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type TemplatePreviewImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function TemplatePreviewImage({ src, alt, className }: TemplatePreviewImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-muted/40', className)}>
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <Skeleton className="absolute inset-0 rounded-none" />
          <Loader2 className="relative h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      {error ? (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          —
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'h-full w-full object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
        />
      )}
    </div>
  );
}
