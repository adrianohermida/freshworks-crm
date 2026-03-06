import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function ErrorPage({ 
  code = "404",
  title = "Página não encontrada",
  message = "Desculpe, a página que você está procurando não existe ou foi removida.",
  homeLink = "/"
}) {
  const handleGoHome = () => {
    window.location.href = homeLink;
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <section className="error-area">
      <div className="d-table">
        <div className="d-table-cell">
          <div className="error-content">
            <h1>{code}</h1>
            <h2>{title}</h2>
            <p>{message}</p>

            <div className="button">
              <button 
                onClick={handleGoBack}
                className="btn"
                style={{
                  marginRight: 'var(--spacing-md)'
                }}
              >
                <ArrowLeft size={16} />
                Voltar
              </button>

              <button 
                onClick={handleGoHome}
                className="btn"
              >
                <Home size={16} />
                Ir para Inicial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}