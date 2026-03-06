import React from 'react';
import { Mail } from 'lucide-react';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    const input = e.target.querySelector('input');
    if (input?.value) {
      console.log('Newsletter signup:', input.value);
      input.value = '';
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row pb-60">
          {/* About Section */}
          <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <div className="single-footer f-about">
              <div className="logo">
                <img src="https://via.placeholder.com/130x40?text=LegalDock" alt="LegalDock" />
              </div>
              <p>
                Gerenciamento completo de processos judicais com integração DataJud.
                Sincronize, monitore e organize seus casos em um único lugar.
              </p>
              <span className="social-title">Siga-nos</span>
              <ul className="social">
                <li>
                  <a href="#linkedin" title="LinkedIn">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#twitter" title="Twitter">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#facebook" title="Facebook">
                    Facebook
                  </a>
                </li>
              </ul>
              <div className="copyright-text">
                <span>© 2026 LegalDock</span>
                <span>Powered by Base44</span>
                <a href="#privacy">Política de Privacidade</a>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="col-lg-2 col-md-6 col-sm-6 col-xs-12">
            <div className="single-footer f-link">
              <h3>Produtos</h3>
              <ul>
                <li>
                  <a href="#features">Recursos</a>
                </li>
                <li>
                  <a href="#pricing">Preços</a>
                </li>
                <li>
                  <a href="#integrations">Integrações</a>
                </li>
                <li>
                  <a href="#security">Segurança</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Company Section */}
          <div className="col-lg-2 col-md-6 col-sm-6 col-xs-12">
            <div className="single-footer f-link">
              <h3>Empresa</h3>
              <ul>
                <li>
                  <a href="#about">Sobre</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Carreiras</a>
                </li>
                <li>
                  <a href="#contact">Contato</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="col-lg-4 col-md-6 col-sm-6 col-xs-12">
            <div className="single-footer newsletter">
              <h3>Newsletter</h3>
              <p>Receba as últimas notícias e atualizações sobre processos judiciais.</p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Seu email"
                  required
                  aria-label="Email para newsletter"
                />
                <div className="button">
                  <button type="submit" className="sub-btn" title="Inscrever-se">
                    <Mail size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright Area */}
        <div className="copyright-area">
          <div className="inner-content">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <p>
                  LegalDock © 2026. Todos os direitos reservados.
                </p>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div className="copyright-owner">
                  <p>
                    <a href="#terms">Termos de Serviço</a> | 
                    <a href="#privacy"> Privacidade</a> | 
                    <a href="#cookies"> Cookies</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}