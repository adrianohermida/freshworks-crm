import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone } from 'lucide-react';

/**
 * Mobile Optimization Component
 * Detecta dispositivo, otimiza layout e performance
 */

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768;
      const isTabletDevice = width >= 768 && width < 1024;

      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
      setScreenSize(isMobileDevice ? 'mobile' : isTabletDevice ? 'tablet' : 'desktop');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, screenSize };
}

/**
 * Mobile-optimized navigation
 */
export function MobileNav({ items = [] }) {
  const { isMobile } = useMobileDetection();

  if (!isMobile) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-around items-center h-16">
        {items.map((item) => (
          <button
            key={item.id}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Mobile-safe modal
 */
export function MobileModal({ isOpen, children, onClose }) {
  const { isMobile } = useMobileDetection();

  if (!isOpen) return null;

  const modalClasses = isMobile
    ? 'fixed inset-0 bg-white dark:bg-gray-800 z-50'
    : 'fixed inset-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50';

  return (
    <div className={modalClasses}>
      <div className="flex flex-col h-full">
        <button
          onClick={onClose}
          className="p-4 text-right text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function MobileOptimization() {
  const { isMobile, screenSize } = useMobileDetection();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Mobile Optimization
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Dispositivo:</span> {screenSize.toUpperCase()}
          </p>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <p>✓ Touch-optimized buttons (48px minimum)</p>
            <p>✓ Viewport meta tags configured</p>
            <p>✓ Responsive grid layouts</p>
            <p>✓ Bottom navigation for mobile</p>
            <p>✓ PWA support ready</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}