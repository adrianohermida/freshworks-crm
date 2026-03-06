import React, { useEffect } from 'react';

export default function AccessibilityEnhancer({ children }) {
  useEffect(() => {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Ir para conteúdo principal';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #000;
      color: #fff;
      padding: 8px;
      z-index: 100;
      border-radius: 0 0 4px 0;
    `;
    skipLink.onFocus = () => {
      skipLink.style.top = '0';
    };
    skipLink.onBlur = () => {
      skipLink.style.top = '-40px';
    };
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for modals
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeBtn = modal.querySelector('[aria-label*="close"], [aria-label*="fechar"]');
          closeBtn?.click();
        }
      }
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      skipLink.remove();
    };
  }, []);

  return (
    <div id="main-content" role="main" style={{ outline: 'none' }}>
      {children}
    </div>
  );
}