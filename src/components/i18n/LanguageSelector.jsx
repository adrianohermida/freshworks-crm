import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

/**
 * Language Selector Component
 * Suporta PT-BR, EN, ES
 */

const languages = {
  'pt-BR': { name: 'Português', flag: '🇧🇷' },
  'en': { name: 'English', flag: '🇺🇸' },
  'es': { name: 'Español', flag: '🇪🇸' }
};

export function useLanguage() {
  const [language, setLanguage] = React.useState(() => {
    return localStorage.getItem('language') || 'pt-BR';
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  return { language, changeLanguage, languages };
}

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{languages[language].flag}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
          {Object.entries(languages).map(([code, { name, flag }]) => (
            <button
              key={code}
              onClick={() => {
                changeLanguage(code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 flex items-center gap-2 ${
                language === code
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Translations mapping
 */
export const translations = {
  'pt-BR': {
    dashboard: 'Painel',
    processes: 'Processos',
    deadlines: 'Prazos',
    contacts: 'Contatos',
    settings: 'Configurações',
    add: 'Adicionar',
    edit: 'Editar',
    delete: 'Deletar',
    save: 'Salvar',
    cancel: 'Cancelar',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso'
  },
  'en': {
    dashboard: 'Dashboard',
    processes: 'Processes',
    deadlines: 'Deadlines',
    contacts: 'Contacts',
    settings: 'Settings',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success'
  },
  'es': {
    dashboard: 'Panel',
    processes: 'Procesos',
    deadlines: 'Plazos',
    contacts: 'Contactos',
    settings: 'Configuración',
    add: 'Agregar',
    edit: 'Editar',
    delete: 'Eliminar',
    save: 'Guardar',
    cancel: 'Cancelar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito'
  }
};

export function useTranslation() {
  const { language } = useLanguage();
  return translations[language] || translations['pt-BR'];
}