import React, { useEffect } from 'react';

export default function PWAMetaTags() {
  useEffect(() => {
    // Dynamically set manifest link
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.href = '/functions/manifest';
    } else {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/functions/manifest';
      document.head.appendChild(link);
    }

    // Set theme color
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (!themeColor) {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#0f766e';
      document.head.appendChild(meta);
    }

    // Set apple-touch-icon
    const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleTouchIcon) {
      const link = document.createElement('link');
      link.rel = 'apple-touch-icon';
      link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect fill='%230f766e' width='180' height='180'/%3E%3Ctext x='50%' y='50%' font-size='90' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EFD%3C/text%3E%3C/svg%3E";
      document.head.appendChild(link);
    }
  }, []);

  return null;
}