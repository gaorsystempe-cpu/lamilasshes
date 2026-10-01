import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryShowcase } from './components/CategoryShowcase';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ZoomLightboxModal } from './components/UltraHdMagnifier';
import { CartDrawer } from './components/CartDrawer';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileBottomBar } from './components/MobileBottomBar';

const AppContent: React.FC = () => {
  const { toastMessage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf2f8]/40 pb-20 sm:pb-0">
      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#064e3b] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-pink-300 backdrop-blur-md animate-bounce flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Bar */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <HeroBanner />
        <CategoryShowcase />
        <CategoryFilterBar />
        <ProductGrid />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Native Bottom Dock Bar */}
      <MobileBottomBar />

      {/* Overlays & Drawers */}
      <ProductDetailModal />
      <ZoomLightboxModal />
      <CartDrawer />
      <AdminPanel />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
