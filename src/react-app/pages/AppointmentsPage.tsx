import Header from '../components/Header';

function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-28 max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold mb-4">Agendar Consulta</h1>
        <p className="text-white/70">Entre em contato para agendar seu atendimento jurídico.</p>
      </main>
    </div>
  );
}

export default AppointmentsPage;
