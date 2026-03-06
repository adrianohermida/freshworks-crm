import React, { useState, useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Lazy Loading para imagens pesadas
 * Implementa Intersection Observer para carregar sob demanda
 */

export default function LazyLoadImage({ src, alt, className = '', width, height }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
          };
          img.onerror = () => {
            setError(true);
            setIsLoading(false);
          };
          img.src = src;
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        ✗ Erro ao carregar imagem
      </div>
    );
  }

  return (
    <div ref={imgRef} className={className}>
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <img src={imageSrc} alt={alt} width={width} height={height} className="w-full h-auto" />
      )}
    </div>
  );
}