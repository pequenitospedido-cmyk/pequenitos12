import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Edit3,
  Plus,
  Check,
  X,
  Upload,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Package,
  FolderTree,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { BRAND_IMAGES } from '../../data/products';
import { AgeRange, Product, SizeOption } from '../../types/product';

const QUICK_SIZES: SizeOption[] = [
  '0-3M',
  '3-6M',
  '6-12M',
  '12-18M',
  '18-24M',
  '2T',
  '3T',
  '4T',
  '5T',
  '6T',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminLiveToolbar: React.FC = () => {
  const {
    isLiveEditMode,
    setIsLiveEditMode,
    quickProductPreset,
    openQuickProductModal,
    closeQuickProductModal,
    categories,
    products,
    saveProduct,
    uploadMedia,
  } = useStore();
  const { user, enterDemoSession } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Detect current category if browsing /mamelucos, /camisetas, etc.
  const currentCategoryFromRoute = ['mamelucos', 'camisetas', 'conjuntos', 'regalos'].find(
    (cat) => location.pathname === `/${cat}`
  );

  // Quick Product Modal Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(39900);
  const [oldPrice, setOldPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('mamelucos');
  const [shortDescription, setShortDescription] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<SizeOption[]>([
    '0-3M',
    '3-6M',
    '6-12M',
    '12-18M',
  ]);
  const [imageUrl, setImageUrl] = useState<string>(BRAND_IMAGES.mamelucoOsito);
  const [featured, setFeatured] = useState<boolean>(true);
  const [badge, setBadge] = useState<string>('Nuevo');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (quickProductPreset.isOpen) {
      setName('');
      setPrice(39900);
      setOldPrice('');
      setCategory(quickProductPreset.category || currentCategoryFromRoute || 'mamelucos');
      setFeatured(quickProductPreset.featured ?? true);
      setShortDescription('');
      setSelectedSizes(['0-3M', '3-6M', '6-12M', '12-18M']);
      setImageUrl(BRAND_IMAGES.mamelucoOsito);
      setBadge('Nuevo');
    }
  }, [quickProductPreset, currentCategoryFromRoute]);

  const handleActivateGutenberg = () => {
    if (!user) {
      enterDemoSession('pequenitospedido@gmail.com');
    }
    setIsLiveEditMode(!isLiveEditMode);
  };

  const handleToggleSize = (sz: SizeOption) => {
    setSelectedSizes((prev) =>
      prev.includes(sz) ? (prev.length > 1 ? prev.filter((s) => s !== sz) : prev) : [...prev, sz]
    );
  };

  const handleImageUpload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'product-images',
        folder: 'productos',
      });
      setImageUrl(asset.url);
    } finally {
      setUploading(false);
    }
  };

  const handleQuickCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const slug = `${slugify(name)}-${Math.floor(100 + Math.random() * 900)}`;
      const mappedAges: AgeRange[] = ['0-3 meses', '3-6 meses', '6-12 meses', '12-18 meses'];

      const newProduct: Product = {
        id: `peq-${Date.now()}`,
        slug,
        name: name.trim(),
        shortDescription:
          shortDescription.trim() ||
          'Prenda confeccionada en algodón hipoalergénico de tacto extra suave para tu Pequeñito.',
        description:
          shortDescription.trim() ||
          'Prenda confeccionada en algodón hipoalergénico de tacto extra suave para acompañar los pequeños grandes momentos de tu bebé.',
        price: Number(price) || 39900,
        oldPrice: oldPrice ? Number(oldPrice) : undefined,
        compareAtPrice: oldPrice ? Number(oldPrice) : undefined,
        category,
        sku: `PEQ-${Math.floor(100 + Math.random() * 900)}`,
        sizes: selectedSizes,
        colors: [
          { name: 'Azul Pastel', hex: '#A9D6F5' },
          { name: 'Crema Suave', hex: '#F5EFE6' },
        ],
        images: [imageUrl],
        featured,
        new: true,
        isGift: category === 'regalos',
        badge: badge.trim() || undefined,
        stock: 15,
        status: 'published',
        sortOrder: 1, // Put at the top so the admin immediately sees it in the section
        ageRange: mappedAges,
        rating: 5.0,
        reviewsCount: 12,
        materials: '100% Algodón Hipoalergénico',
      };

      // Shift existing sortOrder by +1 so the new product appears first in the section
      await saveProduct(newProduct);
      closeQuickProductModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* WordPress / Gutenberg Top Admin Bar */}
      {(user || isLiveEditMode) && (
        <div className="bg-[#1E1C1A] text-white text-xs border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-[#FACC48] transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#4FA6EE]" />
                <span>CMS Pequeñitos</span>
              </Link>

              <span className="text-white/25">|</span>

              {/* Toggle Live Gutenberg Editor */}
              <button
                type="button"
                onClick={() => {
                  if (location.pathname !== '/' && !isLiveEditMode) {
                    setIsLiveEditMode(true);
                  } else {
                    setIsLiveEditMode(!isLiveEditMode);
                  }
                }}
                className={`px-3 py-1 rounded-full font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  isLiveEditMode
                    ? 'bg-[#53C59B] text-[#1E1C1A] shadow-2xs'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>
                  {isLiveEditMode
                    ? 'Modo Gutenberg Activo (Clic para salir)'
                    : 'Editar esta página (Gutenberg)'}
                </span>
              </button>
            </div>

            {/* Quick Contextual "+ Agregar" Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  openQuickProductModal({
                    category: currentCategoryFromRoute || 'mamelucos',
                    featured: true,
                    sectionLabel: currentCategoryFromRoute
                      ? `Categoría ${currentCategoryFromRoute}`
                      : 'Página actual',
                  })
                }
                className="px-3 py-1 rounded-full bg-[#4FA6EE] text-white font-semibold inline-flex items-center gap-1 hover:bg-[#3B93DC] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  + Agregar producto{' '}
                  {currentCategoryFromRoute ? `en ${currentCategoryFromRoute}` : 'aquí'}
                </span>
              </button>

              <Link
                to="/admin/blog/nuevo"
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium inline-flex items-center gap-1 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FACC48]" />
                <span>+ Artículo Blog SEO</span>
              </Link>

              <Link
                to="/admin/productos"
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium hidden md:inline-flex items-center gap-1 transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-[#53C59B]" />
                <span>Productos ({products.length})</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom-Left Button to Activate Gutenberg Mode anytime */}
      {!isLiveEditMode && (
        <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={handleActivateGutenberg}
            className="px-4 py-2.5 rounded-full bg-[#2D2A26]/95 text-white text-xs font-semibold shadow-lg border border-white/15 hover:bg-[#2D2A26] transition-all inline-flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            title="Activar edición directa por bloques (Estilo Gutenberg)"
          >
            <Sparkles className="w-4 h-4 text-[#FACC48]" />
            <span>Editar página / + Bloques</span>
          </button>
        </div>
      )}

      {/* Contextual Quick Add Product Modal ("Agregar producto desde este punto específico") */}
      {quickProductPreset.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2D2A26]/50 backdrop-blur-xs"
            onClick={closeQuickProductModal}
          />
          <form
            onSubmit={handleQuickCreateSubmit}
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[92vh] overflow-y-auto animate-fade-in border border-black/8"
          >
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-black/6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4FA6EE]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Creación rápida en vivo · {quickProductPreset.sectionLabel}</span>
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-[#2D2A26] mt-0.5">
                  Agregar producto directamente aquí
                </h2>
              </div>
              <button
                type="button"
                onClick={closeQuickProductModal}
                className="w-8 h-8 rounded-full bg-[#F7F3EC] inline-flex items-center justify-center text-[#6E685F] hover:text-[#2D2A26] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Upload Preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-black/8">
              <img
                src={imageUrl}
                alt={name || 'Vista previa'}
                className="w-20 h-24 rounded-2xl object-cover bg-white border border-black/8 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#2D2A26]">Fotografía principal</p>
                <p className="text-[11px] text-[#6E685F]">
                  Sube la foto de la prenda (se optimiza automáticamente a WebP).
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#FACC48]" />
                  <span>{uploading ? 'Subiendo foto...' : 'Subir fotografía'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Mameluco Estrellitas Azul"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Precio (COP) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-semibold tabular-nums text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Precio anterior (Opcional)
                </label>
                <input
                  type="number"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  placeholder="Ej. 46900"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm tabular-nums text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Categoría donde se mostrará
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Etiqueta / Sello
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ej. Nuevo, Más vendido, Set x2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                Descripción corta
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Algodón hipoalergénico de tacto suave con broches seguros..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              />
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Tallas disponibles
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SIZES.map((sz) => {
                  const active = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => handleToggleSize(sz)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#2D2A26] text-white'
                          : 'bg-[#F7F3EC] text-[#6E685F] hover:text-[#2D2A26]'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#EBF5FD]/60 border border-[#4FA6EE]/20 cursor-pointer">
              <span className="text-xs font-semibold text-[#2D2A26]">
                Mostrar también en "Los favoritos de nuestros Pequeñitos" (Inicio)
              </span>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[#4FA6EE]"
              />
            </label>

            <div className="pt-3 border-t border-black/6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  closeQuickProductModal();
                  navigate('/admin/productos/nuevo');
                }}
                className="text-xs font-semibold text-[#4FA6EE] hover:underline cursor-pointer"
              >
                Abrir editor completo de variantes →
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={closeQuickProductModal}
                  className="px-4 py-2.5 rounded-full bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#3F3B36] transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4 text-[#53C59B]" />
                  <span>{saving ? 'Publicando...' : 'Publicar producto aquí'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
