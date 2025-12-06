"use client";

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const REFRESH_INTERVAL = 30;

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Header({ onRefresh, isRefreshing }: HeaderProps) {
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  // Reset countdown when refresh happens
  useEffect(() => {
    if (isRefreshing) {
      setCountdown(REFRESH_INTERVAL);
    }
  }, [isRefreshing]);

  // Countdown timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Optional: You could trigger onRefresh() here for auto-refresh
          return REFRESH_INTERVAL;
        }
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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">X</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground tracking-tight">
                Xandeum pNodes
              </h1>
              <p className="text-xs text-muted-foreground">Analytics Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Live</span>
              <span className="font-mono text-xs">({countdown}s)</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}