import Header from '../components/Header';

function ContactPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-28 max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold mb-4">Contato</h1>
        <p className="text-white/70 mb-6">Entre em contato pelo WhatsApp ou e-mail.</p>
        <div className="space-y-2">
          <a className="block text-brand-primary" href="https://wa.me/5551996032004" target="_blank" rel="noopener noreferrer">WhatsApp: (51) 99603-2004</a>
          <a className="block text-brand-primary" href="mailto:contato@hermidamaia.adv.br">contato@hermidamaia.adv.br</a>
        </div>
      </main>
    </div>
  );
}

export default ContactPage;
