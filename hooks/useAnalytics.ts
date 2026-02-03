"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logPageView } from '@/lib/analytics';

/**
 * Hook to automatically track page views
 * Use this in your layout or individual pages
 */
export const usePageTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      // Get page title from document or generate from pathname
      const pageTitle = document.title || pathname;
      logPageView(pathname, pageTitle);
    }
  }, [pathname]);
};

/**
 * Hook to provide analytics functions in components
 */
export const useAnalytics = () => {
  const pathname = usePathname();

  return {
    currentPath: pathname,
    // You can add more analytics helpers here if needed
  };
};
