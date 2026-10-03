import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/formatters';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartCount, cartTotal, setIsCartOpen } = useCatalog();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 max-w-md mx-auto pointer-events-none animate-in slide-in-from-bottom duration-300">
      <button
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-black shadow-2xl shadow-brand-primary/50/30 border border-brand-primary/30/40 transition active:scale-[0.98] cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-stone-950 text-white flex items-center justify-center shadow-md">
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-950">
              {cartCount}
            </span>
          </div>

          <div className="text-left">
            <span className="text-xs uppercase tracking-wider font-extrabold text-stone-800 block">
              Tu pedido
            </span>
            <span className="text-sm font-bold text-stone-950">
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-black tracking-tight text-stone-950">
            {formatPrice(cartTotal)}
          </span>
          <div className="w-8 h-8 rounded-lg bg-stone-950/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </div>
        </div>
      </button>
    </div>
  );
};
