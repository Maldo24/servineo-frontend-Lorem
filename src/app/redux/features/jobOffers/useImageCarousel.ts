// src/hooks/useImageCarousel.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useImageCarousel = (id: string, totalImages: number) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);

  // Estados para touch/swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const [isTouching, setIsTouching] = useState(false);

  const clearCurrentInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      isActiveRef.current = false;
    }
  }, []);

  const startCarousel = useCallback(() => {
    if (totalImages <= 1) return;

    if (isActiveRef.current) return;

    clearCurrentInterval();

    isActiveRef.current = true;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 2000);
  }, [totalImages, clearCurrentInterval]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    startCarousel();
  }, [startCarousel]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    clearCurrentInterval();
    setCurrentIndex(0);
  }, [clearCurrentInterval]);

  const handlePrevImage = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      clearCurrentInterval();
      setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
    },
    [totalImages, clearCurrentInterval],
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      clearCurrentInterval();
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    },
    [totalImages, clearCurrentInterval],
  );

  // Touch handlers para swipe
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      setIsTouching(true);
      clearCurrentInterval();
    },
    [clearCurrentInterval],
  );

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % totalImages);
      } else {
        setCurrentIndex((prev) => (prev - 1 + totalImages) % totalImages);
      }
    }
  }, [totalImages]);

  useEffect(() => {
    // Solo activar en mobile
    const isMobile = window.innerWidth < 1024;
    if (!isMobile || !elementRef.current || totalImages <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio > 0.5;
          setIsVisible(visible);

          if (visible) {
            startCarousel();
          } else {
            clearCurrentInterval();
            setCurrentIndex(0);
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '-10% 0px -10% 0px',
      },
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
      clearCurrentInterval();
    };
  }, [startCarousel, clearCurrentInterval, totalImages]);

  useEffect(() => {
    return () => {
      clearCurrentInterval();
    };
  }, [clearCurrentInterval]);

  return {
    currentIndex,
    isHovered,
    isTouching,
    isVisible,
    elementRef,
    handleMouseEnter,
    handleMouseLeave,
    handlePrevImage,
    handleNextImage,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
