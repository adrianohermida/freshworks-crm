import React from 'react';
import { useTranslation, supportedLanguages } from './useTranslation';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {supportedLanguages.map(lang => (
        <Button
          key={lang.code}
          variant={language === lang.code ? 'default' : 'ghost'}
          size="sm"
          title={lang.name}
          className="h-8 w-8 p-0"
          onClick={() => changeLanguage(lang.code)}
        >
          {lang.flag}
        </Button>
      ))}
    </div>
  );
}