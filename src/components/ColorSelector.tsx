import React from 'react';
import { ProductColor } from '../types/product';

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: ProductColor;
  onSelect: (color: ProductColor) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelect,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-[#6E685F]">
        <span>Color seleccionado:</span>
        <span className="font-medium text-[#2D2A26]">{selectedColor.name}</span>
      </div>
      <div className="flex items-center gap-2.5" role="radiogroup" aria-label="Seleccionar color">
        {colors.map((color) => {
          const isSelected = selectedColor.name === color.name;
          return (
            <button
              key={color.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(color)}
              title={color.name}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                isSelected
                  ? 'ring-2 ring-offset-2 ring-[#2D2A26] scale-105'
                  : 'ring-1 ring-black/15 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              aria-label={color.name}
            />
          );
        })}
      </div>
    </div>
  );
};
