import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Store } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setViewMode, business } = useCatalog();
  const [email, setEmail] = useState('admin@barrioburger.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completá usuario y contraseña');
      return;
    }

    const success = loginAdmin(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
    }
  };

  const handleQuickDemoAccess = () => {
    loginAdmin('admin@barrioburger.com', 'admin123');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 relative">
      {/* Back to catalog button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => setViewMode('public')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700 cursor-pointer"
        >
          <Store className="w-4 h-4 text-amber-500" />
          <span>Volver al Catálogo Público</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 mb-4">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
          Panel de Control
        </h2>
        <p className="mt-1 text-sm text-stone-400">
          Administración de catálogo de <span className="text-amber-400 font-bold">{business.name}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-stone-950 py-8 px-6 sm:px-10 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Quick Demo Access banner */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Acceso Rápido Demo
                </span>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Probá el panel con un solo clic sin escribir claves.
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoAccess}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition cursor-pointer shrink-0"
              >
                Entrar directo
              </button>
            </div>
          </div>

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
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="admin@barrioburger.com"
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
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <span>Ingresar al Panel</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800/80 text-center">
            <span className="text-[11px] text-stone-400">
              Credenciales demo sugeridas: <code className="text-stone-300">admin@barrioburger.com</code> / <code className="text-stone-300">admin123</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
