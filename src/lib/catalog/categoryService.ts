import { supabase, isSupabaseConfigured } from '../supabase';
import { CategoryInfo } from '../../types/product';
import { CATEGORIES } from '../../data/products';

const CATEGORIES_STORAGE_KEY = 'pequenitos_cms_categories_v2';

function getLocalCategories(): CategoryInfo[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      const seeded = CATEGORIES.map((c, idx) => ({
        ...c,
        sortOrder: idx + 1,
        status: 'active' as const,
      }));
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return CATEGORIES.map((c, idx) => ({
      ...c,
      sortOrder: idx + 1,
      status: 'active' as const,
    }));
  }
}

function saveLocalCategories(categories: CategoryInfo[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Ignore storage errors
  }
}

export const categoryService = {
  async listAll(): Promise<CategoryInfo[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          title: row.title || row.name,
          subtitle: row.subtitle || '',
          description: row.description || '',
          image: row.image || CATEGORIES[0].image,
          accentColor: row.accent_color || '#4FA6EE',
          softBg: row.soft_bg || '#EBF5FD',
          sortOrder: Number(row.sort_order ?? 1),
          status: row.status === 'hidden' ? 'hidden' : 'active',
        }));
      }
    }

    return getLocalCategories().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  async saveCategory(category: CategoryInfo): Promise<CategoryInfo> {
    if (isSupabaseConfigured() && supabase) {
      const payload = {
        name: category.name,
        slug: category.slug,
        title: category.title || category.name,
        subtitle: category.subtitle,
        description: category.description,
        image: category.image,
        accent_color: category.accentColor,
        soft_bg: category.softBg,
        sort_order: category.sortOrder ?? 1,
        status: category.status || 'active',
      };

      if (/^[0-9a-f]{8}-[0-9a-f]{4}/i.test(category.id)) {
        await supabase.from('categories').update(payload).eq('id', category.id);
      } else {
        await supabase.from('categories').insert(payload);
      }
    }

    const current = getLocalCategories();
    const idx = current.findIndex((c) => c.id === category.id);
    if (idx > -1) {
      current[idx] = category;
    } else {
      current.push(category);
    }
    saveLocalCategories(current);
    return category;
  },

  async deleteCategory(categoryId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(categoryId)) {
      await supabase.from('categories').delete().eq('id', categoryId);
    }
    const current = getLocalCategories().filter((c) => c.id !== categoryId);
    saveLocalCategories(current);
  },
};
