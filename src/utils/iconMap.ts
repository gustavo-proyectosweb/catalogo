import { 
  // Gastronomía & Alimentos
  Utensils, Pizza, Coffee, IceCream, Cake, Beer, CupSoda, Flame, Cookie, 
  Sandwich, Soup, Apple, Wine, Salad, GlassWater, Beef, Donut, Popcorn,
  
  // Papelería, Arte, Imprenta & Creativos
  BookOpen, Scissors, Palette, Gift, Sparkles, Tag, Package, Bookmark, 
  Printer, PenTool, Image, FileText, Stamp, Brush,

  // Tienda, Moda, Belleza & Comercio General
  ShoppingBag, Star, Heart, Store, Layers, Smile, Shirt, Watch, 
  Glasses, ShoppingCart, Sparkle, Gem, Ticket, Award,
  
  LucideIcon
} from 'lucide-react';

export interface CategoryIconOption {
  id: string;
  label: string;
  icon: LucideIcon | null;
}

export const CATEGORY_ICONS: CategoryIconOption[] = [
  { id: 'none', label: 'Sin ícono', icon: null },
  
  // --- GASTRONOMÍA Y ALIMENTOS ---
  { id: 'Flame', label: 'Fuego / Parrilla', icon: Flame },
  { id: 'Utensils', label: 'Cubiertos / Platos', icon: Utensils },
  { id: 'Sandwich', label: 'Hamburguesas / Sandwich', icon: Sandwich },
  { id: 'Pizza', label: 'Pizza', icon: Pizza },
  { id: 'Beef', label: 'Carnes / Lomitos', icon: Beef },
  { id: 'Soup', label: 'Sopas / Ramen', icon: Soup },
  { id: 'Salad', label: 'Ensaladas / Saludable', icon: Salad },
  { id: 'IceCream', label: 'Helados', icon: IceCream },
  { id: 'Cake', label: 'Pastelería / Tortas', icon: Cake },
  { id: 'Cookie', label: 'Galletas / Dulces', icon: Cookie },
  { id: 'Donut', label: 'Donas / Facturas', icon: Donut },
  { id: 'Popcorn', label: 'Pochoclos / Snacks', icon: Popcorn },
  { id: 'CupSoda', label: 'Gaseosas / Bille', icon: CupSoda },
  { id: 'Coffee', label: 'Café / Infusiones', icon: Coffee },
  { id: 'GlassWater', label: 'Bebidas / Licuados', icon: GlassWater },
  { id: 'Beer', label: 'Cerveza / Barra', icon: Beer },
  { id: 'Wine', label: 'Vinos / Tragos', icon: Wine },
  { id: 'Apple', label: 'Frutas / Verduras', icon: Apple },

  // --- PAPELERÍA, IMPRENTA, ARTE Y CREATIVOS ---
  { id: 'BookOpen', label: 'Cuadernos / Agendas', icon: BookOpen },
  { id: 'Bookmark', label: 'Papelería / Libros', icon: Bookmark },
  { id: 'Scissors', label: 'Tijeras / Manualidades', icon: Scissors },
  { id: 'Palette', label: 'Arte / Ilustración', icon: Palette },
  { id: 'Brush', label: 'Pinceles / Pintura', icon: Brush },
  { id: 'PenTool', label: 'Diseño / Trazos', icon: PenTool },
  { id: 'Printer', label: 'Imprenta / Gráfica', icon: Printer },
  { id: 'FileText', label: 'Hojas / Impresiones', icon: FileText },
  { id: 'Image', label: 'Fotografía / Láminas', icon: Image },
  { id: 'Stamps', label: 'Sellos / Marcas', icon: Stamp },
  { id: 'Gift', label: 'Regalos / Box', icon: Gift },
  { id: 'Sparkles', label: 'Especial / Detalle', icon: Sparkles },
  { id: 'Package', label: 'Packs / Envíos', icon: Package },
  { id: 'Tag', label: 'Etiquetas / Etiquetas', icon: Tag },

  // --- MODA, TIENDA Y COMERCIO GENERAL ---
  { id: 'ShoppingBag', label: 'Bolsa de compras', icon: ShoppingBag },
  { id: 'ShoppingCart', label: 'Carrito / Tienda', icon: ShoppingCart },
  { id: 'Shirt', label: 'Indumentaria / Ropa', icon: Shirt },
  { id: 'Glasses', label: 'Accesorios / Óptica', icon: Glasses },
  { id: 'Watch', label: 'Relojes / Joyas', icon: Watch },
  { id: 'Gem', label: 'Joyería / Premium', icon: Gem },
  { id: 'Store', label: 'Local / Comercio', icon: Store },
  { id: 'Ticket', label: 'Cupones / Eventos', icon: Ticket },
  { id: 'Award', label: 'Destacados / Premios', icon: Award },
  { id: 'Star', label: 'Estrellas / Favoritos', icon: Star },
  { id: 'Heart', label: 'Corazón / Destacados', icon: Heart },
  { id: 'Smile', label: 'Variarios / Varios', icon: Smile },
];

export const getCategoryIconComponent = (iconId?: string): LucideIcon | null => {
  if (!iconId || iconId === 'none') return null;
  const found = CATEGORY_ICONS.find((item) => item.id === iconId);
  return found ? found.icon : null;
};