import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';

export default function TestimonialSlider({
  title = 'Testimonials',
  subtitle = 'What Clients Say',
  testimonials = [],
  autoplay = false,
  autoplayDelay = 5000
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoplay || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section
      style={{
        backgroundColor: '#F4F7FA',
        position: 'relative',
        paddingTop: '110px',
        paddingBottom: '180px'
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
            marginBottom: '50px',
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

        {/* Slider */}
        {testimonials.length > 0 && (
          <div style={{ position: 'relative' }}>
            {/* Testimonial Cards */}
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  display: 'flex',
                  transition: 'transform 0.4s ease',
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: '100%',
                      paddingRight: '20px'
                    }}
                  >
                    <TestimonialCard
                      content={testimonial.content}
                      authorName={testimonial.authorName}
                      authorRole={testimonial.authorRole}
                      authorImage={testimonial.authorImage}
                      quoteIcon={testimonial.quoteIcon}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            {testimonials.length > 1 && (
              <div
                style={{
                  textAlign: 'center',
                  position: 'absolute',
                  bottom: '90px',
                  transform: 'translateX(-50%)',
                  width: '100%',
                  left: '50%',
                  zIndex: 9,
                  margin: 0
                }}
              >
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    style={{
                      height: '6px',
                      width: index === currentIndex ? '25px' : '14px',
                      backgroundColor: index === currentIndex ? '#7E57FF' : '#081828',
                      borderRadius: '5px',
                      display: 'inline-block',
                      border: 'none',
                      margin: '0px 5px',
                      transition: 'all 0.4s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.style.backgroundColor = '#7E57FF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (index !== currentIndex) {
                        e.currentTarget.style.backgroundColor = '#081828';
                      }
                    }}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {testimonials.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#727272'
          }}>
            <p>Nenhum testemunho disponível no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}