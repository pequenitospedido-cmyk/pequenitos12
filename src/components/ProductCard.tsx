import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check, Edit3 } from 'lucide-react';
import { Product, SizeOption } from '../types/product';
import { formatCOP } from '../data/products';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { SizeSelector } from './SizeSelector';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const { isLiveEditMode } = useStore();
  const [selectedSize, setSelectedSize] = useState<SizeOption>(product.sizes[0] || '0-3M');
  const [imgError, setImgError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const favorite = isFavorite(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, product.colors[0], 1, true);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const categoryLabels: Record<string, string> = {
    mamelucos: 'Mamelucos',
    camisetas: 'Camisetas',
    conjuntos: 'Conjuntos',
    combos: 'Combos',
    regalos: 'Regalos',
    novedades: 'Novedades',
  };

  return (
    <article className="group bg-white rounded-3xl p-3 sm:p-4 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#F7F3EC] mb-3.5">
          <Link to={`/producto/${product.slug}`} className="block w-full h-full">
            {!imgError ? (
              <img
                src={product.images[0]}
                alt={`${product.name} - Pequeñitos Colombia`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-[#EBF5FD]/60">
                <span className="font-display text-base text-[#2D2A26]">{product.name}</span>
              </div>
            )}
          </Link>

          {/* Quick Admin Edit Button when Gutenberg Live Mode is Active */}
          {isLiveEditMode && (
            <Link
              to={`/admin/productos/${product.id}`}
              className="absolute top-3 left-3 px-2.5 py-1.5 rounded-full bg-[#2D2A26] text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-md hover:bg-[#4FA6EE] transition-colors z-10"
            >
              <Edit3 className="w-3 h-3 text-[#FACC48]" />
              <span>Editar prenda</span>
            </Link>
          )}

          {/* Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(product.id);
            }}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              favorite
                ? 'bg-[#FEF1EF] text-[#F48B7B] shadow-xs'
                : 'bg-white/90 text-[#2D2A26] hover:bg-white shadow-xs'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-[#F48B7B]' : ''}`} />
          </button>
        </div>

        {/* Clean Unboxed Metadata Row (Zero-Pill Discipline) */}
        <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#6E685F] mb-1">
          <span>{categoryLabels[product.category] || product.category}</span>
          {product.badge && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#4FA6EE]">{product.badge}</span>
            </>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-sans text-sm sm:text-base font-semibold text-[#2D2A26] leading-snug">
          <Link
            to={`/producto/${product.slug}`}
            className="hover:text-[#4FA6EE] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-[#6E685F] mt-1 line-clamp-2 leading-relaxed">
          {product.shortDescription}
        </p>
      </div>

      <div className="mt-3.5 pt-3 border-t border-black/6 space-y-3">
        {/* Price Row */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-semibold text-[#2D2A26] tabular-nums">
            {formatCOP(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[#6E685F] line-through tabular-nums">
              {formatCOP(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Compact Size Selector */}
        <div>
          <span className="sr-only">Seleccionar talla</span>
          <SizeSelector
            sizes={product.sizes.slice(0, 5)}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
            compact
          />
        </div>

        {/* Add to Cart Button */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            justAdded
              ? 'bg-[#53C59B] text-white'
              : 'bg-[#F7F3EC] text-[#2D2A26] hover:bg-[#2D2A26] hover:text-white'
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" />
              <span>Agregado</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
