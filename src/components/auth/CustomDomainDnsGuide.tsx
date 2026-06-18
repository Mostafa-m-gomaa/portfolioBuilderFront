import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Globe2, Loader2, Server, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { parseApiError } from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { CUSTOM_DOMAIN_CNAME_TARGET } from '@/constants/customDomainDns';
import { SUPPORT_WHATSAPP_URL } from '@/constants/supportWhatsApp';
import type { VerifyDomainResponse } from '@/types/auth.types';

const DNS_GUIDE_STEPS = [
  'domainManager.guide.step1',
  'domainManager.guide.step2',
  'domainManager.guide.step3',
  'domainManager.guide.step4',
  'domainManager.guide.step5',
] as const;

const FINAL_GUIDE_STEPS = [
  'domainManager.guide.step6',
  'domainManager.guide.step7',
] as const;

type DnsRecordRow = {
  labelKey: string;
  value?: string;
  valueKey?: string;
  ltr?: boolean;
};

type DnsRecordBlock = {
  titleKey: string;
  rows: DnsRecordRow[];
};

const DNS_RECORD_BLOCKS: DnsRecordBlock[] = [
  {
    titleKey: 'domainManager.guide.cname.title',
    rows: [
      { labelKey: 'domainManager.guide.cname.name', valueKey: 'domainManager.guide.cname.nameValue', ltr: true },
      { labelKey: 'domainManager.guide.cname.type', valueKey: 'domainManager.guide.cname.typeValue', ltr: true },
      { labelKey: 'domainManager.guide.cname.pointsTo', value: CUSTOM_DOMAIN_CNAME_TARGET, ltr: true },
      { labelKey: 'domainManager.guide.cname.ttl', valueKey: 'domainManager.guide.cname.ttlValue', ltr: false },
    ],
  },
];

const resolveVerifyDomainMessageKey = (message?: string, success?: boolean): string => {
  if (success) return 'domainManager.verify.success';

  switch (message) {
    case 'No custom domain found':
      return 'domainManager.verify.noDomain';
    case 'DNS records are not configured correctly':
      return 'domainManager.verify.dnsMismatch';
    case 'SSL generation failed':
      return 'domainManager.verify.sslFailed';
    default:
      return 'domainManager.verify.error';
  }
};

const DnsRecordTable = ({ titleKey, rows }: DnsRecordBlock) => {
  const { t } = useLanguage();

  return (
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-primary/5">
      <div className="flex items-center gap-2 border-b border-primary/15 bg-primary/10 px-4 py-3">
        <Server className="h-4 w-4 text-primary" aria-hidden />
        <p className="text-sm font-semibold text-foreground">{t(titleKey)}</p>
      </div>
      <dl className="divide-y divide-border/80">
        {rows.map((row) => {
          const value = row.value ?? t(row.valueKey ?? '');
          return (
            <div
              key={row.labelKey}
              className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center sm:gap-4"
            >
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(row.labelKey)}
              </dt>
              <dd
                dir={row.ltr ? 'ltr' : undefined}
                className={`text-sm font-semibold text-foreground break-all ${row.ltr ? 'font-mono text-start' : ''}`}
              >
                {value}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

type GuideStepProps = {
  stepKey: string;
  index: number;
};

const GuideStep = ({ stepKey, index }: GuideStepProps) => {
  const { t } = useLanguage();

  return (
    <li className="flex gap-4 rounded-2xl border border-border bg-card/70 p-4 shadow-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {index + 1}
      </span>
      {stepKey === 'domainManager.guide.step7' ? (
        <p className="pt-1 text-sm leading-7 text-foreground">
          {t('domainManager.guide.step7.prefix')}
          <a
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-emerald-600 underline underline-offset-2 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400"
          >
            {t('domainManager.guide.step7.link')}
          </a>
          {t('domainManager.guide.step7.suffix')}
        </p>
      ) : (
        <p className="pt-1 text-sm leading-7 text-foreground">{t(stepKey)}</p>
      )}
    </li>
  );
};

const CustomDomainDnsGuide = () => {
  const { t } = useLanguage();
  const { verifyDomainMutation } = useAuth();
  const [verifyResult, setVerifyResult] = useState<VerifyDomainResponse | null>(null);

  const handleVerify = () => {
    setVerifyResult(null);
    verifyDomainMutation.mutate(undefined, {
      onSuccess: (data) => {
        setVerifyResult(data);
        const messageKey = resolveVerifyDomainMessageKey(data.message, data.success);
        if (data.success) {
          toast.success(t(messageKey));
        } else {
          toast.error(t(messageKey));
        }
      },
      onError: (error) => {
        toast.error(parseApiError(error, t('domainManager.verify.error')));
      },
    });
  };

  const resultMessageKey = verifyResult
    ? resolveVerifyDomainMessageKey(verifyResult.message, verifyResult.success)
    : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="glass-strong rounded-3xl p-6 glow-border"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Globe2 className="h-5 w-5" aria-hidden />
        </div>
        <div>
          <h3 className="font-heading text-xl font-semibold text-foreground">{t('domainManager.guide.title')}</h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">{t('domainManager.guide.intro')}</p>
        </div>
      </div>

      <ol className="mt-6 space-y-3">
        {DNS_GUIDE_STEPS.map((stepKey, index) => (
          <GuideStep key={stepKey} stepKey={stepKey} index={index} />
        ))}
      </ol>

      <div className="mt-6 space-y-4">
        {DNS_RECORD_BLOCKS.map((block) => (
          <DnsRecordTable key={block.titleKey} {...block} />
        ))}
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-500" aria-hidden />
        <p className="text-sm leading-7 text-muted-foreground">{t('domainManager.guide.note')}</p>
      </div>

      <ol className="mt-6 space-y-3">
        {FINAL_GUIDE_STEPS.map((stepKey, index) => (
          <GuideStep key={stepKey} stepKey={stepKey} index={DNS_GUIDE_STEPS.length + index} />
        ))}
      </ol>

      <button
        type="button"
        onClick={handleVerify}
        disabled={verifyDomainMutation.isPending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl gradient-bg py-3 text-sm font-semibold text-primary-foreground disabled:opacity-70"
      >
        {verifyDomainMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <ShieldCheck className="h-4 w-4" aria-hidden />
        )}
        {verifyDomainMutation.isPending ? t('domainManager.verify.verifying') : t('domainManager.verify.button')}
      </button>

      {verifyResult && resultMessageKey ? (
        <div
          role="status"
          className={cn(
            'mt-4 flex gap-3 rounded-2xl border px-4 py-3',
            verifyResult.success
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-destructive/30 bg-destructive/10',
          )}
        >
          {verifyResult.success ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" aria-hidden />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
          )}
          <p className="text-sm leading-7 text-foreground">{t(resultMessageKey)}</p>
        </div>
      ) : null}
    </motion.section>
  );
};

export default CustomDomainDnsGuide;
