import Header from '../components/Header';

function BlogPage() {
  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-28 max-w-4xl mx-auto px-4 pb-16">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-white/70">Conteúdo em atualização.</p>
      </main>
    </div>
  );
}

export default BlogPage;
