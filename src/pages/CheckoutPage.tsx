import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { formatCOP } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';
import { PaymentMethodType } from '../types/product';

const COLOMBIA_DEPARTMENTS = [
  'Antioquia',
  'Atlántico',
  'Bogotá D.C.',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Cauca',
  'Cesar',
  'Córdoba',
  'Cundinamarca',
  'Huila',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Quindío',
  'Risaralda',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
];

const PAYMENT_OPTIONS: {
  id: PaymentMethodType;
  label: string;
  shortLabel: string;
  dotColor: string;
  desc: string;
}[] = [
  {
    id: 'nequi',
    label: '🟣 Nequi / QR',
    shortLabel: 'Nequi',
    dotColor: 'bg-purple-500',
    desc: 'Pago rápido desde tu celular con Nequi o código QR.',
  },
  {
    id: 'transferencia',
    label: '🟢 Transferencia bancaria',
    shortLabel: 'Transferencia bancaria',
    dotColor: 'bg-emerald-500',
    desc: 'Transferencia directa Bancolombia o PSE.',
  },
  {
    id: 'otro',
    label: '🟠 Otro medio de pago',
    shortLabel: 'Otro medio de pago',
    dotColor: 'bg-orange-500',
    desc: 'Acordar otro medio de pago directamente por WhatsApp.',
  },
];

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { createOrder, siteSettings } = useStore();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('nequi');
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [finalWhatsappUrl, setFinalWhatsappUrl] = useState('');
  const [finalMessageText, setFinalMessageText] = useState('');
  const [copiedMsg, setCopiedMsg] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    address: '',
    city: '',
    department: 'Antioquia',
    deliveryNotes: '',
  });

  const selectedPaymentObj =
    PAYMENT_OPTIONS.find((p) => p.id === paymentMethod) || PAYMENT_OPTIONS[0];

  // Build the exact pre-filled WhatsApp message requested
  const generatedWhatsappMessage = useMemo(() => {
    const productLines = items
      .map(
        (item) =>
          `• ${item.product.name} — talla ${item.selectedSize} — x${item.quantity} — ${formatCOP(
            item.product.price * item.quantity
          )}`
      )
      .join('\n');

    const lines = [
      '🧸 Nuevo pedido Pequeñitos',
      'Hola, quiero realizar este pedido:',
      productLines,
      `Total productos: ${formatCOP(subtotal)}`,
      `Cliente: ${form.fullName.trim() || 'Por completar'}`,
      `Teléfono: ${form.whatsapp.trim() || 'Por completar'}`,
      `Ciudad: ${form.city.trim() ? `${form.city.trim()} (${form.department})` : form.department}`,
      `Dirección: ${form.address.trim() || 'Por completar'}`,
      ...(form.deliveryNotes.trim()
        ? [`Indicaciones: ${form.deliveryNotes.trim()}`]
        : []),
      `Medio de pago: ${selectedPaymentObj.shortLabel}`,
      'Quedo pendiente de los datos para realizar el pago. 💛',
    ];

    return lines.join('\n');
  }, [items, subtotal, form, selectedPaymentObj]);

  const targetPhone = siteSettings.whatsappRaw || '573052300566';
  const liveWhatsappHref = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
    generatedWhatsappMessage
  )}`;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const randomRef = `PEQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);

    const savedUrl = liveWhatsappHref;
    const savedText = generatedWhatsappMessage;

    await createOrder({
      orderNumber: randomRef,
      customerName: form.fullName.trim(),
      customerEmail: form.email.trim() || 'pequenitospedido@gmail.com',
      customerPhone: form.whatsapp.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      department: form.department,
      notes: form.deliveryNotes.trim(),
      subtotal,
      shippingCost: 0,
      total: subtotal,
      paymentGateway: selectedPaymentObj.shortLabel,
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      itemsCount: totalCount,
    });

    setFinalWhatsappUrl(savedUrl);
    setFinalMessageText(savedText);
    setOrderCompleted(true);
    clearCart();

    // Trigger external WhatsApp link via anchor click
    const anchor = document.createElement('a');
    anchor.href = savedUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(finalMessageText || generatedWhatsappMessage);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  if (orderCompleted) {
    return (
      <div className="py-12 md:py-16">
        <SEOHead
          title="Pedido Listo para WhatsApp — Pequeñitos"
          description="Tu pedido de Pequeñitos está listo para enviarse por WhatsApp."
        />
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-black/6 shadow-xs space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#ECF9F4] text-[#53C59B] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs font-semibold text-[#53C59B]">
                Atención directa con {siteSettings.contactPerson || 'Milena Vargas'}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
                ¡Tu pedido está listo para WhatsApp!
              </h1>
              <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed">
                Si no se abrió automáticamente la ventana de WhatsApp en tu dispositivo, haz clic en
                el botón verde a continuación para enviar el mensaje prellenado al{' '}
                <strong className="text-[#2D2A26] tabular-nums">
                  {siteSettings.whatsappNumber}
                </strong>
                .
              </p>
            </div>

            {/* Pre-filled Message Box */}
            <div className="rounded-2xl bg-[#FDFBF7] p-4 border border-black/8 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E685F]">
                <span className="font-semibold text-[#2D2A26]">Mensaje de tu pedido:</span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="inline-flex items-center gap-1 font-semibold text-[#4FA6EE] hover:underline cursor-pointer"
                >
                  {copiedMsg ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#53C59B]" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs font-sans whitespace-pre-wrap text-[#2D2A26] leading-relaxed bg-white p-3.5 rounded-xl border border-black/6">
                {finalMessageText}
              </pre>
            </div>

            <div className="space-y-3">
              <a
                href={finalWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-full bg-[#25D366] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors shadow-xs"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Abrir WhatsApp y enviar pedido ahora</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                to="/tienda"
                className="w-full py-3 px-6 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold inline-flex items-center justify-center hover:bg-[#ECE6DA] transition-colors"
              >
                Seguir explorando Pequeñitos
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 md:py-16">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-[#2D2A26]">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-[#6E685F]">
            Agrega tus prendas favoritas antes de enviar tu pedido por WhatsApp.
          </p>
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs font-semibold"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-12">
      <SEOHead
        title="Finalizar Pedido por WhatsApp | Pequeñitos"
        description="Completa tus datos y envía tu pedido directamente por WhatsApp a Pequeñitos Colombia."
        breadcrumbs={[
          { name: 'Mi carrito', path: '/carrito' },
          { name: 'Enviar pedido por WhatsApp', path: '/checkout' },
        ]}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Mi carrito', path: '/carrito' },
            { name: 'Finalizar pedido' },
          ]}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2 mb-8">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26]">
              Finalizar pedido por WhatsApp
            </h1>
            <p className="text-xs sm:text-sm text-[#6E685F] mt-1">
              Completa tus datos de entrega y te atenderá{' '}
              <strong className="text-[#2D2A26]">
                {siteSettings.contactPerson || 'Milena Vargas'}
              </strong>{' '}
              en nuestro WhatsApp oficial ({siteSettings.whatsappNumber}).
            </p>
          </div>
          <Link
            to="/carrito"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E685F] hover:text-[#2D2A26] self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al carrito</span>
          </Link>
        </div>

        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Customer Data & Payment Method Selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Llena tus datos */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-xs space-y-5">
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                1. Llena tus datos de entrega
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Ej. Sandra Buitrago"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.whatsapp}
                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                    placeholder="Ej. 300 123 4567"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="sandra@correo.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Ej. Medellín, Bogotá, Cali..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                    Departamento *
                  </label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                  >
                    {COLOMBIA_DEPARTMENTS.map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Dirección *
                </label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Calle / Carrera / Número / Apartamento o Conjunto"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Indicaciones de entrega (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={form.deliveryNotes}
                  onChange={(e) => setForm({ ...form, deliveryNotes: e.target.value })}
                  placeholder="Ej. Dejar en portería, torre 2 apto 401, o mensaje para regalo..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>
            </div>

            {/* Step 2: ¿Cómo desea pagar? */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-xs space-y-4">
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                2. ¿Cómo desea pagar?
              </h2>
              <p className="text-xs text-[#6E685F]">
                Selecciona tu medio de pago preferido. Al enviar tu pedido por WhatsApp te
                compartiremos los datos exactos o el código QR para realizar el pago:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_OPTIONS.map((opt) => {
                  const active = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        active
                          ? 'border-[#4FA6EE] bg-[#EBF5FD]/60 ring-1 ring-[#4FA6EE]'
                          : 'border-black/10 bg-[#FDFBF7] hover:border-black/25'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-[#2D2A26]">{opt.label}</p>
                        <p className="text-xs text-[#6E685F] mt-0.5">{opt.desc}</p>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          active ? 'border-[#4FA6EE] bg-[#4FA6EE] text-white' : 'border-black/20'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Mi Carrito Summary + WhatsApp Message Preview + CTA */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-xs space-y-5 lg:sticky lg:top-28">
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              🛒 Mi carrito
            </h2>

            {/* Table: Producto | Cantidad | Valor */}
            <div className="overflow-x-auto rounded-2xl border border-black/6">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F3EC] text-[#2D2A26] font-semibold border-b border-black/6">
                  <tr>
                    <th className="py-2.5 px-3">Producto</th>
                    <th className="py-2.5 px-2 text-center">Cantidad</th>
                    <th className="py-2.5 px-3 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/6">
                  {items.map((item) => (
                    <tr
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                    >
                      <td className="py-2.5 px-3">
                        <p className="font-semibold text-[#2D2A26]">{item.product.name}</p>
                        <p className="text-[11px] text-[#6E685F]">Talla {item.selectedSize}</p>
                      </td>
                      <td className="py-2.5 px-2 text-center font-semibold tabular-nums">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-[#2D2A26] tabular-nums whitespace-nowrap">
                        {formatCOP(item.product.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-base font-semibold text-[#2D2A26] pt-2 border-t border-black/6">
              <span>Subtotal:</span>
              <span className="text-xl tabular-nums">{formatCOP(subtotal)}</span>
            </div>

            {/* Live Preview of the Generated WhatsApp Message */}
            <div className="rounded-2xl bg-[#FDFBF7] p-4 border border-black/8 space-y-2">
              <p className="text-[11px] font-semibold text-[#6E685F] uppercase tracking-wider">
                Vista previa del mensaje para WhatsApp:
              </p>
              <pre className="text-xs font-sans whitespace-pre-wrap text-[#2D2A26] leading-relaxed bg-white p-3.5 rounded-xl border border-black/6">
                {generatedWhatsappMessage}
              </pre>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20BD5A] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar pedido por WhatsApp</span>
            </button>

            <p className="text-[11px] text-center text-[#6E685F]">
              Se abrirá nuestro chat oficial de WhatsApp (<strong>305 230 0566</strong>) con tu
              pedido listo para enviar.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
