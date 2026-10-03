import React from 'react';
import { Category } from '../../types';
import { Flame, Utensils, Cookie, CupSoda, LayoutGrid } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  productCountByCategory: Record<string, number>;
  totalProductsCount: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  productCountByCategory,
  totalProductsCount,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'cat-hamburguesas':
        return <Flame className="w-4 h-4 text-brand-primary" />;
      case 'cat-combos':
        return <Utensils className="w-4 h-4 text-brand-primary" />;
      case 'cat-acompaniamientos':
        return <Cookie className="w-4 h-4 text-brand-primary" />;
      case 'cat-bebidas':
        return <CupSoda className="w-4 h-4 text-brand-primary" />;
      default:
        return <LayoutGrid className="w-4 h-4 text-brand-primary" />;
    }
  };

  const activeCategories = categories.filter((c) => c.active);

  return (
    <nav className="sticky top-[33px] z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-md py-2.5 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {/* 'Todos' option */}
          <button
            onClick={() => onSelectCategory('all')}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeCategoryId === 'all'
                ? 'bg-brand-primary text-stone-950 shadow-md shadow-brand-primary/50/20 scale-102'
                : 'bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700/80 border border-stone-700/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Todos</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeCategoryId === 'all'
                  ? 'bg-stone-950/20 text-stone-950'
                  : 'bg-stone-700 text-stone-300'
              }`}
            >
              {totalProductsCount}
            </span>
          </button>

          {/* Dynamic Categories */}
          {activeCategories.map((cat) => {
            const count = productCountByCategory[cat.id] || 0;
            const isSelected = activeCategoryId === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-brand-primary text-stone-950 shadow-md shadow-brand-primary/50/20 scale-102'
                    : 'bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700/80 border border-stone-700/60'
                }`}
              >
                {getIcon(cat.id)}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-stone-950/20 text-stone-950'
                      : 'bg-stone-700 text-stone-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
