import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Plus, ArrowRight, CheckCircle2, EyeOff, Store, Power } from 'lucide-react';

interface AdminHomeProps {
  onGoToProducts: () => void;
  onOpenNewProduct: () => void;
  onGoToCategories: () => void;
}

export const AdminHome: React.FC<AdminHomeProps> = ({
  onGoToProducts,
  onOpenNewProduct,
  onGoToCategories,
}) => {
  const { business, products, categories, updateBusiness } = useCatalog();

  // Estado del local dinámico desde el contexto
  const isStoreOpen = business.isOpen ?? true;

  const handleToggleStoreStatus = async () => {
    await updateBusiness({
      ...business,
      isOpen: !isStoreOpen,
    });
  };

  // Métricas de Productos
  const activeProductsCount = products.filter((p) => p.available).length;
  const outOfStockProductsCount = products.filter((p) => !p.available).length;

  // Métricas de Categorías
  const activeCategoriesCount = categories.filter((c) => c.active ?? true).length;
  const hiddenCategoriesCount = categories.filter((c) => c.active === false).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          
          {/* Badge de Estado del Catálogo (Dinámico) */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              isStoreOpen
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isStoreOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span>
              {isStoreOpen
                ? 'Tu catálogo está activo y listo para recibir pedidos'
                : 'El local figura cerrado (no se toman pedidos)'}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Buenos días 👋
            </h1>
            <p className="text-xl sm:text-2xl font-black text-brand-primary mt-0.5">
              {business.name}
            </p>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-lg">
              Desde acá podés cambiar precios, fotos, crear nuevos productos y organizar tus categorías. Cualquier cambio se ve al instante.
            </p>
          </div>

          {/* Botón Principal */}
          <div className="pt-2">
            <button
              onClick={onOpenNewProduct}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-stone-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Agregar producto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Rápido de Estado del Local (Abierto / Cerrado) */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              isStoreOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Estado del Local:{' '}
              <span className={isStoreOpen ? 'text-emerald-600' : 'text-rose-600'}>
                {isStoreOpen ? 'ABIERTO' : 'CERRADO'}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              {isStoreOpen
                ? 'El catálogo permite a los clientes enviar pedidos por WhatsApp.'
                : 'El catálogo estará bloqueado para nuevos pedidos.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStoreStatus}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
            isStoreOpen
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{isStoreOpen ? 'CERRAR NEGOCIO' : 'ABRIR NEGOCIO'}</span>
        </button>
      </div>

      {/* Tarjetas de Resumen de Productos y Categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card Productos */}
        <div
          onClick={onGoToProducts}
          className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Productos en Menú
            </span>
            <span className="text-4xl font-black text-stone-900 block">
              {products.length}
            </span>
            <div className="text-xs text-stone-600 flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeProductsCount} disponibles
              </span>
              {outOfStockProductsCount > 0 && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                    <EyeOff className="w-3.5 h-3.5" />
                    {outOfStockProductsCount} agotados
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-brand-primary group-hover:text-stone-950 text-stone-700 flex items-center justify-center transition-all">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card Categorías */}
        <div
          onClick={onGoToCategories}
          className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Categorías
            </span>
            <span className="text-4xl font-black text-stone-900 block">
              {categories.length}
            </span>
            <div className="text-xs text-stone-600 flex items-center gap-1.5 pt-1">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeCategoriesCount} visibles
              </span>
              {hiddenCategoriesCount > 0 && (
                <>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-stone-500 font-bold">
                    <EyeOff className="w-3.5 h-3.5" />
                    {hiddenCategoriesCount} ocultas
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-brand-primary group-hover:text-stone-950 text-stone-700 flex items-center justify-center transition-all">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};