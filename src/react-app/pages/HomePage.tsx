import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { ChatWidget } from '../components/ChatWidget';

function HomePage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <ChatWidget />
      <Header />
      <main className="pt-28 max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-extrabold mb-4">Advocacia especializada em superendividamento</h1>
        <p className="text-white/70 mb-8">Analisamos seu caso e ajudamos a renegociar dívidas com segurança jurídica.</p>
        <div className="flex flex-wrap gap-3">
          <a href="https://wa.me/5551996032004" target="_blank" rel="noopener noreferrer" className="bg-brand-primary px-5 py-3 rounded-xl font-bold">Falar no WhatsApp</a>
          <Link to="/contato" className="bg-white/10 px-5 py-3 rounded-xl font-bold">Agendar consulta</Link>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
