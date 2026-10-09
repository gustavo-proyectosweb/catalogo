import React, { useState, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { BusinessInfo } from '../../types';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import { Store, Phone, MapPin, Clock, Save, Instagram, Camera, Image as ImageIcon, Upload, Loader2 } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { business, updateBusiness, showToast } = useCatalog();
  const [formData, setFormData] = useState<BusinessInfo>(business);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

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

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'bannerUrl'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (field === 'logoUrl') setUploadingLogo(true);
    if (field === 'bannerUrl') setUploadingBanner(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, [field]: uploadedUrl }));
      showToast('Imagen subida con éxito');
    } catch (error) {
      console.error('Error al subir imagen a Cloudinary:', error);
      showToast('Error al subir la imagen. Intentalo de nuevo.');
    } finally {
      if (field === 'logoUrl') setUploadingLogo(false);
      if (field === 'bannerUrl') setUploadingBanner(false);
    }
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-stone-900">
          Configuración del Negocio
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Administrá la información principal, marca e imagen de tu local.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  name="schedule"
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

        {/* Identidad Visual y Redes */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
            Identidad Visual y Redes
          </h3>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Usuario o Enlace de Instagram
            </label>
            <div className="relative">
              <Instagram className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                name="instagram"
                value={formData.instagram || ''}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition"
                placeholder="Ej: barrioburger.ok"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            {/* Logo Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Logo / Foto de Perfil
              </label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                  {formData.logoUrl ? (
                    <img
                      src={formData.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-6 h-6 text-stone-400" />
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 font-bold text-xs rounded-xl transition flex items-center gap-2 border border-stone-200/80 shadow-2xs">
                  {uploadingLogo ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                  ) : (
                    <Upload className="w-4 h-4 text-stone-600" />
                  )}
                  <span>{uploadingLogo ? 'Subiendo...' : 'Subir Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingLogo}
                    onChange={(e) => handleImageUpload(e, 'logoUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Banner / Portada
              </label>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
                  {formData.bannerUrl ? (
                    <img
                      src={formData.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-stone-400" />
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2.5 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-800 font-bold text-xs rounded-xl transition flex items-center gap-2 border border-stone-200/80 shadow-2xs">
                  {uploadingBanner ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                  ) : (
                    <Upload className="w-4 h-4 text-stone-600" />
                  )}
                  <span>{uploadingBanner ? 'Subiendo...' : 'Subir Banner'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingBanner}
                    onChange={(e) => handleImageUpload(e, 'bannerUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de Guardar */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || uploadingLogo || uploadingBanner}
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