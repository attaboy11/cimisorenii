import { clsx } from "clsx";
import { ButtonHTMLAttributes } from "react";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 transition text-sm font-semibold",
        className
      )}
      {...props}
    />
  );
}
