export type CurrencyCode = "PYG" | "BRL" | "USD";

export interface ExchangeRate {
  code: CurrencyCode;
  rate: number;
  symbol: string;
  locale: string;
}

export interface CurrencyConfig {
  base: CurrencyCode;
  rates: Record<CurrencyCode, ExchangeRate>;
}
