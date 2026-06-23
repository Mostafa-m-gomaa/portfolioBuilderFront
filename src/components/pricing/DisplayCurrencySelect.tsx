import { useLanguage } from "@/contexts/LanguageContext";
import { DISPLAY_CURRENCY_OPTIONS } from "@/lib/pricingDisplayCurrencies";
import { PRICING_CURRENCY_SELECT_ID } from "@/lib/pricingDisplayCurrencyStorage";

type Props = {
  value: string;
  onChange: (code: string) => void;
  className?: string;
};

const DisplayCurrencySelect = ({ value, onChange, className }: Props) => {
  const { t, lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <div className={className}>
      <div className="mb-2 block text-start text-sm text-muted-foreground md:text-center">{t("pricing.chooseCurrency")}</div>
      <div className="flex flex-wrap items-center gap-2">
        {DISPLAY_CURRENCY_OPTIONS.map((item) => {
          const selected = String(value).toUpperCase() === item.code.toUpperCase();
          return (
            <label
              key={item.code}
              className={`inline-flex items-center gap-3 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-shadow ${selected
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-foreground border-border hover:shadow-sm'
                }`}
            >
              <input
                type="radio"
                name={PRICING_CURRENCY_SELECT_ID}
                value={item.code}
                checked={selected}
                onChange={() => onChange(item.code)}
                className="sr-only"
              />
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{isAr ? item.labelAr : item.labelEn}</span>
                <span className="text-xs text-muted-foreground">({item.code})</span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayCurrencySelect;
