import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { MessageCircle, MapPin, Clock, Instagram, Search } from 'lucide-react';
import { sanitizeWhatsappNumber } from '../../utils/formatters';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { business } = useCatalog();

  const handleWhatsappDirect = () => {
    const cleanNumber = sanitizeWhatsappNumber(business.whatsapp);
    const greeting = encodeURIComponent(`¡Hola ${business.name}! Quería hacerles una consulta.`);
    window.open(`https://wa.me/${cleanNumber}?text=${greeting}`, '_blank');
  };

  return (
    <header className="relative bg-stone-900 text-white overflow-hidden pb-4 sm:pb-6 flex-1 flex flex-col justify-between">
      {/* Background Banner with gradient overlay */}
      <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-stone-950">
        <img
          src={business.bannerUrl}
          alt={business.name}
          className="w-full h-full object-cover object-center opacity-40 scale-105 filter blur-[1px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
      </div>

      {/* Profile & Business Details Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
          {/* Logo Avatar */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-stone-900 border-2 border-brand-primary/80 shadow-2xl overflow-hidden shrink-0">
            <img
              src={business.logoUrl}
              alt={`Logo de ${business.name}`}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Business Info */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-1 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Abierto • Tomando pedidos
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
              {business.name}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base font-medium max-w-xl mt-1">
              {business.tagline}
            </p>
          </div>

          {/* WhatsApp Direct Action Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={handleWhatsappDirect}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition active:scale-95 cursor-pointer flex items-center justify-center"
              title={`Enviar consulta por WhatsApp a ${business.name}`}
              aria-label="Contactar por WhatsApp"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </button>

            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition border border-stone-700"
                title={`Seguinos en ${business.instagram}`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Location & Schedule Pills */}
        <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            <span>{business.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>{business.schedule}</span>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="mt-4 relative max-w-md mx-auto sm:mx-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-800/90 text-white placeholder-stone-400 text-sm rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white bg-stone-700 px-1.5 py-0.5 rounded"
            >
              Borrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
