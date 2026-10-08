import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { BRAND_IMAGES } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { pagesContent } = useStore();
  const pageData = pagesContent.find((p) => p.slug === 'nosotros');

  return (
    <div className="py-6 md:py-12">
      <SEOHead
        title="Somos Pequeñitos — Nuestra Historia"
        description="Creemos que la ropa de los niños debe acompañar sus aventuras, sus juegos, sus abrazos y esos pequeños momentos que terminan convirtiéndose en grandes recuerdos."
        breadcrumbs={[{ name: 'Nosotros', path: '/nosotros' }]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: 'Nosotros' }]} />

        {/* Editorial Hero */}
        <div className="mt-4 rounded-3xl bg-white p-8 sm:p-12 lg:p-16 shadow-xs border border-black/6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-semibold text-[#4FA6EE]">
              {pageData?.subtitle || 'Ropita para pequeños momentos grandes'}
            </p>
            <h1 className="font-display text-3xl sm:text-5xl font-semibold text-[#2D2A26] leading-tight">
              {pageData?.title || 'Somos Pequeñitos'}
            </h1>
            <p className="text-base sm:text-lg text-[#2D2A26]/90 leading-relaxed font-display italic">
              “
              {pageData?.quote ||
                'Creemos que la ropa de los niños debe acompañar sus aventuras, sus juegos, sus abrazos y esos pequeños momentos que terminan convirtiéndose en grandes recuerdos.'}
              ”
            </p>
            <p className="text-sm text-[#6E685F] leading-relaxed">
              {pageData?.body ||
                'Nacimos en Colombia con el propósito de ofrecer a las familias prendas que combinen suavidad real, diseño tierno y practicidad para el día a día. Cada mameluco, camiseta y conjunto es seleccionado pensando en la delicadeza de su piel y en la alegría de la infancia.'}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-4/3 rounded-3xl overflow-hidden bg-[#F7F3EC]">
              <img
                src={pageData?.imageUrl || BRAND_IMAGES.hero}
                alt="Colección de ropa infantil Pequeñitos"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="bg-[#EBF5FD] rounded-3xl p-7 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#4FA6EE] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              Ternura sin excesos
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed">
              Creamos prendas dulces, modernas y atemporales en paletas pastel serenas que resaltan
              la esencia natural de cada bebé.
            </p>
          </div>

          <div className="bg-[#ECF9F4] rounded-3xl p-7 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#53C59B] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              Comodidad todo el día
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed">
              Priorizamos algodones respirables, costuras suaves y broches prácticos que facilitan
              la rutina de mamás y papás.
            </p>
          </div>

          <div className="bg-[#FEF9E7] rounded-3xl p-7 space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#EAB308] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              Cerca de cada familia
            </h2>
            <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed">
              Llegamos a todos los rincones de Colombia con empaques cuidados con cariño y asesoría
              cercana en cada compra.
            </p>
          </div>
        </div>

        {/* Secondary Visual Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white rounded-3xl p-6 sm:p-10 border border-black/6">
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-3/4 rounded-2xl overflow-hidden bg-[#F7F3EC]">
              <img
                src={BRAND_IMAGES.mamelucoOsito}
                alt="Detalle de mameluco Pequeñitos"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-3/4 rounded-2xl overflow-hidden bg-[#F7F3EC]">
              <img
                src={BRAND_IMAGES.mamelucoArcoiris}
                alt="Bordado suave Pequeñitos"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          <div className="space-y-4 md:pl-4">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
              Diseñados para jugar, dormir y descubrir
            </h2>
            <p className="text-sm text-[#6E685F] leading-relaxed">
              Desde su primera puesta al nacer hasta sus carreras a los 6 años, queremos ser parte
              de los capítulos más felices de tu familia.
            </p>
            <div className="pt-2">
              <Link
                to="/tienda"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors"
              >
                <span>Conocer la colección</span>
                <ArrowRight className="w-4 h-4 text-[#FACC48]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
