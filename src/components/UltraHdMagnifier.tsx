import React, { useState, useRef } from 'react';
import { ZoomIn, Maximize2, X, RotateCcw, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface UltraHdMagnifierProps {
  src: string;
  alt: string;
  title?: string;
  zoomLevel?: number; // e.g. 2.5
}

export const UltraHdMagnifier: React.FC<UltraHdMagnifierProps> = ({
  src,
  alt,
  title = '',
  zoomLevel = 2.5
}) => {
  const { openZoomLightbox } = useStore();
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current.getBoundingClientRect();
      setImgSize({ width, height });
      setShowMagnifier(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imgRef.current) {
      const { left, top, width, height } = imgRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      setMousePos({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  // Magnifier glass size
  const magnifierWidth = 160;
  const magnifierHeight = 160;

  return (
    <div className="relative group">
      {/* Image Container with Magnifier Hover */}
      <div
        className="relative overflow-hidden rounded-2xl bg-slate-100 cursor-crosshair border border-slate-200/60 shadow-sm"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-[360px] sm:h-[420px] object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
          referrerPolicy="no-referrer"
        />

        {/* HD Quality Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Detalle Ultra HD</span>
        </div>

        {/* Lightbox Fullscreen Trigger */}
        <button
          onClick={() => openZoomLightbox(src, title || alt)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-all opacity-90 hover:scale-110 shadow-md"
          title="Abrir Visor 4K Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Magnifier Glass Effect */}
        {showMagnifier && (
          <div
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              height: `${magnifierHeight}px`,
              width: `${magnifierWidth}px`,
              top: `${mousePos.y - magnifierHeight / 2}px`,
              left: `${mousePos.x - magnifierWidth / 2}px`,
              opacity: 1,
              border: '2px solid rgba(16, 185, 129, 0.8)',
              borderRadius: '50%',
              backgroundColor: 'white',
              backgroundImage: `url('${src}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imgSize.width * zoomLevel}px ${imgSize.height * zoomLevel}px`,
              backgroundPositionX: `-${mousePos.x * zoomLevel - magnifierWidth / 2}px`,
              backgroundPositionY: `-${mousePos.y * zoomLevel - magnifierHeight / 2}px`,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.5)'
            }}
            className="z-20 transition-opacity duration-150"
          />
        )}

        {/* Hover Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-slate-900/80 text-white text-[11px] font-medium px-3 py-1 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex items-center gap-1.5 whitespace-nowrap">
          <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pasa el cursor para lupa HD | Clic para Zoom 4K</span>
        </div>
      </div>
    </div>
  );
};

// Fullscreen 4K Lightbox Modal Component
export const ZoomLightboxModal: React.FC = () => {
  const { zoomImage, closeZoomLightbox } = useStore();
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!zoomImage) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn select-none">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border-b border-slate-800 text-white z-20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold truncate max-w-md">{zoomImage.title} (Visor Ultra HD 4K)</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
          >
            + Zoom ({Math.round(scale * 100)}%)
          </button>
          <button
            onClick={handleZoomOut}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-200 transition-colors"
          >
            - Reducir
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Restablecer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={closeZoomLightbox}
            className="p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors ml-2"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Surface with Pan & Zoom */}
      <div
        className="flex-1 overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          src={zoomImage.url}
          alt={zoomImage.title}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out',
            maxHeight: '85vh',
            maxWidth: '90vw',
            objectFit: 'contain'
          }}
          className="shadow-2xl rounded-lg"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center text-xs text-slate-400">
        <span>Usa los botones superiores para ampliar el detalle o arrastra la imagen con el mouse</span>
      </div>
    </div>
  );
};
