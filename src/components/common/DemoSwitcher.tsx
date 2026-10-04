import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Store, ShieldCheck, HelpCircle, Lock } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

export const DemoSwitcher: React.FC = () => {
  const { viewMode, setViewMode, isAdminAuthenticated } = useCatalog();
  const [showPitchGuide, setShowPitchGuide] = useState(false);

  // 1. MODO CLIENTE FINAL (Producción)
  if (!APP_CONFIG.showDemoFeatures) {
    // Si la vista actual es el panel del admin, no mostramos la barra promocional
    if (viewMode === 'admin') return null;

    // Si la vista es pública ('public'), se muestra la barra con la promo y el botón de acceso
    return (
      <div className="bg-stone-950 text-stone-300 border-b border-stone-800 text-xs py-2 px-3 sm:px-6 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 relative">
          
          {/* Lado Izquierdo: Indicador de Estado (Fijo) */}
          <div className="flex items-center gap-2 shrink-0 z-10 bg-stone-950 pr-2">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Centro: Marquesina en Mobile (entra desde la derecha) / Texto Alineado a la Izquierda en Tablet y Desktop */}
          <div className="flex-1 overflow-hidden relative flex items-center justify-start h-4">
            <div className="animate-marquee-mobile sm:animate-none whitespace-nowrap">
              <span className="font-medium text-stone-300">
                🔥 -15% abonando en efectivo o transferencia | Pedidos online 24/7
              </span>
            </div>
          </div>

          {/* Lado Derecho: Acceso al Panel para el dueño (Fijo) */}
          <div className="shrink-0 z-10 bg-stone-950 pl-2">
            <button
              onClick={() => setViewMode('admin')}
              className="flex items-center gap-1.5 text-stone-400 hover:text-white transition font-medium cursor-pointer"
              title="Acceso al Panel de Administración"
            >
              <Lock className="w-3.5 h-3.5 text-brand-primary shrink-0" />
              <span className="text-xs">
                {isAdminAuthenticated ? 'Ir al Panel' : 'Acceso Dueño'}
              </span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. MODO DEMO COMERCIAL (Mantiene el switcher completo para tus presentaciones)
  return (
    <div className="bg-stone-900 text-stone-200 border-b border-stone-800 text-xs py-1.5 px-3 sm:px-6 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-stone-300">
            Demo Comercial: <strong className="text-white">BARRIO BURGER</strong>
          </span>
          <button
            onClick={() => setShowPitchGuide(!showPitchGuide)}
            className="inline-flex items-center gap-1 text-brand-primary hover:text-brand-primary font-semibold underline decoration-dotted underline-offset-2 ml-1 cursor-pointer transition"
            title="Ver guía de demostración paso a paso"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guía de Demostración</span>
          </button>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700/60 shadow-inner">
          <button
            onClick={() => setViewMode('public')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition cursor-pointer ${viewMode === 'public'
              ? 'bg-brand-primary text-stone-950 font-bold shadow-sm'
              : 'text-stone-300 hover:text-white'
              }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Ver como Cliente</span>
          </button>

          <button
            onClick={() => setViewMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition cursor-pointer ${viewMode === 'admin'
              ? 'bg-stone-950 text-white font-bold shadow-sm border border-stone-700'
              : 'text-stone-300 hover:text-white'
              }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
            <span>
              {isAdminAuthenticated ? 'Panel de Control' : 'Acceso Dueño'}
            </span>
          </button>
        </div>
      </div>

      {/* Demo Pitch Guide Dropdown / Modal */}
      {showPitchGuide && (
        <div className="mt-2 p-3.5 bg-stone-950 border border-stone-700 rounded-xl shadow-2xl max-w-xl mx-auto text-stone-300 text-xs">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
            <p className="font-bold text-brand-primary flex items-center gap-1.5">
              <span>🎯</span> Guión para mostrar al dueño del comercio (Demostración en 3 minutos)
            </p>
            <button
              onClick={() => setShowPitchGuide(false)}
              className="text-stone-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-stone-800"
            >
              ✕
            </button>
          </div>

          <ol className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-primary shrink-0">1.</span>
              <span>
                <strong>Experiencia Cliente:</strong> Mostrale cómo un comensal entra desde Instagram o un QR al catálogo en su teléfono, navega las categorías y elige una hamburguesa (ej: <em>Doble Bacon</em>).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-primary shrink-0">2.</span>
              <span>
                <strong>Personalización:</strong> Abrí la hamburguesa y sumale extras (Panceta extra, Cheddar). Mostrale cómo suma al total en vivo y tocas <em>"Agregar al pedido"</em>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-brand-primary shrink-0">3.</span>
              <span>
                <strong>Cierre en WhatsApp:</strong> Abrí el carrito y tocá <em>"Pedir por WhatsApp"</em>. Mostrale el mensaje limpio y desglosado listo para enviar. Sin enredos.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-emerald-400 shrink-0">4.</span>
              <span>
                <strong>El "Efecto Wow" del Dueño:</strong> Cambiá a <em>"Acceso Dueño"</em>, entrá a Productos, editá el precio de la <em>Doble Bacon</em> ($12.500 → $13.500) y guardá. Volvé al catálogo: <strong>el precio cambió al instante</strong>.
              </span>
            </li>
          </ol>

          <div className="mt-3 pt-2 border-t border-stone-800 flex justify-end">
            <button
              onClick={() => setShowPitchGuide(false)}
              className="px-3 py-1 bg-brand-primary hover:bg-brand-primary text-stone-950 font-bold rounded-lg text-xs transition"
            >
              Entendido, comenzar demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};