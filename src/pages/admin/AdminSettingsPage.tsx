import React, { useEffect, useState } from 'react';
import {
  Upload,
  Check,
  Sparkles,
  MessageCircle,
  Globe,
  Share2,
  Mail,
  RotateCcw,
  Database,
  ShieldCheck,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { SiteSettings } from '../../types/product';
import { BrandLogo } from '../../components/BrandLogo';

type SettingsSection = 'identidad' | 'contacto' | 'redes' | 'whatsapp' | 'seo' | 'infraestructura';

export const AdminSettingsPage: React.FC = () => {
  const { siteSettings, saveSiteSettings, uploadMedia, dataMode } = useStore();
  const { user, isConfigured } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<SettingsSection>('identidad');
  const [form, setForm] = useState<SiteSettings>(siteSettings);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  const handleLogoUpload = async (file?: File) => {
    if (!file) return;
    setUploadingLogo(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'brand-assets',
        folder: 'logo',
        preserveFormat: true,
      });
      const updated = { ...form, logoUrl: asset.url };
      setForm(updated);
      await saveSiteSettings(updated);
      setSavedNotice('¡Nuevo logo guardado y aplicado en Header y Footer!');
      setTimeout(() => setSavedNotice(''), 3000);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (file?: File) => {
    if (!file) return;
    setUploadingFavicon(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'brand-assets',
        folder: 'logo',
        preserveFormat: true,
      });
      const updated = { ...form, faviconUrl: asset.url };
      setForm(updated);
      await saveSiteSettings(updated);
      setSavedNotice('¡Favicon actualizado correctamente!');
      setTimeout(() => setSavedNotice(''), 3000);
    } finally {
      setUploadingFavicon(false);
    }
  };

  const handleRestoreFallbackLogo = async () => {
    const updated = { ...form, logoUrl: '' };
    setForm(updated);
    await saveSiteSettings(updated);
    setSavedNotice('Logo restaurado al fallback (/brand/logo.png / PEQUEÑITOS).');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSiteSettings(form);
    setSavedNotice('¡Configuración de la tienda guardada exitosamente!');
    setTimeout(() => setSavedNotice(''), 3000);
  };

  const tabs: { id: SettingsSection; label: string; icon: any }[] = [
    { id: 'identidad', label: 'Identidad de marca', icon: Sparkles },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
    { id: 'contacto', label: 'Contacto y Envíos', icon: Mail },
    { id: 'redes', label: 'Redes sociales', icon: Share2 },
    { id: 'seo', label: 'SEO y Metadatos', icon: Globe },
    { id: 'infraestructura', label: 'Base de Datos, Usuario y Dominio', icon: Database },
  ];

  const handleCopySqlSnippet = () => {
    const sql = `-- PEQUEÑITOS: Crear usuario administrador autorizado en profiles
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, 'Milena Vargas', 'admin'
FROM auth.users
WHERE email = 'pequenitospedido@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">Ajustes globales · site_settings</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Configuración de Marca
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
        >
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>Guardar configuración</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-[#ECF9F4] border border-[#53C59B]/40 text-xs sm:text-sm font-semibold text-[#2D2A26] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-[#2D2A26] text-white shadow-2xs'
                  : 'bg-white text-[#6E685F] hover:text-[#2D2A26]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#4FA6EE]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSaveAll} className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-6">
        {/* SECTION 1: IDENTIDAD DE MARCA & LOGO */}
        {activeTab === 'identidad' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                Identidad de marca y Logo oficial
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Administra el nombre, descripción y el logo de PEQUEÑITOS (Bucket:{' '}
                <code>brand-assets</code>).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Nombre de la marca
                </label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Descripción / Concepto de marca
                </label>
                <input
                  type="text"
                  value={form.siteDescription}
                  onChange={(e) => setForm({ ...form, siteDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>
            </div>

            {/* Logo Management Box */}
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-black/8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#2D2A26]">Logo actual de PEQUEÑITOS</h3>
                  <p className="text-xs text-[#6E685F] mt-0.5">
                    Si subes un logo aquí se mostrará en Header y Footer manteniendo su proporción
                    original. Si no hay uno configurado, se usa automáticamente{' '}
                    <code>/brand/logo.png</code>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer">
                    <Upload className="w-4 h-4 text-[#FACC48]" />
                    <span>{uploadingLogo ? 'Subiendo...' : 'Subir nuevo logo'}</span>
                    <input
                      type="file"
                      accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml"
                      onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>

                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={handleRestoreFallbackLogo}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white border border-black/10 text-xs font-semibold text-[#6E685F] hover:text-[#2D2A26] cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Usar fallback /brand/logo.png</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Live Logo Preview */}
              <div className="p-6 rounded-2xl bg-white border border-black/6 flex flex-col items-center justify-center min-h-[110px]">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt="Logo configurado"
                    className="h-14 w-auto object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <BrandLogo />
                )}
                <span className="text-[11px] text-[#6E685F] mt-2">
                  {form.logoUrl
                    ? 'Mostrando logo personalizado desde Storage / brand-assets'
                    : 'Mostrando logo desde /brand/logo.png (con fallback PEQUEÑITOS)'}
                </span>
              </div>
            </div>

            {/* Favicon Upload */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-black/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {form.faviconUrl ? (
                  <img
                    src={form.faviconUrl}
                    alt="Favicon"
                    className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-black/10"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#EBF5FD] text-[#4FA6EE] font-display font-bold flex items-center justify-center">
                    P
                  </div>
                )}
                <div>
                  <h3 className="text-xs font-semibold text-[#2D2A26]">Favicon del navegador</h3>
                  <p className="text-[11px] text-[#6E685F]">
                    Icono pequeño que aparece en la pestaña del navegador (PNG, WEBP o SVG).
                  </p>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD] cursor-pointer self-start sm:self-auto">
                <Upload className="w-3.5 h-3.5 text-[#4FA6EE]" />
                <span>{uploadingFavicon ? 'Subiendo...' : 'Subir favicon'}</span>
                <input
                  type="file"
                  accept=".png,.webp,.svg,image/png,image/webp,image/svg+xml"
                  onChange={(e) => handleFaviconUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* SECTION 2: WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                Configuración de WhatsApp Pedidos y Persona Encargada
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Este número recibe automáticamente los pedidos prellenados desde el checkout y se
                sincroniza en Contacto, Blog y Footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Persona encargada de atención
                </label>
                <input
                  type="text"
                  value={form.contactPerson || 'Milena Vargas'}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                  placeholder="Milena Vargas"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-semibold text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Número de WhatsApp (Colombia)
                </label>
                <input
                  type="text"
                  value={form.whatsappNumber}
                  onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
                  placeholder="305 230 0566"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-semibold tabular-nums text-[#2D2A26]"
                />
                <p className="text-[11px] text-[#6E685F] mt-1">
                  Enlace activo: <code>https://wa.me/{form.whatsappRaw || '573052300566'}</code>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CONTACTO Y ENVÍOS */}
        {activeTab === 'contacto' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              Información de Contacto y Envíos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Correo electrónico de atención
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Horario de atención
                </label>
                <input
                  type="text"
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Tope para envío gratis en Colombia (COP)
                </label>
                <input
                  type="number"
                  value={form.freeShippingThreshold}
                  onChange={(e) =>
                    setForm({ ...form, freeShippingThreshold: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm tabular-nums text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Costo de envío estándar (COP)
                </label>
                <input
                  type="number"
                  value={form.standardShippingCost}
                  onChange={(e) =>
                    setForm({ ...form, standardShippingCost: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm tabular-nums text-[#2D2A26]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: REDES SOCIALES */}
        {activeTab === 'redes' && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
              Enlaces de Redes Sociales
            </h2>

            <div className="space-y-3 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={form.instagramUrl}
                  onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={form.facebookUrl}
                  onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  TikTok URL
                </label>
                <input
                  type="url"
                  value={form.tiktokUrl}
                  onChange={(e) => setForm({ ...form, tiktokUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                SEO Principal y Open Graph (Colombia)
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Configura el título y la descripción predeterminada para buscadores y redes
                sociales. Cada producto sigue generando su propio Schema.org Product automáticamente.
              </p>
            </div>

            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Título principal de la tienda (SEO Title)
                </label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: BASE DE DATOS, USUARIO ADMIN Y DOMINIO PROPIO */}
        {activeTab === 'infraestructura' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                Conexión de Base de Datos (Supabase), Usuario Administrador y Dominio Propio
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Guía paso a paso para pasar del modo local a producción en la nube con tu propio
                dominio <code>.com</code> o <code>.co</code>.
              </p>
            </div>

            {/* 1. Estado actual y Usuario Administrador */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-black/8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#53C59B]" />
                  <h3 className="text-sm font-semibold text-[#2D2A26]">
                    1. ¿Cuál es el usuario que puede editar la página web?
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#EBF5FD] text-[#4FA6EE] text-xs font-semibold">
                  Modo actual: {dataMode}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#2D2A26] pt-1">
                <div className="p-4 rounded-xl bg-white border border-black/6 space-y-1.5">
                  <p className="font-semibold text-[#4FA6EE]">En este momento (Modo Local / Demo):</p>
                  <p className="text-[#6E685F] leading-relaxed">
                    El correo configurado para Milena Vargas es{' '}
                    <strong className="text-[#2D2A26]">pequenitospedido@gmail.com</strong>. Puedes
                    entrar desde <code>/admin</code> o con el botón inferior izquierdo{' '}
                    <strong>"Editar página / + Bloques"</strong> sin contraseña mientras pruebas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/6 space-y-1.5">
                  <p className="font-semibold text-[#53C59B]">Cuando conectes Supabase (En producción):</p>
                  <p className="text-[#6E685F] leading-relaxed">
                    En tu panel de Supabase ve a <strong>Authentication → Users → Add User</strong> y
                    crea el usuario <strong className="text-[#2D2A26]">pequenitospedido@gmail.com</strong> con
                    la contraseña privada que tú elijas. Nadie más podrá editar la tienda.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Cómo conectar la Base de Datos Supabase */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-black/8 space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#4FA6EE]" />
                <h3 className="text-sm font-semibold text-[#2D2A26]">
                  2. ¿Cómo conectar la Base de Datos (Supabase) en 3 pasos?
                </h3>
              </div>

              <ol className="space-y-3 text-xs text-[#6E685F] list-decimal list-inside leading-relaxed">
                <li>
                  Crea un proyecto gratuito en{' '}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#4FA6EE] hover:underline inline-flex items-center gap-1"
                  >
                    <span>supabase.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  llamado <strong>Pequenitos Colombia</strong>.
                </li>
                <li>
                  En el menú izquierdo de Supabase abre <strong>SQL Editor → New Query</strong>,
                  pega el contenido del archivo <code>/supabase/schema.sql</code> (incluido en este
                  proyecto) y haz clic en <strong>Run</strong>. Eso creará automáticamente todas las
                  tablas (productos, categorías, blog SEO, pedidos, configuración) y los buckets de
                  imágenes (<code>product-images</code> y <code>brand-assets</code>).
                </li>
                <li>
                  Ve a <strong>Project Settings → API</strong> en Supabase, copia tu{' '}
                  <strong>Project URL</strong> y tu clave <strong>anon public</strong>, y agrégalas
                  como variables de entorno:
                  <div className="mt-2 p-3 rounded-xl bg-[#2D2A26] text-white font-mono text-[11px] space-y-1">
                    <div>VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"</div>
                    <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI..."</div>
                  </div>
                </li>
              </ol>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-[#6E685F]">
                  Opcional: Comando SQL para dar rol de Admin principal a{' '}
                  <code>pequenitospedido@gmail.com</code>:
                </span>
                <button
                  type="button"
                  onClick={handleCopySqlSnippet}
                  className="px-4 py-2 rounded-full bg-white border border-black/15 text-xs font-semibold text-[#2D2A26] hover:border-[#4FA6EE] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#4FA6EE]" />
                  <span>{copiedSql ? '¡SQL copiado!' : 'Copiar comando SQL Admin'}</span>
                </button>
              </div>
            </div>

            {/* 3. Cómo conectar un Dominio Propio */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-black/8 space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#F48B7B]" />
                <h3 className="text-sm font-semibold text-[#2D2A26]">
                  3. ¿Cómo agregar tu dominio propio (ej. www.pequenitos.co)?
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#6E685F] leading-relaxed">
                <div className="p-4 rounded-xl bg-white border border-black/6 space-y-1.5">
                  <p className="font-semibold text-[#2D2A26]">Opción A: Publicando en Netlify (Recomendado)</p>
                  <p>
                    1. Sube este proyecto a Netlify (ya incluye el archivo <code>netlify.toml</code>{' '}
                    listo).
                    <br />
                    2. En Netlify entra a <strong>Domain Management → Add a domain</strong> y escribe
                    tu dominio (ej. <code>pequenitos.co</code>).
                    <br />
                    3. En donde compraste el dominio (GoDaddy, Namecheap, Hostinger o Mi.com.co),
                    apunta los registros DNS o Nameservers que te indica Netlify. El certificado
                    de seguridad <strong>HTTPS (candado verde)</strong> se activa gratis y automático.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-black/6 space-y-1.5">
                  <p className="font-semibold text-[#2D2A26]">Opción B: Desde Google Cloud Run / AI Studio</p>
                  <p>
                    1. Si despliegas directamente en Google Cloud Run, abre la consola de Cloud Run y
                    ve a <strong>Manage Custom Domains → Add Mapping</strong>.
                    <br />
                    2. Selecciona el servicio de Pequeñitos, verifica tu dominio y agrega el registro{' '}
                    <code>CNAME</code> (para <code>www</code>) y <code>A</code> en el panel DNS de tu
                    proveedor de dominio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-black/6 flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer"
          >
            Guardar cambios en Configuración
          </button>
        </div>
      </form>
    </div>
  );
};
