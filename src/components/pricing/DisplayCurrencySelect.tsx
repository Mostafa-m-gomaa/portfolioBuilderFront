import { useLanguage } from "@/contexts/LanguageContext";
import { DISPLAY_CURRENCY_OPTIONS } from "@/lib/pricingDisplayCurrencies";

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
      <label
        htmlFor="pricing-display-currency"
        className="mb-2 block text-start text-sm text-muted-foreground md:text-center"
      >
        {t("pricing.chooseCurrency")}
      </label>
      <select
        id="pricing-display-currency"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[240px] rounded-xl border border-border bg-card px-4 py-2 text-foreground shadow-sm"
      >
        {DISPLAY_CURRENCY_OPTIONS.map((item) => (
          <option key={item.code} value={item.code}>
            {isAr ? item.labelAr : item.labelEn} ({item.code})
          </option>
        ))}
      </select>
    </div>
  );
};

export default DisplayCurrencySelect;
