"use client";

import { useEffect, useCallback } from 'react';
import { 
  startTrace, 
  stopTrace, 
  measureOperation,
  putTraceAttribute,
  putTraceMetric 
} from '@/lib/performance';

/**
 * Hook to measure component render time
 * @param componentName - Name of the component
 */
export const useRenderPerformance = (componentName: string) => {
  useEffect(() => {
    const traceName = `${componentName}_render`;
    startTrace(traceName);

    return () => {
      stopTrace(traceName);
    };
  }, [componentName]);
};

/**
 * Hook to measure async operations with performance tracking
 */
export const useTrackedOperation = () => {
  const trackedOperation = useCallback(
    async <T>(
      operationName: string,
      operation: () => Promise<T>,
      attributes?: Record<string, string>
    ): Promise<T> => {
      return measureOperation(operationName, operation, attributes);
    },
    []
  );

  return { trackedOperation };
};

/**
 * Hook to manually control traces
 */
export const useTrace = () => {
  const start = useCallback((traceName: string) => {
    startTrace(traceName);
  }, []);

  const stop = useCallback((traceName: string) => {
    stopTrace(traceName);
  }, []);

  const addMetric = useCallback((traceName: string, metricName: string, value: number) => {
    putTraceMetric(traceName, metricName, value);
  }, []);

  const addAttribute = useCallback((traceName: string, attributeName: string, value: string) => {
    putTraceAttribute(traceName, attributeName, value);
  }, []);

  return {
    startTrace: start,
    stopTrace: stop,
    addMetric,
    addAttribute,
  };
};
