import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Wrapper para lazy loading de componentes com Framer Motion
 * Renderiza conteúdo apenas quando visível na viewport
 */
export function LazyLoadWrapper({ 
  children, 
  delay = 0.1,
  threshold = 0.1,
  fallback = null
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay, duration: 0.3, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      ) : (
        fallback
      )}
    </div>
  );
}

/**
 * Lazy load para listas
 */
export function LazyLoadList({ 
  items = [], 
  renderItem,
  itemDelay = 0.05,
  threshold = 0.1
}) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <LazyLoadWrapper 
          key={item.id || index} 
          delay={itemDelay * index}
          threshold={threshold}
        >
          {renderItem(item, index)}
        </LazyLoadWrapper>
      ))}
    </div>
  );
}