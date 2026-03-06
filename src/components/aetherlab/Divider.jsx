import React from 'react';

export default function Divider({ 
  orientation = 'horizontal', 
  variant = 'default',
  margin = 'md',
  className = '' 
}) {
  const margins = {
    sm: 'var(--spacing-md)',
    md: 'var(--spacing-lg)',
    lg: 'var(--spacing-xl)',
  };

  const variants = {
    default: { borderColor: 'var(--color-border)' },
    subtle: { borderColor: '#f0f0f5' },
    strong: { borderColor: 'var(--color-heading)' },
  };

  const isHorizontal = orientation === 'horizontal';

  const style = {
    border: 'none',
    borderRight: !isHorizontal ? '1px solid' : 'none',
    borderTop: isHorizontal ? '1px solid' : 'none',
    margin: isHorizontal ? `${margins[margin]} 0` : `0 ${margins[margin]}`,
    height: !isHorizontal ? '100%' : 'auto',
    width: isHorizontal ? '100%' : 'auto',
    ...variants[variant],
  };

  return <div style={style} className={className} />;
}