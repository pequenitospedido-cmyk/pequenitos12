import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X, ArrowRight, Ruler, Heart, MessageCircle } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { STORE_CONFIG } from '../data/products';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOBILE_NAV_LINKS = [
  { label: 'Inicio', path: '/' },
  { label: 'Tienda Completa', path: '/tienda' },
  { label: 'Mamelucos', path: '/mamelucos' },
  { label: 'Camisetas', path: '/camisetas' },
  { label: 'Conjuntos', path: '/conjuntos' },
  { label: 'Regalos', path: '/regalos' },
  { label: 'Blog Pequeñitos', path: '/blog' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FDFBF7] shadow-xl flex flex-col justify-between z-10 overflow-y-auto">
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/6">
            <BrandLogo />
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[#2D2A26] hover:bg-black/5 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-5 space-y-1" aria-label="Navegación móvil">
            {MOBILE_NAV_LINKS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-[#EBF5FD] text-[#2D2A26] font-semibold'
                      : 'text-[#2D2A26]/80 hover:bg-[#F7F3EC] hover:text-[#2D2A26]'
                  }`
                }
              >
                <span>{item.label}</span>
                <ArrowRight className="w-4 h-4 text-[#6E685F]" />
              </NavLink>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-black/6 space-y-2">
            <Link
              to="/guia-de-tallas"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors"
            >
              <Ruler className="w-4 h-4 text-[#4FA6EE]" />
              <span>Guía de tallas</span>
            </Link>
            <Link
              to="/nosotros"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors"
            >
              <Heart className="w-4 h-4 text-[#F48B7B]" />
              <span>Somos Pequeñitos</span>
            </Link>
            <Link
              to="/contacto"
              onClick={onClose}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#53C59B]" />
              <span>Atención y Contacto</span>
            </Link>
          </div>
        </div>

        <div className="p-5 bg-[#F7F3EC] border-t border-black/6 text-xs text-[#6E685F] space-y-2">
          <p className="font-medium text-[#2D2A26]">{STORE_CONFIG.slogan}</p>
          <p>WhatsApp: {STORE_CONFIG.whatsappNumber} · Envíos a toda Colombia</p>
          <Link
            to="/admin"
            onClick={onClose}
            className="inline-block pt-1 font-semibold text-[#4FA6EE] hover:underline"
          >
            Ir al Panel Administrador (CMS) →
          </Link>
        </div>
      </div>
    </div>
  );
};
