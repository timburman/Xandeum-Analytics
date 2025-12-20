"use client";

import { LayoutDashboard, Server, ExternalLink } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col h-screen sticky top-0">
      
      {/* Logo Section */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border/50">
        <div className="relative w-8 h-8">
          <img 
            src="/xandeum-logo.png" 
            alt="Xandeum" 
            className="object-contain w-full h-full" 
          />
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground">
          Xandeum<span className="text-primary">.Scope</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        
        <div className="px-2 py-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 pl-2">
            Platform
          </p>
          
          <NavLink 
            to="/" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground transition-all"
            activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
            end // Strict match for Home
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>

          <NavLink 
            to="/nodes" 
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground transition-all"
            activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Server className="h-4 w-4" />
            Validator Nodes
          </NavLink>
        </div>

        {/* Optional: External Links Section */}
        <div className="px-2 py-2 mt-4">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 pl-2">
            Resources
          </p>
          <a 
            href="https://www.xandeum.network/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/10 hover:text-foreground transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            Documentation
          </a>
        </div>

      </nav>

      {/* Footer / Version */}
      <div className="p-4 border-t border-border/50">
        <div className="bg-card/50 rounded-lg p-3 border border-border/50">
          <p className="text-xs font-semibold text-foreground">Xandeum Network</p>
          <div className="flex items-center gap-2 mt-1">
             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] text-muted-foreground">Mainnet Alpha Ready</p>
          </div>
        </div>
      </div>

    </aside>
  );
}