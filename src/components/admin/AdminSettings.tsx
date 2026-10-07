import React, { useState, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { BusinessInfo } from '../../types';
import {
  Check,
  Phone,
  MapPin,
  Instagram,
  Upload,
  Loader2,
  Image as ImageIcon,
  Store,
  Power,
} from 'lucide-react';
import { uploadImageToCloudinary } from '../../services/cloudinary';

export const AdminSettings: React.FC = () => {
  const { business, updateBusiness } = useCatalog();

  const [formData, setFormData] = useState<BusinessInfo>({
    ...business,
    isOpen: business.isOpen ?? true,
  });
  const [savedNotification, setSavedNotification] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    setFormData({
      ...business,
      isOpen: business.isOpen ?? true,
    });
  }, [business]);

  const handleToggleStoreStatus = async () => {
    const updated = { ...formData, isOpen: !formData.isOpen };
    setFormData(updated);
    await updateBusiness(updated);
  };

  const handleWhatsappChange = (value: string) => {
    const cleanNumbers = value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, whatsapp: cleanNumbers }));
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: '' }));
  };

  const handleInstagramChange = (value: string) => {
    let cleanUser = value.trim();
    if (cleanUser.startsWith('@')) {
      cleanUser = cleanUser.slice(1);
    }
    setFormData((prev) => ({ ...prev, instagram: cleanUser }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const url = await uploadImageToCloudinary(file);
      setFormData((prev) => ({ ...prev, logoUrl: url }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        logo: 'Error al subir la imagen. Verifica la conexión o formato.',
      }));
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
      setErrors((prev) => ({
        ...prev,
        banner: 'Error al subir el banner. Intenta de nuevo.',
      }));
    } finally {
      setUploadingBanner(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del comercio es obligatorio.';
    }

    if (!formData.tagline.trim()) {
      newErrors.tagline = 'El subtítulo/rubro es obligatorio.';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'El número de WhatsApp es obligatorio.';
    } else if (formData.whatsapp.length < 10) {
      newErrors.whatsapp = 'Ingresá un número válido con código de área (mínimo 10 dígitos).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await updateBusiness(formData);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-black font-heading text-stone-900">
          Configuración del Negocio
        </h2>
        <p className="text-xs text-stone-500">
          Información visible para los clientes y estado de recepción de pedidos
        </p>
      </div>

      {/* Control de Abierto / Cerrado */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              formData.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Estado del Local:{' '}
              <span className={formData.isOpen ? 'text-emerald-600' : 'text-rose-600'}>
                {formData.isOpen ? 'ABIERTO' : 'CERRADO'}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              {formData.isOpen
                ? 'El catálogo permite a los clientes enviar pedidos por WhatsApp.'
                : 'El catálogo estará bloqueado para nuevos pedidos.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleStoreStatus}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
            formData.isOpen
              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-md'
          }`}
        >
          <Power className="w-4 h-4" />
          <span>{formData.isOpen ? 'CERRAR NEGOCIO' : 'ABRIR NEGOCIO'}</span>
        </button>
      </div>

      {savedNotification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>¡Configuración guardada! El catálogo público se actualizó.</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nombre del comercio *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="Ej: Mi Comercio u Tienda"
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 ${
                errors.name
                  ? 'border-rose-500 focus:ring-rose-200'
                  : 'border-stone-300 focus:ring-brand-primary'
              }`}
            />
            {errors.name && (
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                {errors.name}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Subtítulo / Rubro *
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => {
                setFormData({ ...formData, tagline: e.target.value });
                if (errors.tagline) setErrors((prev) => ({ ...prev, tagline: '' }));
              }}
              placeholder="Ej: Tienda de ropa, Indumentaria y accesorios"
              className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 ${
                errors.tagline
                  ? 'border-rose-500 focus:ring-rose-200'
                  : 'border-stone-300 focus:ring-brand-primary'
              }`}
            />
            {errors.tagline && (
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                {errors.tagline}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">
            Descripción del negocio
          </label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Breve presentación o información importante para tus clientes..."
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Número de WhatsApp (con código de país) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                placeholder="Ej: 5491112345678"
                className={`w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 font-mono ${
                  errors.whatsapp
                    ? 'border-rose-500 focus:ring-rose-200'
                    : 'border-stone-300 focus:ring-brand-primary'
                }`}
              />
            </div>
            {errors.whatsapp ? (
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                {errors.whatsapp}
              </span>
            ) : (
              <span className="text-[11px] text-stone-400 mt-1 block">
                A este número llegarán todos los pedidos armados.
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Horario de atención
            </label>
            <input
              type="text"
              value={formData.schedule}
              onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              placeholder="Ej: Lun a Vie de 09:00 a 18:00 hs"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

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
                placeholder="Ej: Av. Principal 1234, Centro"
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
                value={formData.instagram ? `@${formData.instagram}` : ''}
                onChange={(e) => handleInstagramChange(e.target.value)}
                placeholder="@minegocio.ok"
                className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-stone-100">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">Logo del negocio</label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-200 overflow-hidden shrink-0 border border-stone-300 flex items-center justify-center">
                {uploadingLogo ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                ) : formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-stone-400" />
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

          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">Portada / Banner</label>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center gap-3">
              <div className="w-16 h-12 rounded-xl bg-stone-200 overflow-hidden shrink-0 border border-stone-300 flex items-center justify-center">
                {uploadingBanner ? (
                  <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
                ) : formData.bannerUrl ? (
                  <img
                    src={formData.bannerUrl}
                    alt="Banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageIcon className="w-5 h-5 text-stone-400" />
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

        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>GUARDAR CONFIGURACIÓN</span>
          </button>
        </div>
      </form>
    </div>
  );
};