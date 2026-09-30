import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessInfo, Category, Product, CartItem, ExtraOption } from '../types';
import { INITIAL_BUSINESS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData';

interface CatalogContextType {
  business: BusinessInfo;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  // Business actions
  updateBusiness: (business: BusinessInfo) => void;
  resetToDemoDefaults: () => void;
  // Cart actions
  addToCart: (product: Product, quantity: number, selectedExtras: ExtraOption[], notes?: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'barrio_burger_catalog_v2';
const ADMIN_AUTH_KEY = 'barrio_burger_admin_auth';

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessInfo>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_business`);
      return stored ? JSON.parse(stored) : INITIAL_BUSINESS;
    } catch {
      return INITIAL_BUSINESS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_categories`);
      return stored ? JSON.parse(stored) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_products`);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_business`, JSON.stringify(business));
    } catch (e) {
      console.error(e);
    }
  }, [business]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_products`, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Admin authentication
  const loginAdmin = (email: string, pass: string): boolean => {
    // Clean demo credentials - accepts admin@barrioburger.com or any non-empty demo password
    if (email.trim() && pass.trim()) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(ADMIN_AUTH_KEY);
    setViewMode('public');
  };

  // Products CRUD
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    // Also if the product was open in detail, update it
    setSelectedProductForDetail((current) => (current && current.id === updated.id ? updated : current));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  };

  // Categories CRUD
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateBusiness = (updated: BusinessInfo) => {
    setBusiness(updated);
  };

  const resetToDemoDefaults = () => {
    setBusiness(INITIAL_BUSINESS);
    setCategories(INITIAL_CATEGORIES);
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    localStorage.removeItem(`${STORAGE_KEY}_business`);
    localStorage.removeItem(`${STORAGE_KEY}_categories`);
    localStorage.removeItem(`${STORAGE_KEY}_products`);
    localStorage.removeItem(`${STORAGE_KEY}_cart`);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, selectedExtras: ExtraOption[], notes?: string) => {
    // Calculate unit total
    const extrasTotal = selectedExtras.reduce((sum, ext) => sum + ext.price, 0);
    const unitTotal = product.price + extrasTotal;
    const subtotal = unitTotal * quantity;

    // Unique key based on product id and sorted extras ids
    const extrasKey = selectedExtras
      .map((e) => e.id)
      .sort()
      .join('-');
    const cartItemId = `${product.id}__${extrasKey}__${notes || ''}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        const existing = next[existingIndex];
        const newQty = existing.quantity + quantity;
        next[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.unitTotal * newQty,
        };
        return next;
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          quantity,
          selectedExtras,
          unitTotal,
          subtotal,
          notes,
        },
      ];
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              subtotal: item.unitTotal * nextQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CatalogContext.Provider
      value={{
        business,
        categories,
        products,
        cart,
        cartTotal,
        cartCount,
        viewMode,
        setViewMode,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isCartOpen,
        setIsCartOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBusiness,
        resetToDemoDefaults,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
