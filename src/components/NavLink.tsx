"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

// Define props compatible with the existing usage
interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string; // Map 'to' -> 'href' for Next.js
  activeClassName?: string;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, to, end, ...props }, ref) => {
    const pathname = usePathname();
    
    // Check if this link is active
    // We treat it as active if the current path starts with the link path
    // (e.g. /nodes/123 is active for /nodes)
    // Exception: Home ('/') is only active if exact match
    const isActive = to === "/" 
      ? pathname === "/" 
      : pathname?.startsWith(to);

    return (
      <Link
        ref={ref}
        href={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };