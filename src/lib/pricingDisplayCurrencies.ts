export type DisplayCurrencyOption = {
  code: string;
  symbol: string;
  labelAr: string;
  labelEn: string;
};

export const DISPLAY_CURRENCY_OPTIONS: DisplayCurrencyOption[] = [
  {
    code: "EGP",
    symbol: "E£",
    labelAr: "الجنيه المصري",
    labelEn: "Egyptian pound",
  },
  {
    code: "USD",
    symbol: "$",
    labelAr: "الدولار الأمريكي",
    labelEn: "US dollar",
  },
];

const SUPPORTED = new Set(
  DISPLAY_CURRENCY_OPTIONS.map((c) => c.code.toUpperCase()),
);

export const isSupportedDisplayCurrency = (code: string) =>
  SUPPORTED.has(code.toUpperCase());
