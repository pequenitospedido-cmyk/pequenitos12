import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit3, Upload, Check } from 'lucide-react';
import { AgeRange, CategorySlug } from '../types/product';
import { BRAND_IMAGES } from '../data/products';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FilterState, ProductFilters } from '../components/ProductFilters';
import { ProductGrid } from '../components/ProductGrid';
import { SEOHead } from '../components/SEOHead';
import { useStore } from '../context/StoreContext';

interface ShopPageProps {
  presetCategory?: CategorySlug;
}

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'all',
  age: 'all',
  size: 'all',
  maxPrice: 120000,
  color: 'all',
  sort: 'recommended',
};

export const ShopPage: React.FC<ShopPageProps> = ({ presetCategory }) => {
  const {
    publishedProducts,
    activeCategories,
    isLiveEditMode,
    openQuickProductModal,
    saveCategory,
    uploadMedia,
  } = useStore();
  const [searchParams] = useSearchParams();
  const [editingBanner, setEditingBanner] = useState(false);
  const [uploadingBannerImg, setUploadingBannerImg] = useState(false);
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    category: presetCategory || 'all',
    search: searchParams.get('q') || '',
    age: (searchParams.get('age') as AgeRange) || 'all',
  }));

  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const ageParam = (searchParams.get('age') as AgeRange) || 'all';
    setFilters((prev) => ({
      ...prev,
      category: presetCategory || 'all',
      search: qParam,
      age: ageParam,
    }));
  }, [presetCategory, searchParams]);

  const categoryInfo = useMemo(
    () => (presetCategory ? activeCategories.find((c) => c.slug === presetCategory) : undefined),
    [presetCategory, activeCategories]
  );

  const handleUpdateFilters = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
      category: presetCategory || 'all',
    });
  };

  const filteredProducts = useMemo(() => {
    return publishedProducts
      .filter((product) => {
        const activeCat = presetCategory || filters.category;
        if (activeCat !== 'all') {
          if (activeCat === 'novedades') {
            if (!product.new) return false;
          } else if (activeCat === 'regalos') {
            if (product.category !== 'regalos' && !product.isGift) return false;
          } else if (product.category !== activeCat) {
            return false;
          }
        }

        if (filters.search.trim() !== '') {
          const q = filters.search.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesCat = product.category.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesCat) return false;
        }

        if (filters.age !== 'all' && !product.ageRange.includes(filters.age)) {
          return false;
        }

        if (filters.size !== 'all' && !product.sizes.includes(filters.size)) {
          return false;
        }

        if (product.price > filters.maxPrice) {
          return false;
        }

        if (filters.color !== 'all') {
          const hasColor = product.colors.some((c) =>
            c.name.toLowerCase().includes(filters.color.toLowerCase())
          );
          if (!hasColor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sort === 'price-asc') return a.price - b.price;
        if (filters.sort === 'price-desc') return b.price - a.price;
        if (filters.sort === 'newest') return Number(b.new) - Number(a.new);
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });
  }, [filters, presetCategory, publishedProducts]);

  const pageTitle = categoryInfo ? categoryInfo.title : 'Tienda Pequeñitos';
  const pageSubtitle = categoryInfo
    ? categoryInfo.subtitle
    : 'Descubre ropa bonita y cómoda para acompañar cada etapa.';

  return (
    <div className="py-6 md:py-10">
      <SEOHead
        title={pageTitle}
        description={pageSubtitle}
        breadcrumbs={[
          { name: 'Tienda', path: '/tienda' },
          ...(categoryInfo ? [{ name: categoryInfo.name, path: `/${categoryInfo.slug}` }] : []),
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={
            categoryInfo
              ? [{ name: 'Tienda', path: '/tienda' }, { name: categoryInfo.name }]
              : [{ name: 'Tienda Pequeñitos' }]
          }
        />

        {/* Category / Store Header Banner */}
        <div
          className={`rounded-3xl p-6 sm:p-10 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border ${
            isLiveEditMode ? 'border-2 border-[#4FA6EE]' : 'border-black/6'
          }`}
          style={{ backgroundColor: categoryInfo ? categoryInfo.softBg : '#EBF5FD' }}
        >
          <div className="lg:col-span-7 space-y-2.5">
            {isLiveEditMode && (
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <button
                  type="button"
                  onClick={() =>
                    openQuickProductModal({
                      category: presetCategory || (filters.category !== 'all' ? filters.category : 'mamelucos'),
                      featured: false,
                      sectionLabel: pageTitle,
                    })
                  }
                  className="px-4 py-1.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#3F3B36] transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-[#53C59B]" />
                  <span>+ Agregar producto directamente en {pageTitle}</span>
                </button>

                {categoryInfo && (
                  <button
                    type="button"
                    onClick={() => setEditingBanner(!editingBanner)}
                    className="px-3.5 py-1.5 rounded-full bg-white text-[#2D2A26] border border-black/15 text-xs font-semibold inline-flex items-center gap-1.5 hover:border-[#4FA6EE] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#4FA6EE]" />
                    <span>{editingBanner ? 'Cerrar edición del banner' : 'Editar textos / foto de categoría'}</span>
                  </button>
                )}
              </div>
            )}

            <p className="text-xs font-semibold text-[#6E685F]">
              {categoryInfo ? `Colección ${categoryInfo.name}` : 'Catálogo Oficial Pequeñitos'}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26]">
              {pageTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#2D2A26]/80 max-w-xl leading-relaxed">
              {pageSubtitle}
            </p>
            {categoryInfo && (
              <p className="text-xs text-[#6E685F] max-w-xl pt-1 leading-relaxed">
                {categoryInfo.description}
              </p>
            )}

            {/* Inline Gutenberg Editor for Category Banner */}
            {isLiveEditMode && editingBanner && categoryInfo && (
              <div className="mt-4 p-4 rounded-2xl bg-white border border-[#4FA6EE] space-y-3 shadow-md animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#4FA6EE]">
                    Editando cabecera de categoría en vivo
                  </span>
                  <span className="text-[11px] text-[#53C59B] font-semibold inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Guardado automático
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2D2A26] mb-1">
                      Título de la categoría
                    </label>
                    <input
                      type="text"
                      value={categoryInfo.title}
                      onChange={(e) => saveCategory({ ...categoryInfo, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-xs text-[#2D2A26]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#2D2A26] mb-1">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={categoryInfo.subtitle}
                      onChange={(e) => saveCategory({ ...categoryInfo, subtitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-xs text-[#2D2A26]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2D2A26] mb-1">
                    Descripción de la categoría
                  </label>
                  <textarea
                    rows={2}
                    value={categoryInfo.description}
                    onChange={(e) => saveCategory({ ...categoryInfo, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-black/15 text-xs text-[#2D2A26]"
                  />
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2D2A26] text-white text-xs font-semibold hover:bg-[#3F3B36] cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#FACC48]" />
                    <span>
                      {uploadingBannerImg ? 'Subiendo foto...' : 'Cambiar fotografía de esta categoría'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingBannerImg(true);
                        try {
                          const asset = await uploadMedia(file, {
                            bucket: 'product-images',
                            folder: 'categorias',
                          });
                          await saveCategory({ ...categoryInfo, image: asset.url });
                        } finally {
                          setUploadingBannerImg(false);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-16/9 rounded-2xl overflow-hidden bg-white shadow-2xs">
              <img
                src={categoryInfo ? categoryInfo.image : BRAND_IMAGES.hero}
                alt={pageTitle}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Filters & Product Count */}
        <ProductFilters
          filters={filters}
          onChange={handleUpdateFilters}
          onReset={handleResetFilters}
          totalCount={filteredProducts.length}
          hideCategoryFilter={Boolean(presetCategory)}
        />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={filteredProducts}
          onResetFilters={handleResetFilters}
          quickAddCategory={presetCategory || (filters.category !== 'all' ? filters.category : 'mamelucos')}
          quickAddLabel={pageTitle}
        />
      </div>
    </div>
  );
};
