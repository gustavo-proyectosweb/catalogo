import React from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Store, Plus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

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
  const { business, products, categories, setViewMode } = useCatalog();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tu catálogo está activo y listo para recibir pedidos
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Buenos días 👋
            </h1>
            <p className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
              {business.name}
            </p>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-lg">
              Desde acá podés cambiar precios, fotos, crear nuevas hamburguesas y organizar tus categorías. Cualquier cambio se ve al instante.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setViewMode('public')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Ver catálogo como cliente</span>
            </button>

            <button
              onClick={onOpenNewProduct}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm border border-stone-700 transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Agregar producto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simple Summary Cards (Strictly keeping to user spec: no unnecessary charts or complex metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Products Card */}
        <div
          onClick={onGoToProducts}
          className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Productos en Menú
            </span>
            <span className="text-4xl font-extrabold text-stone-900 mt-1 block">
              {products.length}
            </span>
            <span className="text-xs text-stone-600 mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-bold">
                {products.filter((p) => p.available).length} disponibles
              </span>
              <span>•</span>
              <span className="text-stone-600">
                {products.filter((p) => !p.available).length} agotados
              </span>
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-100 text-amber-600 flex items-center justify-center transition">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Categories Card */}
        <div
          onClick={onGoToCategories}
          className="bg-white p-6 rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
              Categorías
            </span>
            <span className="text-4xl font-extrabold text-stone-900 mt-1 block">
              {categories.length}
            </span>
            <span className="text-xs text-stone-600 mt-1 block">
              Organizadas en el menú público
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-stone-100 group-hover:bg-stone-200 text-stone-700 flex items-center justify-center transition">
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Demo helper tip box */}
      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/70 text-xs text-amber-900">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-950">
              Prueba sugerida para el dueño del local:
            </p>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              Andá a la pestaña <strong>"Productos"</strong>, hacé clic en <strong>"Editar"</strong> en la hamburguesa <em>Doble Bacon</em>, aumentale el precio a <strong>$13.500</strong> y guardá. Después tocá <strong>"Ver catálogo"</strong> y mostrale que el cambio impactó en tiempo real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
