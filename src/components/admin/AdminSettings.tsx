import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { BusinessInfo } from '../../types';
import { Check, RotateCcw, Phone, MapPin, Instagram, Upload, Loader2 } from 'lucide-react';
import { uploadImageToCloudinary } from '../../services/cloudinary';

export const AdminSettings: React.FC = () => {
  const { business, updateBusiness, resetToDemoDefaults } = useCatalog();

  const [formData, setFormData] = useState<BusinessInfo>(business);
  const [savedNotification, setSavedNotification] = useState(false);

  // Estados de carga independientes para Logo y Banner
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const url = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    } catch (error) {
      alert('Error al subir el logo. Por favor intenta de nuevo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingBanner(true);
      const url = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, bannerUrl: url }));
    } catch (error) {
      alert('Error al subir la imagen de portada. Por favor intenta de nuevo.');
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const handleReset = () => {
    if (
      window.confirm(
        '¿Restablecer todo a los datos iniciales de demo (Barrio Burger)? Se reiniciarán productos, categorías y precios.'
      )
    ) {
      resetToDemoDefaults();
      setFormData(business);
      alert('Datos de demo restablecidos con éxito.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-black font-heading text-stone-900">
          Configuración del Negocio
        </h2>
        <p className="text-xs text-stone-500">
          Información visible para los clientes y número de WhatsApp receptor de pedidos
        </p>
      </div>

      {savedNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>¡Configuración guardada! El catálogo público se actualizó.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
        {/* Name and Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nombre del comercio *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Subtítulo / Rubro *
            </label>
            <input
              type="text"
              required
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Descripción del local
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* WhatsApp & Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Número de WhatsApp (con código de país) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="5491112345678"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary font-mono"
              />
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              A este número llegarán todos los pedidos armados.
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Horario de atención
            </label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="Mar a Dom de 19:30 a 00:30 hs"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Address & Instagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Dirección física / Localidad
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Usuario de Instagram
            </label>
            <div className="relative">
              <Instagram className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="@barrioburger.ok"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Logo and Banner Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-stone-100">
          {/* Logo Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Logo del negocio
            </label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-200 overflow-hidden shrink-0 border border-stone-300 flex items-center justify-center">
                {uploadingLogo ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                ) : (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition">
                  <Upload className="w-3 h-3" />
                  <span>{uploadingLogo ? 'Subiendo...' : 'Subir logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="O pega la URL del logo"
                  className="w-full px-2.5 py-1 bg-white border border-stone-300 rounded-md text-[11px] text-stone-800 truncate focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>
          </div>

          {/* Banner Field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              Portada / Banner
            </label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3">
              <div className="w-16 h-12 rounded-xl bg-stone-200 overflow-hidden shrink-0 border border-stone-300 flex items-center justify-center">
                {uploadingBanner ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                ) : (
                  <img
                    src={formData.bannerUrl}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition">
                  <Upload className="w-3 h-3" />
                  <span>{uploadingBanner ? 'Subiendo...' : 'Subir banner'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    disabled={uploadingBanner}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  placeholder="O pega la URL de portada"
                  className="w-full px-2.5 py-1 bg-white border border-stone-300 rounded-md text-[11px] text-stone-800 truncate focus:outline-none focus:ring-1 focus:ring-brand-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-stone-600 hover:text-red-700 text-xs font-semibold hover:bg-stone-100 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer datos demo</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>GUARDAR CONFIGURACIÓN</span>
          </button>
        </div>
      </form>
    </div>
  );
};