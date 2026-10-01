import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400 animate-pulse">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Modo Sin Conexión PWA — Usando catálogo en caché local</span>
    </div>
  );
};
