import { Headphones, MapPin, Zap } from "lucide-react";

const TRUST_ITEMS = [
  {
    icon: MapPin,
    label: "Envíos a todo el país",
  },
  {
    icon: Headphones,
    label: "Atención Personalizada",
  },
  {
    icon: Zap,
    label: "Cotización Rápida",
  },
] as const;

export function TrustBadges() {
  return (
    <div className="grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
      {TRUST_ITEMS.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2.5 rounded-lg bg-surface-elevated px-3 py-2.5"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <span className="text-xs font-medium leading-snug text-muted">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
