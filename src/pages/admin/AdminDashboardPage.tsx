import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  EyeOff,
  AlertTriangle,
  FolderTree,
  ShoppingBag,
  TrendingUp,
  Plus,
  Home,
  Image as ImageIcon,
  ArrowRight,
  Settings,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCOP } from '../../data/products';

export const AdminDashboardPage: React.FC = () => {
  const { products, categories, blogPosts, orders, dataMode } = useStore();

  const publishedCount = products.filter((p) => !p.status || p.status === 'published').length;
  const hiddenOrDraftCount = products.filter(
    (p) => p.status === 'hidden' || p.status === 'draft'
  ).length;
  const lowStockProducts = products.filter((p) => p.stock <= 12);
  const totalSales = orders.reduce((acc, o) => acc + o.total, 0);
  const hasDemoOrders = orders.some((o) => o.isDemo);

  const stats = [
    {
      label: 'Productos publicados',
      value: publishedCount,
      sub: 'Visibles en la tienda pública',
      icon: Package,
      bg: 'bg-[#EBF5FD]',
      accent: 'text-[#4FA6EE]',
      link: '/admin/productos',
    },
    {
      label: 'Productos ocultos / borrador',
      value: hiddenOrDraftCount,
      sub: 'Guardados sin publicar',
      icon: EyeOff,
      bg: 'bg-[#F7F3EC]',
      accent: 'text-[#6E685F]',
      link: '/admin/productos',
    },
    {
      label: 'Productos con poco stock',
      value: lowStockProducts.length,
      sub: '12 unidades o menos',
      icon: AlertTriangle,
      bg: 'bg-[#FEF9E7]',
      accent: 'text-[#EAB308]',
      link: '/admin/productos',
    },
    {
      label: 'Categorías',
      value: categories.length,
      sub: `${categories.filter((c) => c.status !== 'hidden').length} activas en tienda`,
      icon: FolderTree,
      bg: 'bg-[#ECF9F4]',
      accent: 'text-[#53C59B]',
      link: '/admin/categorias',
    },
    {
      label: 'Pedidos',
      value: orders.length,
      sub: hasDemoOrders ? 'Valores de demostración (DEMO)' : 'Pedidos registrados',
      icon: ShoppingBag,
      bg: 'bg-[#FEF1EF]',
      accent: 'text-[#F48B7B]',
      link: '/admin/pedidos',
    },
    {
      label: 'Ventas',
      value: formatCOP(totalSales),
      sub: hasDemoOrders ? 'Total acumulado (DEMO)' : 'Total acumulado',
      icon: TrendingUp,
      bg: 'bg-[#ECF9F4]',
      accent: 'text-[#53C59B]',
      link: '/admin/pedidos',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">
            Resumen general · Modo {dataMode}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-0.5">
            Bienvenido al CMS de Pequeñitos
          </h1>
        </div>

        <Link
          to="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FACC48]" />
          <span>+ Nuevo producto</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-black/6 shadow-2xs hover:shadow-md transition-all flex items-start justify-between gap-4"
            >
              <div>
                <p className="text-xs font-medium text-[#6E685F]">{stat.label}</p>
                <p className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1.5 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-[11px] text-[#6E685F] mt-1">{stat.sub}</p>
              </div>
              <div
                className={`w-11 h-11 rounded-2xl ${stat.bg} ${stat.accent} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs">
        <h2 className="font-display text-lg font-semibold text-[#2D2A26] mb-4">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <Link
            to="/admin/productos/nuevo"
            className="p-4 rounded-2xl bg-[#2D2A26] text-white hover:bg-[#3F3B36] transition-colors flex flex-col justify-between gap-3"
          >
            <Plus className="w-5 h-5 text-[#FACC48]" />
            <span className="text-xs font-semibold">+ Nuevo producto</span>
          </Link>

          <Link
            to="/admin/blog/nuevo"
            className="p-4 rounded-2xl bg-[#EBF5FD] text-[#2D2A26] hover:bg-[#D8ECFA] transition-colors flex flex-col justify-between gap-3 border border-[#4FA6EE]/20"
          >
            <BookOpen className="w-5 h-5 text-[#4FA6EE]" />
            <span className="text-xs font-semibold">+ Nuevo artículo SEO</span>
          </Link>

          <Link
            to="/admin/productos"
            className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/6 hover:border-[#4FA6EE] transition-colors flex flex-col justify-between gap-3"
          >
            <Package className="w-5 h-5 text-[#4FA6EE]" />
            <span className="text-xs font-semibold text-[#2D2A26]">Administrar productos</span>
          </Link>

          <Link
            to="/admin/blog"
            className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/6 hover:border-[#4FA6EE] transition-colors flex flex-col justify-between gap-3"
          >
            <BookOpen className="w-5 h-5 text-[#53C59B]" />
            <span className="text-xs font-semibold text-[#2D2A26]">
              Blog SEO ({blogPosts.length})
            </span>
          </Link>

          <Link
            to="/admin/inicio"
            className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/6 hover:border-[#4FA6EE] transition-colors flex flex-col justify-between gap-3"
          >
            <Home className="w-5 h-5 text-[#F48B7B]" />
            <span className="text-xs font-semibold text-[#2D2A26]">Editar inicio (Bloques)</span>
          </Link>

          <Link
            to="/admin/media"
            className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/6 hover:border-[#4FA6EE] transition-colors flex flex-col justify-between gap-3"
          >
            <ImageIcon className="w-5 h-5 text-[#EAB308]" />
            <span className="text-xs font-semibold text-[#2D2A26]">Biblioteca Media</span>
          </Link>
        </div>
      </div>

      {/* Bottom Two Columns: Low Stock Alert & Identity Shortcut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-black/6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Alertas de inventario (Poco stock)
            </h2>
            <Link
              to="/admin/productos"
              className="text-xs font-semibold text-[#4FA6EE] hover:underline"
            >
              Ver todos
            </Link>
          </div>

          <div className="divide-y divide-black/6">
            {lowStockProducts.slice(0, 5).map((prod) => (
              <div key={prod.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-11 h-11 rounded-xl object-cover bg-[#F7F3EC] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#2D2A26] truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-[#6E685F] tabular-nums">
                      SKU: {prod.sku || prod.id} · {formatCOP(prod.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-[#EAB308] tabular-nums">
                    {prod.stock} unid.
                  </span>
                  <Link
                    to={`/admin/productos/${prod.id}`}
                    className="px-3 py-1.5 rounded-xl bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD]"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-black/6 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Identidad de Marca y WhatsApp
            </h2>
            <p className="text-xs text-[#6E685F] leading-relaxed">
              Sube el nuevo logo oficial de Pequeñitos, actualiza el número de WhatsApp de pedidos o
              ajusta los textos SEO de la tienda para Colombia.
            </p>
          </div>

          <Link
            to="/admin/configuracion"
            className="inline-flex items-center justify-between px-5 py-3 rounded-2xl bg-[#F7F3EC] hover:bg-[#EBF5FD] text-xs font-semibold text-[#2D2A26] transition-colors"
          >
            <span>Ir a Configuración de Marca</span>
            <ArrowRight className="w-4 h-4 text-[#4FA6EE]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
