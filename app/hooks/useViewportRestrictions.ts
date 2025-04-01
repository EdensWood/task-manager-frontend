// hooks/useViewportRestrictions.ts
"use client";

import { useEffect } from "react";

export function useViewportRestrictions(minWidth = 320) {
  useEffect(() => {
    // Set initial min-width
    document.documentElement.style.minWidth = `${minWidth}px`;
    
    const handleResize = () => {
      if (window.innerWidth < minWidth) {
        document.documentElement.style.minWidth = `${minWidth}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [minWidth]);
}