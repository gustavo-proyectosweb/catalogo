import React from 'react';

export const CategorySkeleton: React.FC = () => {
  return (
    <nav className="sticky top-[33px] z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 shadow-md py-2.5 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-hidden py-0.5 animate-pulse">
          {/* Píldoras simuladas */}
          {[90, 110, 130, 100, 120].map((width, idx) => (
            <div
              key={idx}
              className="h-9 bg-stone-800/90 rounded-xl shrink-0 border border-stone-700/40"
              style={{ width: `${width}px` }}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};