import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

export type TextTag = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// Using descriptive words for the size prop
type TextSize =
    | "xs"      // formerly 14
    | "sm"      // formerly 16
    | "base"    // formerly 18
    | "lg"      // formerly 24
    | "xl"      // formerly 30
    | "2xl"     // formerly 50
    | "3xl"     // formerly 70
    | "4xl"     // formerly 70
    | "custom";

type TextProps = PropsWithChildren<{
    as?: TextTag;
    size?: TextSize;
    className?: string;
}>;

/**
 * Mapping semantic size names to responsive Tailwind classes.
 */
const sizeClasses: Record<Exclude<TextSize, "custom">, string> = {
    "4xl": "text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight",
    "3xl": "text-4xl md:text-5xl lg:text-7xl leading-tight",
    "2xl": "text-3xl md:text-4xl lg:text-[50px] leading-snug",
    "xl": "text-2xl md:text-[30px] leading-normal",
    "lg": "text-xl md:text-[24px] leading-normal",
    "base": "text-base md:text-[18px] leading-relaxed",
    "sm": "text-sm md:text-[16px] leading-relaxed",
    "xs": "text-xs md:text-[14px] leading-relaxed",
};

export const Text = ({
    as: Tag = "p",
    size = "custom",
    className = "",
    children,
}: TextProps) => {
    const sizeClass = size !== "custom" ? sizeClasses[size] : "";

    return (
        <Tag className={cn(sizeClass, className)}>
            {children}
        </Tag>
    );
};