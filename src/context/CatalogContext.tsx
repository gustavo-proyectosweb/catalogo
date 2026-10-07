import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessInfo, Category, Product, CartItem, ExtraOption } from '../types';
import { INITIAL_BUSINESS } from '../data/initialData';

import { db, auth } from '../firebase/config';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';

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
  isAuthLoading: boolean;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  editingCartItem: CartItem | null;
  setEditingCartItem: (item: CartItem | null) => void;
  openEditCartItem: (item: CartItem) => void;
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
  // Cart actions
  addToCart: (
    product: Product,
    quantity: number,
    selectedExtras: ExtraOption[],
    notes?: string,
    replaceCartItemId?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

const STORAGE_KEY = 'barrio_burger_catalog_v2';

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessInfo>({
    ...INITIAL_BUSINESS,
    isOpen: INITIAL_BUSINESS.isOpen ?? true,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => setToastMessage(msg);
  const hideToast = () => setToastMessage(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_cart`);
      if (!stored) return [];

      const parsedCart: CartItem[] = JSON.parse(stored);

      return parsedCart.map((item) => {
        const extrasTotal = item.selectedExtras?.reduce((sum, ext) => sum + ext.price, 0) || 0;
        const correctUnitTotal = item.product.price + extrasTotal;
        const correctSubtotal = correctUnitTotal * item.quantity;

        return {
          ...item,
          unitTotal: correctUnitTotal,
          subtotal: correctSubtotal,
        };
      });
    } catch {
      return [];
    }
  });

  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetailState] = useState<Product | null>(null);
  const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);

  const setSelectedProductForDetail = (product: Product | null) => {
    setEditingCartItem(null);
    setSelectedProductForDetailState(product);
  };

  // Escuchar negocio
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'business', 'main'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as BusinessInfo;
          setBusiness({
            ...data,
            isOpen: data.isOpen ?? true, // Fallback si no existe en Firestore todavía
          });
        }
      },
      (error) => console.error("Error al escuchar negocio:", error)
    );
    return () => unsub();
  }, []);

  // Escuchar Categorías y Productos
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

  // Guardar Carrito
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_cart`, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminAuthenticated(!!user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = pass.trim();
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setViewMode('public');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Product Actions
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    try {
      if (!isAdminAuthenticated) {
        console.warn('Advertencia: Intentando agregar producto sin sesión de admin detectada.');
      }
      
      const docRef = await addDoc(collection(db, 'products'), productData);
      showToast(`¡Producto "${productData.name}" creado con éxito!`);
      return { ...productData, id: docRef.id };
    } catch (error) {
      console.error('Error al guardar en Firebase:', error);
      showToast('Error al guardar el producto en la base de datos');
      throw error;
    }
  };

  const updateProduct = async (updated: Product) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    const { id, ...dataToUpdate } = updated;
    await updateDoc(doc(db, 'products', id), dataToUpdate);

    if (selectedProductForDetail && selectedProductForDetail.id === updated.id) {
      setSelectedProductForDetail(updated);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    await deleteDoc(doc(db, 'products', id));
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const toggleProductAvailability = async (id: string) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    const product = products.find((p) => p.id === id);
    if (!product) return;
    await updateDoc(doc(db, 'products', id), { available: !product.available });
  };

  // Category Actions
  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    const nextOrder = categories.length > 0
      ? Math.max(...categories.map((c) => c.order ?? 0)) + 1
      : 0;
    await addDoc(collection(db, 'categories'), {
      ...categoryData,
      order: categoryData.order ?? nextOrder,
      active: categoryData.active ?? true,
    });
  };

  const updateCategory = async (updated: Category) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    const { id, ...dataToUpdate } = updated;
    await updateDoc(doc(db, 'categories', id), dataToUpdate);
  };

  const deleteCategory = async (id: string) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    await deleteDoc(doc(db, 'categories', id));
  };

  // Business Actions
  const updateBusiness = async (updated: BusinessInfo) => {
    if (!isAdminAuthenticated) throw new Error('No autorizado');
    await setDoc(doc(db, 'business', 'main'), updated, { merge: true });
  };

  const openEditCartItem = (item: CartItem) => {
    setEditingCartItem(item);
    setSelectedProductForDetailState(item.product);
    setIsCartOpen(false);
  };

  const addToCart = (
    product: Product,
    quantity: number,
    selectedExtras: ExtraOption[] = [],
    notes?: string,
    replaceCartItemId?: string
  ) => {
    const extrasTotal = selectedExtras.reduce((sum, ext) => sum + ext.price, 0);
    const unitTotal = product.price + extrasTotal;
    const cleanNotes = notes ? notes.trim() : '';

    setCart((prevCart) => {
      if (replaceCartItemId) {
        return prevCart.map((item) => {
          if (item.cartItemId === replaceCartItemId) {
            return {
              ...item,
              quantity,
              selectedExtras,
              unitTotal,
              subtotal: unitTotal * quantity,
              notes: cleanNotes || undefined,
            };
          }
          return item;
        });
      }

      const sortedNewExtras = [...selectedExtras].map((e) => e.id).sort().join(',');

      const existingIndex = prevCart.findIndex((item) => {
        if (item.product.id !== product.id) return false;
        const sortedItemExtras = [...(item.selectedExtras || [])].map((e) => e.id).sort().join(',');
        const sameExtras = sortedItemExtras === sortedNewExtras;
        const sameNotes = (item.notes || '') === cleanNotes;
        return sameExtras && sameNotes;
      });

      if (existingIndex > -1) {
        return prevCart.map((item, idx) => {
          if (idx === existingIndex) {
            const newQty = item.quantity + quantity;
            return {
              ...item,
              quantity: newQty,
              subtotal: item.unitTotal * newQty,
            };
          }
          return item;
        });
      }

      const uniqueCartItemId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${product.id}_${Date.now()}`;

      const newItem: CartItem = {
        cartItemId: uniqueCartItemId,
        product,
        quantity,
        selectedExtras,
        unitTotal,
        subtotal: unitTotal * quantity,
        notes: cleanNotes || undefined,
      };

      return [...prevCart, newItem];
    });

    setEditingCartItem(null);

    const msg = replaceCartItemId
      ? `Cambios guardados en ${product.name}`
      : `¡${product.name} agregado al pedido!`;
    showToast(msg);
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
        isAuthLoading,
        loginAdmin,
        logoutAdmin,
        isCartOpen,
        setIsCartOpen,
        selectedProductForDetail,
        setSelectedProductForDetail,
        editingCartItem,
        setEditingCartItem,
        openEditCartItem,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBusiness,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toastMessage,
        showToast,
        hideToast,
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