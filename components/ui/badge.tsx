import { clsx } from "clsx";

export function Badge({ label, className }: { label: string; className?: string }) {
  return <span className={clsx("badge bg-slate-800 border border-slate-700", className)}>{label}</span>;
}
