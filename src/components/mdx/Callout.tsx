import type { ReactNode } from "react";
import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

const VARIANTS = {
  tip: {
    icon: Lightbulb,
    className: "border-l-emerald-500/60 *:[svg]:text-emerald-600 dark:*:[svg]:text-emerald-400",
    label: "Tip",
  },
  info: {
    icon: Info,
    className: "border-l-sky-500/60 *:[svg]:text-sky-600 dark:*:[svg]:text-sky-400",
    label: "Info",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-l-amber-500/60 *:[svg]:text-amber-600 dark:*:[svg]:text-amber-400",
    label: "Warning",
  },
} as const;

export function Callout({
  type = "info",
  children,
}: {
  type?: keyof typeof VARIANTS;
  children: ReactNode;
}) {
  const variant = VARIANTS[type];
  const Icon = variant.icon;
  return (
    <Alert className={cn("my-6 border-l-4 bg-muted/30", variant.className)}>
      <Icon aria-hidden />
      <AlertTitle>{variant.label}</AlertTitle>
      <AlertDescription className="[&>p]:my-0">{children}</AlertDescription>
    </Alert>
  );
}
