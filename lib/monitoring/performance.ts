/**
 * Performance Monitoring Utilities
 * Tracks and reports performance metrics
 */

import { logger } from "./logger";

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100;

  /**
   * Measure function execution time
   */
  async measure<T>(
    name: string,
    fn: () => Promise<T> | T
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric(name, duration, "ms");
      logger.logPerformance(name, duration);
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}_error`, duration, "ms");
      throw error;
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number, unit: string = "ms") {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow operations
    if (value > 1000) {
      logger.warn("Slow operation detected", {
        metric: name,
        duration: `${value}${unit}`,
      });
    }
  }

  /**
   * Get metrics summary
   */
  getMetrics(): {
    [key: string]: {
      count: number;
      avg: number;
      min: number;
      max: number;
    };
  } {
    const summary: {
      [key: string]: {
        count: number;
        total: number;
        min: number;
        max: number;
      };
    } = {};

    this.metrics.forEach((metric) => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          count: 0,
          total: 0,
          min: Infinity,
          max: -Infinity,
        };
      }

      const stat = summary[metric.name];
      stat.count++;
      stat.total += metric.value;
      stat.min = Math.min(stat.min, metric.value);
      stat.max = Math.max(stat.max, metric.value);
    });

    const result: {
      [key: string]: {
        count: number;
        avg: number;
        min: number;
        max: number;
      };
    } = {};

    Object.keys(summary).forEach((key) => {
      const stat = summary[key];
      result[key] = {
        count: stat.count,
        avg: stat.total / stat.count,
        min: stat.min,
        max: stat.max,
      };
    });

    return result;
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(name: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return performanceMonitor.measure(
        `${target.constructor.name}.${propertyKey}`,
        () => originalMethod.apply(this, args)
      );
    };

    return descriptor;
  };
}



