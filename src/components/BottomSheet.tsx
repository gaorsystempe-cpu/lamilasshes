import React from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[90vh]'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Sheet Surface */}
      <div className={`w-full bg-white rounded-t-3xl shadow-2xl border-t border-pink-200 overflow-hidden flex flex-col ${maxHeight} animate-slideUp`}>
        {/* Grab Handle Bar */}
        <div className="pt-3 pb-1 cursor-grab active:cursor-grabbing shrink-0" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />
        </div>

        {/* Header if title provided */}
        {title && (
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h3 className="text-base font-extrabold font-heading text-[#064e3b]">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sheet Body Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-safe">
          {children}
        </div>
      </div>
    </div>
  );
};
