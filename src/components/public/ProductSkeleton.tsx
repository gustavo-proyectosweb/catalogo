import React from 'react';

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden animate-pulse">
      {/* Contenedor Imagen */}
      <div className="aspect-[16/10] sm:aspect-[16/9] w-full bg-stone-200" />

      {/* Detalle del producto */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          {/* Título */}
          <div className="h-5 bg-stone-200 rounded-md w-3/4" />
          {/* Descripción (2 líneas) */}
          <div className="space-y-1.5 pt-1">
            <div className="h-3 bg-stone-200 rounded-md w-full" />
            <div className="h-3 bg-stone-200 rounded-md w-4/5" />
          </div>
        </div>

        {/* Fila del precio y botón */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="h-2.5 bg-stone-200 rounded-md w-8" />
            <div className="h-5 bg-stone-200 rounded-md w-16" />
          </div>
          <div className="h-9 w-24 bg-stone-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
};