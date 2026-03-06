import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const toastIcons = {
  success: { icon: CheckCircle2, bg: 'bg-green-50', border: 'border-l-green-500', text: 'text-green-800' },
  error: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-l-red-500', text: 'text-red-800' },
  info: { icon: Info, bg: 'bg-blue-50', border: 'border-l-blue-500', text: 'text-blue-800' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-l-amber-500', text: 'text-amber-800' }
};

export default function ToastNotification() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (event) => {
      const { message, type = 'info', duration = 3000 } = event.detail;
      const id = Date.now();

      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm">
      {toasts.map((toast) => {
        const config = toastIcons[toast.type] || toastIcons.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`${config.bg} border-l-4 ${config.border} rounded-lg p-4 shadow-lg flex items-start gap-3 animate-slideInUp`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${config.text}`} />
            <p className={`text-sm ${config.text} flex-1`}>{toast.message}</p>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className={`flex-shrink-0 ${config.text} hover:opacity-70`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}