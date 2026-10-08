import { supabase, isSupabaseConfigured } from '../supabase';
import { MediaAsset } from '../../types/product';
import { INITIAL_MEDIA_ASSETS } from '../../data/products';
import { optimizeImageFile } from '../imageOptimizer';

const MEDIA_STORAGE_KEY = 'pequenitos_cms_media_v1';

function getLocalMedia(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(INITIAL_MEDIA_ASSETS));
      return INITIAL_MEDIA_ASSETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MEDIA_ASSETS;
  }
}

function saveLocalMedia(assets: MediaAsset[]): void {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(assets));
  } catch {
    // Ignore quota errors
  }
}

export const mediaService = {
  async listAll(): Promise<MediaAsset[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          name: row.name,
          url: row.url,
          bucket: row.bucket || 'product-images',
          folder: row.folder || 'productos',
          mimeType: row.mime_type || 'image/webp',
          sizeBytes: row.size_bytes,
          createdAt: row.created_at,
        }));
      }
    }
    return getLocalMedia();
  },

  async uploadImage(
    file: File,
    options: {
      bucket: 'product-images' | 'brand-assets';
      folder: 'productos' | 'logo' | 'banners' | 'paginas';
      preserveFormat?: boolean;
    }
  ): Promise<MediaAsset> {
    const optimized = await optimizeImageFile(file, {
      maxWidth: options.bucket === 'brand-assets' ? 800 : 1400,
      maxHeight: options.bucket === 'brand-assets' ? 800 : 1400,
      preserveFormat: options.preserveFormat || options.bucket === 'brand-assets',
    });

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const filePath = `${options.folder}/${Date.now()}-${cleanName}`;
    let finalUrl = optimized.dataUrl;

    if (isSupabaseConfigured() && supabase) {
      const { error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, optimized.blob, {
          contentType: optimized.mimeType,
          upsert: true,
        });

      if (!uploadError) {
        const { data: pubData } = supabase.storage.from(options.bucket).getPublicUrl(filePath);
        if (pubData?.publicUrl) {
          finalUrl = pubData.publicUrl;
        }
      }

      await supabase.from('media').insert({
        name: file.name,
        url: finalUrl,
        bucket: options.bucket,
        storage_path: filePath,
        folder: options.folder,
        mime_type: optimized.mimeType,
        size_bytes: optimized.sizeBytes,
      });
    }

    const newAsset: MediaAsset = {
      id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: file.name,
      url: finalUrl,
      bucket: options.bucket,
      folder: options.folder,
      mimeType: optimized.mimeType,
      sizeBytes: optimized.sizeBytes,
      createdAt: new Date().toISOString(),
    };

    const current = getLocalMedia();
    current.unshift(newAsset);
    saveLocalMedia(current);

    return newAsset;
  },

  async deleteMedia(assetId: string): Promise<void> {
    if (isSupabaseConfigured() && supabase && /^[0-9a-f]{8}-[0-9a-f]{4}/i.test(assetId)) {
      await supabase.from('media').delete().eq('id', assetId);
    }
    const current = getLocalMedia().filter((m) => m.id !== assetId);
    saveLocalMedia(current);
  },
};
