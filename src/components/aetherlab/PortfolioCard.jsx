import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY, SHADOWS } from './theme/ThemeConfig';

export default function PortfolioCard({ 
  image = "",
  title = "Projeto",
  category = "Design",
  link = "#",
  buttonText = "Ver Projeto"
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-all duration-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderRadius: '6px',
        marginBottom: '30px'
      }}
    >
      {/* Image */}
      <div
        className="overflow-hidden"
        style={{
          borderRadius: '6px'
        }}
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            transition: 'all 0.4s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute left-[15px] bottom-[15px] bg-white rounded-[5px] inline-block"
        style={{
          padding: '20px 35px 20px 20px',
          boxShadow: SHADOWS.sm
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: COLORS.text.body,
            margin: '0',
            fontFamily: TYPOGRAPHY.fontFamily,
            fontWeight: TYPOGRAPHY.weights.normal
          }}
        >
          {category}
        </p>

        <h4
          style={{
            marginTop: '5px',
            fontSize: '16px',
            fontWeight: TYPOGRAPHY.weights.bold,
            lineHeight: '28px',
            color: COLORS.text.heading,
            fontFamily: TYPOGRAPHY.fontFamily,
            margin: '5px 0 0 0'
          }}
        >
          {title}
        </h4>

        <a
          href={link}
          className="inline-block mt-3 px-7 py-2 border-2 border-white text-white rounded transition-all duration-300 hover:bg-white"
          style={{
            fontSize: '12px',
            fontWeight: TYPOGRAPHY.weights.medium,
            fontFamily: TYPOGRAPHY.fontFamily,
            textDecoration: 'none',
            color: 'white',
            borderColor: 'white',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = COLORS.primary;
            e.target.style.backgroundColor = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = 'white';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}