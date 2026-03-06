import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function StatusAlert({ status = 'idle', message, details = null }) {
  const configs = {
    success: {
      className: "border-green-300 bg-green-50 dark:bg-green-900/20",
      icon: CheckCircle2,
      iconColor: "text-green-600 dark:text-green-400",
      textColor: "text-green-800 dark:text-green-300"
    },
    error: {
      className: "border-red-300 bg-red-50 dark:bg-red-900/20",
      icon: AlertCircle,
      iconColor: "text-red-600 dark:text-red-400",
      textColor: "text-red-800 dark:text-red-300"
    },
    warning: {
      className: "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20",
      icon: AlertTriangle,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      textColor: "text-yellow-800 dark:text-yellow-300"
    }
  };

  const config = configs[status] || configs.success;
  const Icon = config.icon;

  if (status === 'idle') return null;

  return (
    <Alert className={config.className}>
      <Icon className={`h-5 w-5 ${config.iconColor}`} />
      <AlertDescription className={config.textColor}>
        <strong>{message}</strong>
        {details && <div className="text-sm opacity-90 mt-2">{details}</div>}
      </AlertDescription>
    </Alert>
  );
}