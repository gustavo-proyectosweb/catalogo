import React from 'react';
import {
    MapPin,
    Clock,
    CreditCard,
    Banknote,
    ShoppingBag,
    Truck,
    Instagram
} from 'lucide-react';
import { BusinessInfo } from '../../types';
import { useCatalog } from '../../context/CatalogContext';

interface FooterProps {
    business: BusinessInfo;
}

export const Footer: React.FC<FooterProps> = ({ business }) => {
    const { cartCount, isCartOpen } = useCatalog();
    
    // La barra flotante está visible solo si hay productos y el carrito no está desplegado
    const isFloatingBarVisible = cartCount > 0 && !isCartOpen;

    return (
        <footer 
            className={`w-full bg-stone-900 text-stone-300 pt-8 border-t border-stone-800 mt-6 transition-all duration-300 ${
                isFloatingBarVisible ? 'pb-28 sm:pb-12' : 'pb-8'
            }`}
        >
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                {/* Grilla principal: 2 columnas en Tablet/Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-stone-800/80 text-sm">

                    {/* Columna 1: Datos del Comercio y Contacto */}
                    <div className="space-y-3 text-center md:text-left">
                        <h3 className="text-base font-bold text-white tracking-wide uppercase font-heading">
                            {business.name}
                        </h3>

                        <div className="space-y-1.5 text-stone-400 text-xs sm:text-sm">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
                                <span>{business.address}</span>
                            </div>

                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <Clock className="w-4 h-4 text-brand-primary shrink-0" />
                                <span>{business.schedule || 'Consultar horarios de atención'}</span>
                            </div>
                        </div>

                        {/* Redes Sociales e Igualdad Estética */}
                        <div className="pt-1 flex items-center justify-center md:justify-start gap-2">
                            {business.whatsapp && (
                                <a
                                    href={`https://wa.me/${business.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors border border-stone-700/50"
                                    title="Contactar por WhatsApp"
                                >
                                    <svg className="w-4 h-4 fill-emerald-400 shrink-0" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    <span>WhatsApp</span>
                                </a>
                            )}

                            {business.instagram && (
                                <a
                                    href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors border border-stone-700/50"
                                    title="Instagram"
                                >
                                    <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                                    <span>Instagram</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Columna 2: Métodos de Pago y Opciones de Entrega */}
                    <div className="space-y-3 text-center md:text-right flex flex-col justify-center">
                        <div>
                            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                                Medios de Pago
                            </h4>
                            <div className="flex items-center justify-center md:justify-end gap-2.5 text-xs text-stone-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <Banknote className="w-4 h-4 text-brand-primary" />
                                    Efectivo
                                </span>
                                <span className="text-stone-600">•</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-brand-primary" />
                                    Transferencia / Mercado Pago
                                </span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1.5">
                                Envíos y Retiros
                            </h4>
                            <div className="flex items-center justify-center md:justify-end gap-2.5 text-xs text-stone-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <ShoppingBag className="w-4 h-4 text-brand-primary" />
                                    Retiro en Local
                                </span>
                                <span className="text-stone-600">•</span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Truck className="w-4 h-4 text-brand-primary" />
                                    Delivery
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Pie de Copyright y Marca */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-stone-500 text-center sm:text-left">
                    <p>© {new Date().getFullYear()} {business.name}. Todos los derechos reservados.</p>
                    <p className="text-stone-600">
                        Catálogo digital potenciado por{' '}
                        <a
                            href="https://wa.me/5491167972487"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 font-medium hover:text-white transition-colors underline decoration-stone-700 hover:decoration-white cursor-pointer"
                        >
                            Gustavo Miño
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};