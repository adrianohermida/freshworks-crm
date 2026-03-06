
import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function Contact({ 
  title = "Entre em Contato",
  description = "Temos prazer em ouvir você. Envie-nos uma mensagem.",
  email = "contato@aetherlab.com",
  phone = "+55 (00) 0000-0000",
  address = "Rua Exemplo, 123 - São Paulo, SP",
  onSubmit = async (data) => {}
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await onSubmit(formData);
      setStatus('success');
      setMessage('Mensagem enviada com sucesso! Retornaremos em breve.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Erro ao enviar. Tente novamente.');
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Info */}
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          {email && (
            <div className="flex gap-4">
              <Mail className="w-6 h-6 text-[#7E57FF] flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                <a href={`mailto:${email}`} className="text-gray-600 dark:text-gray-400 hover:text-[#7E57FF]">
                  {email}
                </a>
              </div>
            </div>
          )}
          {phone && (
            <div className="flex gap-4">
              <Phone className="w-6 h-6 text-[#7E57FF] flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Telefone</p>
                <a href={`tel:${phone}`} className="text-gray-600 dark:text-gray-400 hover:text-[#7E57FF]">
                  {phone}
                </a>
              </div>
            </div>
          )}
          {address && (
            <div className="flex gap-4">
              <MapPin className="w-6 h-6 text-[#7E57FF] flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Endereço</p>
                <p className="text-gray-600 dark:text-gray-400">
                  {address}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Seu Nome"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7E57FF]"
        />
        <input
          type="email"
          name="email"
          placeholder="Seu Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7E57FF]"
        />
        <input
          type="text"
          name="subject"
          placeholder="Assunto"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7E57FF]"
        />
        <textarea
          name="message"
          placeholder="Sua Mensagem"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-white dark:bg-[#0f1419] border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7E57FF] resize-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-3 bg-[#7E57FF] hover:bg-[#6B4FD8] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {status === 'loading' ? 'Enviando...' : <>
            <Send className="w-5 h-5" />
            Enviar Mensagem
          </>}
        </button>

        {status === 'success' && (
          <div className="flex gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 text-sm">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm">{message}</p>
          </div>
        )}
      </form>
    </div>
  );
}

// Re-export Contact components
export { default as ContactForm } from './ContactForm';
export { default as ContactWidget } from './ContactWidget';
export { default as ContactSection } from './ContactSection';
export { default as MapSection } from './MapSection';
