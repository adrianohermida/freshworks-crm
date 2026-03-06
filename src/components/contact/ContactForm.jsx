import React, { useState } from 'react';
import Button from '@/components/aetherlab/Button';
import Input from '@/components/aetherlab/Input';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div style={{ position: 'relative', backgroundColor: '#F4F7FA', padding: 'var(--spacing-2xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-2xl)' }}>
          {/* Form Section */}
          <div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-heading)'
            }}>
              Envie uma Mensagem
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <Input
                type="text"
                name="name"
                placeholder="Seu Nome"
                value={formData.name}
                onChange={handleChange}
                size="md"
                variant="outline"
              />

              <Input
                type="email"
                name="email"
                placeholder="seu.email@example.com"
                value={formData.email}
                onChange={handleChange}
                size="md"
                variant="outline"
              />

              <Input
                type="tel"
                name="phone"
                placeholder="(11) 9999-9999"
                value={formData.phone}
                onChange={handleChange}
                size="md"
                variant="outline"
              />

              <textarea
                name="message"
                placeholder="Digite sua mensagem aqui..."
                value={formData.message}
                onChange={handleChange}
                style={{
                  height: '200px',
                  border: '1px solid #eee',
                  borderRadius: '5px',
                  padding: 'var(--spacing-md)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-heading)',
                  transition: 'all 0.4s ease',
                  resize: 'none',
                  backgroundColor: '#F4F7FA',
                }}
                onFocus={(e) => e.target.style.borderColor = '#7E57FF'}
                onBlur={(e) => e.target.style.borderColor = '#eee'}
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                style={{ marginTop: 'var(--spacing-md)' }}
              >
                Enviar Mensagem
              </Button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
              <h2 style={{
                fontSize: '28px',
                fontWeight: 700,
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.4,
                color: 'var(--color-heading)'
              }}>
                Entre em Contato Conosco
              </h2>
              <p style={{
                fontSize: 'var(--font-size-base)',
                color: 'var(--color-body)',
                lineHeight: 1.6
              }}>
                Estamos aqui para ajudar. Envie sua mensagem e responderemos em breve.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-heading)'
                }}>
                  📧 Email
                </h3>
                <p style={{
                  margin: 0,
                  color: 'var(--color-body)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  contato@example.com
                </p>
              </div>

              <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-heading)'
                }}>
                  📱 Telefone
                </h3>
                <p style={{
                  margin: 0,
                  color: 'var(--color-body)',
                  fontSize: 'var(--font-size-base)'
                }}>
                  +55 (11) 3000-0000
                </p>
              </div>

              <div>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-heading)'
                }}>
                  📍 Endereço
                </h3>
                <p style={{
                  margin: 0,
                  color: 'var(--color-body)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 1.6
                }}>
                  Av. Paulista, 1000<br />
                  São Paulo, SP 01311-100<br />
                  Brasil
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}