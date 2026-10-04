// src/components/ProductDetailModal.tsx

import React, { useState, useEffect } from 'react';
import { Product, ExtraOption } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { X, Plus, Minus, Check, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedExtras: ExtraOption[], notes?: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [notes, setNotes] = useState('');

  // Reset state whenever a new product is selected
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedExtras([]);
      setNotes('');
    }
  }, [product]);

  if (!product) return null;

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Compute unit price including selected extras
  const extrasSum = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = product.price + extrasSum;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedExtras, notes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200 animate-in slide-in-from-bottom duration-300">
        {/* Modal Header / Image */}
        <div className="relative aspect-[16/10] w-full bg-stone-100 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-2 rounded-full bg-stone-900/70 hover:bg-stone-900 text-white backdrop-blur-md transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {product.badge && (
            <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-lg bg-brand-primary text-stone-950 text-xs font-black shadow-md">
              {product.badge}
            </span>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Title and Price */}
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-2xl font-black font-heading text-stone-900">
                {product.name}
              </h2>
              <span className="text-2xl font-black text-stone-900 tracking-tight shrink-0">
                {formatPrice(product.price)}
              </span>
            </div>

            <p className="mt-2 text-stone-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Extras Section */}
          {product.extras && product.extras.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                  Extras & Personalización
                </h3>
                <span className="text-[11px] text-stone-400 font-medium">Opcional</span>
              </div>

              <div className="space-y-2">
                {product.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <label
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'border-brand-primary bg-brand-primary/5/70 text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isChecked
                              ? 'bg-brand-primary border-brand-primary text-stone-950 font-bold'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm font-semibold">{extra.name}</span>
                      </div>

                      <span className="text-sm font-bold text-stone-800">
                        +{formatPrice(extra.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Note */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-stone-600 mb-1.5">
              ¿Alguna aclaración? (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Aclaraciones o indicaciones especiales para el pedido..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Modal Sticky Bottom Bar */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-white border border-stone-200 rounded-xl p-1 shadow-sm shrink-0">
            <button
              onClick={handleIncrement}
              disabled={quantity <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-700 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-stone-900 text-base">
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-700 cursor-pointer transition"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-between px-5 py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary active:scale-[0.99] text-stone-950 font-black text-sm sm:text-base shadow-lg shadow-brand-primary/50/20 transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <span>Agregar al pedido</span>
            </span>
            <span>{formatPrice(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};