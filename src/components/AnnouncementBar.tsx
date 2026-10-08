import React, { useState } from 'react';

export const AnnouncementBar: React.FC = () => {
  const [showAltMessage, setShowAltMessage] = useState(false);

  return (
    <div className="bg-[#EBF5FD] text-[#2D2A26] border-b border-[#4FA6EE]/15 text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <span className="hidden md:inline-block text-[#6E685F]">
          Algodón hipoalergénico para bebés y niños
        </span>
        <button
          type="button"
          onClick={() => setShowAltMessage((prev) => !prev)}
          className="mx-auto md:mx-0 font-medium tracking-wide text-center hover:text-[#4FA6EE] transition-colors cursor-pointer"
          title="Haz clic para ver más beneficios"
        >
          {showAltMessage
            ? 'Compra fácil y recibe tus Pequeñitos en casa'
            : 'Envíos a toda Colombia · Gratis en compras desde $120.000'}
        </button>
        <span className="hidden md:inline-block text-[#6E685F] tabular-nums">
          Atención personalizada en Colombia
        </span>
      </div>
    </div>
  );
};
