import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Star,
  Trash2,
  ArrowRight,
  Plus,
  Check,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { generateProductContent } from '../../lib/gemini';
import {
  AgeRange,
  Product,
  ProductColor,
  ProductStatus,
  ProductVariant,
  SizeOption,
} from '../../types/product';
import { BRAND_IMAGES } from '../../data/products';

const ALL_SIZES: SizeOption[] = [
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

const ALL_AGES: AgeRange[] = [
  '0-3 meses',
  '3-6 meses',
  '6-12 meses',
  '12-18 meses',
  '18-24 meses',
  '2-3 años',
  '3-4 años',
  '4-5 años',
  '5-6 años',
];

const PRESET_COLORS: ProductColor[] = [
  { name: 'Azul Pastel', hex: '#A9D6F5' },
  { name: 'Crema Suave', hex: '#F5EFE6' },
  { name: 'Verde Menta', hex: '#B4E4D1' },
  { name: 'Coral Suave', hex: '#FAD2CC' },
  { name: 'Amarillo Cálido', hex: '#FCE8A6' },
  { name: 'Blanco Nube', hex: '#FFFFFF' },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminProductEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, categories, mediaAssets, saveProduct, uploadMedia } = useStore();

  const isEditing = Boolean(id && id !== 'nuevo');
  const existingProduct = isEditing ? products.find((p) => p.id === id) : undefined;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(39900);
  const [compareAtPrice, setCompareAtPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('mamelucos');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState<number>(10);
  const [sizes, setSizes] = useState<SizeOption[]>(['0-3M', '3-6M', '6-12M']);
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Azul Pastel', hex: '#A9D6F5' },
  ]);
  const [ageRange, setAgeRange] = useState<AgeRange[]>(['0-3 meses', '3-6 meses', '6-12 meses']);
  const [images, setImages] = useState<string[]>([BRAND_IMAGES.mamelucoOsito]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isGift, setIsGift] = useState(false);
  const [badge, setBadge] = useState('');
  const [materials, setMaterials] = useState('100% Algodón Hipoalergénico');
  const [status, setStatus] = useState<ProductStatus>('published');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#A9D6F5');
  const [savedNotice, setSavedNotice] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSlug(existingProduct.slug);
      setShortDescription(existingProduct.shortDescription);
      setDescription(existingProduct.description);
      setPrice(existingProduct.price);
      setCompareAtPrice(
        existingProduct.oldPrice ? String(existingProduct.oldPrice) : ''
      );
      setCategory(existingProduct.category);
      setSku(existingProduct.sku || '');
      setStock(existingProduct.stock);
      setSizes(existingProduct.sizes);
      setColors(existingProduct.colors);
      setAgeRange(existingProduct.ageRange);
      setImages(existingProduct.images);
      setVariants(existingProduct.variants || []);
      setFeatured(existingProduct.featured);
      setIsNew(existingProduct.new);
      setIsGift(Boolean(existingProduct.isGift));
      setBadge(existingProduct.badge || '');
      setMaterials(existingProduct.materials || '100% Algodón Hipoalergénico');
      setStatus(existingProduct.status || 'published');
    }
  }, [existingProduct]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      setSlug(slugify(val));
    }
  };

  const toggleSize = (sz: SizeOption) => {
    setSizes((prev) =>
      prev.includes(sz) ? prev.filter((s) => s !== sz) : [...prev, sz]
    );
  };

  const toggleAge = (age: AgeRange) => {
    setAgeRange((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  const toggleColor = (color: ProductColor) => {
    setColors((prev) => {
      const exists = prev.some((c) => c.name === color.name);
      if (exists && prev.length > 1) {
        return prev.filter((c) => c.name !== color.name);
      }
      if (!exists) {
        return [...prev, color];
      }
      return prev;
    });
  };

  const handleAddCustomColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
    setNewColorName('');
  };

  // Generate or sync product_variants from selected sizes and colors
  const handleGenerateVariants = () => {
    const baseSku = (sku || slug || 'PEQ').toUpperCase().slice(0, 10);
    const generated: ProductVariant[] = [];
    const totalCombos = Math.max(1, sizes.length * colors.length);
    const perComboStock = Math.max(1, Math.floor(stock / totalCombos));

    sizes.forEach((sz) => {
      colors.forEach((col, cIdx) => {
        generated.push({
          id: `var-${Date.now()}-${sz}-${cIdx}`,
          size: sz,
          colorName: col.name,
          colorHex: col.hex,
          stock: perComboStock,
          sku: `${baseSku}-${sz}-${col.name.slice(0, 3).toUpperCase()}`,
          price,
        });
      });
    });

    setVariants(generated);
  };

  const handleFilesUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.type.startsWith('image/')) continue;
        const asset = await uploadMedia(file, {
          bucket: 'product-images',
          folder: 'productos',
        });
        uploadedUrls.push(asset.url);
      }
      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMakePrimaryImage = (idx: number) => {
    if (idx === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(idx, 1);
      copy.unshift(selected);
      return copy;
    });
  };

  const handleMoveImage = (idx: number, dir: 'left' | 'right') => {
    const target = dir === 'left' ? idx - 1 : idx + 1;
    if (target < 0 || target >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (targetStatus: ProductStatus) => {
    if (!name.trim()) return;

    const finalSlug = slug.trim() || slugify(name);
    const totalVariantStock =
      variants.length > 0
        ? variants.reduce((sum, v) => sum + Number(v.stock || 0), 0)
        : Number(stock || 0);

    const productPayload: Product = {
      id: existingProduct ? existingProduct.id : `peq-${Date.now()}`,
      name: name.trim(),
      slug: finalSlug,
      shortDescription:
        shortDescription.trim() ||
        'Prenda suave y cómoda pensada para acompañar cada etapa de nuestros Pequeñitos.',
      description:
        description.trim() ||
        shortDescription.trim() ||
        'Confeccionada con algodón hipoalergénico de tacto extra suave.',
      price: Number(price) || 39900,
      oldPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      sku: sku.trim() || `PEQ-${Math.floor(100 + Math.random() * 900)}`,
      sizes: sizes.length > 0 ? sizes : ['0-3M'],
      colors: colors.length > 0 ? colors : [{ name: 'Azul Pastel', hex: '#A9D6F5' }],
      variants,
      images: images.length > 0 ? images : [BRAND_IMAGES.mamelucoOsito],
      featured,
      new: isNew,
      isGift,
      badge: badge.trim() || undefined,
      stock: totalVariantStock,
      status: targetStatus,
      sortOrder: existingProduct?.sortOrder ?? 1,
      ageRange: ageRange.length > 0 ? ageRange : ['0-3 meses'],
      materials,
    };

    await saveProduct(productPayload);
    setStatus(targetStatus);
    setSavedNotice(
      targetStatus === 'published'
        ? '¡Producto publicado en la tienda!'
        : 'Cambios guardados correctamente.'
    );
    setTimeout(() => {
      navigate('/admin/productos');
    }, 700);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generateProductContent(aiPrompt);
      if (result) {
        setName(result.name);
        setSlug(slugify(result.name));
        setShortDescription(result.shortDescription);
        setDescription(result.description);
        setPrice(result.price);
        setCategory(result.category);
        setShowAiModal(false);
        setAiPrompt('');
      } else {
        alert('Hubo un error generando el producto. Revisa tu API key.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-black/6 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/productos"
            className="w-10 h-10 rounded-full bg-[#F7F3EC] inline-flex items-center justify-center text-[#2D2A26] hover:bg-[#EBF5FD]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs text-[#6E685F]">
              {isEditing ? `Editando producto` : 'Crear nuevo producto'}
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#2D2A26]">
              {name || 'Nuevo Producto Pequeñitos'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Wand2 className="w-4 h-4" />
            <span>Autogenerar con IA</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-5 py-2.5 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold hover:bg-[#ECE6DA] transition-colors cursor-pointer"
          >
            Guardar borrador
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4 text-[#53C59B]" />
            <span>Publicar</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-[#ECF9F4] border border-[#53C59B]/40 text-xs sm:text-sm font-semibold text-[#2D2A26] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Información principal
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Nombre del producto *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ej. Mameluco Osito Azul"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Slug (URL amigable)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="mameluco-osito-azul"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-mono text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Descripción corta
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Resumen breve que aparece en las tarjetas de producto..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Descripción completa
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la suavidad de la tela, detalles de confección y beneficios..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
              />
            </div>
          </div>

          {/* Product Gallery (Supabase Storage `product-images`) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
                  Galería del producto
                </h2>
                <p className="text-xs text-[#6E685F]">
                  La primera fotografía es la <strong>imagen principal</strong>. Las imágenes se
                  optimizan automáticamente (Bucket: <code>product-images</code>).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMediaPicker((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD] cursor-pointer self-start"
              >
                <ImageIcon className="w-4 h-4 text-[#4FA6EE]" />
                <span>Elegir de Media</span>
              </button>
            </div>

            {/* Drag and Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFilesUpload(e.dataTransfer.files);
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                isDragging
                  ? 'border-[#4FA6EE] bg-[#EBF5FD]/50'
                  : 'border-black/15 bg-[#FDFBF7] hover:border-[#4FA6EE]'
              }`}
            >
              <Upload className="w-7 h-7 text-[#4FA6EE] mx-auto mb-2" />
              <p className="text-xs sm:text-sm font-semibold text-[#2D2A26]">
                {uploadingImage
                  ? 'Optimizando y subiendo fotografías...'
                  : 'Arrastra fotografías aquí o selecciona desde tu dispositivo'}
              </p>
              <p className="text-[11px] text-[#6E685F] mt-1 mb-3">
                Soporta JPG, PNG y WEBP · Compresión automática inteligente
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer">
                <span>Subir fotografías</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFilesUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {/* Media Library Quick Selector */}
            {showMediaPicker && (
              <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/10 space-y-3">
                <p className="text-xs font-semibold text-[#2D2A26]">
                  Haz clic en una imagen de la biblioteca para agregarla al producto:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto">
                  {mediaAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setImages((prev) => [...prev, asset.url])}
                      className="aspect-square rounded-xl overflow-hidden border border-black/10 hover:border-[#4FA6EE] group relative cursor-pointer"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className={`relative rounded-2xl overflow-hidden bg-[#F7F3EC] border-2 p-2 space-y-2 ${
                    idx === 0 ? 'border-[#4FA6EE]' : 'border-black/6'
                  }`}
                >
                  <div className="aspect-3/4 rounded-xl overflow-hidden bg-white">
                    <img
                      src={imgUrl}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] px-1">
                    {idx === 0 ? (
                      <span className="font-semibold text-[#4FA6EE] flex items-center gap-1">
                        <Star className="w-3 h-3 fill-[#4FA6EE]" /> Principal
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleMakePrimaryImage(idx)}
                        className="text-[#6E685F] hover:text-[#2D2A26] font-medium cursor-pointer"
                      >
                        Hacer principal
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 text-[#6E685F] hover:text-[#2D2A26] disabled:opacity-30 cursor-pointer"
                        title="Mover antes"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveImage(idx, 'right')}
                        disabled={idx === images.length - 1}
                        className="p-1 text-[#6E685F] hover:text-[#2D2A26] disabled:opacity-30 cursor-pointer"
                        title="Mover después"
                      >
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 text-[#F48B7B] hover:text-[#2D2A26] cursor-pointer"
                        title="Eliminar fotografía"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sizes, Colors & Variants */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-6">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Tallas, Colores y Variantes
            </h2>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-2">
                Tallas disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((sz) => {
                  const active = sizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer tabular-nums ${
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

            {/* Recommended Age */}
            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-2">
                Edad recomendada
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_AGES.map((age) => {
                  const active = ageRange.includes(age);
                  return (
                    <button
                      key={age}
                      type="button"
                      onClick={() => toggleAge(age)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        active
                          ? 'bg-[#EBF5FD] text-[#2D2A26] border border-[#4FA6EE]'
                          : 'bg-[#FDFBF7] text-[#6E685F] border border-black/10'
                      }`}
                    >
                      {age}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#2D2A26]">
                Colores del producto
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_COLORS.map((col) => {
                  const active = colors.some((c) => c.name === col.name);
                  return (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer ${
                        active
                          ? 'border-[#2D2A26] bg-[#FDFBF7] text-[#2D2A26] font-semibold'
                          : 'border-black/10 text-[#6E685F]'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/15"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newColorName}
                  onChange={(e) => setNewColorName(e.target.value)}
                  placeholder="Nuevo color (ej. Rosa Bebé)"
                  className="px-3 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26]"
                />
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-black/10 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="px-3.5 py-2 rounded-xl bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD] cursor-pointer"
                >
                  + Añadir color
                </button>
              </div>
            </div>

            {/* Variants Matrix (`product_variants`) */}
            <div className="pt-4 border-t border-black/6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-semibold text-[#2D2A26]">
                    Variantes de Inventario (Talla / Color / Stock / SKU)
                  </h3>
                  <p className="text-[11px] text-[#6E685F]">
                    Controla el stock específico de cada combinación en <code>product_variants</code>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateVariants}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EBF5FD] text-xs font-semibold text-[#2D2A26] hover:bg-[#D8ECFA] cursor-pointer self-start"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Generar variantes desde tallas y colores</span>
                </button>
              </div>

              {variants.length > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-black/6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F7F3EC] text-[#2D2A26] font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Talla</th>
                        <th className="py-2.5 px-3">Color</th>
                        <th className="py-2.5 px-3">Stock (unid.)</th>
                        <th className="py-2.5 px-3">SKU Variante</th>
                        <th className="py-2.5 px-3 text-right">Quitar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/6">
                      {variants.map((v, vIdx) => (
                        <tr key={v.id}>
                          <td className="py-2 px-3 font-semibold">{v.size}</td>
                          <td className="py-2 px-3">{v.colorName}</td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              min={0}
                              value={v.stock}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === vIdx ? { ...item, stock: val } : item
                                  )
                                );
                              }}
                              className="w-20 px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-black/10 tabular-nums"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => {
                                const val = e.target.value;
                                setVariants((prev) =>
                                  prev.map((item, i) =>
                                    i === vIdx ? { ...item, sku: val } : item
                                  )
                                );
                              }}
                              className="w-36 px-2.5 py-1 rounded-lg bg-[#FDFBF7] border border-black/10 font-mono text-[11px]"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                setVariants((prev) => prev.filter((_, i) => i !== vIdx))
                              }
                              className="text-[#F48B7B] hover:text-[#2D2A26] p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column: Pricing, Category, Visibility & Flags */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing & Stock */}
          <div className="bg-white rounded-3xl p-6 border border-black/6 shadow-2xs space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Precio e Inventario
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Precio de venta (COP) *
              </label>
              <input
                type="number"
                required
                min={0}
                step={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-semibold tabular-nums text-[#2D2A26]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Precio anterior (Opcional)
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
                placeholder="Ej. 46900"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm tabular-nums text-[#2D2A26]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-black/6">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Stock general
                </label>
                <input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm tabular-nums text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  SKU Principal
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="PEQ-015"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs font-mono text-[#2D2A26]"
                />
              </div>
            </div>
          </div>

          {/* Organization & Visibility */}
          <div className="bg-white rounded-3xl p-6 border border-black/6 shadow-2xs space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Categoría y Visibilidad
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Estado del producto
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-medium text-[#2D2A26]"
              >
                <option value="published">Publicado (Visible en tienda)</option>
                <option value="draft">Borrador (No visible)</option>
                <option value="hidden">Oculto (Guardado sin mostrar)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-black/6 space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-[#2D2A26]">
                    Mostrar en inicio (Destacado)
                  </span>
                  <span className="text-[11px] text-[#6E685F]">
                    Aparece en "Los favoritos de nuestros Pequeñitos"
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#4FA6EE]"
                />
              </label>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-[#2D2A26]">
                    Mostrar como novedad
                  </span>
                  <span className="text-[11px] text-[#6E685F]">
                    Aparece automáticamente en la sección Novedades
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 accent-[#53C59B]"
                />
              </label>

              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <div>
                  <span className="block text-xs font-semibold text-[#2D2A26]">
                    Ideal para Regalo
                  </span>
                  <span className="text-[11px] text-[#6E685F]">
                    Incluir también en la colección de Regalos
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 accent-[#F48B7B]"
                />
              </label>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Etiqueta sutil opcional
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej. Más vendido, Nuevo, Set 2 Piezas"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="w-full py-4 px-6 rounded-full bg-[#2D2A26] text-white text-sm font-semibold hover:bg-[#3F3B36] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Publicar producto en tienda</span>
            <ArrowRight className="w-4 h-4 text-[#FACC48]" />
          </button>
        </div>
      </div>

      {/* AI Generation Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <Wand2 className="w-6 h-6" />
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                Asistente de IA
              </h2>
            </div>
            
            <p className="text-sm text-[#6E685F]">
              Describe el producto que quieres crear y la Inteligencia Artificial generará el título, la descripción, el precio y otros detalles por ti.
            </p>
            
            <textarea
              rows={4}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ej: Un mameluco de dinosaurio para bebé de 6 a 12 meses, color verde, muy suave..."
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-indigo-400"
              disabled={isGenerating}
            />
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-5 py-2.5 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold hover:bg-[#ECE6DA] transition-colors cursor-pointer"
                disabled={isGenerating}
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt.trim()}
                className="px-6 py-2.5 rounded-full bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <span>Generando...</span>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Generar Producto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
