import React from 'react';
import { SizeOption } from '../types/product';

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: SizeOption;
  onSelect: (size: SizeOption) => void;
  compact?: boolean;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelect,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-wrap items-center ${compact ? 'gap-1' : 'gap-2'}`}
      role="radiogroup"
      aria-label="Seleccionar talla"
    >
      {sizes.map((size) => {
        const active = selectedSize === size;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(size);
            }}
            className={`whitespace-nowrap shrink-0 transition-all cursor-pointer tabular-nums font-medium ${
              compact
                ? `px-2 py-1 text-[11px] rounded-lg ${
                    active
                      ? 'bg-[#2D2A26] text-white font-semibold'
                      : 'bg-[#F7F3EC] text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#ECE6DA]'
                  }`
                : `px-3.5 py-2 text-xs rounded-xl border ${
                    active
                      ? 'bg-[#2D2A26] text-white border-[#2D2A26] font-semibold shadow-xs'
                      : 'bg-white text-[#2D2A26] border-black/10 hover:border-[#2D2A26]/40'
                  }`
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
};
