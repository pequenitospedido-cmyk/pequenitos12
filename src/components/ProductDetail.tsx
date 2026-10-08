import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Check,
  Ruler,
  ShoppingBag,
  Heart,
  Minus,
  Plus,
} from 'lucide-react';
import { Product, ProductColor, SizeOption } from '../types/product';
import { formatCOP } from '../data/products';
import { SizeSelector } from './SizeSelector';
import { ColorSelector } from './ColorSelector';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
}

const ALL_STORE_SIZES: SizeOption[] = [
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

export const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart, toggleFavorite, isFavorite } = useCart();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeOption>(product.sizes[0] || '0-3M');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] || { name: 'Azul Pastel', hex: '#A9D6F5' }
  );
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity, true);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity, false);
    navigate('/checkout');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
        <div className="aspect-4/3 sm:aspect-3/4 lg:aspect-4/3 rounded-3xl overflow-hidden bg-[#F7F3EC] border border-black/6">
          <img
            src={product.images[selectedImage] || product.images[0]}
            alt={`${product.name} - Vista ${selectedImage + 1}`}
            className="w-full h-full object-cover object-center transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        {product.images.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {product.images.map((img, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={`aspect-4/3 rounded-2xl overflow-hidden bg-[#F7F3EC] border-2 transition-all cursor-pointer ${
                  selectedImage === index
                    ? 'border-[#4FA6EE] scale-[0.99]'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Contiguous Purchase Module */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-black/6 space-y-6">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs text-[#6E685F] mb-2">
            <span>
              Colección Pequeñitos · {product.ageRange[0]} a{' '}
              {product.ageRange[product.ageRange.length - 1]}
            </span>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#6E685F] hover:text-[#F48B7B] transition-colors cursor-pointer"
            >
              <Heart className={`w-4 h-4 ${favorite ? 'fill-[#F48B7B] text-[#F48B7B]' : ''}`} />
              <span>{favorite ? 'Guardado' : 'Favorito'}</span>
            </button>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            {product.name}
          </h1>

          {/* Rating ★★★★★ */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center text-[#FACC48]" aria-label="Calificación 5 de 5 estrellas">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FACC48]" />
              ))}
            </div>
            <span className="text-xs font-medium text-[#2D2A26] tabular-nums">
              {product.rating?.toFixed(1) || '5.0'}
            </span>
            <span className="text-xs text-[#6E685F] tabular-nums">
              ({product.reviewsCount || 28} reseñas de familias)
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-semibold text-[#2D2A26] tabular-nums">
              {formatCOP(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-sm text-[#6E685F] line-through tabular-nums">
                {formatCOP(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="text-sm text-[#6E685F] mt-3 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Size Selector with Guide Link */}
        <div className="space-y-2.5 pt-4 border-t border-black/6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#2D2A26]">
              Talla seleccionada: <span className="text-[#4FA6EE]">{selectedSize}</span>
            </span>
            <Link
              to="/guia-de-tallas"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4FA6EE] hover:underline"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Guía de tallas</span>
            </Link>
          </div>

          <SizeSelector
            sizes={ALL_STORE_SIZES}
            selectedSize={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>

        {/* Color Selector */}
        <div className="pt-2">
          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>

        {/* Quantity Selector */}
        <div className="space-y-2 pt-2">
          <span className="block text-xs font-semibold text-[#2D2A26]">Cantidad</span>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-2xl bg-[#F7F3EC] p-1 border border-black/6">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center text-[#2D2A26] hover:bg-white transition-colors cursor-pointer"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-semibold tabular-nums text-[#2D2A26]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-9 h-9 rounded-xl inline-flex items-center justify-center text-[#2D2A26] hover:bg-white transition-colors cursor-pointer"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-[#6E685F] tabular-nums">
              {product.stock} unidades disponibles
            </span>
          </div>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-4 px-6 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
              addedFeedback
                ? 'bg-[#53C59B] text-white'
                : 'bg-[#2D2A26] text-white hover:bg-[#3F3B36]'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado a tu carrito!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#FACC48]" />
                <span>Agregar al carrito</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-3.5 px-6 rounded-full bg-[#EBF5FD] text-[#2D2A26] text-sm font-semibold hover:bg-[#D8ECFA] transition-colors cursor-pointer"
          >
            Comprar ahora
          </button>
        </div>

        {/* Full Description & Key Attributes */}
        <div className="pt-5 border-t border-black/6 space-y-4">
          <div>
            <h2 className="font-sans text-xs font-semibold text-[#2D2A26] mb-1.5">
              Descripción de la prenda
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.materials && (
            <p className="text-xs text-[#6E685F]">
              <strong className="text-[#2D2A26]">Composición:</strong> {product.materials}
            </p>
          )}

          {/* Requested Trust Checklist */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-[#2D2A26] font-medium">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#53C59B] shrink-0" />
              <span>Material suave</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#53C59B] shrink-0" />
              <span>Cómodo para el día a día</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#53C59B] shrink-0" />
              <span>Diseño pensado para niños</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#53C59B] shrink-0" />
              <span>Envíos a toda Colombia</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
