"use client";

import { getSupportedCurrencies } from "@/lib/currency";
import type { CurrencyCode } from "@/types";

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const currencies = getSupportedCurrencies();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
      {currencies.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => onChange(code)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            value === code
              ? "bg-accent text-white shadow-sm"
              : "text-muted hover:bg-surface-elevated hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
