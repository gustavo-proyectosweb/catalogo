import React, { useState } from 'react';
import { useCatalog } from '../../context/CatalogContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Check, X, GripVertical, Flame } from 'lucide-react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCatalog();

  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    addCategory({
      name: newCategoryName.trim(),
      order: categories.length + 1,
      active: true,
      icon: 'Utensils',
    });

    setNewCategoryName('');
    setIsAdding(false);
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = (cat: Category) => {
    if (!editingName.trim()) return;
    updateCategory({
      ...cat,
      name: editingName.trim(),
    });
    setEditingCategoryId(null);
  };

  const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1;

  // Verificamos límites
  if (targetIndex < 0 || targetIndex >= categories.length) return;

  const currentCat = categories[index];
  const targetCat = categories[targetIndex];

  // Intercambiamos sus números de 'order'
  try {
    await updateCategory({ ...currentCat, order: targetCat.order ?? targetIndex });
    await updateCategory({ ...targetCat, order: currentCat.order ?? index });
  } catch (error) {
    console.error("Error al reordenar categorías:", error);
  }
};

  const handleToggleActive = (cat: Category) => {
    updateCategory({
      ...cat,
      active: !cat.active,
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (categories.length <= 1) {
      alert('Debe quedar al menos una categoría en el catálogo.');
      return;
    }
    if (window.confirm(`¿Seguro que querés eliminar la categoría "${name}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-heading text-stone-900">
            Categorías
          </h2>
          <p className="text-xs text-stone-500">
            Organizá los grupos en que se dividen tus productos en el menú
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

      {/* Add new category form */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl flex flex-col sm:flex-row items-center gap-3 animate-in fade-in"
        >
          <div className="flex-1 w-full">
            <input
              type="text"
              required
              autoFocus
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nombre de la nueva categoría (ej: Postres)"
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200/60 font-semibold text-xs"
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

     {/* Categories list */}
<div className="max-w-4xl mx-auto space-y-3">
  {categories.map((cat, index) => {
    const isEditingThis = editingCategoryId === cat.id;

    return (
      <div
        key={cat.id}
        className="bg-white rounded-2xl border border-stone-200 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-brand-primary/50 transition"
      >
        {isEditingThis ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-none focus:border-brand-primary"
              autoFocus
            />
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
        ) : (
          <>
            {/* Lado Izquierdo: Número y Nombre */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center font-bold text-xs shrink-0">
                {index + 1}
              </span>
              <span className="font-heading font-black text-stone-900 text-base truncate">
                {cat.name}
              </span>
            </div>

            {/* Lado Derecho / Fila Inferior en Mobile */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-stone-100">
              {/* Botonera Subir / Bajar */}
              <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/80">
                <button
                  onClick={() => handleMoveCategory(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white disabled:opacity-25 disabled:cursor-not-allowed rounded-lg transition cursor-pointer"
                  title="Mover arriba"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleMoveCategory(index, 'down')}
                  disabled={index === categories.length - 1}
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
                  title="Editar nombre"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
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
    </div>
  );
};
