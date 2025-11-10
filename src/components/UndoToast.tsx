import React, { useEffect } from 'react';
import { RotateCcw, X } from 'lucide-react';

interface UndoToastProps {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

export default function UndoToast({ message, onUndo, onDismiss, duration = 5000 }: UndoToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white rounded-lg shadow-2xl flex items-center justify-between p-4 z-50 animate-fade-in-up">
      <span className="text-sm">{message}</span>
      <div className="flex items-center gap-4 ml-6">
        <button
          onClick={onUndo}
          className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          <RotateCcw size={16} /> Undo
        </button>
        <button onClick={onDismiss} className="text-slate-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}