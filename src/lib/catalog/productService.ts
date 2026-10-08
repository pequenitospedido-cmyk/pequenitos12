import { supabase, isSupabaseConfigured } from '../supabase';
import { Product, ProductStatus, ProductVariant } from '../../types/product';
import { PRODUCTS, buildDefaultVariantsForProduct } from '../../data/products';

const STORAGE_KEY = 'pequenitos_cms_products_v2';

function normalizeSeedProducts(): Product[] {
  return PRODUCTS.map((p, idx) => ({
    ...p,
    compareAtPrice: p.oldPrice,
    sku: p.sku || `PEQ-${String(idx + 1).padStart(3, '0')}`,
    status: p.status || 'published',
    sortOrder: p.sortOrder ?? idx + 1,
    variants: buildDefaultVariantsForProduct(p),
    createdAt: p.createdAt || '2026-10-01T10:00:00Z',
    updatedAt: p.updatedAt || '2026-10-07T09:00:00Z',
  }));
}

function getLocalProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = normalizeSeedProducts();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return normalizeSeedProducts();
  }
}

function saveLocalProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  } catch {
    // Ignore storage quota errors
  }
}

function mapSupabaseRowToProduct(row: any): Product {
  const images: string[] = Array.isArray(row.product_images) && row.product_images.length > 0
    ? [...row.product_images]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((img) => img.url)
    : [];

  const variants: ProductVariant[] = Array.isArray(row.product_variants)
    ? [...row.product_variants]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((v) => ({
          id: v.id,
          size: v.size,
          colorName: v.color_name,
          colorHex: v.color_hex || '#A9D6F5',
          stock: Number(v.stock ?? 0),
          sku: v.sku || '',
          price: v.price ? Number(v.price) : undefined,
        }))
    : [];

  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));
  const colorMap = new Map<string, string>();
  variants.forEach((v) => {
    if (!colorMap.has(v.colorName)) {
      colorMap.set(v.colorName, v.colorHex);
    }
  });

  const totalVariantStock =
    variants.length > 0
      ? variants.reduce((sum, v) => sum + v.stock, 0)
      : Number(row.stock ?? 0);

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    shortDescription: row.short_description || '',
    price: Number(row.price ?? 0),
    oldPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : undefined,
    category: row.category_slug || 'mamelucos',
    categoryId: row.category_id,
    sku: row.sku || '',
    sizes: uniqueSizes.length > 0 ? (uniqueSizes as any) : ['0-3M', '3-6M', '6-12M'],
    colors:
      colorMap.size > 0
        ? Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }))
        : [{ name: 'Azul Pastel', hex: '#A9D6F5' }],
    variants,
    images: images.length > 0 ? images : [PRODUCTS[0].images[0]],
    featured: Boolean(row.featured),
    new: Boolean(row.is_new),
    isGift: Boolean(row.is_gift),
    badge: row.badge || undefined,
    stock: totalVariantStock,
    status: (row.status as ProductStatus) || 'published',
    sortOrder: Number(row.sort_order ?? 0),
    ageRange: Array.isArray(row.age_range) ? row.age_range : ['0-3 meses', '3-6 meses'],
    rating: Number(row.rating ?? 5.0),
    reviewsCount: Number(row.reviews_count ?? 12),
    materials: row.materials || undefined,
    careInstructions: Array.isArray(row.care_instructions) ? row.care_instructions : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const productService = {
  async listAll(): Promise<Product[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*), product_variants(*)')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(mapSupabaseRowToProduct);
      }
    }
    return getLocalProducts().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  async saveProduct(productData: Product): Promise<Product> {
    const now = new Date().toISOString();
    const normalized: Product = {
      ...productData,
      oldPrice: productData.compareAtPrice ?? productData.oldPrice,
      compareAtPrice: productData.compareAtPrice ?? productData.oldPrice,
      status: productData.status || 'published',
      updatedAt: now,
      createdAt: productData.createdAt || now,
    };

    if (isSupabaseConfigured() && supabase) {
      const payload = {
        name: normalized.name,
        slug: normalized.slug,
        description: normalized.description,
        short_description: normalized.shortDescription,
        price: normalized.price,
        compare_at_price: normalized.compareAtPrice || null,
        category_slug: normalized.category,
        sku: normalized.sku || null,
        age_range: normalized.ageRange,
        featured: normalized.featured,
        is_new: normalized.new,
        is_gift: Boolean(normalized.isGift),
        badge: normalized.badge || null,
        status: normalized.status,
        sort_order: normalized.sortOrder ?? 0,
        stock: normalized.stock,
        materials: normalized.materials || null,
      };

      const isExistingUuid = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(normalized.id);
      let savedProductId = normalized.id;

      if (isExistingUuid) {
        await supabase.from('products').update(payload).eq('id', normalized.id);
      } else {
        const { data } = await supabase.from('products').insert(payload).select('id').single();
        if (data?.id) savedProductId = data.id;
      }

      if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(savedProductId)) {
        // Sync images
        await supabase.from('product_images').delete().eq('product_id', savedProductId);
        if (normalized.images.length > 0) {
          await supabase.from('product_images').insert(
            normalized.images.map((url, idx) => ({
              product_id: savedProductId,
              url,
              alt_text: `${normalized.name} - Imagen ${idx + 1}`,
              is_primary: idx === 0,
              sort_order: idx,
            }))
          );
        }

        // Sync variants
        await supabase.from('product_variants').delete().eq('product_id', savedProductId);
        if (normalized.variants && normalized.variants.length > 0) {
          await supabase.from('product_variants').insert(
            normalized.variants.map((v, idx) => ({
              product_id: savedProductId,
              size: v.size,
              color_name: v.colorName,
              color_hex: v.colorHex,
              stock: v.stock,
              sku: v.sku,
              price: v.price || normalized.price,
              sort_order: idx,
            }))
          );
        }
      }
    }

    const current = getLocalProducts();
    const index = current.findIndex((p) => p.id === normalized.id);
    if (index > -1) {
      current[index] = normalized;
    } else {
      current.unshift(normalized);
    }
    saveLocalProducts(current);
    return normalized;
  },

  async deleteProduct(productId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(productId)) {
      await supabase.from('products').delete().eq('id', productId);
    }
    const current = getLocalProducts().filter((p) => p.id !== productId);
    saveLocalProducts(current);
  },

  async duplicateProduct(productId: string): Promise<Product | null> {
    const current = getLocalProducts();
    const source = current.find((p) => p.id === productId);
    if (!source) return null;

    const timestampSuffix = Math.floor(100 + Math.random() * 900);
    const copy: Product = {
      ...source,
      id: `peq-copy-${Date.now()}`,
      name: `${source.name} (copia)`,
      slug: `${source.slug}-copia-${timestampSuffix}`,
      sku: source.sku ? `${source.sku}-COPY` : `PEQ-COPY-${timestampSuffix}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return this.saveProduct(copy);
  },
};
