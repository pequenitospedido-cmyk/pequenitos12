import { EditablePageContent } from '../../types/product';
import { INITIAL_PAGES_CONTENT } from '../../data/products';

const PAGES_STORAGE_KEY = 'pequenitos_cms_pages_v2';

function getLocalPages(): EditablePageContent[] {
  try {
    const raw = localStorage.getItem(PAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(INITIAL_PAGES_CONTENT));
      return INITIAL_PAGES_CONTENT;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PAGES_CONTENT;
  }
}

export const pageService = {
  async listPages(): Promise<EditablePageContent[]> {
    return getLocalPages();
  },

  async savePage(page: EditablePageContent): Promise<EditablePageContent> {
    const updated = { ...page, updatedAt: new Date().toISOString() };
    const current = getLocalPages();
    const idx = current.findIndex((p) => p.id === page.id || p.slug === page.slug);
    if (idx > -1) {
      current[idx] = updated;
    } else {
      current.push(updated);
    }
    try {
      localStorage.setItem(PAGES_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Ignore storage error
    }
    return updated;
  },
};
