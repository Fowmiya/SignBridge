import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map(toast => {
        let Icon = Info;
        let bgClass = 'bg-slate-900 text-white border-slate-800';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          bgClass = 'bg-teal-950 text-teal-100 border-teal-800';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-amber-950 text-amber-100 border-amber-800';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-rose-950 text-rose-100 border-rose-800';
        }

        return (
          <div
            key={toast.id}
            id={toast.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl ${bgClass} transition-all duration-200 ease-out`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
