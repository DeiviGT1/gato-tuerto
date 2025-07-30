// src/components/ui/LazyLoadSection.jsx

import React, { useState, useRef, useEffect } from 'react';

function LazyLoadSection({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    // El Intersection Observer es la API del navegador que nos permite
    // saber cuándo un elemento entra en la pantalla.
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando el placeholder es visible, actualizamos el estado.
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Una vez que es visible, dejamos de observar para no hacer trabajo extra.
          observer.unobserve(placeholderRef.current);
        }
      },
      {
        // El 'rootMargin' hace que empecemos a cargar el componente 200px
        // ANTES de que entre en la pantalla, para que cuando el usuario
        // llegue, ya esté listo.
        rootMargin: '0px 0px 200px 0px',
      }
    );

    if (placeholderRef.current) {
      observer.observe(placeholderRef.current);
    }

    // Limpiamos el observador cuando el componente se desmonta.
    return () => {
      if (placeholderRef.current) {
        observer.unobserve(placeholderRef.current);
      }
    };
  }, []);

  // Si es visible, renderizamos los hijos (el componente real).
  // Si no, renderizamos un placeholder con una altura mínima para 
  // evitar saltos en el layout (Layout Shift).
  return isVisible ? (
    children
  ) : (
    <div ref={placeholderRef} style={{ minHeight: '200px', width: '100%' }} />
  );
}

export default LazyLoadSection;