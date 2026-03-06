import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useSupabaseSession } from '../hooks/useSupabaseSession';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const session = useSupabaseSession();
  const user = session?.user;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-brand-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="text-white font-extrabold">Hermida Maia</Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <Link to="/" className="text-white/80 hover:text-brand-primary">Início</Link>
          <Link to="/sobre" className="text-white/80 hover:text-brand-primary">Sobre</Link>
          <Link to="/contato" className="text-white/80 hover:text-brand-primary">Contato</Link>
          {user ? (
            <button onClick={handleLogout} className="text-white/80 hover:text-brand-primary flex items-center gap-1"><LogOut size={16} />Sair</button>
          ) : (
            <Link to="/login" className="text-white/80 hover:text-brand-primary flex items-center gap-1"><User size={16} />Login</Link>
          )}
        </nav>

        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen((v) => !v)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 p-4 flex flex-col gap-3 bg-brand-dark">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Início</Link>
          <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Sobre</Link>
          <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)} className="text-white">Contato</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
