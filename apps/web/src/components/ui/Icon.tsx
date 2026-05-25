import { type SVGProps, type JSX } from "react";

export type IconName =
  | "search" | "cart" | "user" | "heart" | "heart-filled"
  | "star" | "star-filled" | "menu" | "chev-down" | "chev-right"
  | "plus" | "minus" | "x" | "check" | "bolt" | "eye"
  | "info" | "warn" | "err" | "spark" | "truck" | "shield"
  | "refresh" | "arr-right" | "arr-left" | "grid" | "tag";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

const P: Record<IconName, JSX.Element> = {
  "search":       <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  "cart":         <><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1.2"/><circle cx="18" cy="21" r="1.2"/></>,
  "user":         <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  "heart":        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  "heart-filled": <path fill="currentColor" stroke="none" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  "star":         <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  "star-filled":  <path fill="currentColor" stroke="none" d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z"/>,
  "menu":         <><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></>,
  "chev-down":    <path d="m6 9 6 6 6-6"/>,
  "chev-right":   <path d="m9 6 6 6-6 6"/>,
  "plus":         <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  "minus":        <path d="M5 12h14"/>,
  "x":            <><path d="m18 6-12 12"/><path d="m6 6 12 12"/></>,
  "check":        <path d="m4 12 5 5L20 6"/>,
  "bolt":         <path d="M13 2 3 14h7v8l10-12h-7V2z"/>,
  "eye":          <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
  "info":         <><circle cx="12" cy="12" r="10"/><path d="M12 8v.01M11 12h1v5h1"/></>,
  "warn":         <><path d="M12 3 2 21h20L12 3z"/><path d="M12 9v5"/><path d="M12 17.5v.01"/></>,
  "err":          <><circle cx="12" cy="12" r="10"/><path d="m9 9 6 6M15 9l-6 6"/></>,
  "spark":        <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/>,
  "truck":        <><path d="M3 17V6h13v11"/><path d="M16 9h4l3 4v4h-7"/><circle cx="7.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></>,
  "shield":       <path d="M12 2 4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z"/>,
  "refresh":      <><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>,
  "arr-right":    <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
  "arr-left":     <><path d="M19 12H5"/><path d="m11 5-7 7 7 7"/></>,
  "grid":         <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  "tag":          <><path d="M3 12V3h9l9 9-9 9-9-9z"/><circle cx="7.5" cy="7.5" r="1.2"/></>,
};

/**
 * Icon — biblioteca inline de SVG genéricos.
 * @example <Icon name="cart" size={20} />
 */
export function Icon({ name, size = 20, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={strokeWidth}
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      {P[name]}
    </svg>
  );
}
