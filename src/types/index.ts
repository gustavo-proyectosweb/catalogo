export interface ExtraOption {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  available: boolean;
  order: number;
  badge?: string;
  extras: ExtraOption[];
}

export interface Category {
  id: string;
  name: string;
  order: number;
  active: boolean;
  icon?: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  description: string;
  whatsapp: string;
  address: string;
  instagram: string;
  schedule: string;
  logoUrl: string;
  bannerUrl: string;
  currencySymbol: string;
  primaryColor: string;
  isOpen: boolean;
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedExtras: ExtraOption[];
  unitTotal: number;
  subtotal: number;
  notes?: string;
}
