import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';
import { Send } from 'lucide-react';

export default function FooterNewsletterSection({ 
  title = "Newsletter",
  description = "Inscreva-se para receber nossas atualizações",
  placeholder = "Seu email...",
  onSubscribe = () => {}
}) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubscribe(email);
    setEmail('');
  };

  return (
    <div
      style={{
        paddingLeft: '80px'
      }}
      className="lg:pl-[80px] md:pl-0"
    >
      <h3
        style={{
          fontSize: '17px',
          fontWeight: TYPOGRAPHY.weights.semibold,
          display: 'block',
          marginBottom: '35px',
          color: COLORS.white,
          fontFamily: TYPOGRAPHY.fontFamily,
          margin: '0 0 35px 0'
        }}
        className="md:mb-[25px] xs:mb-[25px]"
      >
        {title}
      </h3>

      {description && (
        <p
          style={{
            color: COLORS.white,
            fontSize: '15px',
            fontFamily: TYPOGRAPHY.fontFamily,
            fontWeight: '400',
            marginBottom: '20px'
          }}
        >
          {description}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '30px', position: 'relative' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          style={{
            height: '52px',
            width: '100%',
            borderRadius: '8px',
            border: 'none',
            boxShadow: 'none',
            textShadow: 'none',
            paddingLeft: '18px',
            paddingRight: '70px',
            transition: 'all 0.4s ease',
            backgroundColor: '#ffffff1f',
            color: COLORS.white,
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: '15px',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => e.target.style.backgroundColor = '#ffffff29'}
          onBlur={(e) => e.target.style.backgroundColor = '#ffffff1f'}
        />

        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '0px',
            top: '0',
            height: '52px',
            width: '52px',
            borderRadius: '0 8px 8px 0',
            backgroundColor: '#ffffff29',
            color: COLORS.white,
            textAlign: 'center',
            lineHeight: '52px',
            border: 'none',
            boxShadow: 'none',
            textShadow: 'none',
            fontSize: '18px',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = COLORS.white;
            e.target.style.backgroundColor = COLORS.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.color = COLORS.white;
            e.target.style.backgroundColor = '#ffffff29';
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}