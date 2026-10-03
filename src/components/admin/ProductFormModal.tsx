// src/components/admin/ProductFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Product, Category, ExtraOption } from '../../types';
import { X, Plus, Trash2, Image, Sparkles, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Upload, Loader2 } from 'lucide-react';

interface ProductFormModalProps {
  productToEdit: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
}

// Curated high quality food image presets so the user can easily swap images without needing to find a URL
const PRESET_IMAGES = [
  { label: 'Doble Smash Bacon', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Burger Clásica', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80' },
  { label: 'BBQ Crunchy', url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80' },
  { label: 'Cheddar Cascada', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80' },
  { label: 'Veggie Portobello', url: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80' },
  { label: 'Combo Burger & Papas', url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Papas Rústicas', url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80' },
  { label: 'Papas Cheddar & Bacon', url: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&auto=format&fit=crop&q=80' },
  { label: 'Aros de Cebolla', url: 'https://images.unsplash.com/photo-1639024471287-03521672366c?w=800&auto=format&fit=crop&q=80' },
  { label: 'Gaseosa Cola', url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  categories,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(12500);
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [badge, setBadge] = useState('');
  const [extras, setExtras] = useState<ExtraOption[]>([]);

  // New extra field state
  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState<number | string>(1000);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setDescription(productToEdit.description);
      setPrice(productToEdit.price);
      setCategoryId(productToEdit.categoryId);
      setImageUrl(productToEdit.imageUrl);
      setAvailable(productToEdit.available);
      setBadge(productToEdit.badge || '');
      setExtras(productToEdit.extras || []);
    } else {
      setName('');
      setDescription('');
      setPrice(12500);
      setCategoryId(categories[0]?.id || 'cat-hamburguesas');
      setImageUrl(PRESET_IMAGES[0].url);
      setAvailable(true);
      setBadge('');
      setExtras([
        { id: `ext-${Date.now()}-1`, name: 'Cheddar extra', price: 1000, available: true },
        { id: `ext-${Date.now()}-2`, name: 'Panceta extra', price: 1500, available: true },
      ]);
    }
  }, [productToEdit, categories]);

  const handleAddExtra = () => {
    if (!newExtraName.trim()) return;
    const numPrice = Number(newExtraPrice) || 0;
    const newExtra: ExtraOption = {
      id: `ext-${Date.now()}`,
      name: newExtraName.trim(),
      price: numPrice,
      available: true,
    };
    setExtras((prev) => [...prev, newExtra]);
    setNewExtraName('');
    setNewExtraPrice(1000);
  };

  const handleRemoveExtra = (id: string) => {
    setExtras((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const numericPrice = Number(price) || 0;

    if (isEditing && productToEdit) {
      onSave({
        ...productToEdit,
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        categoryId: categoryId || categories[0]?.id,
        imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
        available,
        badge: badge.trim() || undefined,
        extras,
      });
    } else {
      onSave({
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        categoryId: categoryId || categories[0]?.id,
        imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
        available,
        badge: badge.trim() || undefined,
        extras,
        order: 99,
      });
    }
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url); // Asigna automáticamente la URL devuelta por Cloudinary
    } catch (error) {
      alert('Hubo un error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-heading font-black">
              {isEditing ? 'Editar producto' : 'Nuevo producto'}
            </h3>
            <p className="text-xs text-stone-400">
              {isEditing
                ? 'Los cambios se reflejarán inmediatamente en el catálogo público'
                : 'Completá los datos básicos para publicar en el catálogo'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          {/* Two-column general fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nombre del producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Doble Bacon"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Precio ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold text-sm">
                  $
                </span>
                <input
                  type="number"
                  required
                  min="0"
                  step="50"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Etiqueta / Badge (Opcional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej: MÁS PEDIDA 🔥, NUEVO"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Descripción de ingredientes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pan brioche, doble carne, cheddar fundido..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Availability switch */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-stone-900 block">
                Producto disponible
              </span>
              <span className="text-xs text-stone-500">
                {available ? 'Visible y disponible para comprar' : 'Marcado como agotado en el menú'}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setAvailable(!available)}
              className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                available ? 'bg-emerald-500' : 'bg-stone-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  available ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Image Selection with Upload + Presets + Custom URL */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Imagen del producto
            </label>

            {/* Current preview & Upload / URL */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300 relative flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                ) : (
                  <img
                    src={imageUrl || PRESET_IMAGES[0].url}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                {/* Botón para subir desde dispositivo */}
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Subiendo...' : 'Subir foto local'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {uploading && <span className="text-xs text-brand-primary font-semibold">Procesando imagen...</span>}
                </div>

                {/* Input para pegar URL manual */}
                <div>
                  <span className="text-[11px] font-semibold text-stone-500 block">O pegá una URL de imagen:</span>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full mt-0.5 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs text-stone-800 truncate focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>

            {/* Quick Presets Picker */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-1">
                O elegí una foto predefinida rápida:
              </span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`shrink-0 flex items-center gap-1.5 p-1 rounded-xl border text-xs transition cursor-pointer ${
                      imageUrl === preset.url
                        ? 'border-brand-primary bg-brand-primary/5 text-stone-900 font-bold'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="pr-1">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Extras / Adicionales Manager */}
          <div className="pt-2 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-stone-600">
                Opciones / Extras
              </label>
              <span className="text-xs text-stone-400">
                {extras.length} {extras.length === 1 ? 'extra' : 'extras'} configurados
              </span>
            </div>

            {/* Existing extras */}
            <div className="space-y-2">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                >
                  <span className="font-semibold text-stone-800">{extra.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-900">+{formatPrice(extra.price)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExtra(extra.id)}
                      className="text-stone-400 hover:text-red-500 p-1 rounded transition"
                      title="Eliminar extra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add extra row */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
                placeholder="Nombre del extra (ej: Huevo frito)"
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
              <div className="relative w-28">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-xs font-bold">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={newExtraPrice}
                  onChange={(e) => setNewExtraPrice(e.target.value)}
                  className="w-full pl-6 pr-2 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                />
              </div>
              <button
                type="button"
                onClick={handleAddExtra}
                className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sumar</span>
              </button>
            </div>
          </div>
        </form>

        {/* Modal Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{isEditing ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
