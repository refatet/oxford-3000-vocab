/**
 * Performance utility functions for the Oxford 3000 vocabulary learning app
 */

/**
 * Debounce function to limit how often a function can be called
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit how often a function can be called
 * @param func Function to throttle
 * @param limit Limit time in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measure performance of a function
 * @param func Function to measure
 * @param label Label for performance measurement
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  func: T,
  label: string
): (...args: Parameters<T>) => ReturnType<T> {
  return function(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = func(...args);
    const end = performance.now();
    console.log(`${label}: ${end - start}ms`);
    return result;
  };
}

/**
 * Simple in-memory cache
 */
export class SimpleCache<T> {
  private cache: Map<string, { value: T; timestamp: number }> = new Map();
  private readonly ttl: number;
  
  /**
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  constructor(ttl: number = 5 * 60 * 1000) {
    this.ttl = ttl;
  }
  
  /**
   * Get value from cache
   * @param key Cache key
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      return undefined;
    }
    
    // Check if item is expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * Set value in cache
   * @param key Cache key
   * @param value Value to cache
   */
  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }
  
  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Lazy load image
 * @param imageUrl Image URL
 * @param onLoad Callback when image is loaded
 */
export function lazyLoadImage(
  imageUrl: string,
  onLoad?: (image: HTMLImageElement) => void
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    
    image.onload = () => {
      if (onLoad) {
        onLoad(image);
      }
      resolve(image);
    };
    
    image.onerror = (error) => {
      reject(error);
    };
    
    image.src = imageUrl;
  });
}
