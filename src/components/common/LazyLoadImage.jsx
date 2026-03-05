import React, { useRef, useEffect } from 'react';

/**
 * Componente de Imagem com Lazy Loading
 * Carrega imagem apenas quando visível na viewport
 */
export default function LazyLoadImage({ 
  src, 
  alt, 
  placeholder = '/placeholder.png',
  className = '',
  width,
  height,
  ...props 
}) {
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('opacity-0');
          observer.unobserve(img);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={placeholder}
      data-src={src}
      alt={alt}
      width={width}
      height={height}
      className={`opacity-0 transition-opacity duration-300 ${className}`}
      loading="lazy"
      {...props}
    />
  );
}