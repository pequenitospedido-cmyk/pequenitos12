import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { AnnouncementBar } from './AnnouncementBar';
import { MobileMenu } from './MobileMenu';
import { useCart } from '../context/CartContext';

const PRIMARY_NAV = [
  { label: 'Inicio', path: '/' },
  { label: 'Tienda', path: '/tienda' },
  { label: 'Mamelucos', path: '/mamelucos' },
  { label: 'Camisetas', path: '/camisetas' },
  { label: 'Conjuntos', path: '/conjuntos' },
  { label: 'Regalos', path: '/regalos' },
  { label: 'Blog', path: '/blog' },
];

export const Header: React.FC = () => {
  const { totalItems, openDrawer, lastAddedTimestamp, favorites } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [animateCart, setAnimateCart] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (lastAddedTimestamp > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 350);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTimestamp]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tienda?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    } else {
      navigate('/tienda');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-black/6 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Title / Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 inline-flex items-center justify-center rounded-full text-[#2D2A26] hover:bg-black/5 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
            <BrandLogo />
          </div>

          {/* Zone 2: Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#6E685F]"
            aria-label="Navegación principal"
          >
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#4FA6EE] text-[#2D2A26] font-semibold'
                      : 'border-transparent hover:text-[#2D2A26] hover:border-[#2D2A26]/20'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Actions (Search, User/Favorites, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
                setIsUserPanelOpen(false);
              }}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsUserPanelOpen((prev) => !prev);
                  setIsSearchOpen(false);
                }}
                className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer relative"
                aria-label="Mi cuenta y favoritos"
              >
                <User className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#F48B7B] absolute top-2 right-2" />
                )}
              </button>

              {isUserPanelOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-black/6 p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-black/6">
                    <p className="font-semibold text-sm text-[#2D2A26]">Espacio Pequeñitos</p>
                    <button
                      type="button"
                      onClick={() => setIsUserPanelOpen(false)}
                      className="text-[#6E685F] hover:text-[#2D2A26]"
                      aria-label="Cerrar panel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="py-3 space-y-2.5 text-xs text-[#6E685F]">
                    <p>
                      Tienes <strong className="text-[#2D2A26] tabular-nums">{favorites.length}</strong>{' '}
                      {favorites.length === 1 ? 'prenda guardada' : 'prendas guardadas'} en tus favoritos.
                    </p>
                    <div className="pt-1 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserPanelOpen(false);
                          navigate('/tienda');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#F7F3EC] hover:bg-[#EBF5FD] text-[#2D2A26] font-medium text-left transition-colors cursor-pointer"
                      >
                        Explorar catálogo completo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserPanelOpen(false);
                          navigate('/guia-de-tallas');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#F7F3EC] hover:bg-[#EBF5FD] text-[#2D2A26] font-medium text-left transition-colors cursor-pointer"
                      >
                        Consultar guía de tallas
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserPanelOpen(false);
                          navigate('/contacto');
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-[#F7F3EC] hover:bg-[#EBF5FD] text-[#2D2A26] font-medium text-left transition-colors cursor-pointer"
                      >
                        Asesoría por WhatsApp (Milena Vargas)
                      </button>
                      <div className="pt-2 mt-1 border-t border-black/6">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserPanelOpen(false);
                            navigate('/admin');
                          }}
                          className="w-full py-2.5 px-3 rounded-xl bg-[#2D2A26] hover:bg-[#3F3B36] text-white font-semibold text-left transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <span>Panel Administrador (CMS)</span>
                          <span className="text-[10px] text-[#FACC48]">/admin →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={openDrawer}
              className={`h-10 px-3.5 inline-flex items-center gap-2 rounded-full bg-[#2D2A26] text-white hover:bg-[#3F3B36] transition-all cursor-pointer ${
                animateCart ? 'animate-cart-bounce' : ''
              }`}
              aria-label={`Abrir carrito de compras con ${totalItems} productos`}
            >
              <ShoppingBag className="w-4 h-4 text-[#FACC48]" />
              <span className="text-xs font-semibold tabular-nums whitespace-nowrap">
                {totalItems}
              </span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-black/6 bg-white py-3.5 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <form
              onSubmit={handleSearchSubmit}
              className="max-w-2xl mx-auto flex items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar mamelucos, conjuntos, regalos para recién nacido..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-black/10 rounded-full text-sm text-[#2D2A26] placeholder:text-[#6E685F] focus:outline-none focus:border-[#4FA6EE]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-[#4FA6EE] text-white text-sm font-semibold hover:bg-[#3B93DC] transition-colors whitespace-nowrap cursor-pointer"
              >
                Buscar
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2.5 rounded-full text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                aria-label="Cerrar búsqueda"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};
