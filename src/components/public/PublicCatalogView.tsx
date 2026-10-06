import React, { useState, useMemo } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Header } from './Header';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { FloatingCartBar } from './FloatingCartBar';
import { CartDrawer } from './CartDrawer';
import { Footer } from './Footer';
import { ProductSkeleton } from './ProductSkeleton';
import { CategorySkeleton } from './CategorySkeleton';

export const PublicCatalogView: React.FC = () => {
  const {
    categories,
    products,
    business,
    isLoading,
    addToCart,
    selectedProductForDetail,
    setSelectedProductForDetail,
    editingCartItem
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
      const wordBoundaryRegex = new RegExp(`\\b${q}`, 'i');

      result = result.filter((p) => {
        // Solo evalúa el nombre del producto
        return wordBoundaryRegex.test(p.name);
      });
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
    <div className="min-h-screen bg-stone-100/70">
      {/* Contenedor Hero exclusivo para el Header en Mobile */}
      <div className="min-h-[calc(100dvh-36px)] sm:min-h-0 flex flex-col justify-between bg-stone-900">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>

      {/* Sticky Category Navigation / Category Skeleton */}
      {isLoading ? (
        <CategorySkeleton />
      ) : (
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
      )}

      {/* Main Catalog Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        {isLoading ? (
          /* Esqueleto de carga para la grilla de productos */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : (
          /* Renderizado normal del catálogo */
          <>
            {searchQuery ? (
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-600">
                  Resultados de búsqueda para "{searchQuery}" ({filteredProducts.length})
                </h2>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer"
                >
                  Ver todo el menú
                </button>
              </div>
            ) : null}

            {/* Group by category if 'all' is selected and no search, or display flat list */}
            {activeCategoryId === 'all' && !searchQuery ? (
              <div className="space-y-8">
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
                      className="mt-4 px-4 py-2 bg-brand-primary text-stone-950 font-bold rounded-xl text-xs cursor-pointer"
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
          </>
        )}
      </main>

      {/* Footer */}
      <Footer business={business} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        key={selectedProductForDetail ? `${selectedProductForDetail.id}-${editingCartItem?.cartItemId || 'new'}` : 'modal-closed'}
        product={selectedProductForDetail}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(prod, qty, extras, notes, replaceCartItemId) =>
          addToCart(prod, qty, extras, notes, replaceCartItemId)
        }
      />

      {/* Floating Bottom Cart Bar */}
      <FloatingCartBar />

      {/* Cart Drawer / Order Review */}
      <CartDrawer />
    </div>
  );
};