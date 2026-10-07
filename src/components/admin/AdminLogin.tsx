import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Store, Loader2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setViewMode, business } = useCatalog();
  const [email, setEmail] = useState('admin@barrioburger.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Por favor completá usuario y contraseña');
      return;
    }

    setLoading(true);
    setError('');

    const success = await loginAdmin(cleanEmail, cleanPassword);
    setLoading(false);

    if (!success) {
      setError('Credenciales incorrectas o usuario no registrado');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 relative">
      {/* Back to catalog button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => setViewMode('public')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700 cursor-pointer"
        >
          <Store className="w-4 h-4 text-brand-primary" />
          <span>Volver al Catálogo Público</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-primary text-stone-950 flex items-center justify-center mx-auto shadow-xl shadow-brand-primary/50/20 mb-4">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
          Panel de Control
        </h2>
        <p className="mt-1 text-sm text-stone-400">
          Administración de catálogo de <span className="text-brand-primary font-bold">{business.name}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-950 py-8 px-6 sm:px-10 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="admin@barrioburger.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-black text-sm shadow-lg shadow-brand-primary/50/20 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Ingresar al Panel</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};