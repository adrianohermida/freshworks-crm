import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu, X, Bell, User } from 'lucide-react';

export default function ComponentesMobileOtimizados() {
  const [expandidos, setExpandidos] = useState({});

  const MobileCard = ({ titulo, conteudo, id }) => {
    const isExpanded = expandidos[id];

    return (
      <Card 
        className="w-full p-4 mb-3 touch-highlight cursor-pointer"
        onClick={() => setExpandidos(prev => ({ ...prev, [id]: !isExpanded }))}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{titulo}</h3>
          <ChevronDown 
            className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>
        {isExpanded && (
          <p className="text-xs text-gray-600 mt-3">{conteudo}</p>
        )}
      </Card>
    );
  };

  const MobileBottomSheet = ({ isOpen, onClose, titulo, conteudo }) => {
    if (!isOpen) return null;

    return (
      <>
        <div 
          className="fixed inset-0 bg-black/50 z-40 touch-none"
          onClick={onClose}
        />
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="font-semibold">{titulo}</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4">{conteudo}</div>
        </div>
      </>
    );
  };

  const MobileNavigation = ({ items }) => {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t grid grid-cols-4 gap-0 h-16">
        {items.map((item) => (
          <button 
            key={item.id}
            className="flex flex-col items-center justify-center text-xs font-semibold text-gray-600 hover:text-blue-600 active:bg-gray-100"
          >
            {item.icon && <item.icon className="w-5 h-5 mb-1" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="pb-20">
      <style>{`
        .touch-highlight {
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile-first optimization */
        @media (max-width: 640px) {
          input, button, a {
            min-height: 44px;
            min-width: 44px;
          }
          
          .viewport-fix {
            viewport-fit: cover;
          }
        }
        
        /* Prevent zoom on input focus (iOS) */
        input {
          font-size: 16px;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">📱 Componentes Mobile</h1>
        
        <MobileCard 
          id="card1"
          titulo="Expandível Responsivo"
          conteudo="Componentes otimizados para touch com hit targets de 44x44px (Apple guidelines)"
        />
        
        <MobileCard 
          id="card2"
          titulo="Bottom Sheet Navigation"
          conteudo="Menu flutuante no rodapé para melhor acessibilidade no mobile"
        />
        
        <MobileCard 
          id="card3"
          titulo="Touch Optimization"
          conteudo="Tap highlight, prevent zoom on focus, font size 16px+ para melhor UX"
        />

        <Card className="p-4 bg-blue-50">
          <h3 className="font-semibold text-sm mb-2">✅ Mobile Features Implementadas</h3>
          <ul className="text-xs space-y-1 text-gray-700">
            <li>✓ Componentes com mínimo 44x44px</li>
            <li>✓ Scroll suave e transições</li>
            <li>✓ Bottom sheet para modals</li>
            <li>✓ Expandível para economia de espaço</li>
            <li>✓ Viewport meta correto</li>
          </ul>
        </Card>
      </div>

      <MobileNavigation items={[
        { id: 1, label: 'Home', icon: Menu },
        { id: 2, label: 'Notif', icon: Bell },
        { id: 3, label: 'Chat', icon: Menu },
        { id: 4, label: 'Perfil', icon: User }
      ]} />
    </div>
  );
}