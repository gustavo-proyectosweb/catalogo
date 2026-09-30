import React, { useState, useMemo } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Header } from './Header';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { FloatingCartBar } from './FloatingCartBar';
import { CartDrawer } from './CartDrawer';
import { Product } from '../../types';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export const PublicCatalogView: React.FC = () => {
  const {
    categories,
    products,
    business,
    addToCart,
    selectedProductForDetail,
    setSelectedProductForDetail,
    setViewMode,
  } = useCatalog();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active categories map
  const activeCategories = useMemo(
    () => categories.filter((c) => c.active),
    [categories]
  );

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    } else if (activeCategoryId !== 'all') {
      result = result.filter((p) => p.categoryId === activeCategoryId);
    }

    return result;
  }, [products, activeCategoryId, searchQuery]);

  // Product counts per category
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <div className="min-h-screen bg-stone-100/70 pb-28">
      {/* Header with Search and Business Info */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Sticky Category Navigation */}
      <CategoryNav
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={(id) => {
          setActiveCategoryId(id);
          if (searchQuery) setSearchQuery('');
        }}
        productCountByCategory={productCountByCategory}
        totalProductsCount={products.length}
      />

      {/* Main Catalog Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {searchQuery ? (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-600">
              Resultados de búsqueda para "{searchQuery}" ({filteredProducts.length})
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-amber-600 hover:underline"
            >
              Ver todo el menú
            </button>
          </div>
        ) : null}

        {/* Group by category if 'all' is selected and no search, or display flat list */}
        {activeCategoryId === 'all' && !searchQuery ? (
          <div className="space-y-10">
            {activeCategories.map((cat) => {
              const categoryProducts = products.filter((p) => p.categoryId === cat.id);
              if (categoryProducts.length === 0) return null;

              return (
                <section key={cat.id} id={cat.id} className="scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl sm:text-2xl font-black font-heading text-stone-900 tracking-tight">
                      {cat.name}
                    </h2>
                    <span className="text-xs font-bold text-stone-600 px-2 py-0.5 rounded-full bg-stone-200">
                      {categoryProducts.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {categoryProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={(p) => setSelectedProductForDetail(p)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
                <p className="text-base font-bold text-stone-800">
                  No encontramos productos para tu búsqueda
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Probá buscando otra palabra o seleccioná otra categoría.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategoryId('all');
                  }}
                  className="mt-4 px-4 py-2 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={(p) => setSelectedProductForDetail(p)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center text-xs text-stone-600 border-t border-stone-200/80 mt-12 space-y-3">
        <div className="flex items-center justify-center gap-2 text-stone-700 font-semibold">
          <span>{business.name}</span>
          <span>•</span>
          <span>{business.address}</span>
        </div>

        <p className="text-stone-600 max-w-md mx-auto">
          "La web organiza. WhatsApp vende." Prototipo funcional para comercios con catálogo autogestionable y pedido directo.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4 text-stone-600">
          <button
            onClick={() => setViewMode('admin')}
            className="hover:text-stone-900 flex items-center gap-1 underline decoration-stone-300 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Acceso al Panel de Administración</span>
          </button>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(prod, qty, extras, notes) => addToCart(prod, qty, extras, notes)}
      />

      {/* Floating Bottom Cart Bar (fixed at bottom on mobile/desktop) */}
      <FloatingCartBar />

      {/* Cart Drawer / Order Review */}
      <CartDrawer />
    </div>
  );
};
