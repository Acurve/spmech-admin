"use client";

import { PropsWithChildren, AnchorHTMLAttributes } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkVariant = | "button-outline" | "button" | "custom" | "button-brand";

interface LinkTagProps extends PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>> {
    variant?: LinkVariant;
    href?: string;
    notLink?: boolean;
}

// Atomic style constants for better maintainability
const UNDERLINE_BASE = "relative transition-all duration-500 after:absolute after:left-0 after:right-0 after:-bottom-1.5 after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:will-change-transform after:transform-gpu";
const UNDERLINE_HOVER = "hover:after:origin-left hover:after:scale-x-100";
const BUTTON_BASE = "h-12 px-6 rounded-full flex items-center justify-center transition-all duration-500 w-max";

const variantClasses: Record<LinkVariant, { base?: string; hover?: string; active?: string }> = {

    "button-outline": {
        base: `${BUTTON_BASE} border border-foreground text-foreground`,
        hover: "hover:bg-foreground hover:text-white",
        active: "bg-foreground text-white",
    },
    "button": {
        base: `${BUTTON_BASE} bg-foreground text-white`,
        hover: "hover:opacity-90",
        active: "scale-[0.98]",
    },
    "button-brand": {
        base: `${BUTTON_BASE} bg-brand text-white`,
        hover: "hover:opacity-90",
        active: "scale-[0.98]",
    },
    "custom": {},
};

export const LinkTag = ({
    children,
    className = "",
    variant = "custom",
    href = "",
    notLink = false,
    ...props
}: LinkTagProps) => {
    const pathname = usePathname();

    // Strict check for active state; handles empty hrefs safely

    const isActive = href ? pathname === href : false

    const styles = variantClasses[variant];

    const combinedClassName = cn(
        styles.base,
        isActive ? styles.active : styles.hover,
        notLink && "cursor-pointer",
        className
    );

    if (notLink) {
        return (
            <span role="button" className={combinedClassName} {...(props as any)}>
                {children}
            </span>
        );
    }

    return (
        <Link href={href} className={combinedClassName} {...props}>
            {children}
        </Link>
    );
};
