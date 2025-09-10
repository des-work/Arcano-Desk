import { useCallback, useMemo, useRef } from 'react';

// Memoization utilities for performance optimization

export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback(
    ((...args: Parameters<T>) => {
      return callbackRef.current(...args);
    }) as T,
    deps
  );
};

export const useStableMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  const factoryRef = useRef(factory);
  factoryRef.current = factory;

  return useMemo(() => {
    return factoryRef.current();
  }, deps);
};

// Deep comparison hook for objects
export const useDeepMemo = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  const prevDepsRef = useRef<React.DependencyList>([]);
  const resultRef = useRef<T>();

  const depsChanged = deps.some((dep, index) => {
    const prevDep = prevDepsRef.current[index];
    return !deepEqual(dep, prevDep);
  });

  if (depsChanged || resultRef.current === undefined) {
    resultRef.current = factory();
    prevDepsRef.current = deps;
  }

  return resultRef.current;
};

// Deep equality check
const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (typeof a !== typeof b) return false;
  
  if (typeof a !== 'object') return a === b;
  
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
};

// Memoized selector hook
export const useMemoizedSelector = <T>(
  selector: () => T,
  deps: React.DependencyList
): T => {
  return useDeepMemo(selector, deps);
};

// Cache hook for expensive computations
export const useCache = <K, V>(
  keyFactory: () => K,
  valueFactory: (key: K) => V,
  deps: React.DependencyList
): V => {
  const cacheRef = useRef<Map<string, V>>(new Map());
  
  return useMemo(() => {
    const key = keyFactory();
    const keyString = JSON.stringify(key);
    
    if (cacheRef.current.has(keyString)) {
      return cacheRef.current.get(keyString)!;
    }
    
    const value = valueFactory(key);
    cacheRef.current.set(keyString, value);
    
    // Limit cache size
    if (cacheRef.current.size > 100) {
      const firstKey = cacheRef.current.keys().next().value;
      cacheRef.current.delete(firstKey);
    }
    
    return value;
  }, deps);
};

// Debounced value hook
export const useDebouncedValue = <T>(
  value: T,
  delay: number
): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Throttled value hook
export const useThrottledValue = <T>(
  value: T,
  delay: number
): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value);
  const lastUpdateRef = useRef<number>(0);
  
  React.useEffect(() => {
    const now = Date.now();
    
    if (now - lastUpdateRef.current >= delay) {
      setThrottledValue(value);
      lastUpdateRef.current = now;
    } else {
      const timeout = setTimeout(() => {
        setThrottledValue(value);
        lastUpdateRef.current = Date.now();
      }, delay - (now - lastUpdateRef.current));
      
      return () => clearTimeout(timeout);
    }
  }, [value, delay]);
  
  return throttledValue;
};

// Memoized async function hook
export const useMemoizedAsync = <T, P extends any[]>(
  asyncFn: (...args: P) => Promise<T>,
  deps: React.DependencyList
) => {
  const cacheRef = useRef<Map<string, Promise<T>>>(new Map());
  
  return useCallback(async (...args: P): Promise<T> => {
    const key = JSON.stringify(args);
    
    if (cacheRef.current.has(key)) {
      return cacheRef.current.get(key)!;
    }
    
    const promise = asyncFn(...args);
    cacheRef.current.set(key, promise);
    
    // Clean up resolved promises
    promise.finally(() => {
      cacheRef.current.delete(key);
    });
    
    return promise;
  }, deps);
};

// Memoized filter hook
export const useMemoizedFilter = <T>(
  items: T[],
  filterFn: (item: T) => boolean,
  deps: React.DependencyList
): T[] => {
  return useMemo(() => {
    return items.filter(filterFn);
  }, [items, ...deps]);
};

// Memoized sort hook
export const useMemoizedSort = <T>(
  items: T[],
  sortFn: (a: T, b: T) => number,
  deps: React.DependencyList
): T[] => {
  return useMemo(() => {
    return [...items].sort(sortFn);
  }, [items, ...deps]);
};

// Memoized group hook
export const useMemoizedGroup = <T, K extends string | number>(
  items: T[],
  groupFn: (item: T) => K,
  deps: React.DependencyList
): Record<K, T[]> => {
  return useMemo(() => {
    return items.reduce((groups, item) => {
      const key = groupFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }, [items, ...deps]);
};

// Memoized search hook
export const useMemoizedSearch = <T>(
  items: T[],
  searchTerm: string,
  searchFn: (item: T, term: string) => boolean,
  deps: React.DependencyList
): T[] => {
  return useMemo(() => {
    if (!searchTerm.trim()) return items;
    return items.filter(item => searchFn(item, searchTerm));
  }, [items, searchTerm, ...deps]);
};

// Import React for the hooks that need it
import React from 'react';
