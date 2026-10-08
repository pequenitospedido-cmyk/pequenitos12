import React, { useState } from 'react';
import { NavLink, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  FileText,
  BookOpen,
  Home,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Plus,
  Edit3,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../BrandLogo';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Productos', path: '/admin/productos', icon: Package },
  { label: 'Categorías', path: '/admin/categorias', icon: FolderTree },
  { label: 'Blog (SEO)', path: '/admin/blog', icon: BookOpen },
  { label: 'Pedidos', path: '/admin/pedidos', icon: ShoppingBag },
  { label: 'Páginas', path: '/admin/paginas', icon: FileText },
  { label: 'Inicio', path: '/admin/inicio', icon: Home },
  { label: 'Media', path: '/admin/media', icon: ImageIcon },
  { label: 'Configuración', path: '/admin/configuracion', icon: Settings },
];

export const AdminLayout: React.FC = () => {
  const { user, loading, signOut } = useAdminAuth();
  const { dataMode, publishedProducts, setIsLiveEditMode } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center text-sm text-[#6E685F]">
        Cargando panel administrativo...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const renderSidebarContent = (onItemClick?: () => void) => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-black/6 flex items-center justify-between">
          <div>
            <BrandLogo />
            <p className="text-[11px] font-medium text-[#6E685F] mt-1">
              CMS · Modo {dataMode}
            </p>
          </div>
          {onItemClick && (
            <button
              type="button"
              onClick={onItemClick}
              className="lg:hidden p-2 rounded-xl text-[#6E685F] hover:text-[#2D2A26]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick New Product CTA */}
        <div className="px-4 pt-4 pb-2">
          <Link
            to="/admin/productos/nuevo"
            onClick={onItemClick}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2D2A26] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#3F3B36] transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-[#FACC48]" />
            <span>Nuevo producto</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1" aria-label="Menú del administrador">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onItemClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF5FD] text-[#2D2A26] font-semibold'
                      : 'text-[#6E685F] hover:bg-[#F7F3EC] hover:text-[#2D2A26]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 text-[#4FA6EE]" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom User & Sign Out */}
      <div className="p-4 border-t border-black/6 space-y-2 bg-[#FDFBF7]">
        <div className="px-3 py-2 rounded-xl bg-white border border-black/6 text-xs">
          <p className="font-semibold text-[#2D2A26] truncate">{user.email}</p>
          <p className="text-[11px] text-[#6E685F] tabular-nums">
            {publishedProducts.length} productos publicados
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#F48B7B] hover:bg-[#FEF1EF] transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#2D2A26] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-black/6 shrink-0 sticky top-0 h-screen overflow-y-auto">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-10 overflow-y-auto">
            {renderSidebarContent(() => setMobileOpen(false))}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Bar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-black/6 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#2D2A26] hover:bg-[#F7F3EC]"
              aria-label="Abrir menú lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs sm:text-sm font-semibold text-[#2D2A26]">
              Administrador Pequeñitos
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setIsLiveEditMode(true);
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#53C59B] text-[#1E1C1A] text-xs font-semibold hover:bg-[#43B288] transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar página en vivo (Gutenberg)</span>
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#F7F3EC] hover:bg-[#EBF5FD] text-xs font-semibold text-[#2D2A26] transition-colors whitespace-nowrap"
            >
              <span>Ver tienda pública</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#4FA6EE]" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
