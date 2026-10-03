import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { formatPrice, sanitizeWhatsappNumber } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, Send, Copy, Check, MessageSquareText, MapPin, User } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    business,
  } = useCatalog();

  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [addressOrNote, setAddressOrNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);

  if (!isCartOpen) return null;

  // Build formatted WhatsApp message
  const buildWhatsappMessage = (): string => {
    let msg = `🍔 *¡Hola ${business.name}! Quiero realizar un pedido:*\n\n`;

    cart.forEach((item) => {
      msg += `• *${item.quantity}× ${item.product.name}* (${formatPrice(item.product.price)} c/u)\n`;
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        item.selectedExtras.forEach((extra) => {
          msg += `   + ${extra.name} (+${formatPrice(extra.price)})\n`;
        });
      }
      if (item.notes) {
        msg += `   _Nota: ${item.notes}_\n`;
      }
      msg += `   Subtotal: ${formatPrice(item.subtotal)}\n\n`;
    });

    msg += `------------------------------------\n`;
    msg += `💰 *TOTAL ESTIMADO: ${formatPrice(cartTotal)}*\n`;
    msg += `------------------------------------\n\n`;

    if (customerName.trim()) {
      msg += `👤 *Cliente:* ${customerName.trim()}\n`;
    }
    msg += `🛵 *Modalidad:* ${deliveryType === 'delivery' ? 'Envío a domicilio' : 'Retiro por el local'}\n`;
    if (addressOrNote.trim()) {
      msg += `📍 *Dirección/Aclaración:* ${addressOrNote.trim()}\n`;
    }

    msg += `\n¿Podrían confirmarme el pedido y el tiempo de entrega? ¡Muchas gracias!`;

    return msg;
  };

  const handleSendToWhatsApp = () => {
    const rawMessage = buildWhatsappMessage();
    const encoded = encodeURIComponent(rawMessage);
    const cleanNumber = sanitizeWhatsappNumber(business.whatsapp);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyMessage = () => {
    const rawMessage = buildWhatsappMessage();
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="fixed inset-0 -z-10" onClick={() => setIsCartOpen(false)} />

      <div className="bg-white w-full sm:max-w-md h-full flex flex-col shadow-2xl border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
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

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-stone-800 transition text-xs font-medium flex items-center gap-1 cursor-pointer"
                title="Vaciar pedido"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Vaciar</span>
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
              aria-label="Cerrar pedido"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-3">
                <MessageSquareText className="w-8 h-8" />
              </div>
              <p className="font-bold text-stone-800 text-base mb-1">Tu pedido está vacío</p>
              <p className="text-xs text-stone-500 max-w-xs">
                Seleccioná una hamburguesa o combo del catálogo para empezar a armarlo.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-4 py-2 rounded-xl bg-brand-primary text-stone-950 font-bold text-xs shadow-sm hover:bg-brand-primary transition"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-col gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-stone-900 text-sm leading-snug">
                          {item.product.name}
                        </h4>
                        <span className="text-xs font-semibold text-stone-500">
                          {formatPrice(item.unitTotal)} c/u
                        </span>

                        {/* Selected extras */}
                        {item.selectedExtras && item.selectedExtras.length > 0 && (
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

                        {/* Customer note on product */}
                        {item.notes && (
                          <p className="mt-1 text-[11px] text-brand-primary italic bg-brand-primary/5 px-2 py-0.5 rounded border border-brand-primary/20/60 inline-block">
                            Nota: {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Item subtotal */}
                      <span className="font-black text-stone-900 text-sm shrink-0">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>

                    {/* Stepper & delete */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-red-500 text-xs flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Quitar</span>
                      </button>

                      <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-xs">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-stone-100 text-stone-700 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery info for WhatsApp */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-stone-600 block">
                  Datos para el comercio
                </span>

                {/* Name */}
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Tu nombre (ej: Carlos)"
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>

                {/* Delivery or Takeaway */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      deliveryType === 'delivery'
                        ? 'bg-brand-primary border-brand-primary text-stone-950 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🛵 Envío a domicilio
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType('takeaway')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      deliveryType === 'takeaway'
                        ? 'bg-brand-primary border-brand-primary text-stone-950 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    🛍️ Retiro en local
                  </button>
                </div>

                {/* Address or note */}
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <textarea
                    rows={2}
                    value={addressOrNote}
                    onChange={(e) => setAddressOrNote(e.target.value)}
                    placeholder={
                      deliveryType === 'delivery'
                        ? 'Dirección de entrega (calle, número, piso/depto)'
                        : 'Aclaración para el retiro (ej: paso 21:30)'
                    }
                    className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-primary resize-none"
                  />
                </div>
              </div>

              {/* Message preview toggle (convenient for pitches and verification) */}
              <div className="pt-1">
                <button
                  onClick={() => setShowTextPreview(!showTextPreview)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800 flex items-center gap-1"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>{showTextPreview ? 'Ocultar' : 'Ver'} mensaje que recibirá WhatsApp</span>
                </button>

                {showTextPreview && (
                  <div className="mt-2 p-3 bg-stone-900 text-stone-300 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap border border-stone-800">
                    {buildWhatsappMessage()}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 space-y-3 shrink-0">
            {/* Total Row */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 font-bold uppercase tracking-wider block">
                  Total estimado
                </span>
                <span className="text-[11px] text-stone-400">A confirmar por el comercio</span>
              </div>
              <span className="text-2xl font-black text-stone-900 tracking-tight">
                {formatPrice(cartTotal)}
              </span>
            </div>

            {/* MAIN ACTION: PEDIR POR WHATSAPP */}
            <button
              onClick={handleSendToWhatsApp}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold text-base shadow-xl shadow-emerald-600/30 transition cursor-pointer"
            >
              <Send className="w-5 h-5 fill-white" />
              <span>PEDIR POR WHATSAPP</span>
            </button>

            {/* Secondary Option: Copy message */}
            <button
              onClick={handleCopyMessage}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 font-semibold text-xs transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                  <span className="text-emerald-700 font-bold">¡Mensaje copiado al portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copiar texto del pedido</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
