import React, { useEffect } from 'react';
import GLightbox from 'glightbox';

/**
 * Lightbox Component
 * Wrapper for GLightbox library with Aetherlab theming
 */
export default function Lightbox({ selector = '.glightbox', options = {} }) {
  useEffect(() => {
    // Initialize GLightbox with custom options
    const lightbox = GLightbox({
      selector,
      openEffect: 'fade',
      closeEffect: 'fade',
      slideEffect: 'slide',
      ...options,
    });

    return () => {
      // Cleanup on unmount
      if (lightbox && lightbox.destroy) {
        lightbox.destroy();
      }
    };
  }, [selector, options]);

  return null;
}

/**
 * LightboxImage Component
 * Simple wrapper to create a lightbox-enabled image
 */
export function LightboxImage({
  src,
  thumb,
  title = '',
  description = '',
  className = '',
  alt = 'Image',
  ...props
}) {
  return (
    <a
      href={src}
      className={`glightbox ${className}`}
      data-glightbox={`title:${title};description:${description}`}
      {...props}
    >
      <img src={thumb || src} alt={alt} />
    </a>
  );
}

/**
 * LightboxGallery Component
 * Creates a gallery of lightbox-enabled images
 */
export function LightboxGallery({
  images = [],
  groupName = 'gallery',
  className = 'grid grid-cols-2 md:grid-cols-3 gap-4',
}) {
  return (
    <div className={className}>
      {images.map((image, index) => (
        <a
          key={index}
          href={image.src}
          className="glightbox overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          data-gallery={groupName}
          data-glightbox={`title:${image.title || ''};description:${image.description || ''}`}
        >
          <img
            src={image.thumb || image.src}
            alt={image.alt || `Gallery image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </a>
      ))}
    </div>
  );
}