"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";

type FormSubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function FormSubmitButton({
  children,
  pendingLabel = "Saving...",
  variant = "primary",
  className,
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant={variant} className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  );
}
