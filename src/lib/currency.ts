import exchangeRatesData from "@/data/mock/exchange-rates.json";
import type { CurrencyCode, CurrencyConfig } from "@/types";

const config = exchangeRatesData as CurrencyConfig;

export function convertPrice(
  amountInBase: number,
  targetCurrency: CurrencyCode
): number {
  const rate = config.rates[targetCurrency]?.rate ?? 1;
  return amountInBase * rate;
}

export function formatPrice(
  amountInBase: number,
  currency: CurrencyCode = "PYG"
): string {
  const converted = convertPrice(amountInBase, currency);
  const { symbol, locale } = config.rates[currency];

  if (currency === "PYG") {
    return `${symbol} ${Math.round(converted).toLocaleString(locale)}`;
  }

  return `${symbol} ${converted.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrencyConfig(): CurrencyConfig {
  return config;
}

export function getSupportedCurrencies(): CurrencyCode[] {
  return Object.keys(config.rates) as CurrencyCode[];
}
