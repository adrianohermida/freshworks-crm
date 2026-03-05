import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQSection({ 
  title = "Perguntas Frequentes",
  subtitle = "Encontre respostas para suas dúvidas",
  faqs = [
    {
      id: 1,
      question: "Como integrar meus processos existentes?",
      answer: "Você pode integrar seus processos através da sincronização com DataJud. Basta conectar sua conta e selecionar os tribunais desejados."
    },
    {
      id: 2,
      question: "Quais são os requisitos de segurança?",
      answer: "Utilizamos criptografia de nível enterprise e seguimos todas as normas LGPD e CNJ para proteger seus dados."
    },
    {
      id: 3,
      question: "Posso exportar meus dados?",
      answer: "Sim, você pode exportar dados em diversos formatos como PDF, Excel e Google Sheets a qualquer momento."
    },
    {
      id: 4,
      question: "Qual é o tempo de implementação?",
      answer: "Normalmente entre 3 a 7 dias úteis, dependendo da complexidade da sua estrutura."
    }
  ]
}) {
  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <section className="faq section">
      <div className="container">
        {/* Section Title */}
        {(title || subtitle) && (
          <div className="section-title">
            {title && <h2 style={{ fontSize: '34px', marginBottom: '20px' }}>{title}</h2>}
            {subtitle && <p style={{ fontSize: '16px', color: 'var(--color-body)' }}>{subtitle}</p>}
          </div>
        )}

        {/* Accordion */}
        <div className="accordion">
          {faqs.map((faq) => (
            <div key={faq.id} className="accordion-item">
              <button
                className={`accordion-button ${expanded === faq.id ? '' : 'collapsed'}`}
                onClick={() => toggleAccordion(faq.id)}
                aria-expanded={expanded === faq.id}
              >
                <span className="title">{faq.question}</span>
                <ChevronDown 
                  size={18} 
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    transition: 'transform 0.3s ease',
                    transform: expanded === faq.id ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)'
                  }}
                />
              </button>

              {expanded === faq.id && (
                <div className="accordion-collapse">
                  <div className="accordion-body">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}