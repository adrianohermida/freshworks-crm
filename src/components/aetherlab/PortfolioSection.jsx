import React, { useState, useMemo } from 'react';
import PortfolioItem from './PortfolioItem';

export default function PortfolioSection({ 
  title = 'Portfolio',
  subtitle = 'Our Works',
  portfolioItems = [],
  categories = ['Todos'],
  onItemClick = null
}) {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Todos') {
      return portfolioItems;
    }
    return portfolioItems.filter(item => item.category === activeCategory);
  }, [activeCategory, portfolioItems]);

  return (
    <section
      style={{
        padding: '110px 0',
        position: 'relative'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Section Title */}
        {(title || subtitle) && (
          <div style={{
            textAlign: 'center',
            marginBottom: '60px',
            position: 'relative',
            zIndex: 5
          }}>
            {subtitle && (
              <h3 style={{
                fontSize: '15px',
                fontWeight: 600,
                display: 'inline-block',
                marginBottom: '20px',
                color: '#7E57FF',
                textTransform: 'capitalize',
                margin: 0
              }}>
                {subtitle}
              </h3>
            )}
            {title && (
              <h2 style={{
                fontSize: '34px',
                marginBottom: '20px',
                lineHeight: '42px',
                textTransform: 'capitalize',
                position: 'relative',
                fontWeight: 700,
                color: '#081828',
                margin: '20px 0 0 0'
              }}>
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Filter Buttons */}
        {categories.length > 0 && (
          <div style={{
            marginBottom: '60px',
            textAlign: 'center'
          }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '10px 23px',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: 'none',
                  backgroundColor: activeCategory === category ? '#7E57FF' : '#eff2f9',
                  color: activeCategory === category ? '#fff' : '#051441',
                  borderRadius: '6px',
                  marginRight: '10px',
                  marginBottom: '10px',
                  transition: 'all 0.3s ease-out',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== category) {
                    e.target.style.backgroundColor = '#7E57FF';
                    e.target.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== category) {
                    e.target.style.backgroundColor = '#eff2f9';
                    e.target.style.color = '#051441';
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Portfolio Grid */}
        <div style={{
          marginTop: '80px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {filteredItems.map((item) => (
            <PortfolioItem
              key={item.id}
              image={item.image}
              title={item.title}
              category={item.category}
              onViewClick={() => onItemClick && onItemClick(item)}
            />
          ))}
        </div>

        {/* No Items Message */}
        {filteredItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#727272'
          }}>
            <p>Nenhum projeto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}