import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP, STORE_CONFIG } from '../data/products';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingRemaining,
  } = useCart();
  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.round((subtotal / STORE_CONFIG.freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col justify-between z-10 animate-fade-in"
        aria-label="Carrito de compras"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-black/6">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#4FA6EE]" />
              <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
                Tu Carrito Pequeñitos
              </h2>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {items.length > 0 && (
            <div className="px-6 py-3 bg-[#EBF5FD]/70 border-b border-[#4FA6EE]/15">
              <div className="flex items-center gap-2 text-xs text-[#2D2A26]">
                <Truck className="w-4 h-4 text-[#4FA6EE] shrink-0" />
                {freeShippingRemaining > 0 ? (
                  <span>
                    Te faltan{' '}
                    <strong className="font-semibold tabular-nums">
                      {formatCOP(freeShippingRemaining)}
                    </strong>{' '}
                    para <strong className="text-[#4FA6EE]">envío gratis</strong> en Colombia.
                  </span>
                ) : (
                  <span className="font-semibold text-[#2D2A26]">
                    ¡Felicidades! Tu pedido tiene envío gratis a toda Colombia.
                  </span>
                )}
              </div>
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#4FA6EE] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-display text-xl text-[#2D2A26] mb-2">
                Su carrito está esperando una nueva aventura.
              </p>
              <p className="text-xs text-[#6E685F] max-w-xs mb-6">
                Descubre nuestros mamelucos, conjuntos y regalos pensados para acompañar cada etapa.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeDrawer();
                  navigate('/tienda');
                }}
                className="px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer"
              >
                Explorar productos
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                className="flex gap-4 p-3.5 rounded-2xl bg-white border border-black/6 shadow-2xs"
              >
                <Link
                  to={`/producto/${item.product.slug}`}
                  onClick={closeDrawer}
                  className="w-20 h-24 rounded-xl overflow-hidden bg-[#F7F3EC] shrink-0"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/producto/${item.product.slug}`}
                        onClick={closeDrawer}
                        className="text-sm font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors truncate"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor.name
                          )
                        }
                        className="text-[#6E685F] hover:text-[#F48B7B] transition-colors p-1 cursor-pointer"
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#6E685F] mt-0.5">
                      Talla: {item.selectedSize} · {item.selectedColor.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="inline-flex items-center rounded-xl bg-[#F7F3EC] p-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor.name,
                            item.quantity - 1
                          )
                        }
                        className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-[#2D2A26] hover:bg-white transition-colors cursor-pointer"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums text-[#2D2A26]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor.name,
                            item.quantity + 1
                          )
                        }
                        className="w-7 h-7 inline-flex items-center justify-center rounded-lg text-[#2D2A26] hover:bg-white transition-colors cursor-pointer"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-[#2D2A26] tabular-nums">
                      {formatCOP(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-black/6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6E685F]">Subtotal</span>
              <span className="text-base font-semibold text-[#2D2A26] tabular-nums">
                {formatCOP(subtotal)}
              </span>
            </div>
            <p className="text-xs text-[#6E685F]">
              Envío calculado al finalizar la compra. Envíos a toda Colombia.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/carrito"
                onClick={closeDrawer}
                className="py-3 px-4 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold text-center hover:bg-[#ECE6DA] transition-colors whitespace-nowrap"
              >
                Ver carrito
              </Link>
              <Link
                to="/checkout"
                onClick={closeDrawer}
                className="py-3 px-4 rounded-full bg-[#2D2A26] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-[#3F3B36] transition-colors whitespace-nowrap"
              >
                <span>Ir al checkout</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FACC48]" />
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
