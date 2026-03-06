import { createContext, useContext, useState } from 'react';

const translations = {
  "pt-BR": {
    "common": {
      "dashboard": "Dashboard",
      "tickets": "Tickets",
      "contacts": "Contatos",
      "agents": "Agentes",
      "analytics": "Analytics",
      "status": "Status",
      "portal": "Portal",
      "settings": "Configurações",
      "language": "Idioma",
      "theme": "Tema",
      "logout": "Sair",
      "save": "Salvar",
      "cancel": "Cancelar",
      "delete": "Deletar",
      "edit": "Editar",
      "create": "Criar",
      "search": "Buscar",
      "loading": "Carregando...",
      "error": "Erro",
      "success": "Sucesso"
    },
    "dashboard": {
      "title": "Dashboard",
      "subtitle": "Visão geral de tickets e performance",
      "totalTickets": "Total de Tickets",
      "openTickets": "Abertos",
      "pendingTickets": "Pendentes",
      "resolvedTickets": "Resolvidos",
      "urgentTickets": "Urgentes",
      "avgResolutionTime": "Tempo Médio de Resolução",
      "resolutionRate": "Taxa de Resolução",
      "slaAtRisk": "SLA em Risco"
    }
  },
  "en-US": {
    "common": {
      "dashboard": "Dashboard",
      "tickets": "Tickets",
      "contacts": "Contacts",
      "agents": "Agents",
      "analytics": "Analytics",
      "status": "Status",
      "portal": "Portal",
      "settings": "Settings",
      "language": "Language",
      "theme": "Theme",
      "logout": "Logout",
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "create": "Create",
      "search": "Search",
      "loading": "Loading...",
      "error": "Error",
      "success": "Success"
    },
    "dashboard": {
      "title": "Dashboard",
      "subtitle": "Overview of tickets and performance",
      "totalTickets": "Total Tickets",
      "openTickets": "Open",
      "pendingTickets": "Pending",
      "resolvedTickets": "Resolved",
      "urgentTickets": "Urgent",
      "avgResolutionTime": "Average Resolution Time",
      "resolutionRate": "Resolution Rate",
      "slaAtRisk": "SLA at Risk"
    }
  },
  "es-ES": {
    "common": {
      "dashboard": "Panel",
      "tickets": "Tickets",
      "contacts": "Contactos",
      "agents": "Agentes",
      "analytics": "Analítica",
      "status": "Estado",
      "portal": "Portal",
      "settings": "Configuración",
      "language": "Idioma",
      "theme": "Tema",
      "logout": "Cerrar Sesión",
      "save": "Guardar",
      "cancel": "Cancelar",
      "delete": "Eliminar",
      "edit": "Editar",
      "create": "Crear",
      "search": "Buscar",
      "loading": "Cargando...",
      "error": "Error",
      "success": "Éxito"
    },
    "dashboard": {
      "title": "Panel",
      "subtitle": "Descripción general de tickets y desempeño",
      "totalTickets": "Tickets Totales",
      "openTickets": "Abiertos",
      "pendingTickets": "Pendientes",
      "resolvedTickets": "Resueltos",
      "urgentTickets": "Urgentes",
      "avgResolutionTime": "Tiempo Promedio de Resolución",
      "resolutionRate": "Tasa de Resolución",
      "slaAtRisk": "SLA en Riesgo"
    }
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('app_language');
    if (stored && Object.keys(translations).includes(stored)) {
      return stored;
    }
    return 'pt-BR';
  });

  const changeLanguage = (newLang) => {
    if (Object.keys(translations).includes(newLang)) {
      setLanguage(newLang);
      localStorage.setItem('app_language', newLang);
    }
  };

  const t = (key, defaultValue = key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    return value || defaultValue;
  };

  return (
    <I18nContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider');
  }
  return context;
};

export const supportedLanguages = [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸' }
];