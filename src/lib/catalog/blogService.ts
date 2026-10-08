import { supabase, isSupabaseConfigured } from '../supabase';
import { BlogPost, BlogPostStatus } from '../../types/product';
import { INITIAL_BLOG_POSTS } from '../../data/products';

const BLOG_STORAGE_KEY = 'pequenitos_cms_blog_v1';

function normalizeSeedPosts(): BlogPost[] {
  return INITIAL_BLOG_POSTS.map((post, idx) => ({
    ...post,
    status: post.status || 'published',
    featured: post.featured ?? true,
    sortOrder: post.sortOrder ?? idx + 1,
    tags: post.tags || ['Cuidado del bebé', 'Ropa infantil Colombia'],
    focusKeyword: post.focusKeyword || post.title.toLowerCase(),
    seoTitle: post.seoTitle || `${post.title} | Blog Pequeñitos`,
    seoDescription: post.seoDescription || post.excerpt,
    updatedAt: post.updatedAt || '2026-10-07T09:00:00Z',
  }));
}

function getLocalPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (!raw) {
      const seeded = normalizeSeedPosts();
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return normalizeSeedPosts();
  }
}

function saveLocalPosts(posts: BlogPost[]): void {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    // Ignore storage quota errors
  }
}

export const blogService = {
  async listAll(): Promise<BlogPost[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          excerpt: row.excerpt || '',
          content: Array.isArray(row.content) ? row.content : [row.content || ''],
          category: row.category || 'Cuidado del Bebé',
          author: row.author || 'Milena Vargas',
          readTime: row.read_time || '3 min de lectura',
          publishedAt: row.published_at || 'Octubre 2026',
          image: row.image || INITIAL_BLOG_POSTS[0].image,
          tags: Array.isArray(row.tags) ? row.tags : [],
          focusKeyword: row.focus_keyword || '',
          seoTitle: row.seo_title || row.title,
          seoDescription: row.seo_description || row.excerpt || '',
          featured: Boolean(row.featured ?? true),
          status: (row.status as BlogPostStatus) || 'published',
          sortOrder: Number(row.sort_order ?? 1),
          updatedAt: row.updated_at,
        }));
      }
    }

    return getLocalPosts().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  },

  async saveBlogPost(postData: BlogPost): Promise<BlogPost> {
    const now = new Date().toISOString();
    const normalized: BlogPost = {
      ...postData,
      status: postData.status || 'published',
      featured: postData.featured ?? true,
      seoTitle: postData.seoTitle?.trim() || `${postData.title} | Blog Pequeñitos`,
      seoDescription: postData.seoDescription?.trim() || postData.excerpt,
      updatedAt: now,
    };

    if (isSupabaseConfigured() && supabase) {
      const payload = {
        slug: normalized.slug,
        title: normalized.title,
        excerpt: normalized.excerpt,
        content: normalized.content,
        category: normalized.category,
        author: normalized.author,
        read_time: normalized.readTime,
        published_at: normalized.publishedAt,
        image: normalized.image,
        tags: normalized.tags || [],
        focus_keyword: normalized.focusKeyword || null,
        seo_title: normalized.seoTitle || null,
        seo_description: normalized.seoDescription || null,
        featured: normalized.featured,
        status: normalized.status,
        sort_order: normalized.sortOrder ?? 1,
      };

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(normalized.id);
      if (isUuid) {
        await supabase.from('blog_posts').update(payload).eq('id', normalized.id);
      } else {
        await supabase.from('blog_posts').insert(payload);
      }
    }

    const current = getLocalPosts();
    const index = current.findIndex((p) => p.id === normalized.id);
    if (index > -1) {
      current[index] = normalized;
    } else {
      current.unshift(normalized);
    }
    saveLocalPosts(current);
    return normalized;
  },

  async deleteBlogPost(postId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(postId)) {
      await supabase.from('blog_posts').delete().eq('id', postId);
    }
    const current = getLocalPosts().filter((p) => p.id !== postId);
    saveLocalPosts(current);
  },

  async duplicateBlogPost(postId: string): Promise<BlogPost | null> {
    const current = getLocalPosts();
    const source = current.find((p) => p.id === postId);
    if (!source) return null;

    const suffix = Math.floor(100 + Math.random() * 900);
    const copy: BlogPost = {
      ...source,
      id: `blog-copy-${Date.now()}`,
      title: `${source.title} (copia)`,
      slug: `${source.slug}-copia-${suffix}`,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };

    return this.saveBlogPost(copy);
  },
};
