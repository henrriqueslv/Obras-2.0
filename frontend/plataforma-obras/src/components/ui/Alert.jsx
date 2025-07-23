import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export const Alert = ({ type = 'info', title, message, className = '' }) => {
  const types = {
    success: {
      icon: CheckCircle,
      classes: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
    },
    error: {
      icon: XCircle,
      classes: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
    },
    warning: {
      icon: AlertCircle,
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300'
    },
    info: {
      icon: Info,
      classes: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300'
    }
  };

  const { icon: Icon, classes } = types[type];

  return (
    <div className={`border rounded-lg p-4 ${classes} ${className}`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h3 className="font-medium mb-1">{title}</h3>
          )}
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};

