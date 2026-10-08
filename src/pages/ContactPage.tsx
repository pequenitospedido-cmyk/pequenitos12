import React, { useState } from 'react';
import { MessageCircle, Mail, Clock, CheckCircle2, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';

export const ContactPage: React.FC = () => {
  const { siteSettings, pagesContent } = useStore();
  const pageData = pagesContent.find((p) => p.slug === 'contacto');

  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const whatsappUrl = `https://wa.me/${siteSettings.whatsappRaw}?text=${encodeURIComponent(
    'Hola Pequeñitos, me gustaría recibir asesoría sobre sus prendas.'
  )}`;

  const isDemoNumber = siteSettings.whatsappNumber.includes('000 0000');

  return (
    <div className="py-6 md:py-12">
      <SEOHead
        title="Contacto y Atención al Cliente — Pequeñitos"
        description="Estamos para ayudarle. Contáctanos por WhatsApp o correo electrónico para asesoría de tallas, pedidos y regalos en toda Colombia."
        breadcrumbs={[{ name: 'Contacto', path: '/contacto' }]}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: 'Contacto' }]} />

        <div className="mt-4 mb-10 text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-[#53C59B]">
            {pageData?.subtitle || 'Atención cercana y personalizada'}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26] mt-1">
            {pageData?.title || 'Estamos para ayudarle'}
          </h1>
          <p className="text-sm sm:text-base text-[#6E685F] mt-2 leading-relaxed">
            {pageData?.body ||
              '¿Tienes dudas sobre una talla, quieres armar un regalo de nacimiento o consultar el estado de tu envío? Escríbenos, nos encantará atenderte.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#ECF9F4] text-[#53C59B] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-sans text-sm font-semibold text-[#2D2A26]">
                    WhatsApp Pedidos y Asesoría
                  </h2>
                  <p className="text-base font-semibold text-[#2D2A26] mt-0.5 tabular-nums">
                    +57 {siteSettings.whatsappNumber}
                  </p>
                  <p className="text-xs font-medium text-[#53C59B] mt-0.5">
                    Atención directa con {siteSettings.contactPerson || 'Milena Vargas'}
                  </p>
                  <p className="text-xs text-[#6E685F] mt-1">
                    Asesoría personalizada en tallas, disponibilidad y pedidos a toda Colombia.
                  </p>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-[#25D366] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hablar con {siteSettings.contactPerson || 'Milena Vargas'} por WhatsApp</span>
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xs border border-black/6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-sans text-sm font-semibold text-[#2D2A26]">
                    Correo electrónico
                  </h2>
                  <a
                    href={`mailto:${siteSettings.contactEmail}`}
                    className="text-sm font-semibold text-[#4FA6EE] hover:underline mt-0.5 block"
                  >
                    {siteSettings.contactEmail}
                  </a>
                  <p className="text-xs text-[#6E685F] mt-1">
                    Encargada: {siteSettings.contactPerson || 'Milena Vargas'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-black/6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#FEF1EF] text-[#F48B7B] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-sans text-sm font-semibold text-[#2D2A26]">
                    Redes sociales y horario
                  </h2>
                  <p className="text-xs text-[#6E685F] mt-0.5">{siteSettings.schedule}</p>
                  <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-[#2D2A26]">
                    <a
                      href={siteSettings.instagramUrl || 'https://instagram.com/pequenitos_colombia'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#4FA6EE] hover:underline"
                    >
                      Instagram: {siteSettings.instagramHandle || '@pequenitos_colombia'}
                    </a>
                    <a
                      href={siteSettings.tiktokUrl || 'https://tiktok.com/@pequenitoscolombia'}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#4FA6EE] hover:underline"
                    >
                      TikTok: {siteSettings.tiktokHandle || '@pequenitoscolombia'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-black/6">
            <h2 className="font-display text-xl font-semibold text-[#2D2A26] mb-1">
              Envíanos un mensaje
            </h2>
            <p className="text-xs text-[#6E685F] mb-6">
              Completa el siguiente formulario y nuestro equipo se pondrá en contacto contigo.
            </p>

            {formSent ? (
              <div className="rounded-2xl bg-[#ECF9F4] p-6 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-8 h-8 text-[#53C59B] mx-auto" />
                <h3 className="font-display text-lg font-semibold text-[#2D2A26]">
                  ¡Mensaje recibido con éxito!
                </h3>
                <p className="text-xs sm:text-sm text-[#6E685F] max-w-md mx-auto">
                  Gracias por escribirnos a Pequeñitos. Muy pronto te responderemos al correo
                  indicado.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSent(false)}
                  className="px-5 py-2 rounded-full bg-[#2D2A26] text-white text-xs font-semibold cursor-pointer"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#2D2A26] mb-1.5">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Laura Gómez"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#2D2A26] mb-1.5">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2A26] mb-1.5">Asunto</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Asesoría de tallas / Consulta de pedido / Regalo"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D2A26] mb-1.5">Mensaje</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer"
                >
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
