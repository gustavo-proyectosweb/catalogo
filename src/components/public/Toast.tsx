import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  isOpen,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-stone-900 text-white rounded-2xl shadow-xl border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <CheckCircle2 className="w-5 h-5 text-brand-primary shrink-0" />
      <span className="text-xs sm:text-sm font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};