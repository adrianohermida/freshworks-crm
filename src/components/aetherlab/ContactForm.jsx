import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactForm({ 
  title = "Entre em Contato",
  email = "contato@legaldock.com",
  phone = "+55 (92) 3000-0000",
  address = "Manaus, Amazonas, Brasil",
  onSubmit = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (onSubmit) {
      await onSubmit(formData);
    } else {
      console.log('Form submitted:', formData);
    }
    
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="contact-us section">
      <div className="container">
        <div className="row">
          {/* Contact Form */}
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <h3 className="form-title">{title}</h3>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="Seu Nome"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      placeholder="Seu Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Seu Telefone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      placeholder="Assunto"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="form-group">
                    <textarea
                      name="message"
                      placeholder="Sua Mensagem"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="button">
                    <button type="submit" className="btn">
                      <Send size={16} style={{ marginRight: '8px' }} />
                      Enviar Mensagem
                    </button>
                  </div>
                  
                  {submitted && (
                    <div style={{
                      marginTop: 'var(--spacing-md)',
                      padding: 'var(--spacing-md)',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      color: 'var(--color-success)',
                      borderRadius: 'var(--border-radius-sm)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      ✓ Mensagem enviada com sucesso!
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="contact-widget-wrapper">
              <div className="main-title">
                <h2>Informações de Contato</h2>
                <p>Entre em contato conosco para dúvidas ou sugestões sobre a plataforma.</p>
              </div>

              <div className="contact-widget-block">
                <h3>
                  <Mail size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Email
                </h3>
                <p>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </div>

              <div className="contact-widget-block">
                <h3>
                  <Phone size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Telefone
                </h3>
                <p>
                  <a href={`tel:${phone}`}>{phone}</a>
                </p>
              </div>

              <div className="contact-widget-block">
                <h3>
                  <MapPin size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Localização
                </h3>
                <p>{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}