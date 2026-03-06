import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function CallToActionSection({ 
  title = "Pronto para começar?",
  highlight = "Comece agora gratuitamente",
  buttonText = "Comece Agora",
  buttonUrl = "#pricing",
  bgShape = true
}) {
  return (
    <section className="call-action">
      <div className="container">
        <div className="inner-content">
          {bgShape && (
            <div 
              className="bg-shape"
              style={{
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, var(--color-primary), transparent)',
                filter: 'blur(60px)',
              }}
            />
          )}

          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="text">
                <h2>
                  {title}
                  <span>{highlight}</span>
                </h2>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="button">
                <a 
                  href={buttonUrl}
                  className="btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                  }}
                >
                  {buttonText}
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}