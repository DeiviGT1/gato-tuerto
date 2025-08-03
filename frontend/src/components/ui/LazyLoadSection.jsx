// src/components/ui/LazyLoadSection.jsx

import React, { useState, useRef, useEffect } from 'react';

function LazyLoadSection({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(placeholderRef.current);
        }
      },
      {
        rootMargin: '0px 0px 200px 0px',
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    return () => {
      if (placeholderRef.current) {
        observer.unobserve(placeholderRef.current);
      }
    };
  }, []);

  return isVisible ? (
    children
  ) : (
    <div ref={placeholderRef} style={{ minHeight: '200px', width: '100%' }} />
  );
}

export default LazyLoadSection;