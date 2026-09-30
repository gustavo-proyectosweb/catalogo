import React from 'react';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Plus, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const hasExtras = product.extras && product.extras.length > 0;

  return (
    <div
      onClick={() => product.available && onSelect(product)}
      className={`group flex flex-col justify-between bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden ${
        product.available ? 'cursor-pointer active:scale-[0.99]' : 'opacity-70 cursor-not-allowed'
      }`}
    >
      {/* Product Image Box */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            product.available ? 'group-hover:scale-105' : 'grayscale'
          }`}
          loading="lazy"
        />

        {/* Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {!product.available ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900/90 backdrop-blur-sm text-red-400 text-xs font-bold shadow-md">
              <AlertCircle className="w-3.5 h-3.5" />
              Agotado hoy
            </span>
          ) : product.badge ? (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-stone-950 text-xs font-extrabold shadow-md tracking-tight">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Extras indicator pill */}
        {product.available && hasExtras && (
          <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-[11px] font-semibold text-stone-200">
            <SlidersHorizontal className="w-3 h-3 text-amber-400" />
            Personalizable
          </span>
        )}
      </div>

      {/* Product Details Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-lg text-stone-900 group-hover:text-amber-600 transition leading-snug">
              {product.name}
            </h3>
          </div>

          <p className="mt-1.5 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Add Button Row */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-stone-400 block font-medium">Precio</span>
            <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.available ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{hasExtras ? 'Elegir' : 'Agregar'}</span>
            </button>
          ) : (
            <span className="text-xs text-stone-400 font-semibold px-2.5 py-1.5 rounded-lg bg-stone-100">
              No disponible
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
