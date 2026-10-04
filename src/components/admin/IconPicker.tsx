import React, { useState } from 'react';
import { CATEGORY_ICONS } from '../../utils/iconMap';
import { ChevronDown, Ban } from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconId: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = CATEGORY_ICONS.find((item) => item.id === value) || CATEGORY_ICONS[0];
  const SelectedIcon = selectedItem.icon;

  return (
    <div className="relative">
      {/* Botón para abrir el selector visual */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-800 hover:border-stone-400 transition cursor-pointer"
      >
        <span className="text-stone-500 text-xs font-semibold">Ícono:</span>
        <div className="flex items-center gap-1.5 font-bold text-stone-900">
          {SelectedIcon ? (
            <SelectedIcon className="w-4 h-4 text-brand-primary" />
          ) : (
            <Ban className="w-4 h-4 text-stone-400" />
          )}
          <span>{selectedItem.label.split('/')[0]}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Menú flotante con la Grilla de Íconos */}
      {isOpen && (
        <>
          {/* Fondo para cerrar al hacer clic afuera */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 mt-2 z-50 w-72 p-3 bg-white border border-stone-200 rounded-2xl shadow-xl space-y-2 animate-in fade-in">
            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
              Seleccionar ícono
            </p>

            {/* Cuadrícula de Íconos (Grid) */}
            <div className="grid grid-cols-5 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {CATEGORY_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = item.id === value;

                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    onClick={() => {
                      onChange(item.id);
                      setIsOpen(false);
                    }}
                    className={`p-2.5 rounded-xl flex items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? 'bg-brand-primary text-stone-950 ring-2 ring-brand-primary/50'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200/60'
                    }`}
                  >
                    {IconComponent ? (
                      <IconComponent className="w-5 h-5" />
                    ) : (
                      <Ban className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};