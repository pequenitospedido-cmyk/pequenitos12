import { supabase, isSupabaseConfigured } from '../supabase';
import { HomepageBlock } from '../../types/product';
import { INITIAL_HOMEPAGE_BLOCKS } from '../../data/products';

const PUBLISHED_BLOCKS_KEY = 'pequenitos_cms_home_published_v2';
const DRAFT_BLOCKS_KEY = 'pequenitos_cms_home_draft_v2';

function getLocalBlocks(key: string): HomepageBlock[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(INITIAL_HOMEPAGE_BLOCKS));
      return INITIAL_HOMEPAGE_BLOCKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HOMEPAGE_BLOCKS;
  }
}

export const homepageService = {
  async getPublishedBlocks(): Promise<HomepageBlock[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          type: row.block_type,
          label: row.config?.label || row.title,
          title: row.title,
          subtitle: row.subtitle || '',
          description: row.description || '',
          buttonText: row.button_text || '',
          buttonLink: row.button_link || '/tienda',
          secondaryButtonText: row.secondary_button_text || '',
          secondaryButtonLink: row.secondary_button_link || '',
          imageUrl: row.image_url || undefined,
          visible: Boolean(row.visible),
          sortOrder: Number(row.sort_order ?? 1),
          status: 'published',
        }));
      }
    }

    return getLocalBlocks(PUBLISHED_BLOCKS_KEY).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getDraftBlocks(): Promise<HomepageBlock[]> {
    return getLocalBlocks(DRAFT_BLOCKS_KEY).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async saveDraftBlocks(blocks: HomepageBlock[]): Promise<HomepageBlock[]> {
    const ordered = blocks.map((b, idx) => ({
      ...b,
      sortOrder: idx + 1,
      status: 'draft' as const,
    }));
    try {
      localStorage.setItem(DRAFT_BLOCKS_KEY, JSON.stringify(ordered));
    } catch {
      // Ignore storage error
    }
    return ordered;
  },

  async publishBlocks(blocks: HomepageBlock[]): Promise<HomepageBlock[]> {
    const published = blocks.map((b, idx) => ({
      ...b,
      sortOrder: idx + 1,
      status: 'published' as const,
    }));

    if (isSupabaseConfigured() && supabase) {
      for (const b of published) {
        await supabase.from('homepage_sections').upsert({
          id: b.id,
          block_type: b.type,
          title: b.title,
          subtitle: b.subtitle,
          description: b.description,
          button_text: b.buttonText,
          button_link: b.buttonLink,
          secondary_button_text: b.secondaryButtonText || null,
          secondary_button_link: b.secondaryButtonLink || null,
          image_url: b.imageUrl || null,
          visible: b.visible,
          sort_order: b.sortOrder,
          status: 'published',
          config: { label: b.label },
        });
      }
    }

    try {
      localStorage.setItem(PUBLISHED_BLOCKS_KEY, JSON.stringify(published));
      localStorage.setItem(DRAFT_BLOCKS_KEY, JSON.stringify(published));
    } catch {
      // Ignore storage error
    }
    return published;
  },
};
