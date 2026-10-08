import React from 'react';
import { Truck, ShieldCheck, Heart, PackageCheck } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Envíos a toda Colombia',
    description: 'Entregas seguras en ciudades principales y municipios de todo el país.',
    accent: 'text-[#4FA6EE]',
    bg: 'bg-[#EBF5FD]',
  },
  {
    icon: ShieldCheck,
    title: 'Compra fácil y segura',
    description: 'Proceso claro, rápido y acompañado en cada paso de tu pedido.',
    accent: 'text-[#53C59B]',
    bg: 'bg-[#ECF9F4]',
  },
  {
    icon: Heart,
    title: 'Prendas seleccionadas con cariño',
    description: 'Algodón hipoalergénico, costuras suaves y diseños pensados para su piel.',
    accent: 'text-[#F48B7B]',
    bg: 'bg-[#FEF1EF]',
  },
  {
    icon: PackageCheck,
    title: 'Atención personalizada',
    description: 'Te asesoramos con tallas, combinaciones y regalos especiales por WhatsApp.',
    accent: 'text-[#EAB308]',
    bg: 'bg-[#FEF9E7]',
  },
];

export const BenefitsSection: React.FC = () => {
  return (
    <section className="py-10 md:py-12 border-y border-black/6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#2D2A26]">
            Todo para vestir sus pequeños momentos
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 p-4 rounded-2xl bg-[#FDFBF7] transition-colors"
              >
                <div
                  className={`w-11 h-11 rounded-2xl ${item.bg} ${item.accent} flex items-center justify-center shrink-0`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-sans text-sm font-semibold text-[#2D2A26]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6E685F] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
