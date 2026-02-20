"use client";

import { useEffect } from "react";
import { logger } from "@/lib/monitoring/logger";
import dynamic from "next/dynamic";

/**
 * Client-side Performance Monitor
 * Tracks Core Web Vitals and performance metrics
 */
function PerformanceMonitorComponent() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Track Core Web Vitals - use dynamic import to avoid SSR issues
    const initWebVitals = async () => {
      try {
        // Use dynamic import - Next.js won't analyze this at build time
        // because it's inside a client component with ssr: false
        const webVitalsModule: any = await import(
          /* webpackIgnore: true */ "web-vitals"
        );
        const { onCLS, onFID, onFCP, onLCP, onTTFB, onINP } = webVitalsModule;
        
        if (onCLS) {
          onCLS((metric: any) => {
            logger.logPerformance("CLS", metric.value, "");
            sendToAnalytics(metric);
          });
        }

        if (onFID) {
          onFID((metric: any) => {
            logger.logPerformance("FID", metric.value, "ms");
            sendToAnalytics(metric);
          });
        }

        if (onFCP) {
          onFCP((metric: any) => {
            logger.logPerformance("FCP", metric.value, "ms");
            sendToAnalytics(metric);
          });
        }

        if (onLCP) {
          onLCP((metric: any) => {
            logger.logPerformance("LCP", metric.value, "ms");
            sendToAnalytics(metric);
          });
        }

        if (onTTFB) {
          onTTFB((metric: any) => {
            logger.logPerformance("TTFB", metric.value, "ms");
            sendToAnalytics(metric);
          });
        }

        if (onINP) {
          onINP((metric: any) => {
            logger.logPerformance("INP", metric.value, "ms");
            sendToAnalytics(metric);
          });
        }
      } catch (error) {
        // web-vitals not available, skip Core Web Vitals tracking
        if (process.env.NODE_ENV === "development") {
          console.warn("web-vitals not available:", error);
        }
      }
    };

    // Delay initialization slightly to ensure module is loaded
    const timer = setTimeout(() => {
      initWebVitals();
    }, 100);

    // Track page load time
    if (window.performance) {
      window.addEventListener("load", () => {
        const navigation = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          logger.logPerformance("Page Load", pageLoadTime, "ms");

          // Log detailed timing
          logger.info("Page Performance", {
            dns: `${navigation.domainLookupEnd - navigation.domainLookupStart}ms`,
            tcp: `${navigation.connectEnd - navigation.connectStart}ms`,
            request: `${navigation.responseStart - navigation.requestStart}ms`,
            response: `${navigation.responseEnd - navigation.responseStart}ms`,
            domProcessing: `${navigation.domComplete - navigation.domInteractive}ms`,
            total: `${pageLoadTime}ms`,
          });
        }
      });
    }

    return () => clearTimeout(timer);
  }, []);

  return null;
}

// Use Next.js dynamic import with ssr: false to prevent build-time resolution
const PerformanceMonitor = dynamic(() => Promise.resolve(PerformanceMonitorComponent), {
  ssr: false,
});

export default PerformanceMonitor;

function sendToAnalytics(metric: any) {
  // Send to analytics service (Google Analytics, etc.)
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", metric.name, {
      value: Math.round(metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
    });
  }

  // Send to Sentry for performance monitoring
  if (typeof window !== "undefined" && (window as any).Sentry) {
    (window as any).Sentry.metrics.distribution(metric.name, metric.value, {
      tags: {
        id: metric.id,
      },
    });
  }
}

