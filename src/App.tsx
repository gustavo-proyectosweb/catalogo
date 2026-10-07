import React, { useEffect } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { PublicCatalogView } from './components/public/PublicCatalogView';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { Loader2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { viewMode, setViewMode, isAdminAuthenticated, isAuthLoading } = useCatalog();

  // Support direct deep link via hash #admin
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [setViewMode]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-100 text-stone-900 selection:bg-brand-primary selection:text-white">
      {/* Demo Switcher Bar for pitches */}
      <DemoSwitcher />

      {/* View routing: Public vs Admin */}
      {viewMode === 'admin' ? (
        isAuthLoading ? (
          <div className="min-h-screen bg-stone-900 flex items-center justify-center text-stone-100">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
          </div>
        ) : isAdminAuthenticated ? (
          <AdminLayout />
        ) : (
          <AdminLogin />
        )
      ) : (
        <PublicCatalogView />
      )}
    </div>
  );
};

export default function App() {
  return (
    <CatalogProvider>
      <MainApp />
    </CatalogProvider>
  );
}