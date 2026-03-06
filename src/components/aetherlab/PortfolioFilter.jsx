import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function PortfolioFilter({ 
  categories = [],
  onCategoryChange = () => {},
  activeCategory = "All"
}) {
  if (categories.length === 0) return null;

  return (
    <div
      className="flex flex-wrap justify-center gap-2"
      style={{
        marginBottom: '0',
        textAlign: 'center'
      }}
    >
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategoryChange(category)}
          style={{
            padding: '10px 23px',
            fontSize: '14px',
            fontWeight: TYPOGRAPHY.weights.medium,
            border: 'none',
            background: activeCategory === category ? COLORS.primary : '#eff2f9',
            color: activeCategory === category ? COLORS.white : '#051441',
            borderRadius: '6px',
            marginRight: '10px',
            marginBottom: '10px',
            transition: 'all 0.3s ease-out',
            cursor: 'pointer',
            fontFamily: TYPOGRAPHY.fontFamily
          }}
          onMouseEnter={(e) => {
            if (activeCategory !== category) {
              e.target.style.background = COLORS.primary;
              e.target.style.color = COLORS.white;
            }
          }}
          onMouseLeave={(e) => {
            if (activeCategory !== category) {
              e.target.style.background = '#eff2f9';
              e.target.style.color = '#051441';
            }
          }}
          className="sm:px-[18px] sm:py-[7px] md:px-[18px] md:py-[7px]"
        >
          {category}
        </button>
      ))}
    </div>
  );
}