import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice } from '../../utils/formatters';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const FloatingCartBar: React.FC = () => {
  const { cartCount, cartTotal, setIsCartOpen, isCartOpen } = useCatalog();

  if (cartCount === 0 || isCartOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xs z-40 animate-in slide-in-from-bottom duration-300">
      <button
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-brand-primary hover:bg-brand-primary/90 text-stone-950 font-bold p-3.5 sm:p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-brand-primary/30 active:scale-[0.98] transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative bg-stone-950 text-white p-2.5 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-primary">
              {cartCount}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-wider block text-stone-900/80">
              Tu Pedido
            </span>
            <span className="text-xs font-extrabold text-stone-950">
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg font-black text-stone-950">
            {formatPrice(cartTotal)}
          </span>
          <div className="bg-stone-950/10 p-1.5 rounded-lg">
            <ArrowRight className="w-4 h-4 text-stone-950" />
          </div>
        </div>
      </button>
    </div>
  );
};