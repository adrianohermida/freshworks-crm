import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export default function FooterNewsletter({ isDark = false }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular envio
    setTimeout(() => {
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
        Newsletter
      </h3>
      <p className="text-gray-300 text-sm">
        Receba as últimas atualizações e notícias
      </p>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full h-12 px-4 pr-12 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:border-[#7e57ff] focus:outline-none transition-all duration-300"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-[#7e57ff] transition-colors disabled:opacity-50"
        >
          <Mail className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}