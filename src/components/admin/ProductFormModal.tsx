// src/components/admin/ProductFormModal.tsx

import React, { useState, useEffect } from 'react';
import { Product, Category, ExtraOption } from '../../types';
import { X, Plus, Trash2, Check, Upload, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { uploadImageToCloudinary } from '../../services/cloudinary';

interface ProductFormModalProps {
  productToEdit: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'> | Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  productToEdit,
  categories,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | string>(1000);
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [available, setAvailable] = useState(true);
  const [badge, setBadge] = useState('');
  const [extras, setExtras] = useState<ExtraOption[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newExtraName, setNewExtraName] = useState('');
  const [newExtraPrice, setNewExtraPrice] = useState<number | string>(500);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setDescription(productToEdit.description || '');
      setPrice(productToEdit.price || 0);
      setCategoryId(productToEdit.categoryId || '');
      setImageUrl(productToEdit.imageUrl || '');
      setAvailable(productToEdit.available ?? true);
      setBadge(productToEdit.badge || '');
      setExtras(productToEdit.extras || []);
    } else {
      setName('');
      setDescription('');
      setPrice(1000);
      setCategoryId(categories[0]?.id || '');
      setImageUrl('');
      setAvailable(true);
      setBadge('');
      setExtras([]);
    }
    setErrorMessage(null);
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
    setNewExtraPrice(500);
  };

  const handleRemoveExtra = (id: string) => {
    setExtras((prev) => prev.filter((e) => e.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('Ingresá el nombre del producto.');
      return;
    }

    const numericPrice = Number(price);
    if (price === '' || isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage('Ingresá un precio válido mayor o igual a 0.');
      return;
    }

    const selectedCategory = categoryId || categories[0]?.id;
    if (!selectedCategory) {
      setErrorMessage('Debes seleccionar o crear al menos una categoría previa.');
      return;
    }

    setErrorMessage(null);

    // Evitamos enviar undefined a Firebase (usamos strings vacíos o borramos la propiedad)
    const cleanBadge = badge.trim();
    const cleanDescription = description.trim();
    const cleanImageUrl = imageUrl.trim();

    try {
      if (isEditing && productToEdit) {
        await onSave({
          ...productToEdit,
          name: name.trim(),
          description: cleanDescription,
          price: numericPrice,
          categoryId: selectedCategory,
          imageUrl: cleanImageUrl,
          available,
          badge: cleanBadge,
          extras,
        });
      } else {
        await onSave({
          name: name.trim(),
          description: cleanDescription,
          price: numericPrice,
          categoryId: selectedCategory,
          imageUrl: cleanImageUrl,
          available,
          badge: cleanBadge,
          extras,
          order: Date.now(),
        });
      }
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      setErrorMessage("Ocurrió un error al intentar guardar en la base de datos.");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setImageUrl(url);
    } catch (error) {
      alert('Hubo un error al subir la imagen. Por favor intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
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
            type="button"
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensaje de Error */}
        {errorMessage && (
          <div className="bg-red-50 border-b border-red-200 px-5 py-2.5 flex items-center gap-2 text-xs font-bold text-red-700 animate-in fade-in shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body */}
        <form id="product-form" onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nombre del producto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Ej: Hamburguesa Doble Cheddar"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Categoría *
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
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
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
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
                placeholder="Ej: DESTACADO ⭐, NUEVO, PROMO"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Descripción del producto
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles, especificaciones o características..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-stone-900 block">
                Producto disponible
              </span>
              <span className="text-xs text-stone-500">
                {available ? 'Visible y disponible para comprar' : 'Marcado como pausado / sin stock en el catálogo'}
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

          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Imagen del producto
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300 relative flex items-center justify-center">
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                ) : imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-stone-400" />
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
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
          </div>

          <div className="pt-2 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-stone-600">
                Opciones / Extras
              </label>
              <span className="text-xs text-stone-400">
                {extras.length} {extras.length === 1 ? 'opción' : 'opciones'} configuradas
              </span>
            </div>

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
                      className="text-stone-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                      title="Eliminar opción"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newExtraName}
                onChange={(e) => setNewExtraName(e.target.value)}
                placeholder="Nombre de la opción o extra"
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900"
              />
              <div className="relative w-28">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500 text-xs font-bold">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="50"
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
            form="product-form"
            type="submit"
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