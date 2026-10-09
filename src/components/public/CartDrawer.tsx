import React, { useState, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { CartItem } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { formatPrice, sanitizeWhatsappNumber } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, Send, MapPin, User, AlertCircle, ShoppingBag, Pencil, Lock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    openEditCartItem,
    business,
  } = useCatalog();

  const isOpen = business.isOpen ?? true;

  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [addressOrNote, setAddressOrNote] = useState('');

  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setErrors({});
  }, [isCartOpen, deliveryType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };

    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const sanitizeInput = (str: string): string => {
    if (!str) return '';
    return str.replace(/[<>/]/g, '').trim();
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; address?: string } = {};
    const cleanName = customerName.trim();
    const cleanAddress = addressOrNote.trim();

    if (!cleanName) {
      newErrors.name = 'Por favor ingresá tu nombre.';
    } else if (cleanName.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+\$/.test(cleanName)) {
      newErrors.name = 'Ingresá un nombre válido (solo letras).';
    }

    if (deliveryType === 'delivery') {
      if (!cleanAddress) {
        newErrors.address = 'Ingresá tu dirección para el envío.';
      } else if (cleanAddress.length < 5) {
        newErrors.address = 'Ingresá una dirección más detallada (ej: Calle y N°).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatedCartTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const buildWhatsappMessage = (): string => {
    const safeName = sanitizeInput(customerName);
    const safeAddress = sanitizeInput(addressOrNote);

    let msg = `*PEDIDO - ${business.name.toUpperCase()}*\n\n`;

    if (safeName) {
      msg += `*Cliente:* ${safeName}\n`;
    }
    msg += `*Entrega:* ${deliveryType === 'delivery' ? 'Envío a domicilio' : 'Retiro en local'}\n`;

    if (safeAddress) {
      msg += `*${deliveryType === 'delivery' ? 'Dirección' : 'Nota'}:* ${safeAddress}\n`;
    }

    msg += `\n----------------------------------\n`;
    msg += `*DETALLE DEL PEDIDO*\n`;
    msg += `----------------------------------\n\n`;

    cart.forEach((item) => {
      msg += `*${item.quantity}x ${item.product.name}* - ${formatPrice(item.subtotal)}\n`;

      if (item.selectedExtras && item.selectedExtras.length > 0) {
        item.selectedExtras.forEach((extra) => {
          msg += `  + ${extra.name} (${formatPrice(extra.price)})\n`;
        });
      }

      if (item.notes) {
        msg += `  _Aclaración: ${sanitizeInput(item.notes)}_\n`;
      }
      msg += `\n`;
    });

    msg += `----------------------------------\n`;
    msg += `*TOTAL: ${formatPrice(calculatedCartTotal)}*\n`;
    msg += `----------------------------------\n\n`;

    msg += `¿Me confirman la demora estimada? ¡Gracias!`;

    return msg;
  };

  const handleSendToWhatsApp = () => {
    if (!isOpen) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    const rawMessage = buildWhatsappMessage();
    const encoded = encodeURIComponent(rawMessage);
    const cleanNumber = sanitizeWhatsappNumber(business.whatsapp);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;

    window.open(waUrl, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0 -z-10" onClick={() => setIsCartOpen(false)} />

      <div className="bg-white w-full sm:max-w-md h-full flex flex-col shadow-2xl border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary text-stone-950 flex items-center justify-center font-black">
              {cartCount}
            </div>
            <div>
              <h2 className="font-heading font-black text-lg">Tu Pedido</h2>
              <span className="text-xs text-stone-400">
                {cart.length} {cart.length === 1 ? 'ítem distinto' : 'ítems distintos'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {cart.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-stone-400 hover:text-red-400 p-2 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                title="Vaciar todo el pedido"
                aria-label="Vaciar pedido"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-bold text-stone-800 text-base mb-1">Tu pedido está vacío</p>
              <p className="text-xs text-stone-500 max-w-xs mb-4">
                Elegí tus productos favoritos del catálogo para comenzar tu pedido.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-brand-primary text-stone-950 font-bold text-xs shadow-sm hover:opacity-95 transition cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              {/* Alerta si el local está cerrado */}
              {!isOpen && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-rose-800 text-xs">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <div>
                    <span className="font-bold block">El negocio está cerrado</span>
                    <span>En este momento no se están recibiendo nuevos pedidos.</span>
                  </div>
                </div>
              )}

              {/* Lista de productos */}
              <div className="space-y-3">
                {cart.map((item) => {
                  const hasExtras = item.selectedExtras && item.selectedExtras.length > 0;

                  return (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/50 flex flex-col gap-2.5"
                    >
                      <div className="flex items-start gap-3">
                        {/* Imagen del Producto en el Carrito */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200/60 flex items-center justify-center">
                          {item.product.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-stone-400" />
                          )}
                        </div>

                        {/* Detalles e Info del Producto */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-stone-900 text-sm leading-snug truncate">
                            {item.product.name}
                          </h4>

                          <div className="mt-0.5 text-[11px] font-medium text-stone-500 flex flex-wrap items-center gap-x-2">
                            <span>Base: {formatPrice(item.product.price)}</span>
                            {hasExtras && (
                              <span className="font-semibold text-stone-700">
                                (Unidad: {formatPrice(item.unitTotal)} c/u)
                              </span>
                            )}
                          </div>

                          {hasExtras && (
                            <div className="mt-1 space-y-0.5">
                              {item.selectedExtras.map((extra) => (
                                <div
                                  key={extra.id}
                                  className="text-[11px] text-stone-600 flex items-center gap-1 font-medium"
                                >
                                  <span className="text-brand-primary font-bold">+</span>
                                  <span>{extra.name}</span>
                                  <span className="text-stone-400">({formatPrice(extra.price)})</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {item.notes && (
                            <p className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 inline-block font-medium">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>

                        {/* Subtotal del Item */}
                        <div className="text-right shrink-0">
                          <span className="font-black text-stone-900 text-sm block">
                            {formatPrice(item.subtotal)}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-stone-400 font-semibold">
                              {item.quantity} × {formatPrice(item.unitTotal)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditCartItem(item)}
                            className="text-stone-500 hover:text-brand-primary text-xs flex items-center gap-1 font-bold transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>

                          <span className="text-stone-300">|</span>

                          <button
                            onClick={() => setItemToDelete(item)}
                            className="text-stone-400 hover:text-red-500 text-xs flex items-center gap-1 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Quitar</span>
                          </button>
                        </div>

                        <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                            aria-label="Restar uno"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.cartItemId, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                            aria-label="Sumar uno"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formulario de Datos */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 mt-4">
                <span className="text-xs font-black uppercase tracking-wider text-stone-600 block">
                  Datos para el pedido
                </span>

                <div>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      maxLength={50}
                      disabled={!isOpen}
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      placeholder="Tu nombre (ej: Carlos)"
                      className={`w-full pl-9 pr-3 py-2 bg-white rounded-xl border text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                          : 'border-stone-200 focus:ring-brand-primary'
                      } ${!isOpen ? 'bg-stone-100 cursor-not-allowed text-stone-400' : ''}`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-brand-primary border-brand-primary text-stone-950 shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    } ${!isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    🛵 Envío a domicilio
                  </button>
                  <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => setDeliveryType('takeaway')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      deliveryType === 'takeaway'
                        ? 'bg-brand-primary border-brand-primary text-stone-950 shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    } ${!isOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    🛍️ Retiro en local
                  </button>
                </div>

                <div>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <textarea
                      rows={2}
                      maxLength={120}
                      disabled={!isOpen}
                      value={addressOrNote}
                      onChange={(e) => {
                        setAddressOrNote(e.target.value);
                        if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                      }}
                      placeholder={
                        deliveryType === 'delivery'
                          ? 'Dirección de entrega (calle, número, piso/depto)'
                          : 'Aclaración para el retiro (opcional, ej: paso 21:30)'
                      }
                      className={`w-full pl-9 pr-3 py-2 bg-white rounded-xl border text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 resize-none ${
                        errors.address
                          ? 'border-red-500 focus:ring-red-500 bg-red-50/20'
                          : 'border-stone-200 focus:ring-brand-primary'
                      } ${!isOpen ? 'bg-stone-100 cursor-not-allowed text-stone-400' : ''}`}
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.address}</span>
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">
                  Total estimado
                </span>
                <span className="text-[11px] text-stone-400">A confirmar por el comercio</span>
              </div>
              <span className="text-2xl font-black text-stone-900 tracking-tight">
                {formatPrice(calculatedCartTotal)}
              </span>
            </div>

            <button
              disabled={isSubmitting || !isOpen}
              onClick={handleSendToWhatsApp}
              className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-extrabold text-base shadow-xl transition ${
                isOpen
                  ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-emerald-600/25 cursor-pointer'
                  : 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
              }`}
            >
              {isOpen ? (
                <>
                  <Send className="w-5 h-5 fill-white" />
                  <span>PEDIR POR WHATSAPP</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>NEGOCIO CERRADO</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Modales de Confirmación */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="¿Vaciar el pedido?"
        description="Se removerán todos los productos agregados a tu carrito."
        confirmText="Sí, vaciar"
        cancelText="Volver"
        onConfirm={() => {
          clearCart();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />

      <ConfirmModal
        isOpen={!!itemToDelete}
        title={`¿Quitar ${itemToDelete?.product.name}?`}
        description="Este producto se removerá de la lista de tu pedido."
        confirmText="Eliminar"
        cancelText="Conservar"
        onConfirm={() => {
          if (itemToDelete) {
            removeFromCart(itemToDelete.cartItemId);
            setItemToDelete(null);
          }
        }}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};