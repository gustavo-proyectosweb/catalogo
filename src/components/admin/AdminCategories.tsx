import React, { useState, useMemo, useEffect } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Category } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { getCategoryIconComponent } from '../../utils/iconMap';
import { IconPicker } from './IconPicker';

const ITEMS_PER_PAGE = 15;

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, showToast } = useCatalog();

  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('none');

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingIcon, setEditingIcon] = useState('none');

  const [currentPage, setCurrentPage] = useState(1);

  // Modales de alerta y confirmación
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // Control del scroll cuando hay modal abierto
  useEffect(() => {
    if (categoryToDelete || showAlertModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [categoryToDelete, showAlertModal]);

  // Paginación
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE) || 1;

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return categories.slice(start, start + ITEMS_PER_PAGE);
  }, [categories, currentPage]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    addCategory({
      name: newCategoryName.trim(),
      order: categories.length + 1,
      active: true,
      icon: newCategoryIcon,
    });

    setNewCategoryName('');
    setNewCategoryIcon('none');
    setIsAdding(false);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditingName(cat.name);
    setEditingIcon(cat.icon || 'none');
  };

  const handleSaveEdit = (cat: Category) => {
    if (!editingName.trim()) return;
    updateCategory({
      ...cat,
      name: editingName.trim(),
      icon: editingIcon,
    });
    setEditingCategoryId(null);
  };

  const handleMoveCategory = async (globalIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? globalIndex - 1 : globalIndex + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const currentCat = categories[globalIndex];
    const targetCat = categories[targetIndex];

    try {
      await updateCategory({ ...currentCat, order: targetCat.order ?? targetIndex });
      await updateCategory({ ...targetCat, order: currentCat.order ?? globalIndex });
    } catch (error) {
      console.error('Error al reordenar categorías:', error);
    }
  };

  const handleToggleActive = (cat: Category) => {
    updateCategory({
      ...cat,
      active: !cat.active,
    });
  };

  const handleDeleteRequest = (id: string, name: string) => {
    if (categories.length <= 1) {
      setShowAlertModal(true);
      return;
    }
    setCategoryToDelete({ id, name });
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
      showToast(`Categoría "${categoryToDelete.name}" eliminada`);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-heading text-stone-900">
            Categorías
          </h2>
          <p className="text-xs text-stone-500">
            Organizá los grupos en que se dividen tus productos en el catálogo ({categories.length} en total)
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary text-stone-950 font-bold text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva categoría</span>
          </button>
        )}
      </div>

      {/* Formulario Agregar Nueva Categoría */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex flex-col sm:flex-row items-center gap-3 animate-in fade-in"
        >
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <input
              type="text"
              required
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la categoría (ej: Agendas / Postres)"
              className="flex-1 px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />

            {/* Selector Visual de Ícono */}
            <IconPicker value={newCategoryIcon} onChange={setNewCategoryIcon} />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200/60 font-semibold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary text-stone-950 font-bold rounded-xl text-xs shadow-sm cursor-pointer"
            >
              Guardar categoría
            </button>
          </div>
        </form>
      )}

      {/* Lista de Categorías */}
      <div className="max-w-4xl mx-auto space-y-3">
        {paginatedCategories.map((cat, localIndex) => {
          const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + localIndex;
          const isEditingThis = editingCategoryId === cat.id;
          const CurrentIcon = getCategoryIconComponent(cat.icon);

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-stone-200 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-brand-primary/50 transition"
            >
              {isEditingThis ? (
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-brand-primary"
                    autoFocus
                  />

                  {/* Selector Visual de Ícono al editar */}
                  <IconPicker value={editingIcon} onChange={setEditingIcon} />

                  <div className="flex items-center gap-2 self-end sm:self-auto pt-1 sm:pt-0">
                    <button
                      onClick={() => handleSaveEdit(cat)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                      title="Guardar"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    <button
                      onClick={() => setEditingCategoryId(null)}
                      className="p-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg transition cursor-pointer"
                      title="Cancelar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Lado Izquierdo: Número, Ícono Seleccionado y Nombre */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {globalIndex + 1}
                    </span>
                    {CurrentIcon && (
                      <CurrentIcon className="w-4 h-4 text-brand-primary shrink-0" />
                    )}
                    <span className="font-heading font-black text-stone-900 text-base truncate">
                      {cat.name}
                    </span>
                  </div>

                  {/* Lado Derecho */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    {/* Botonera Subir / Bajar */}
                    <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/80">
                      <button
                        onClick={() => handleMoveCategory(globalIndex, 'up')}
                        disabled={globalIndex === 0}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
                        title="Mover arriba"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveCategory(globalIndex, 'down')}
                        disabled={globalIndex === categories.length - 1}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
                        title="Mover abajo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Toggle Activa / Oculta */}
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                        cat.active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-stone-100 text-stone-500 border border-stone-200'
                      }`}
                    >
                      {cat.active ? 'Activa' : 'Oculta'}
                    </button>

                    {/* Acciones Editar y Eliminar */}
                    <div className="flex items-center gap-1 border-l border-stone-200 pl-1.5 ml-1">
                      <button
                        onClick={() => handleStartEdit(cat)}
                        className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition cursor-pointer"
                        title="Editar categoría"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteRequest(cat.id, cat.name)}
                        className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Paginador */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-stone-200 text-xs font-semibold text-stone-600">
          <span>
            Página <strong className="text-stone-900">{currentPage}</strong> de{' '}
            <strong className="text-stone-900">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">¿Eliminar categoría?</h3>
              <p className="text-xs text-stone-500 mt-1">
                ¿Estás seguro de que querés eliminar <span className="font-bold text-stone-800">"{categoryToDelete.name}"</span>? Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alerta: Mínimo 1 categoría */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900">Acción no permitida</h3>
              <p className="text-xs text-stone-500 mt-1">
                Debe quedar al menos una categoría registrada en el catálogo para organizar tus productos.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAlertModal(false)}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};