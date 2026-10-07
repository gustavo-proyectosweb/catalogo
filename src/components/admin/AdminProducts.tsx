import React, { useState, useMemo, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Plus, Edit3, Trash2, Search, AlertTriangle, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminProductsProps {
  onOpenProductModal: (product: Product | null) => void;
}

const ITEMS_PER_PAGE = 10; // Cantidad de productos a mostrar por página

export const AdminProducts: React.FC<AdminProductsProps> = ({ onOpenProductModal }) => {
  const {
    products,
    categories,
    deleteProduct,
    toggleProductAvailability,
  } = useCatalog();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para el modal de confirmación de borrado
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  // Resetear a la página 1 cada vez que cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  useEffect(() => {
    if (productToDelete) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [productToDelete]);

  const categoriesMap = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  // 1. Filtrar y ordenar
  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((prod) => {
        const matchesCat = selectedCategory === 'all' || prod.categoryId === selectedCategory;
        if (!matchesCat) return false;
        if (!query) return true;

        return prod.name.toLowerCase().startsWith(query);
      })
      .sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
  }, [products, search, selectedCategory]);

  // 2. Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black font-heading text-stone-900">
            Productos
          </h2>
          <p className="text-xs text-stone-500">
            {products.length} productos en el catálogo
          </p>
        </div>

        <button
          onClick={() => onOpenProductModal(null)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Agregar producto</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="sm:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products List / Cards */}
      <div className="space-y-3">
        {paginatedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-500">
            <p className="font-bold text-sm">No se encontraron productos</p>
            <p className="text-xs text-stone-400 mt-1">
              Probá cambiando los filtros o creá un nuevo producto.
            </p>
          </div>
        ) : (
          paginatedProducts.map((product) => {
            const categoryName = categoriesMap[product.categoryId] || 'Sin categoría';

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-primary/40/60 transition"
              >
                {/* Photo & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-stone-400 p-1 text-center">
                        <ImageIcon className="w-6 h-6 stroke-1 mb-0.5" />
                        <span className="text-[9px] font-medium leading-none">Sin foto</span>
                      </div>
                    )}

                    {!product.available && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-[10px] font-black text-red-300">Agotado</span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-black text-stone-900 text-sm sm:text-base truncate">
                        {product.name}
                      </h4>
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-brand-primary/10 text-brand-primary shrink-0">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-stone-500 block">
                      {categoryName}
                    </span>

                    <span className="text-sm sm:text-base font-extrabold text-stone-900 mt-0.5 block">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleProductAvailability(product.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      product.available
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200 border border-stone-200'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.available ? 'bg-emerald-500' : 'bg-stone-400'
                      }`}
                    />
                    <span>{product.available ? 'Disponible' : 'Agotado'}</span>
                  </button>

                  <button
                    onClick={() => onOpenProductModal(product)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => setProductToDelete({ id: product.id, name: product.name })}
                    className="p-2 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-600">
          <span>
            Mostrando página <strong className="text-stone-900">{currentPage}</strong> de{' '}
            <strong className="text-stone-900">{totalPages}</strong> ({filteredProducts.length} resultados)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Confirmación Borrado */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">
                ¿Eliminar producto?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                ¿Estás seguro de que querés eliminar <span className="font-bold text-stone-800">"{productToDelete.name}"</span>? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};