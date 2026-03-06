import React from 'react';
import { useTheme } from 'next-themes';
import AIDocumentAnalyzer from '@/components/AIDocumentAnalyzer';

export default function DocumentAnalysisPage() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Document Analysis</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Automatic document classification, metadata extraction, and quality assessment
          </p>
        </div>

        {/* Main Component */}
        <AIDocumentAnalyzer />
      </div>
    </div>
  );
}