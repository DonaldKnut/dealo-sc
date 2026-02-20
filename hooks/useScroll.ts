import { useState, useEffect } from "react";

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Hook to track scroll position
 */
export function useScroll(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    window.addEventListener("scroll", updatePosition);
    updatePosition();

    return () => window.removeEventListener("scroll", updatePosition);
  }, []);

  return scrollPosition;
}

/**
 * Hook to check if user has scrolled past a threshold
 */
export function useScrollThreshold(threshold: number = 20): boolean {
  const [isScrolled, setIsScrolled] = useState(false);
  const { y } = useScroll();

  useEffect(() => {
    setIsScrolled(y > threshold);
  }, [y, threshold]);

  return isScrolled;
}



