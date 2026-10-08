import React from 'react';
import { ShoppingBag, Info } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCOP } from '../../data/products';

export const AdminOrdersPage: React.FC = () => {
  const { orders } = useStore();
  const hasDemo = orders.some((o) => o.isDemo);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">Gestión de compras</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Pedidos ({orders.length})
          </h1>
        </div>
      </div>

      {hasDemo && (
        <div className="rounded-2xl bg-[#FEF9E7] border border-[#FACC48]/40 p-4 flex items-start gap-3 text-xs text-[#2D2A26]">
          <Info className="w-4 h-4 text-[#EAB308] shrink-0 mt-0.5" />
          <span>
            <strong>Pedidos de demostración identificados:</strong> Los pedidos marcados como{' '}
            <strong>DEMO</strong> son ejemplos iniciales. Cualquier pedido que realices desde{' '}
            <code>/checkout</code> también aparecerá registrado en esta tabla.
          </span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-black/6 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] border-b border-black/6">
                <th className="py-3.5 px-5">Orden</th>
                <th className="py-3.5 px-5">Cliente</th>
                <th className="py-3.5 px-5">Ciudad / Destino</th>
                <th className="py-3.5 px-5">Prendas</th>
                <th className="py-3.5 px-5">Pasarela</th>
                <th className="py-3.5 px-5">Estado Pago</th>
                <th className="py-3.5 px-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6 text-xs sm:text-sm">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FDFBF7]">
                  <td className="py-4 px-5 font-mono font-semibold text-[#2D2A26]">
                    #{order.orderNumber}
                    {order.isDemo && (
                      <span className="ml-2 text-[10px] font-sans font-semibold text-[#EAB308]">
                        · DEMO
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5">
                    <p className="font-semibold text-[#2D2A26]">{order.customerName}</p>
                    <p className="text-[11px] text-[#6E685F]">{order.customerPhone}</p>
                  </td>
                  <td className="py-4 px-5 text-xs text-[#6E685F]">
                    {order.city}, {order.department}
                  </td>
                  <td className="py-4 px-5 tabular-nums text-xs">
                    {order.itemsCount} {order.itemsCount === 1 ? 'unidad' : 'unidades'}
                  </td>
                  <td className="py-4 px-5 uppercase text-xs font-semibold text-[#6E685F]">
                    {order.paymentGateway}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`text-xs font-semibold ${
                        order.paymentStatus === 'paid' ? 'text-[#53C59B]' : 'text-[#EAB308]'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right font-semibold text-[#2D2A26] tabular-nums">
                    {formatCOP(order.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
