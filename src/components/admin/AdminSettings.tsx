import React, { useState, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { BusinessInfo } from '../../types';
import { Store, Phone, MapPin, Clock, Save, Power } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { business, updateBusiness, showToast } = useCatalog();
  const [formData, setFormData] = useState<BusinessInfo>(business);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(business);
  }, [business]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleToggleOpen = () => {
    setFormData((prev) => ({
      ...prev,
      isOpen: !(prev.isOpen ?? true),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateBusiness(formData);
      showToast('Configuración del negocio guardada con éxito');
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      showToast('Error al guardar la configuración');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStoreOpen = formData.isOpen ?? true;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900">
          Configuración del Negocio
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Administrá la información principal, horarios y el estado de recepción de pedidos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Estado del Local */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  isStoreOpen
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Estado de Recepción de Pedidos
                </h3>
                <p className="text-xs text-stone-500">
                  {isStoreOpen
                    ? 'El catálogo está abierto para realizar pedidos.'
                    : 'El local figura cerrado y no se aceptan pedidos en este momento.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleOpen}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                isStoreOpen
                  ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isStoreOpen ? 'CERRAR LOCAL' : 'ABRIR LOCAL'}</span>
            </button>
          </div>
        </div>

        {/* Información Principal */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Información General
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nombre del Negocio
              </label>
              <div className="relative">
                <Store className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                  placeholder="Ej: Barrio Burger"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Teléfono / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp || ''}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                  placeholder="Ej: 5491112345678"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Dirección
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                  placeholder="Ej: Av. San Martín 1234"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Horarios de Atención
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  name="hours"
                  value={formData.schedule || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                  placeholder="Ej: Mar a Dom de 19:00 a 00:00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Descripción / Mensaje de Bienvenida
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition resize-none"
              placeholder="Descripción breve de tu negocio..."
            />
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-stone-950 font-black text-sm rounded-xl shadow-md transition active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};