import { supabase, isSupabaseConfigured } from '../supabase';
import { SiteSettings } from '../../types/product';
import { INITIAL_SITE_SETTINGS } from '../../data/products';

const SETTINGS_STORAGE_KEY = 'pequenitos_cms_settings_v2';

function getLocalSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SITE_SETTINGS));
      return INITIAL_SITE_SETTINGS;
    }
    return { ...INITIAL_SITE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}

export const settingsService = {
  async getSettings(): Promise<SiteSettings> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (!error && data) {
        return {
          siteName: data.site_name || INITIAL_SITE_SETTINGS.siteName,
          siteDescription: data.site_description || INITIAL_SITE_SETTINGS.siteDescription,
          contactPerson: INITIAL_SITE_SETTINGS.contactPerson,
          logoUrl: data.logo_url || '',
          faviconUrl: data.favicon_url || '',
          whatsappNumber: data.whatsapp_number || INITIAL_SITE_SETTINGS.whatsappNumber,
          whatsappRaw: data.whatsapp_raw || INITIAL_SITE_SETTINGS.whatsappRaw,
          contactEmail: data.contact_email || INITIAL_SITE_SETTINGS.contactEmail,
          schedule: data.schedule || INITIAL_SITE_SETTINGS.schedule,
          instagramHandle: INITIAL_SITE_SETTINGS.instagramHandle,
          instagramUrl: data.instagram_url || INITIAL_SITE_SETTINGS.instagramUrl,
          facebookUrl: data.facebook_url || INITIAL_SITE_SETTINGS.facebookUrl,
          tiktokHandle: INITIAL_SITE_SETTINGS.tiktokHandle,
          tiktokUrl: data.tiktok_url || INITIAL_SITE_SETTINGS.tiktokUrl,
          seoTitle: data.seo_title || INITIAL_SITE_SETTINGS.seoTitle,
          seoDescription: data.seo_description || INITIAL_SITE_SETTINGS.seoDescription,
          ogImageUrl: data.og_image_url || INITIAL_SITE_SETTINGS.ogImageUrl,
          freeShippingThreshold: Number(
            data.free_shipping_threshold ?? INITIAL_SITE_SETTINGS.freeShippingThreshold
          ),
          standardShippingCost: Number(
            data.standard_shipping_cost ?? INITIAL_SITE_SETTINGS.standardShippingCost
          ),
          announcementText: INITIAL_SITE_SETTINGS.announcementText,
        };
      }
    }
    return getLocalSettings();
  },

  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    const digitsOnly = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const cleanWhatsappRaw = digitsOnly.startsWith('57')
      ? digitsOnly
      : digitsOnly.length === 10
      ? `57${digitsOnly}`
      : digitsOnly || '573052300566';

    const updated: SiteSettings = {
      ...settings,
      whatsappRaw: cleanWhatsappRaw,
    };

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('site_settings').upsert({
        id: 'global',
        site_name: updated.siteName,
        site_description: updated.siteDescription,
        logo_url: updated.logoUrl || null,
        favicon_url: updated.faviconUrl || null,
        whatsapp_number: updated.whatsappNumber,
        whatsapp_raw: updated.whatsappRaw,
        contact_email: updated.contactEmail,
        schedule: updated.schedule,
        instagram_url: updated.instagramUrl,
        facebook_url: updated.facebookUrl,
        tiktok_url: updated.tiktokUrl,
        seo_title: updated.seoTitle,
        seo_description: updated.seoDescription,
        og_image_url: updated.ogImageUrl || null,
        free_shipping_threshold: updated.freeShippingThreshold,
        standard_shipping_cost: updated.standardShippingCost,
      });
    }

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }

    return updated;
  },
};
