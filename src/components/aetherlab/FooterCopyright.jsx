import React from 'react';

export default function FooterCopyright({ 
  year = new Date().getFullYear(),
  companyName = 'LegalChain',
  creditsUrl = '#'
}) {
  return (
    <div className="border-t border-white/20 pt-8 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
        <p>
          © {year} {companyName}. Todos os direitos reservados.
        </p>
        
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-[#7e57ff] transition-colors">
            Política de Privacidade
          </a>
          <a href="#" className="hover:text-[#7e57ff] transition-colors">
            Termos de Serviço
          </a>
          <a 
            href={creditsUrl}
            className="text-[#7e57ff] hover:text-white transition-colors font-medium"
          >
            Desenvolvido por Aetherlab
          </a>
        </div>
      </div>
    </div>
  );
}