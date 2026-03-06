import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

export default function ExportButton({ data, filename = 'advise-sync' }) {
  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      <Download className="w-4 h-4 mr-2" />
      JSON
    </Button>
  );
}