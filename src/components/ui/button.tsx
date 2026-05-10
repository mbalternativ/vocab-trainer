import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { clsx } from "clsx";

type ButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
        {
          "bg-slate-900 text-white hover:bg-slate-800": variant === "primary",
          "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50": variant === "secondary",
          "text-slate-700 hover:bg-slate-100": variant === "ghost",
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
