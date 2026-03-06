import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function HeroSection({
  subtitle = "Bem-vindo ao LegalDock",
  title = "Gerencie seus processos jurídicos com inteligência",
  description = "Sincronize dados dos principais tribunais do Brasil, organize prazos e movimentações processuais em uma única plataforma.",
  primaryButton = {
    text: "Começar Agora",
    onClick: () => {},
    variant: "primary"
  },
  secondaryButton = {
    text: "Ver Demo",
    onClick: () => {},
    variant: "secondary"
  },
  backgroundImage = null,
  heroImage = null,
  fullHeight = true
}) {
  return (
    <section 
      className="hero-area" 
      style={{
        minHeight: fullHeight ? '100vh' : 'auto',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
      }}
    >
      {/* Hero Shapes */}
      {backgroundImage && (
        <div className="hero-shapes" />
      )}

      <div className="container">
        <div className="row align-items-center">
          {/* Hero Content */}
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
            <div className="hero-content">
              {subtitle && (
                <h4>{subtitle}</h4>
              )}

              <h1>{title}</h1>

              {description && (
                <p>{description}</p>
              )}

              <div className="button">
                {primaryButton && (
                  <button
                    className={`btn ${primaryButton.variant === 'secondary' ? 'btn-alt' : ''}`}
                    onClick={primaryButton.onClick}
                  >
                    {primaryButton.text}
                    <ArrowRight size={16} />
                  </button>
                )}

                {secondaryButton && (
                  <button
                    className="btn btn-alt"
                    onClick={secondaryButton.onClick}
                  >
                    {secondaryButton.text}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          {heroImage && (
            <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12">
              <div className="hero-image">
                <img 
                  src={heroImage} 
                  alt="Hero Image" 
                  className="main-image"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}