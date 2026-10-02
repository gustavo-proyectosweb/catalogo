import { db } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { INITIAL_BUSINESS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data/initialData';
import { Product, Category, BusinessInfo } from '../types';

// Helper para eliminar propiedades con valor undefined antes de escribir en Firestore
function sanitizeData<T extends Record<string, any>>(obj: T): T {
  const cleanObj = { ...obj };
  Object.keys(cleanObj).forEach((key) => {
    if (cleanObj[key] === undefined) {
      delete cleanObj[key];
    }
  });
  return cleanObj;
}

export async function seedFirestoreData() {
  console.log('🚀 Iniciando migración de datos a Firestore...');

  try {
    // 1. Migrar BusinessInfo -> business/info (setDoc sin merge)
    const cleanBusiness = sanitizeData<BusinessInfo>(INITIAL_BUSINESS);
    const businessRef = doc(db, 'business', 'info');
    await setDoc(businessRef, cleanBusiness);
    console.log('✅ BusinessInfo migrado exitosamente.');

    // 2. Migrar Categories -> categories/{category.id} (setDoc sin merge)
    for (const category of INITIAL_CATEGORIES) {
      const { id, ...categoryData } = category;
      const cleanCategory = sanitizeData<Omit<Category, 'id'>>(categoryData);
      const categoryRef = doc(db, 'categories', id);
      await setDoc(categoryRef, cleanCategory);
    }
    console.log(`✅ ${INITIAL_CATEGORIES.length} Categorías migradas exitosamente.`);

    // 3. Migrar Products -> products/{product.id} (setDoc sin merge)
    for (const product of INITIAL_PRODUCTS) {
      const { id, ...productData } = product;
      const cleanProduct = sanitizeData<Omit<Product, 'id'>>(productData);
      const productRef = doc(db, 'products', id);
      await setDoc(productRef, cleanProduct);
    }
    console.log(`✅ ${INITIAL_PRODUCTS.length} Productos migrados exitosamente.`);

    console.log('🎉 ¡Migración completada con éxito!');
    return { success: true, message: 'Migración exitosa' };
  } catch (error: any) {
    console.error('❌ Error durante la migración a Firestore:', error);
    return { success: false, error: error?.message || 'Error desconocido' };
  }
}

// Exponer únicamente en el objeto window para ejecución manual desde la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).runFirestoreSeed = seedFirestoreData;
}