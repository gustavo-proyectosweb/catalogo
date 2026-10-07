import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { MessageCircle, MapPin, Clock, Instagram, Search, ChevronDown } from 'lucide-react';
import { sanitizeWhatsappNumber } from '../../utils/formatters';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { business } = useCatalog();

  const isOpen = business.isOpen ?? true;

  const handleWhatsappDirect = () => {
    const cleanNumber = sanitizeWhatsappNumber(business.whatsapp);
    const greeting = encodeURIComponent(`¡Hola ${business.name}! Quería hacerles una consulta.`);
    window.open(`https://wa.me/${cleanNumber}?text=${greeting}`, '_blank');
  };

  const scrollToMenu = () => {
    window.scrollTo({
      top: 280,
      behavior: 'smooth',
    });
  };

  return (
    <header className="relative bg-stone-900 text-white overflow-hidden pb-3 sm:pb-6 flex-1 flex flex-col justify-between border-b border-stone-800">
      <div className="relative h-28 sm:h-52 w-full overflow-hidden bg-stone-950">
        <img
          src={business.bannerUrl}
          alt={business.name}
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 sm:-mt-20 relative z-10 w-full">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-6 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl p-1 bg-stone-900 border-2 border-brand-primary/80 shadow-2xl overflow-hidden shrink-0">
            <img
              src={business.logoUrl}
              alt={`Logo de ${business.name}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-1">
            {/* BADGE DINÁMICO DE ESTADO */}
            {isOpen ? (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] sm:text-xs font-semibold mb-1 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Abierto • Tomando pedidos
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[11px] sm:text-xs font-semibold mb-1 border border-rose-500/30">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Cerrado • Solo catálogo
              </div>
            )}

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
              {business.name}
            </h1>

            <p className="text-stone-300 text-xs sm:text-base font-medium max-w-xl mt-0.5">
              {business.tagline}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={handleWhatsappDirect}
              className="p-2 sm:p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold"
              title={`Enviar consulta por WhatsApp a ${business.name}`}
              aria-label="Contactar por WhatsApp"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Consulta</span>
            </button>

            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition border border-stone-700"
                title={`Seguinos en ${business.instagram}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-6 text-[11px] sm:text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{business.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span>{business.schedule}</span>
          </div>
        </div>

        <div className="mt-3 relative max-w-md mx-auto sm:mx-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 bg-stone-800/90 text-white placeholder-stone-400 text-xs sm:text-sm rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-white bg-stone-700 px-1.5 py-0.5 rounded"
            >
              Borrar
            </button>
          )}
        </div>

        <div className="mt-3 flex justify-center sm:hidden">
          <button
            onClick={scrollToMenu}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20 animate-bounce cursor-pointer"
          >
            <span>Deslizá para ver el catálogo</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};