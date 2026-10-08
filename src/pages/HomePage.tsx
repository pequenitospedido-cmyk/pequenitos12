import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Gift,
  Ruler,
  Eye,
  EyeOff,
  Edit3,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Upload,
  Check,
  X,
  ShoppingBag,
  BookOpen,
  MessageCircle,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { BenefitsSection } from '../components/BenefitsSection';
import { CategorySection } from '../components/CategorySection';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { ProductGrid } from '../components/ProductGrid';
import { Newsletter } from '../components/Newsletter';
import { SEOHead } from '../components/SEOHead';
import { BRAND_IMAGES, SIZE_GUIDE_DATA } from '../data/products';
import { useStore } from '../context/StoreContext';
import { HomepageBlock, HomepageBlockType } from '../types/product';

const GUTENBERG_BLOCK_TEMPLATES: {
  type: HomepageBlockType;
  name: string;
  desc: string;
  icon: any;
  accent: string;
  defaultData: Partial<HomepageBlock>;
}[] = [
  {
    type: 'custom_products',
    name: 'Vitrina de Productos (Por Categoría)',
    desc: 'Muestra productos de una categoría específica y permite agregar productos desde este punto.',
    icon: ShoppingBag,
    accent: 'bg-[#EBF5FD] text-[#4FA6EE]',
    defaultData: {
      label: 'Vitrina de Productos',
      title: 'Selección especial para tu bebé',
      subtitle: 'Colección destacada',
      description: 'Prendas suaves y hipoalergénicas listas para enviar a toda Colombia.',
      buttonText: 'Ver toda la categoría',
      buttonLink: '/mamelucos',
      categoryFilter: 'mamelucos',
    },
  },
  {
    type: 'promo_banner',
    name: 'Banner Editorial con Imagen y Botón',
    desc: 'Sección visual de 2 columnas con fotografía grande, título, texto e invitación.',
    icon: ImageIcon,
    accent: 'bg-[#FEF1EF] text-[#F48B7B]',
    defaultData: {
      label: 'Banner Editorial',
      title: 'Suavidad que abraza cada etapa',
      subtitle: 'Algodón 100% Hipoalergénico',
      description:
        'Diseñamos cada prenda pensando en la delicadeza de su piel y la comodidad para el día y la noche.',
      buttonText: 'Explorar colección',
      buttonLink: '/tienda',
      imageUrl: BRAND_IMAGES.conjuntoBebe,
    },
  },
  {
    type: 'custom_text',
    name: 'Bloque de Texto / Historia / Aviso',
    desc: 'Sección editorial centrada con fondo pastel personalizable y botón opcional.',
    icon: FileText,
    accent: 'bg-[#FEF9E7] text-[#EAB308]',
    defaultData: {
      label: 'Bloque de Texto Editorial',
      title: 'Hecho con amor para pequeños grandes momentos',
      subtitle: 'Filosofía Pequeñitos',
      description:
        'En Pequeñitos cuidamos cada costura, cada botón y cada textura para que tu bebé disfrute de total libertad de movimiento.',
      buttonText: 'Conocer nuestra historia',
      buttonLink: '/nosotros',
      bgColor: '#EBF5FD',
    },
  },
  {
    type: 'whatsapp_cta',
    name: 'Banner de Asesoría por WhatsApp',
    desc: 'Bloque directo para que las mamás y papás conversen con Milena Vargas por WhatsApp.',
    icon: MessageCircle,
    accent: 'bg-[#ECF9F4] text-[#53C59B]',
    defaultData: {
      label: 'Asesoría WhatsApp',
      title: '¿Dudas con la talla o buscas un regalo para recién nacido?',
      subtitle: 'Atención personalizada con Milena Vargas',
      description:
        'Escríbenos directamente a nuestro WhatsApp 305 230 0566 y te asesoramos paso a paso con tu pedido.',
      buttonText: 'Hablar por WhatsApp',
      buttonLink: 'https://wa.me/573052300566',
    },
  },
  {
    type: 'blog_section',
    name: 'Sección de Artículos del Blog (SEO)',
    desc: 'Muestra los últimos consejos y guías educativas del Blog Pequeñitos.',
    icon: BookOpen,
    accent: 'bg-[#EBF5FD] text-[#4FA6EE]',
    defaultData: {
      label: 'Sección Blog SEO',
      title: 'Consejos y guías para el cuidado de tu bebé',
      subtitle: 'Blog Pequeñitos',
      description: 'Artículos de valor sobre cuidado del algodón, tallas y primera muda.',
      buttonText: 'Ir al Blog',
      buttonLink: '/blog',
    },
  },
  {
    type: 'gifts_section',
    name: 'Banner Especial de Regalos',
    desc: 'Destaca las cajas y sets de regalo con empaque especial y tarjeta incluida.',
    icon: Gift,
    accent: 'bg-[#FEF1EF] text-[#F48B7B]',
    defaultData: {
      label: 'Sección Regalos',
      title: '¿Buscando un regalo inolvidable de Baby Shower?',
      subtitle: 'Detalles listos para celebrar',
      description:
        'Cada set viene empacado con delicadeza e incluye tarjeta personalizada sin costo adicional.',
      buttonText: 'Ver regalos',
      buttonLink: '/regalos',
      imageUrl: BRAND_IMAGES.comboRegalo,
    },
  },
];

const PASTEL_BG_OPTIONS = [
  { label: 'Crema Suave', value: '#F7F3EC' },
  { label: 'Azul Pastel', value: '#EBF5FD' },
  { label: 'Coral Suave', value: '#FEF1EF' },
  { label: 'Verde Menta', value: '#ECF9F4' },
  { label: 'Amarillo Cálido', value: '#FEF9E7' },
  { label: 'Blanco Puro', value: '#FFFFFF' },
];

export const HomePage: React.FC = () => {
  const {
    publishedProducts,
    publishedBlogPosts,
    publishedHomepageBlocks,
    draftHomepageBlocks,
    categories,
    siteSettings,
    isLiveEditMode,
    setIsLiveEditMode,
    openQuickProductModal,
    publishHomepageBlocks,
    uploadMedia,
  } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDraftPreview = searchParams.get('preview') === 'draft';

  // Inline Gutenberg Editor State
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [insertingAtIndex, setInsertingAtIndex] = useState<number | null>(null);
  const [uploadingBlockImg, setUploadingBlockImg] = useState(false);
  const [savedToast, setSavedToast] = useState('');

  // In live edit mode, show all blocks (including hidden ones so admin can re-enable them)
  const blocksToRender = (isDraftPreview ? draftHomepageBlocks : publishedHomepageBlocks)
    .filter((b) => (isLiveEditMode ? true : b.visible))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const mamelucosProducts = publishedProducts
    .filter((p) => p.category === 'mamelucos')
    .slice(0, 4);

  const showToast = (msg: string) => {
    setSavedToast(msg);
    setTimeout(() => setSavedToast(''), 2600);
  };

  // Update a single block immediately and persist
  const handleInlineUpdateBlock = async (blockId: string, changes: Partial<HomepageBlock>) => {
    const updated = publishedHomepageBlocks.map((b) =>
      b.id === blockId ? { ...b, ...changes } : b
    );
    await publishHomepageBlocks(updated);
  };

  // Move block up or down
  const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
    const ordered = [...publishedHomepageBlocks].sort((a, b) => a.sortOrder - b.sortOrder);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= ordered.length) return;

    const temp = ordered[index];
    ordered[index] = ordered[target];
    ordered[target] = temp;

    const reindexed = ordered.map((b, i) => ({ ...b, sortOrder: i + 1 }));
    await publishHomepageBlocks(reindexed);
    showToast('Orden de bloques actualizado.');
  };

  // Delete a custom block or hide a core block
  const handleDeleteOrHideBlock = async (block: HomepageBlock) => {
    if (publishedHomepageBlocks.length <= 1) return;
    const remaining = publishedHomepageBlocks
      .filter((b) => b.id !== block.id)
      .map((b, i) => ({ ...b, sortOrder: i + 1 }));
    await publishHomepageBlocks(remaining);
    setEditingBlockId(null);
    showToast(`Bloque "${block.title}" eliminado de la página.`);
  };

  // Insert a new Gutenberg block at a specific position
  const handleInsertBlockAt = async (
    insertIndex: number,
    template: (typeof GUTENBERG_BLOCK_TEMPLATES)[number]
  ) => {
    const ordered = [...publishedHomepageBlocks].sort((a, b) => a.sortOrder - b.sortOrder);
    const newBlock: HomepageBlock = {
      id: `block-${Date.now()}`,
      type: template.type,
      label: template.defaultData.label || template.name,
      title: template.defaultData.title || 'Nuevo bloque Pequeñitos',
      subtitle: template.defaultData.subtitle || 'Pequeñitos Colombia',
      description: template.defaultData.description || '',
      buttonText: template.defaultData.buttonText || 'Ver más',
      buttonLink: template.defaultData.buttonLink || '/tienda',
      imageUrl: template.defaultData.imageUrl,
      categoryFilter: template.defaultData.categoryFilter || 'mamelucos',
      bgColor: template.defaultData.bgColor || '#EBF5FD',
      visible: true,
      sortOrder: insertIndex + 1,
      status: 'published',
    };

    ordered.splice(insertIndex, 0, newBlock);
    const reindexed = ordered.map((b, idx) => ({ ...b, sortOrder: idx + 1 }));
    await publishHomepageBlocks(reindexed);
    setInsertingAtIndex(null);
    setEditingBlockId(newBlock.id);
    showToast(`¡Bloque "${template.name}" añadido en este punto!`);
  };

  const handleBlockImageUpload = async (blockId: string, file?: File) => {
    if (!file) return;
    setUploadingBlockImg(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'product-images',
        folder: 'banners',
      });
      await handleInlineUpdateBlock(blockId, { imageUrl: asset.url });
      showToast('Imagen del bloque actualizada.');
    } finally {
      setUploadingBlockImg(false);
    }
  };

  // Render the Gutenberg "+ Insertar bloque aquí" divider between sections
  const renderGutenbergInserter = (insertIndex: number) => {
    if (!isLiveEditMode) return null;
    const isOpen = insertingAtIndex === insertIndex;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-2">
        <div className="relative flex items-center justify-center py-2">
          <div className="w-full border-t-2 border-dashed border-[#4FA6EE]/40" />
          <button
            type="button"
            onClick={() => setInsertingAtIndex(isOpen ? null : insertIndex)}
            className="absolute px-4 py-1.5 rounded-full bg-[#4FA6EE] text-white text-xs font-semibold shadow-sm hover:bg-[#3B93DC] transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insertar bloque o sección aquí</span>
          </button>
        </div>

        {isOpen && (
          <div className="mt-3 p-6 rounded-3xl bg-white border-2 border-[#4FA6EE] shadow-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-black/6">
              <div>
                <p className="text-xs font-semibold text-[#4FA6EE] uppercase tracking-wider">
                  Selector de Bloques Gutenberg
                </p>
                <h3 className="font-display text-lg font-semibold text-[#2D2A26]">
                  ¿Qué deseas agregar en este punto de la página?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInsertingAtIndex(null)}
                className="p-1.5 rounded-full bg-[#F7F3EC] text-[#6E685F] hover:text-[#2D2A26] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GUTENBERG_BLOCK_TEMPLATES.map((tpl) => {
                const Icon = tpl.icon;
                return (
                  <button
                    key={tpl.type + tpl.name}
                    type="button"
                    onClick={() => handleInsertBlockAt(insertIndex, tpl)}
                    className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/8 hover:border-[#4FA6EE] hover:bg-[#EBF5FD]/30 text-left transition-all flex items-start gap-3.5 cursor-pointer group"
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl ${tpl.accent} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#2D2A26] group-hover:text-[#4FA6EE]">
                        {tpl.name}
                      </p>
                      <p className="text-[11px] text-[#6E685F] mt-0.5 leading-relaxed">
                        {tpl.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the actual visual content of a block
  const renderBlockContent = (block: HomepageBlock) => {
    switch (block.type) {
      case 'hero':
        return <Hero block={block} />;

      case 'benefits':
        return <BenefitsSection />;

      case 'categories':
        return <CategorySection block={block} />;

      case 'featured_products':
        return <FeaturedProducts block={block} />;

      case 'promo_banner':
        return (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-3xl overflow-hidden bg-[#F7F3EC] grid grid-cols-1 lg:grid-cols-12 items-center border border-black/6">
                <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-5">
                  <p className="text-xs font-semibold text-[#F48B7B]">
                    {block.subtitle || 'Cuidado y suavidad en cada costura'}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26] leading-tight">
                    {block.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#6E685F] leading-relaxed">
                    {block.description}
                  </p>
                  {block.buttonText && (
                    <div className="pt-2">
                      <Link
                        to={block.buttonLink || '/tienda'}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors whitespace-nowrap"
                      >
                        <span>{block.buttonText}</span>
                        <ArrowRight className="w-4 h-4 text-[#FACC48]" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 h-72 sm:h-96 lg:h-full min-h-[320px] bg-[#EBF5FD]">
                  <img
                    src={block.imageUrl || BRAND_IMAGES.conjuntoBebe}
                    alt={block.title}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </section>
        );

      case 'mamelucos_section':
        return (
          <section className="py-12 md:py-16 bg-white border-y border-black/6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold text-[#4FA6EE]">
                    {block.subtitle || 'Categoría insignia'}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1">
                    {block.title}
                  </h2>
                  <p className="text-sm text-[#6E685F] mt-2 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                <Link
                  to={block.buttonLink || '/mamelucos'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EBF5FD] text-[#2D2A26] text-xs sm:text-sm font-semibold hover:bg-[#D8ECFA] transition-colors whitespace-nowrap self-start md:self-auto"
                >
                  <span>{block.buttonText || 'Ver todos los mamelucos'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <ProductGrid
                products={mamelucosProducts}
                quickAddCategory="mamelucos"
                quickAddLabel={block.title || 'Mamelucos suaves'}
              />
            </div>
          </section>
        );

      case 'custom_products': {
        const targetCat = block.categoryFilter || 'mamelucos';
        const customList = publishedProducts
          .filter((p) => (targetCat === 'all' ? true : p.category === targetCat))
          .slice(0, 4);

        return (
          <section className="py-12 md:py-16 bg-white border-y border-black/6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold text-[#4FA6EE]">{block.subtitle}</p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1">
                    {block.title}
                  </h2>
                  <p className="text-sm text-[#6E685F] mt-2 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                {block.buttonText && (
                  <Link
                    to={block.buttonLink || `/${targetCat}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#EBF5FD] text-[#2D2A26] text-xs sm:text-sm font-semibold hover:bg-[#D8ECFA] transition-colors whitespace-nowrap self-start md:self-auto"
                  >
                    <span>{block.buttonText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              <ProductGrid
                products={customList}
                quickAddCategory={targetCat === 'all' ? 'mamelucos' : targetCat}
                quickAddLabel={block.title || `Categoría ${targetCat}`}
              />
            </div>
          </section>
        );
      }

      case 'custom_text':
        return (
          <section className="py-10 md:py-14">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className="rounded-3xl p-8 sm:p-12 text-center border border-black/6 space-y-4"
                style={{ backgroundColor: block.bgColor || '#EBF5FD' }}
              >
                {block.subtitle && (
                  <p className="text-xs font-semibold text-[#4FA6EE] uppercase tracking-wider">
                    {block.subtitle}
                  </p>
                )}
                <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#2D2A26] max-w-2xl mx-auto">
                  {block.title}
                </h2>
                <p className="text-sm sm:text-base text-[#6E685F] max-w-2xl mx-auto leading-relaxed">
                  {block.description}
                </p>
                {block.buttonText && (
                  <div className="pt-2">
                    <Link
                      to={block.buttonLink || '/tienda'}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors"
                    >
                      <span>{block.buttonText}</span>
                      <ArrowRight className="w-4 h-4 text-[#FACC48]" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'whatsapp_cta':
        return (
          <section className="py-10 md:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-[#ECF9F4] border border-[#53C59B]/25 p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl text-center lg:text-left">
                  <p className="text-xs font-semibold text-[#53C59B]">
                    {block.subtitle || `Atención personalizada con ${siteSettings.contactPerson}`}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
                    {block.title}
                  </h2>
                  <p className="text-sm text-[#6E685F] leading-relaxed">{block.description}</p>
                </div>

                <a
                  href={`https://wa.me/${siteSettings.whatsappRaw || '573052300566'}?text=${encodeURIComponent(
                    'Hola Milena, vengo de la página de Pequeñitos y quiero recibir asesoría.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-full bg-[#25D366] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#20BD5A] transition-colors shrink-0 shadow-xs"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{block.buttonText || 'Hablar por WhatsApp'}</span>
                </a>
              </div>
            </div>
          </section>
        );

      case 'blog_section':
        return (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold text-[#53C59B]">
                    {block.subtitle || 'Blog Pequeñitos'}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1">
                    {block.title}
                  </h2>
                  <p className="text-sm text-[#6E685F] mt-2 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                <Link
                  to={block.buttonLink || '/blog'}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors whitespace-nowrap"
                >
                  <span>{block.buttonText || 'Leer todos los artículos'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {publishedBlogPosts.slice(0, 3).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-black/6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-16/9 bg-[#F7F3EC] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-2.5">
                        <span className="text-xs font-semibold text-[#4FA6EE]">
                          {post.category} · {post.readTime}
                        </span>
                        <h3 className="font-display text-lg font-semibold text-[#2D2A26] group-hover:text-[#4FA6EE] transition-colors leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#6E685F] line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-[#2D2A26]">
                      <span>Por {post.author}</span>
                      <span className="inline-flex items-center gap-1 text-[#4FA6EE]">
                        <span>Leer más</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gifts_section':
        return (
          <section className="py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-[#FEF1EF] border border-[#F48B7B]/20 p-8 sm:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#F48B7B]">
                    <Gift className="w-4 h-4" />
                    <span>{block.subtitle || 'Detalles listos para celebrar'}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-4xl font-semibold text-[#2D2A26]">
                    {block.title}
                  </h2>
                  <p className="text-sm sm:text-base text-[#6E685F] max-w-xl leading-relaxed">
                    {block.description}
                  </p>
                  <div className="pt-2">
                    <Link
                      to={block.buttonLink || '/regalos'}
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors whitespace-nowrap"
                    >
                      <span>{block.buttonText || 'Ver regalos'}</span>
                      <ArrowRight className="w-4 h-4 text-[#FACC48]" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-2xl overflow-hidden aspect-4/3 bg-white shadow-xs">
                    <img
                      src={block.imageUrl || BRAND_IMAGES.comboRegalo}
                      alt={block.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'size_guide':
        return (
          <section className="py-12 md:py-16 bg-white border-t border-black/6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4FA6EE]">
                    <Ruler className="w-4 h-4" />
                    <span>{block.subtitle || 'Compra con tranquilidad'}</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1">
                    {block.title}
                  </h2>
                  <p className="text-sm text-[#6E685F] mt-1">{block.description}</p>
                </div>

                <Link
                  to={block.buttonLink || '/guia-de-tallas'}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs sm:text-sm font-semibold hover:bg-[#EBF5FD] transition-colors whitespace-nowrap self-start md:self-auto"
                >
                  <span>{block.buttonText || 'Abrir guía de tallas completa'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
                {SIZE_GUIDE_DATA.map((row) => (
                  <Link
                    key={row.age}
                    to={`/tienda?age=${encodeURIComponent(row.age)}`}
                    className="group p-4 rounded-2xl bg-[#FDFBF7] border border-black/6 hover:border-[#4FA6EE] hover:bg-[#EBF5FD]/40 transition-all text-center flex flex-col justify-between"
                  >
                    <span className="font-display text-base font-semibold text-[#2D2A26] group-hover:text-[#4FA6EE] transition-colors">
                      {row.sizeCode}
                    </span>
                    <span className="text-xs font-medium text-[#2D2A26] mt-1">{row.age}</span>
                    <span className="text-[11px] text-[#6E685F] mt-1 tabular-nums">
                      {row.heightCm}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case 'newsletter':
        return <Newsletter block={block} />;

      default:
        return null;
    }
  };

  // Wrap each block with Gutenberg controls when isLiveEditMode is active
  const renderGutenbergWrappedBlock = (block: HomepageBlock, index: number) => {
    if (!isLiveEditMode) {
      return <React.Fragment key={block.id}>{renderBlockContent(block)}</React.Fragment>;
    }

    const isEditingThis = editingBlockId === block.id;
    const isProductSection =
      block.type === 'featured_products' ||
      block.type === 'mamelucos_section' ||
      block.type === 'custom_products' ||
      block.type === 'categories';

    const targetCategoryForQuickAdd =
      block.type === 'mamelucos_section'
        ? 'mamelucos'
        : block.type === 'custom_products'
        ? block.categoryFilter || 'mamelucos'
        : 'mamelucos';

    return (
      <React.Fragment key={block.id}>
        {renderGutenbergInserter(index)}

        <div
          className={`relative transition-all mx-2 sm:mx-4 my-3 rounded-3xl border-2 ${
            !block.visible
              ? 'border-dashed border-black/20 opacity-60 bg-black/5'
              : isEditingThis
              ? 'border-[#4FA6EE] ring-4 ring-[#4FA6EE]/15'
              : 'border-[#4FA6EE]/45 hover:border-[#4FA6EE]'
          }`}
        >
          {/* Floating Gutenberg Block Bar */}
          <div className="bg-[#2D2A26] text-white px-4 py-2.5 rounded-t-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4FA6EE] text-white font-semibold">
                Bloque #{index + 1}
              </span>
              <span className="font-semibold text-white">{block.label || block.title}</span>
              {!block.visible && (
                <span className="px-2 py-0.5 rounded-full bg-[#F48B7B] text-white text-[10px]">
                  Oculto al público
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Contextual "+ Agregar producto en este punto" */}
              {isProductSection && (
                <button
                  type="button"
                  onClick={() =>
                    openQuickProductModal({
                      category: targetCategoryForQuickAdd,
                      featured: block.type === 'featured_products',
                      sectionLabel: block.title || block.label,
                    })
                  }
                  className="px-3 py-1 rounded-full bg-[#53C59B] text-[#1E1C1A] font-semibold inline-flex items-center gap-1 hover:bg-[#43B288] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar producto en esta sección</span>
                </button>
              )}

              {/* Contextual "+ Escribir artículo SEO" if blog_section */}
              {block.type === 'blog_section' && (
                <button
                  type="button"
                  onClick={() => navigate('/admin/blog/nuevo')}
                  className="px-3 py-1 rounded-full bg-[#FACC48] text-[#1E1C1A] font-semibold inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Agregar artículo SEO aquí</span>
                </button>
              )}

              {/* Edit Block Inline Button */}
              <button
                type="button"
                onClick={() => setEditingBlockId(isEditingThis ? null : block.id)}
                className={`px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  isEditingThis
                    ? 'bg-[#FACC48] text-[#1E1C1A]'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingThis ? 'Cerrar editor' : 'Editar textos / imagen'}</span>
              </button>

              {/* Move Up / Down */}
              <button
                type="button"
                onClick={() => handleMoveBlock(index, 'up')}
                disabled={index === 0}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                title="Subir este bloque"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveBlock(index, 'down')}
                disabled={index === blocksToRender.length - 1}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 cursor-pointer"
                title="Bajar este bloque"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              {/* Toggle Visible */}
              <button
                type="button"
                onClick={() => handleInlineUpdateBlock(block.id, { visible: !block.visible })}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
                title={block.visible ? 'Ocultar sección' : 'Mostrar sección'}
              >
                {block.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>

              {/* Remove Block */}
              <button
                type="button"
                onClick={() => handleDeleteOrHideBlock(block)}
                className="p-1.5 rounded-lg bg-[#F48B7B]/20 text-[#F48B7B] hover:bg-[#F48B7B] hover:text-white cursor-pointer"
                title="Eliminar bloque de la página"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Inline Gutenberg Block Inspector Drawer (directly on the page!) */}
          {isEditingThis && (
            <div className="p-6 bg-white border-b-2 border-[#4FA6EE]/30 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#4FA6EE] uppercase tracking-wider">
                  Editando en vivo: {block.label}
                </span>
                <span className="text-[11px] text-[#53C59B] font-semibold">
                  ✓ Los cambios se ven y guardan al instante
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                    Título principal
                  </label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => handleInlineUpdateBlock(block.id, { title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-sm text-[#2D2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                    Subtítulo superior
                  </label>
                  <input
                    type="text"
                    value={block.subtitle}
                    onChange={(e) =>
                      handleInlineUpdateBlock(block.id, { subtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-sm text-[#2D2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                    Texto del botón
                  </label>
                  <input
                    type="text"
                    value={block.buttonText}
                    onChange={(e) =>
                      handleInlineUpdateBlock(block.id, { buttonText: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-sm text-[#2D2A26]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                    Descripción / Párrafo
                  </label>
                  <textarea
                    rows={2}
                    value={block.description}
                    onChange={(e) =>
                      handleInlineUpdateBlock(block.id, { description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-sm text-[#2D2A26]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                    Enlace del botón (Destino)
                  </label>
                  <input
                    type="text"
                    value={block.buttonLink}
                    onChange={(e) =>
                      handleInlineUpdateBlock(block.id, { buttonLink: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-sm font-mono text-[#2D2A26]"
                  />
                </div>
              </div>

              {/* If Custom Products Block: Choose which category to display */}
              {block.type === 'custom_products' && (
                <div className="pt-2 border-t border-black/6 flex flex-wrap items-center gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                      ¿Qué categoría de productos mostrar en este bloque?
                    </label>
                    <select
                      value={block.categoryFilter || 'mamelucos'}
                      onChange={(e) =>
                        handleInlineUpdateBlock(block.id, {
                          categoryFilter: e.target.value,
                          buttonLink: e.target.value === 'all' ? '/tienda' : `/${e.target.value}`,
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-xs font-semibold text-[#2D2A26]"
                    >
                      <option value="all">Todos los productos</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* If Custom Text Block: Choose Pastel Background */}
              {block.type === 'custom_text' && (
                <div className="pt-2 border-t border-black/6 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-[#2D2A26] mr-2">
                    Color pastel del bloque:
                  </span>
                  {PASTEL_BG_OPTIONS.map((bg) => (
                    <button
                      key={bg.value}
                      type="button"
                      onClick={() => handleInlineUpdateBlock(block.id, { bgColor: bg.value })}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                        block.bgColor === bg.value ? 'border-[#2D2A26] ring-1 ring-[#2D2A26]' : 'border-black/10'
                      }`}
                      style={{ backgroundColor: bg.value }}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              )}

              {/* If Block has Image (Hero, Promo Banner, Gifts) */}
              {(block.type === 'hero' ||
                block.type === 'promo_banner' ||
                block.type === 'gifts_section') && (
                <div className="pt-3 border-t border-black/6 flex flex-wrap items-center gap-4">
                  {block.imageUrl && (
                    <img
                      src={block.imageUrl}
                      alt={block.title}
                      className="w-24 h-16 rounded-xl object-cover bg-[#F7F3EC] border border-black/10"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#FACC48]" />
                    <span>
                      {uploadingBlockImg ? 'Subiendo imagen...' : 'Cambiar fotografía de este bloque'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleBlockImageUpload(block.id, e.target.files?.[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Render the actual block content */}
          {renderBlockContent(block)}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div>
      <SEOHead title={siteSettings.seoTitle} description={siteSettings.seoDescription} />

      {/* Toast Notification for Inline Gutenberg Actions */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-[#2D2A26] text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>{savedToast}</span>
        </div>
      )}

      {/* Gutenberg Mode Info Banner at the top of Home */}
      {isLiveEditMode && (
        <div className="bg-[#EBF5FD] border-b border-[#4FA6EE]/25 py-3 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#2D2A26]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4FA6EE] shrink-0" />
              <span>
                <strong>Modo Editor Visual Gutenberg Activo:</strong> Haz clic en{' '}
                <strong>"Editar textos / imagen"</strong> sobre cualquier sección, usa{' '}
                <strong>"+ Insertar bloque aquí"</strong> entre secciones o agrega productos
                directamente donde quieras.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLiveEditMode(false)}
              className="px-4 py-1.5 rounded-full bg-[#2D2A26] text-white font-semibold hover:bg-[#3F3B36] shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Ver página normal
            </button>
          </div>
        </div>
      )}

      {isDraftPreview && !isLiveEditMode && (
        <div className="bg-[#2D2A26] text-white py-2.5 px-4 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#FACC48]" />
            <span>
              <strong>Modo Vista Previa (Borrador):</strong> Estás visualizando los bloques de
              inicio antes de publicarlos.
            </span>
          </div>
          <Link
            to="/admin/inicio"
            className="px-3.5 py-1 rounded-full bg-white text-[#2D2A26] font-semibold hover:bg-[#FACC48] transition-colors"
          >
            Volver al editor de Inicio
          </Link>
        </div>
      )}

      {/* Render All Blocks */}
      {blocksToRender.map((block, index) => renderGutenbergWrappedBlock(block, index))}

      {/* Final Gutenberg Inserter at the bottom of the page */}
      {isLiveEditMode && renderGutenbergInserter(blocksToRender.length)}
    </div>
  );
};
