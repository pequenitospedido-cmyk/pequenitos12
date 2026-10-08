import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ruler, Info, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SIZE_GUIDE_DATA } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';

export const SizeGuidePage: React.FC = () => {
  const [selectedAgeIndex, setSelectedAgeIndex] = useState<number>(0);
  const selectedRow = SIZE_GUIDE_DATA[selectedAgeIndex];

  return (
    <div className="py-6 md:py-12">
      <SEOHead
        title="Guía de Tallas para Bebés y Niños — Pequeñitos"
        description="Encuentra la talla ideal de ropa para tu bebé o niño en Pequeñitos. Tabla de medidas por edad, altura y peso aproximado desde 0-3 meses hasta 6 años."
        breadcrumbs={[{ name: 'Guía de tallas', path: '/guia-de-tallas' }]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: 'Guía de tallas' }]} />

        {/* Header */}
        <div className="bg-[#EBF5FD] rounded-3xl p-6 sm:p-10 mt-2 mb-8 border border-[#4FA6EE]/20">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4FA6EE] mb-2">
            <Ruler className="w-4 h-4" />
            <span>Guía oficial de medidas Pequeñitos</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26]">
            Encuentra la talla ideal
          </h1>
          <p className="text-sm sm:text-base text-[#6E685F] mt-2 max-w-2xl leading-relaxed">
            Sabemos que cada niño crece a su propio ritmo. Diseñamos nuestras prendas con moldes
            cómodos que permiten libertad de movimiento y espacio para el pañal en las etapas de
            bebé.
          </p>
        </div>

        {/* Interactive Stage Selector */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-black/6 mb-8">
          <h2 className="font-display text-xl font-semibold text-[#2D2A26] mb-3">
            Consulta rápida por etapa
          </h2>
          <p className="text-xs text-[#6E685F] mb-4">
            Selecciona la edad actual de tu bebé o niño para ver la talla sugerida:
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {SIZE_GUIDE_DATA.map((row, idx) => (
              <button
                key={row.age}
                type="button"
                onClick={() => setSelectedAgeIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedAgeIndex === idx
                    ? 'bg-[#2D2A26] text-white shadow-2xs'
                    : 'bg-[#F7F3EC] text-[#6E685F] hover:text-[#2D2A26]'
                }`}
              >
                {row.age}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-[#FDFBF7] p-5 sm:p-6 border border-black/6 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
            <div>
              <span className="text-xs text-[#6E685F] block">Talla sugerida</span>
              <span className="font-display text-3xl font-semibold text-[#4FA6EE] tabular-nums">
                {selectedRow.sizeCode}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#6E685F] block">Altura aproximada</span>
              <span className="text-base font-semibold text-[#2D2A26] tabular-nums">
                {selectedRow.heightCm}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#6E685F] block">Peso aproximado</span>
              <span className="text-base font-semibold text-[#2D2A26] tabular-nums">
                {selectedRow.weightKg}
              </span>
            </div>
            <div className="sm:text-right">
              <Link
                to={`/tienda?age=${encodeURIComponent(selectedRow.age)}`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors whitespace-nowrap"
              >
                <span>Ver prendas {selectedRow.sizeCode}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FACC48]" />
              </Link>
            </div>
          </div>
          <p className="text-xs text-[#6E685F] mt-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#53C59B] shrink-0" />
            <span>{selectedRow.stageTip}</span>
          </p>
        </div>

        {/* Complete Size Table */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xs border border-black/6 mb-8">
          <div className="px-6 py-5 border-b border-black/6">
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              Tabla general de medidas Pequeñitos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] border-b border-black/6">
                  <th className="py-3.5 px-6">Edad</th>
                  <th className="py-3.5 px-6">Talla sugerida</th>
                  <th className="py-3.5 px-6">Altura aproximada</th>
                  <th className="py-3.5 px-6">Peso aproximado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/6 text-xs sm:text-sm">
                {SIZE_GUIDE_DATA.map((row) => (
                  <tr
                    key={row.age}
                    className="hover:bg-[#FDFBF7] transition-colors"
                  >
                    <td className="py-4 px-6 font-medium text-[#2D2A26]">{row.age}</td>
                    <td className="py-4 px-6 font-semibold text-[#4FA6EE] tabular-nums">
                      {row.sizeCode}
                    </td>
                    <td className="py-4 px-6 text-[#6E685F] tabular-nums">{row.heightCm}</td>
                    <td className="py-4 px-6 text-[#6E685F] tabular-nums">{row.weightKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mandatory Orientation Note */}
        <div className="rounded-2xl bg-[#FEF9E7] border border-[#FACC48]/40 p-5 flex items-start gap-3.5 text-xs sm:text-sm text-[#2D2A26]">
          <Info className="w-5 h-5 text-[#EAB308] shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            Las medidas son orientativas. Recomendamos revisar las medidas de la prenda antes de
            comprar. Si tu bebé se encuentra entre dos tallas, te sugerimos elegir la talla
            siguiente para que pueda disfrutar su ropita por más tiempo.
          </p>
        </div>
      </div>
    </div>
  );
};
