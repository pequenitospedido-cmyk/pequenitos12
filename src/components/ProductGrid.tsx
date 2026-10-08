import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { useStore } from '../context/StoreContext';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  onResetFilters?: () => void;
  quickAddCategory?: string;
  quickAddFeatured?: boolean;
  quickAddLabel?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyMessage = 'No encontramos prendas que coincidan con los filtros seleccionados.',
  onResetFilters,
  quickAddCategory = 'mamelucos',
  quickAddFeatured = false,
  quickAddLabel = 'Esta sección',
}) => {
  const { isLiveEditMode, openQuickProductModal } = useStore();

  if (products.length === 0 && !isLiveEditMode) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center my-6 border border-black/6">
        <p className="font-display text-xl text-[#2D2A26] mb-2">
          Explora otras opciones para tu Pequeñito
        </p>
        <p className="text-sm text-[#6E685F] max-w-md mx-auto mb-5">{emptyMessage}</p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {/* Contextual "+ Agregar producto aquí" slot when Gutenberg Live Edit Mode is active */}
      {isLiveEditMode && (
        <button
          type="button"
          onClick={() =>
            openQuickProductModal({
              category: quickAddCategory,
              featured: quickAddFeatured,
              sectionLabel: quickAddLabel,
            })
          }
          className="min-h-[320px] rounded-3xl border-2 border-dashed border-[#4FA6EE] bg-[#EBF5FD]/35 hover:bg-[#EBF5FD]/70 p-6 flex flex-col items-center justify-center text-center gap-3 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#4FA6EE] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Plus className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <p className="font-display text-base font-semibold text-[#2D2A26]">
              + Agregar producto aquí
            </p>
            <p className="text-xs text-[#6E685F]">
              Se publicará directamente en <strong>{quickAddLabel}</strong>
            </p>
          </div>
        </button>
      )}
    </div>
  );
};
