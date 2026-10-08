import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
  } = useCart();

  return (
    <div className="py-6 md:py-12">
      <SEOHead
        title="Mi Carrito — Pequeñitos"
        description="Revisa tus prendas seleccionadas en Pequeñitos y envía tu pedido fácilmente por WhatsApp con envíos a toda Colombia."
        breadcrumbs={[{ name: 'Mi carrito', path: '/carrito' }]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: 'Mi carrito' }]} />

        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26] mt-2 mb-8">
          🛒 Mi carrito
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center border border-black/6 shadow-xs max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#2D2A26] mb-2">
              Su carrito está esperando una nueva aventura.
            </h2>
            <p className="text-sm text-[#6E685F] mb-7 leading-relaxed">
              Explora nuestra colección de mamelucos, camisetas, conjuntos y regalos pensados con
              ternura para cada etapa.
            </p>
            <Link
              to="/tienda"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors"
            >
              <span>Explorar productos</span>
              <ArrowRight className="w-4 h-4 text-[#FACC48]" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Table: Producto | Cantidad | Valor */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-3xl border border-black/6 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] border-b border-black/6">
                        <th className="py-4 px-5">Producto</th>
                        <th className="py-4 px-5 text-center">Cantidad</th>
                        <th className="py-4 px-5 text-right">Valor</th>
                        <th className="py-4 px-4 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/6 text-xs sm:text-sm">
                      {items.map((item) => (
                        <tr
                          key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                          className="hover:bg-[#FDFBF7] transition-colors"
                        >
                          {/* Producto */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-4">
                              <Link
                                to={`/producto/${item.product.slug}`}
                                className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-[#F7F3EC] shrink-0"
                              >
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </Link>
                              <div>
                                <Link
                                  to={`/producto/${item.product.slug}`}
                                  className="font-sans text-sm sm:text-base font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors"
                                >
                                  {item.product.name}
                                </Link>
                                <p className="text-xs text-[#6E685F] mt-1">
                                  Talla: <strong className="text-[#2D2A26]">{item.selectedSize}</strong>{' '}
                                  · {item.selectedColor.name}
                                </p>
                                <p className="text-xs text-[#6E685F] mt-0.5 tabular-nums">
                                  {formatCOP(item.product.price)} c/u
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Cantidad */}
                          <td className="py-4 px-5 text-center">
                            <div className="inline-flex items-center rounded-xl bg-[#F7F3EC] p-1">
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
                                className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-lg text-[#2D2A26] hover:bg-white transition-colors cursor-pointer"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs sm:text-sm font-semibold tabular-nums text-[#2D2A26]">
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
                                className="w-7 h-7 sm:w-8 sm:h-8 inline-flex items-center justify-center rounded-lg text-[#2D2A26] hover:bg-white transition-colors cursor-pointer"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Valor */}
                          <td className="py-4 px-5 text-right font-semibold text-sm sm:text-base text-[#2D2A26] tabular-nums whitespace-nowrap">
                            {formatCOP(item.product.price * item.quantity)}
                          </td>

                          {/* Quitar */}
                          <td className="py-4 px-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor.name
                                )
                              }
                              className="p-2 text-[#6E685F] hover:text-[#F48B7B] transition-colors cursor-pointer"
                              aria-label="Eliminar del carrito"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Subtotal Footer */}
                <div className="px-6 py-4 bg-[#FDFBF7] border-t border-black/6 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#6E685F]">Subtotal:</span>
                  <span className="text-lg sm:text-xl font-semibold text-[#2D2A26] tabular-nums">
                    {formatCOP(subtotal)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/tienda"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continuar comprando</span>
                </Link>
              </div>
            </div>

            {/* Summary & Continue to Checkout */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-xs space-y-5 lg:sticky lg:top-28">
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                Resumen de tu pedido
              </h2>

              <div className="space-y-2.5 text-sm pt-2 border-t border-black/6">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex justify-between text-xs text-[#6E685F]"
                  >
                    <span className="truncate pr-2">
                      {item.product.name} ({item.selectedSize}) x{item.quantity}
                    </span>
                    <span className="font-medium text-[#2D2A26] tabular-nums shrink-0">
                      {formatCOP(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between text-base font-semibold text-[#2D2A26] pt-3 border-t border-black/6">
                  <span>Subtotal</span>
                  <span className="text-xl tabular-nums">{formatCOP(subtotal)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 px-6 rounded-full bg-[#53C59B] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#43B288] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Completar datos y pedir por WhatsApp</span>
              </Link>

              <p className="text-[11px] text-center text-[#6E685F]">
                En el siguiente paso llenas tus datos de entrega, eliges Nequi / QR o Transferencia
                y envías tu pedido directo a nuestro WhatsApp.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
