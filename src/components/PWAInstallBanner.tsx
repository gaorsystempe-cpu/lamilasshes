import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share2, PlusSquare, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isInstalled || isDismissed) {
    return null;
  }

  if (isInstallable) {
    return (
      <div className="bg-[#064e3b] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md border-b border-emerald-900 animate-fadeIn">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-pink-300 text-[#064e3b] rounded-lg font-heading font-extrabold flex items-center justify-center text-[10px] shrink-0">
            LAMI
          </div>
          <div>
            <span className="font-bold">Instala la App Oficial LAMI LASHES®</span>
            <span className="hidden sm:inline text-pink-200 text-[11px] ml-2">
              • Acceso ultrarrápido sin abrir navegador
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={install}
            className="bg-pink-300 hover:bg-pink-200 text-[#064e3b] px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Instalar App</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-pink-200 hover:text-white rounded-lg transition-colors"
            title="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (isIOS) {
    return (
      <>
        <div className="bg-[#064e3b] text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md border-b border-emerald-900">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-pink-300" />
            <span>Instalar LAMI LASHES® en tu iPhone / iPad</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowIOSGuide(true)}
              className="bg-pink-300 hover:bg-pink-200 text-[#064e3b] px-3 py-1 rounded-lg font-bold text-[11px] transition-all"
            >
              Ver cómo instalar
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-pink-200 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl relative border border-pink-200">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-pink-100 text-[#064e3b] rounded-2xl flex items-center justify-center mx-auto mb-3 font-heading font-extrabold text-lg">
                L'A
              </div>

              <h3 className="text-base font-extrabold font-heading text-[#064e3b] mb-2">
                Instalar LAMI LASHES® en iPhone
              </h3>

              <div className="text-xs text-slate-600 text-left space-y-3 bg-pink-50/60 p-4 rounded-2xl border border-pink-100 mb-4">
                <div className="flex items-start gap-2.5">
                  <span className="bg-[#064e3b] text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">1</span>
                  <span>Toca el botón <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> <strong>Compartir</strong> en la barra inferior de Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="bg-[#064e3b] text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">2</span>
                  <span>Desplázate hacia abajo y selecciona <PlusSquare className="w-3.5 h-3.5 inline text-slate-700" /> <strong>Agregar al inicio</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="bg-[#064e3b] text-white font-mono text-[10px] w-5 h-5 rounded-full flex items-center justify-center shrink-0">3</span>
                  <span>¡Listo! Tendrás la App en tu pantalla de inicio con acceso directo a WhatsApp.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full bg-[#064e3b] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-[#042f2e] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
