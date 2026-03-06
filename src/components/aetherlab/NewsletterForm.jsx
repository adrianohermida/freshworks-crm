import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Integrar com seu serviço de email (EmailJS, etc.)
      setSuccess(true);
      setEmail('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao inscrever:', error);
    }
  };

  return (
    <div className="single-footer newsletter">
      <h3>Newsletters</h3>
      <p>Receba novidades e conteúdos sobre inovação e tecnologia.</p>

      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Endereço eletrônico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="sub-btn">
          <Mail className="w-4 h-4" />
        </button>
      </form>

      {success && (
        <div style={{ display: 'block', marginTop: '10px', color: '#4caf50' }}>
          Inscrição recebida com sucesso! Verifique sua caixa de entrada.
        </div>
      )}
    </div>
  );
}