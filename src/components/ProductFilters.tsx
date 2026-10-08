import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { AgeRange, CategorySlug, SizeOption } from '../types/product';

export type SortOption = 'recommended' | 'newest' | 'price-asc' | 'price-desc';

export interface FilterState {
  search: string;
  category: CategorySlug | 'all';
  age: AgeRange | 'all';
  size: SizeOption | 'all';
  maxPrice: number;
  color: string | 'all';
  sort: SortOption;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  hideCategoryFilter?: boolean;
}

const CATEGORIES_LIST: { value: CategorySlug | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'mamelucos', label: 'Mamelucos' },
  { value: 'camisetas', label: 'Camisetas' },
  { value: 'conjuntos', label: 'Conjuntos' },
  { value: 'regalos', label: 'Regalos' },
];

const AGE_OPTIONS: (AgeRange | 'all')[] = [
  'all',
  '0-3 meses',
  '3-6 meses',
  '6-12 meses',
  '12-18 meses',
  '18-24 meses',
  '2-3 años',
  '3-4 años',
  '4-5 años',
  '5-6 años',
];

const SIZE_OPTIONS: (SizeOption | 'all')[] = [
  'all',
  '0-3M',
  '3-6M',
  '6-12M',
  '12-18M',
  '18-24M',
  '2T',
  '3T',
  '4T',
  '5T',
  '6T',
];

const COLOR_OPTIONS = [
  { label: 'Todos los colores', value: 'all' },
  { label: 'Azul Pastel', value: 'Azul' },
  { label: 'Crema Suave', value: 'Crema' },
  { label: 'Verde Menta', value: 'Menta' },
  { label: 'Coral Suave', value: 'Coral' },
  { label: 'Amarillo Cálido', value: 'Amarillo' },
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  hideCategoryFilter = false,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    (!hideCategoryFilter && filters.category !== 'all') ||
    filters.age !== 'all' ||
    filters.size !== 'all' ||
    filters.maxPrice < 120000 ||
    filters.color !== 'all';

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-black/6 mb-8 space-y-5">
      {/* Top Row: Search, Count & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Buscar por nombre, prenda o etapa..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] placeholder:text-[#6E685F] focus:outline-none focus:border-[#4FA6EE]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between md:justify-end gap-4">
          <span className="text-xs sm:text-sm font-medium text-[#6E685F] tabular-nums">
            <strong className="text-[#2D2A26]">{totalCount}</strong>{' '}
            {totalCount === 1 ? 'producto' : 'productos'}
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-[#6E685F] whitespace-nowrap">
              Ordenar por:
            </label>
            <select
              id="sort-select"
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value as SortOption })}
              className="py-2 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm font-medium text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE] cursor-pointer"
            >
              <option value="recommended">Recomendados</option>
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio menor</option>
              <option value="price-desc">Precio mayor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Interactive Segmented Tabs (if on /tienda) */}
      {!hideCategoryFilter && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES_LIST.map((cat) => {
            const active = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onChange({ category: cat.value })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#2D2A26] text-white'
                    : 'bg-[#F7F3EC] text-[#6E685F] hover:text-[#2D2A26]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Detailed Filter Controls: Edad, Talla, Color, Precio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-black/6">
        <div>
          <label className="block text-[11px] font-medium text-[#6E685F] mb-1">Edad</label>
          <select
            value={filters.age}
            onChange={(e) => onChange({ age: e.target.value as AgeRange | 'all' })}
            className="w-full py-2 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          >
            {AGE_OPTIONS.map((age) => (
              <option key={age} value={age}>
                {age === 'all' ? 'Todas las edades' : age}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#6E685F] mb-1">Talla</label>
          <select
            value={filters.size}
            onChange={(e) => onChange({ size: e.target.value as SizeOption | 'all' })}
            className="w-full py-2 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          >
            {SIZE_OPTIONS.map((sz) => (
              <option key={sz} value={sz}>
                {sz === 'all' ? 'Todas las tallas' : `Talla ${sz}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#6E685F] mb-1">Color</label>
          <select
            value={filters.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-full py-2 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          >
            {COLOR_OPTIONS.map((col) => (
              <option key={col.value} value={col.value}>
                {col.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] font-medium text-[#6E685F] mb-1">
            <span>Precio hasta</span>
            <span className="text-[#2D2A26] font-semibold tabular-nums">
              ${filters.maxPrice.toLocaleString('es-CO')}
            </span>
          </div>
          <input
            type="range"
            min={25000}
            max={120000}
            step={5000}
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="w-full accent-[#4FA6EE] cursor-pointer mt-1.5"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-[#6E685F]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#4FA6EE]" />
            <span>Filtros activos aplicados</span>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#F48B7B] hover:text-[#2D2A26] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Restablecer filtros</span>
          </button>
        </div>
      )}
    </div>
  );
};
