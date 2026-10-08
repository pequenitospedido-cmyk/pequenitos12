import React, { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';
import { HomepageBlock } from '../types/product';

interface NewsletterProps {
  block?: HomepageBlock;
}

export const Newsletter: React.FC<NewsletterProps> = ({ block }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#EBF5FD] p-8 sm:p-12 text-center max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-[#4FA6EE] mb-2">
            {block?.subtitle || 'Comunidad Pequeñitos'}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            {block?.title || 'Acompañamos cada etapa de su crecimiento'}
          </h2>
          <p className="text-sm text-[#6E685F] max-w-lg mx-auto mt-2.5 leading-relaxed">
            {block?.description ||
              'Suscríbete para recibir lanzamientos de nuevas colecciones, consejos de cuidado para las prendas de tu bebé y beneficios exclusivos para familias en Colombia.'}
          </p>

          {submitted ? (
            <div className="mt-6 inline-flex items-center gap-2 bg-white px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-[#2D2A26] shadow-2xs animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#53C59B]" />
              <span>¡Gracias por unirte a la familia Pequeñitos!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-6 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5"
            >
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#6E685F] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-sm text-[#2D2A26] placeholder:text-[#6E685F] focus:outline-none focus:ring-2 focus:ring-[#4FA6EE]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors whitespace-nowrap cursor-pointer"
              >
                {block?.buttonText || 'Suscribirme'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
