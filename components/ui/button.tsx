import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary: "bg-primary text-primary-foreground border-primary hover:bg-primary/90",
  secondary: "bg-white text-foreground border-border hover:bg-muted",
  ghost: "bg-transparent text-foreground border-transparent hover:bg-muted",
  destructive: "bg-destructive text-white border-destructive hover:bg-destructive/90"
};

const sizes = {
  md: "h-12 px-4 text-base",
  sm: "h-10 px-3 text-sm",
  icon: "h-11 w-11 p-0"
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

function classNames(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg border font-medium transition",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
