import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { AdminHome } from './AdminHome';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';
import { ProductFormModal } from './ProductFormModal';
import { Product } from '../../types';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Layers,
  Settings,
  Store,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    business,
    categories,
    addProduct,
    updateProduct,
    logoutAdmin,
    setViewMode,
  } = useCatalog();

  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'categories' | 'settings'>('home');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const handleOpenProductModal = (product: Product | null) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (productData: Omit<Product, 'id'> | Product) => {
    if ('id' in productData) {
      updateProduct(productData as Product);
    } else {
      addProduct(productData);
    }
    setIsProductModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Top Navigation Bar */}
      <nav className="bg-stone-900 border-b border-stone-800 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="font-heading font-black text-sm sm:text-base tracking-tight block">
                  {business.name}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                  Panel de Control
                </span>
              </div>
            </div>

            {/* Quick Public View & Logout buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('public')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Ver Catálogo</span>
              </button>

              <button
                onClick={logoutAdmin}
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subnav Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 border-t border-stone-800/60">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'home'
                  ? 'bg-stone-800 text-amber-400 border border-stone-700'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Inicio</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'products'
                  ? 'bg-stone-800 text-amber-400 border border-stone-700'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Productos</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'categories'
                  ? 'bg-stone-800 text-amber-400 border border-stone-700'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Categorías</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                activeTab === 'settings'
                  ? 'bg-stone-800 text-amber-400 border border-stone-700'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configuración</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <AdminHome
            onGoToProducts={() => setActiveTab('products')}
            onOpenNewProduct={() => handleOpenProductModal(null)}
            onGoToCategories={() => setActiveTab('categories')}
          />
        )}

        {activeTab === 'products' && (
          <AdminProducts onOpenProductModal={handleOpenProductModal} />
        )}

        {activeTab === 'categories' && <AdminCategories />}

        {activeTab === 'settings' && <AdminSettings />}
      </main>

      {/* Product Form Modal (Used for both Create and Edit) */}
      {isProductModalOpen && (
        <ProductFormModal
          productToEdit={productToEdit}
          categories={categories}
          onClose={() => setIsProductModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};
