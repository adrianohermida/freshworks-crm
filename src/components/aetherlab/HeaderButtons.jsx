import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeaderButtons({ 
  isDark = false,
  onSignIn,
  onSignUp 
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSignIn}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          isDark
            ? 'text-gray-300 hover:text-[#7e57ff]'
            : 'text-gray-700 hover:text-[#7e57ff]'
        }`}
      >
        Entrar
      </button>

      <Button
        onClick={onSignUp}
        className="px-6 py-2 bg-[#7e57ff] text-white hover:bg-[#6b4cc9] font-semibold rounded-lg transition-all duration-300"
      >
        Começar
      </Button>
    </div>
  );
}