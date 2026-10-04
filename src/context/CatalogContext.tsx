import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessInfo, Category, Product, CartItem, ExtraOption } from '../types';
import { INITIAL_BUSINESS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData';

import { db } from '../firebase/config';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';

import { auth } from '../firebase/config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';


interface CatalogContextType {
  business: BusinessInfo;
  categories: Category[];
  products: Product[];
  isLoading: boolean;
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  // Business actions
  updateBusiness: (business: BusinessInfo) => Promise<void>;
  resetToDemoDefaults: () => Promise<void>;
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
  const [business, setBusiness] = useState<BusinessInfo>(INITIAL_BUSINESS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_cart`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // 1. Escuchar la información del Negocio (Documento único 'main')
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'business', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          setBusiness(docSnap.data() as BusinessInfo);
        }
      },
      (error) => console.error("Error al escuchar negocio:", error)
    );
    return () => unsub();
  }, []);

  // 2 y 3. Escuchar Categorías y Productos con bandera de carga inicial
  useEffect(() => {
    let categoriesLoaded = false;
    let productsLoaded = false;

    const checkLoadingComplete = () => {
      if (categoriesLoaded && productsLoaded) {
        setIsLoading(false);
      }
    };

    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const cats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[];

        const sortedCats = cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCategories(sortedCats);
        categoriesLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error("Error al escuchar categorías:", error);
        categoriesLoaded = true;
        checkLoadingComplete();
      }
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const prods = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];
        setProducts(prods);
        productsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error("Error al escuchar productos:", error);
        productsLoaded = true;
        checkLoadingComplete();
      }
    );

    return () => {
      unsubCategories();
      unsubProducts();
    };
  }, []);

  // Guardar Carrito en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);


  // Listener en tiempo real del estado de autenticación en Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminAuthenticated(true);
      } else {
        setIsAdminAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Login real con Firebase Auth
  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  // Logout real con Firebase Auth
  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setViewMode('public');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };


  // -------------------------------------------------------------
  // OPERACIONES DE PRODUCTOS (FIRESTORE)
  // -------------------------------------------------------------
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      return {
        ...productData,
        id: docRef.id,
      };
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  };

  const updateProduct = async (updated: Product) => {
    try {
      const { id, ...dataToUpdate } = updated;
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, dataToUpdate);

      // Si el producto estaba abierto en el detalle, actualizamos el modal
      setSelectedProductForDetail((current) => (current && current.id === updated.id ? updated : current));
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      // Limpiamos del carrito local si existía ese producto
      setCart((prev) => prev.filter((item) => item.product.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const toggleProductAvailability = async (id: string) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;

      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        available: !product.available,
      });
    } catch (error) {
      console.error("Error al cambiar disponibilidad:", error);
    }
  };

  // -------------------------------------------------------------
  // OPERACIONES DE CATEGORÍAS (FIRESTORE)
  // -------------------------------------------------------------
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      // Calculamos el próximo número de orden disponible
      const nextOrder = categories.length > 0
        ? Math.max(...categories.map((c) => c.order ?? 0)) + 1
        : 0;

      // Si categoryData no trae un order definido, le asignamos nextOrder
      const finalData = {
        ...categoryData,
        order: categoryData.order ?? nextOrder,
        active: categoryData.active ?? true,
      };

      await addDoc(collection(db, 'categories'), finalData);
    } catch (error) {
      console.error("Error al agregar categoría:", error);
    }
  };

  const updateCategory = async (updated: Category) => {
    try {
      const { id, ...dataToUpdate } = updated;
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, dataToUpdate);
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  // -------------------------------------------------------------
  // OPERACIONES DEL NEGOCIO (FIRESTORE)
  // -------------------------------------------------------------
  const updateBusiness = async (updated: BusinessInfo) => {
    try {
      // Guardamos o actualizamos directamente el documento 'main' en la colección 'business'
      const businessRef = doc(db, 'business', 'main');
      await setDoc(businessRef, updated, { merge: true });
    } catch (error) {
      console.error("Error al actualizar la información del negocio:", error);
    }
  };

  const resetToDemoDefaults = async () => {
    try {
      // 1. Restaurar negocio por defecto
      await setDoc(doc(db, 'business', 'main'), INITIAL_BUSINESS);

      // 2. Limpiar carrito local
      setCart([]);
      localStorage.removeItem(`${STORAGE_KEY}_cart`);

      console.log("Datos de demostración restaurados");
    } catch (error) {
      console.error("Error al reiniciar a valores por defecto:", error);
    }
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
        isLoading,
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
