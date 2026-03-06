import { useEffect, useRef, useState } from 'react';

/**
 * Custom Hook - Intersection Observer
 * Detecta quando elemento entra em viewport
 */

export function useIntersectionObserver(ref, options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, {
      threshold: 0.1,
      ...options
    });

    if (ref.current) {
      observerRef.current.observe(ref.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [ref, options]);

  return { isVisible };
}