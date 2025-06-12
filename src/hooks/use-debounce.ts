import { useState, useEffect } from "react";

/**
 * Debounce hook that delays updating a value until after a specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay is complete
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Advanced debounce hook with immediate execution option
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @param immediate - Whether to execute immediately on first call
 * @returns The debounced value
 */
export function useDebounceAdvanced<T>(
  value: T,
  delay: number,
  immediate: boolean = false
): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isFirstRun, setIsFirstRun] = useState(true);

  useEffect(() => {
    // Execute immediately on first run if immediate is true
    if (immediate && isFirstRun) {
      setDebouncedValue(value);
      setIsFirstRun(false);
      return;
    }

    // Set up debounced execution
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsFirstRun(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, immediate, isFirstRun]);

  return debouncedValue;
}

/**
 * Debounce hook with callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds
 * @param dependencies - Dependencies for the callback
 * @returns The debounced callback function
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  dependencies: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [callback, delay, ...dependencies]);

  return debouncedCallback;
}
