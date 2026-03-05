import React, { useState } from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function BlogCommentForm({ 
  title = "Deixe um Comentário",
  onSubmit = () => {}
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section
      style={{
        marginTop: '80px'
      }}
      className="md:mt-[60px] xs:mt-[40px]"
    >
      <h3
        style={{
          fontSize: '20px',
          fontWeight: TYPOGRAPHY.weights.bold,
          marginBottom: '30px',
          position: 'relative',
          zIndex: 1,
          textTransform: 'capitalize',
          fontFamily: TYPOGRAPHY.fontFamily,
          color: COLORS.black,
          margin: '0 0 30px 0'
        }}
        className="xs:text-[18px]"
      >
        {title}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Name & Email */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '20px'
          }}
          className="xs:grid-cols-1"
        >
          <div style={{ position: 'relative' }}>
            <label
              style={{
                color: COLORS.black,
                display: 'block',
                marginBottom: '10px',
                fontWeight: '400',
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: '14px'
              }}
            >
              Nome
            </label>
            <input
              type="text"
              name="name"
              placeholder="Seu Nome"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                border: 'none',
                fontSize: '15px',
                color: COLORS.black,
                padding: '0 25px',
                fontWeight: '400',
                height: '53px',
                border: '1px solid #eee',
                marginBottom: '20px',
                borderRadius: '6px',
                transition: 'all 0.4s ease',
                backgroundColor: COLORS.lightGray,
                fontFamily: TYPOGRAPHY.fontFamily,
                width: '100%',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = '#eee'}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label
              style={{
                color: COLORS.black,
                display: 'block',
                marginBottom: '10px',
                fontWeight: '400',
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: '14px'
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                border: 'none',
                fontSize: '15px',
                color: COLORS.black,
                padding: '0 25px',
                fontWeight: '400',
                height: '53px',
                border: '1px solid #eee',
                marginBottom: '20px',
                borderRadius: '6px',
                transition: 'all 0.4s ease',
                backgroundColor: COLORS.lightGray,
                fontFamily: TYPOGRAPHY.fontFamily,
                width: '100%',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = COLORS.primary}
              onBlur={(e) => e.target.style.borderColor = '#eee'}
            />
          </div>
        </div>

        {/* Message */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <label
            style={{
              color: COLORS.black,
              display: 'block',
              marginBottom: '10px',
              fontWeight: '400',
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: '14px'
            }}
          >
            Mensagem
          </label>
          <textarea
            name="message"
            placeholder="Sua Mensagem"
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              border: 'none',
              fontSize: '15px',
              color: COLORS.black,
              padding: '25px',
              fontWeight: '400',
              height: '180px',
              border: '1px solid #eee',
              borderRadius: '6px',
              transition: 'all 0.4s ease',
              backgroundColor: COLORS.lightGray,
              fontFamily: TYPOGRAPHY.fontFamily,
              width: '100%',
              boxSizing: 'border-box',
              resize: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = COLORS.primary}
            onBlur={(e) => e.target.style.borderColor = '#eee'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '12px 40px',
            borderRadius: '6px',
            backgroundColor: COLORS.primary,
            color: COLORS.white,
            border: 'none',
            fontSize: '14px',
            fontWeight: TYPOGRAPHY.weights.semibold,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: TYPOGRAPHY.fontFamily
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = '0.85';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Enviar Comentário
        </button>
      </form>
    </section>
  );
}