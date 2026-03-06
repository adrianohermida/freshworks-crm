import Header from '../components/Header';

function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-28 max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold mb-4">Sobre</h1>
        <p className="text-white/70">Escritório focado em soluções para superendividamento e defesa do consumidor.</p>
      </main>
    </div>
  );
}

export default AboutPage;
