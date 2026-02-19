import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useSubdomainAvailability } from '@/hooks/useAuth';

const sanitizeSubdomain = (value: string) => value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);

type SubdomainManagerCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  currentSubdomain?: string | null;
  onSuccess?: () => void;
};

const SubdomainManagerCard = ({
  title,
  description,
  buttonLabel,
  currentSubdomain,
  onSuccess,
}: SubdomainManagerCardProps) => {
  const { updateSubdomainMutation } = useAuth();
  const [subdomain, setSubdomain] = useState(currentSubdomain || '');
  const cleanSubdomain = useMemo(() => sanitizeSubdomain(subdomain), [subdomain]);
  const availability = useSubdomainAvailability(cleanSubdomain);

  const isChecking = availability.isFetching;
  const isAvailable = availability.data?.available === true;
  const hasChanged = cleanSubdomain !== (currentSubdomain || '');
  const canUpdate = cleanSubdomain.length >= 3 && isAvailable && hasChanged;

  const availabilityText =
    cleanSubdomain.length === 0
      ? 'Type your subdomain to check availability.'
      : cleanSubdomain.length < 3
        ? 'Minimum 3 characters.'
        : isChecking
          ? 'Checking availability...'
          : isAvailable
            ? 'Available. You can use this subdomain.'
            : 'Unavailable. Try another one.';

  const availabilityClassName =
    cleanSubdomain.length < 3 || isChecking
      ? 'text-muted-foreground'
      : isAvailable
        ? 'text-emerald-500'
        : 'text-destructive';

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canUpdate) return;
    try {
      await updateSubdomainMutation.mutateAsync(cleanSubdomain);
      onSuccess?.();
    } catch {
      // Error handled in mutation hook.
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <h3 className="font-heading text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-muted-foreground">Subdomain</label>
          <div className="glass rounded-xl px-3 py-2 flex items-center gap-1">
            <input
              value={subdomain}
              onChange={(e) => setSubdomain(sanitizeSubdomain(e.target.value))}
              placeholder="yourname"
              className="bg-transparent flex-1 text-sm focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">.localhost</span>
          </div>
          <p className={`text-xs mt-2 ${availabilityClassName}`}>{availabilityText}</p>
          {currentSubdomain && (
            <p className="text-xs mt-1 text-muted-foreground">Current: {currentSubdomain}</p>
          )}
        </div>

        {canUpdate && (
          <button
            disabled={updateSubdomainMutation.isPending}
            className="w-full gradient-bg py-3 rounded-xl text-primary-foreground font-semibold text-sm disabled:opacity-70"
          >
            {updateSubdomainMutation.isPending ? 'Saving...' : buttonLabel}
          </button>
        )}
      </form>
    </motion.div>
  );
};

export default SubdomainManagerCard;

