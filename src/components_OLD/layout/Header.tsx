"use client";

import { RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Next.js Image

const REFRESH_INTERVAL = 30;

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  useEffect(() => {
    if (isRefreshing) {
      setCountdown(REFRESH_INTERVAL);
    }
  }, [isRefreshing]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return REFRESH_INTERVAL;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setCountdown(REFRESH_INTERVAL);
    onRefresh();
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3"> {/* Reduced py slightly for cleaner look */}
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8"> {/* Fixed container for logo */}
              <Image 
                src="/xandeum-logo.png" 
                alt="Xandeum Logo" 
                fill 
                className="object-contain" // Ensures logo fits perfectly without stretching
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight leading-none">
                Xandeum Scope
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider mt-0.5">
                pNode Analytics
              </p>
            </div>
          </div>

          {/* Search Bar (Visual Only) */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                placeholder="Search pNodes by PubKey or IP..." 
                className="w-full bg-secondary/30 border border-border rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Refresh Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground hidden sm:flex">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs">Live Update</span>
              <span className="font-mono text-xs opacity-50">({countdown}s)</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="h-9"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}