import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { useStore } from '../context/StoreContext';
import { X, Lock } from 'lucide-react';

type InfoModalType = 'envios' | 'cambios' | 'faq' | null;

export const Footer: React.FC = () => {
  const { siteSettings } = useStore();
  const [activeModal, setActiveModal] = useState<InfoModalType>(null);

  return (
    <>
      <footer className="bg-white border-t border-black/6 pt-14 pb-10 text-sm text-[#6E685F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-black/6">
            {/* Column 1: Pequeñitos */}
            <div className="lg:col-span-1 space-y-3">
              <BrandLogo />
              <p className="text-xs leading-relaxed text-[#6E685F] pt-1">
                {siteSettings.siteDescription} Ropa para bebés y niños confeccionada con dulzura,
                comodidad y calidad para el día a día.
              </p>
              <div className="flex flex-col gap-1.5 pt-2 text-xs font-medium text-[#2D2A26]">
                <a
                  href={siteSettings.instagramUrl || 'https://instagram.com/pequenitos_colombia'}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#4FA6EE] transition-colors"
                >
                  Instagram: {siteSettings.instagramHandle || '@pequenitos_colombia'}
                </a>
                <a
                  href={siteSettings.tiktokUrl || 'https://tiktok.com/@pequenitoscolombia'}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#4FA6EE] transition-colors"
                >
                  TikTok: {siteSettings.tiktokHandle || '@pequenitoscolombia'}
                </a>
              </div>
            </div>

            {/* Column 2: Tienda */}
            <div>
              <h3 className="font-sans text-xs font-semibold text-[#2D2A26] mb-3.5">Tienda</h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/tienda" className="hover:text-[#2D2A26] transition-colors">
                    Toda la colección
                  </Link>
                </li>
                <li>
                  <Link to="/mamelucos" className="hover:text-[#2D2A26] transition-colors">
                    Mamelucos para bebé
                  </Link>
                </li>
                <li>
                  <Link to="/camisetas" className="hover:text-[#2D2A26] transition-colors">
                    Camisetas infantiles
                  </Link>
                </li>
                <li>
                  <Link to="/conjuntos" className="hover:text-[#2D2A26] transition-colors">
                    Conjuntos
                  </Link>
                </li>
                <li>
                  <Link to="/regalos" className="hover:text-[#2D2A26] transition-colors">
                    Regalos para recién nacido
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-[#2D2A26] transition-colors">
                    Blog Pequeñitos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Ayuda */}
            <div>
              <h3 className="font-sans text-xs font-semibold text-[#2D2A26] mb-3.5">Ayuda</h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/guia-de-tallas" className="hover:text-[#2D2A26] transition-colors">
                    Guía de tallas
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('envios')}
                    className="hover:text-[#2D2A26] transition-colors cursor-pointer text-left"
                  >
                    Envíos a toda Colombia
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('cambios')}
                    className="hover:text-[#2D2A26] transition-colors cursor-pointer text-left"
                  >
                    Cambios y devoluciones
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal('faq')}
                    className="hover:text-[#2D2A26] transition-colors cursor-pointer text-left"
                  >
                    Preguntas frecuentes
                  </button>
                </li>
                <li>
                  <Link to="/contacto" className="hover:text-[#2D2A26] transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Información */}
            <div>
              <h3 className="font-sans text-xs font-semibold text-[#2D2A26] mb-3.5">Información</h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link to="/nosotros" className="hover:text-[#2D2A26] transition-colors">
                    Somos Pequeñitos
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-[#2D2A26] transition-colors">
                    Consejos para bebés
                  </Link>
                </li>
                <li>
                  <Link to="/carrito" className="hover:text-[#2D2A26] transition-colors">
                    Mi carrito
                  </Link>
                </li>
                <li>
                  <Link to="/checkout" className="hover:text-[#2D2A26] transition-colors">
                    Finalizar pedido por WhatsApp
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Contacto */}
            <div>
              <h3 className="font-sans text-xs font-semibold text-[#2D2A26] mb-3.5">Contacto</h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <span className="block text-[#2D2A26] font-medium">Atención personalizada:</span>
                  <span>{siteSettings.contactPerson || 'Milena Vargas'}</span>
                </li>
                <li>
                  <span className="block text-[#2D2A26] font-medium">WhatsApp Pedidos:</span>
                  <a
                    href={`https://wa.me/${siteSettings.whatsappRaw}`}
                    target="_blank"
                    rel="noreferrer"
                    className="tabular-nums text-[#4FA6EE] font-semibold hover:underline"
                  >
                    +57 {siteSettings.whatsappNumber}
                  </a>
                </li>
                <li>
                  <span className="block text-[#2D2A26] font-medium">Correo:</span>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="hover:text-[#2D2A26] break-all"
                  >
                    {siteSettings.contactEmail}
                  </a>
                </li>
                <li>
                  <span className="block text-[#2D2A26] font-medium">Horario:</span>
                  <span>{siteSettings.schedule}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center justify-center gap-3 text-xs text-[#6E685F] text-center">
            <p>© 2026 {siteSettings.siteName || 'Pequeñitos'}. Todos los derechos reservados.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <p>
                Atención por {siteSettings.contactPerson || 'Milena Vargas'} · WhatsApp{' '}
                {siteSettings.whatsappNumber} · Colombia
              </p>
              <Link
                to="/admin"
                className="text-[#6E685F]/70 hover:text-[#4FA6EE] transition-colors"
                title="Acceso Seguro"
              >
                <Lock className="w-3 h-3" />
              </Link>
            </div>
            <p className="text-[10px] text-[#6E685F]/70 mt-1">
              Desarrollado por <a href="https://aimatika.com" target="_blank" rel="noreferrer" className="hover:text-[#4FA6EE] transition-colors font-medium">aimatika</a>
            </p>
          </div>
        </div>
      </footer>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs"
            onClick={() => setActiveModal(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-black/6">
              <h3 className="font-display text-xl font-semibold text-[#2D2A26]">
                {activeModal === 'envios' && 'Envíos a toda Colombia'}
                {activeModal === 'cambios' && 'Política de Cambios y Devoluciones'}
                {activeModal === 'faq' && 'Preguntas Frecuentes'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full inline-flex items-center justify-center text-[#6E685F] hover:text-[#2D2A26] hover:bg-[#F7F3EC] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-5 space-y-3 text-xs sm:text-sm text-[#6E685F] leading-relaxed">
              {activeModal === 'envios' && (
                <>
                  <p>
                    Realizamos despachos seguros a todas las ciudades y municipios de Colombia a
                    través de transportadoras aliadas certificadas.
                  </p>
                  <p>
                    <strong className="text-[#2D2A26]">Tiempos de entrega:</strong> 2 a 4 días
                    hábiles en ciudades principales (Bogotá, Medellín, Cali, Barranquilla,
                    Bucaramanga) y 3 a 6 días hábiles en el resto del país.
                  </p>
                  <p>
                    <strong className="text-[#2D2A26]">Envío gratis:</strong> En todas las compras
                    superiores a ${siteSettings.freeShippingThreshold.toLocaleString('es-CO')} COP.
                  </p>
                </>
              )}
              {activeModal === 'cambios' && (
                <>
                  <p>
                    Queremos que cada prenda le quede perfecta a tu Pequeñito. Si necesitas cambiar
                    la talla o referencia, cuentas con{' '}
                    <strong className="text-[#2D2A26]">30 días calendario</strong> desde la
                    recepción de tu pedido.
                  </p>
                  <p>
                    Escríbenos directamente al WhatsApp{' '}
                    <strong>{siteSettings.whatsappNumber}</strong> con{' '}
                    <strong>{siteSettings.contactPerson || 'Milena Vargas'}</strong> para coordinar
                    tu cambio fácilmente.
                  </p>
                </>
              )}
              {activeModal === 'faq' && (
                <>
                  <p>
                    <strong className="text-[#2D2A26]">¿Cómo funciona la compra por WhatsApp?</strong>
                    <br />
                    Agregas tus prendas favoritas al carrito, llenas tus datos de entrega, eliges tu
                    medio de pago (Nequi / QR, Transferencia bancaria u otro medio) y al hacer clic
                    en "Enviar pedido por WhatsApp" se abre automáticamente el chat con{' '}
                    {siteSettings.contactPerson || 'Milena Vargas'} con el resumen completo de tu
                    pedido.
                  </p>
                  <p>
                    <strong className="text-[#2D2A26]">¿Puedo enviar un pedido como regalo?</strong>
                    <br />
                    ¡Sí! En las indicaciones del pedido puedes incluir tu mensaje personalizado sin
                    costo adicional.
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
