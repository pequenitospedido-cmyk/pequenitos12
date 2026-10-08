import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BRAND_IMAGES } from '../data/products';
import { HomepageBlock } from '../types/product';

interface HeroProps {
  block?: HomepageBlock;
}

export const Hero: React.FC<HeroProps> = ({ block }) => {
  const [imgError, setImgError] = useState(false);

  const title = block?.title || 'Pequeños momentos, grandes aventuras.';
  const description =
    block?.description ||
    'Ropita cómoda, bonita y pensada para acompañar cada etapa de nuestros Pequeñitos. Texturas suaves que cuidan su piel desde el primer día.';
  const primaryBtnText = block?.buttonText || 'Ver colección';
  const primaryBtnLink = block?.buttonLink || '/tienda';
  const secondaryBtnText = block?.secondaryButtonText || 'Comprar mamelucos';
  const secondaryBtnLink = block?.secondaryButtonLink || '/mamelucos';
  const heroImage = block?.imageUrl || BRAND_IMAGES.hero;

  // Preserve the italic blue accent on the second phrase if matching the default or containing a comma
  const renderTitle = () => {
    if (title.includes(',')) {
      const [firstPart, ...rest] = title.split(',');
      return (
        <>
          {firstPart},{' '}
          <span className="italic font-normal text-[#4FA6EE]">{rest.join(',').trim()}</span>
        </>
      );
    }
    return title;
  };

  return (
    <section className="relative overflow-hidden py-8 md:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Brand Message */}
          <div className="lg:col-span-6 space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-medium text-[#6E685F]">
              <span className="text-[#4FA6EE] font-semibold">Colección 2026</span>
              <span aria-hidden="true">·</span>
              <span>Algodón hipoalergénico para bebé</span>
              <span aria-hidden="true">·</span>
              <span>Hecho con amor</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-semibold leading-[1.08] tracking-tight text-[#2D2A26]">
              {renderTitle()}
            </h1>

            <p className="text-base sm:text-lg text-[#6E685F] leading-relaxed max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                to={primaryBtnLink}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-all shadow-xs whitespace-nowrap"
              >
                <span>{primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 text-[#FACC48]" />
              </Link>

              {secondaryBtnText && (
                <Link
                  to={secondaryBtnLink}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#EBF5FD] text-[#2D2A26] text-sm font-semibold hover:bg-[#D8ECFA] transition-colors whitespace-nowrap"
                >
                  {secondaryBtnText}
                </Link>
              )}
            </div>

            <div className="pt-4 border-t border-black/6 grid grid-cols-3 gap-4 max-w-md text-xs text-[#6E685F]">
              <div>
                <p className="font-semibold text-[#2D2A26] text-sm tabular-nums">0 a 6 años</p>
                <p>Tallas para cada etapa</p>
              </div>
              <div>
                <p className="font-semibold text-[#2D2A26] text-sm">100% Suave</p>
                <p>Cuidado hipoalergénico</p>
              </div>
              <div>
                <p className="font-semibold text-[#2D2A26] text-sm">Colombia</p>
                <p>Envíos a todo el país</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Composition of Baby Clothing */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-[#F7F3EC] shadow-sm aspect-4/3 group">
              {!imgError ? (
                <img
                  src={heroImage}
                  alt="Colección de ropa para bebés y mamelucos suaves Pequeñitos"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#EBF5FD] via-[#FDFBF7] to-[#FEF1EF]">
                  <Sparkles className="w-10 h-10 text-[#4FA6EE] mb-3" />
                  <p className="font-display text-xl text-[#2D2A26]">
                    Ropita para pequeños momentos grandes
                  </p>
                </div>
              )}

              {/* Subtle Editorial Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-[#FDFBF7]/95 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xs">
                <p className="text-xs text-[#6E685F]">Destacado de temporada</p>
                <Link
                  to="/producto/mameluco-osito-aventurero"
                  className="text-sm font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors inline-flex items-center gap-1.5 mt-0.5"
                >
                  <span>Mamelucos en Algodón Pima desde $39.900</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
