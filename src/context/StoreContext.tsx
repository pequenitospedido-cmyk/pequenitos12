import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BlogPost,
  CategoryInfo,
  EditablePageContent,
  HomepageBlock,
  MediaAsset,
  OrderRecord,
  Product,
  SiteSettings,
} from '../types/product';
import {
  CATEGORIES,
  INITIAL_BLOG_POSTS,
  INITIAL_DEMO_ORDERS,
  INITIAL_HOMEPAGE_BLOCKS,
  INITIAL_MEDIA_ASSETS,
  INITIAL_PAGES_CONTENT,
  INITIAL_SITE_SETTINGS,
  PRODUCTS,
  buildDefaultVariantsForProduct,
} from '../data/products';
import {
  blogService,
  categoryService,
  homepageService,
  mediaService,
  orderService,
  pageService,
  productService,
  settingsService,
} from '../lib/catalog';
import { isSupabaseConfigured } from '../lib/supabase';

export interface QuickProductPreset {
  isOpen: boolean;
  category?: string;
  featured?: boolean;
  sectionLabel?: string;
}

interface StoreContextType {
  dataMode: 'DEMO' | 'SUPABASE';
  isLoading: boolean;
  isLiveEditMode: boolean;
  setIsLiveEditMode: (val: boolean) => void;
  quickProductPreset: QuickProductPreset;
  openQuickProductModal: (preset?: Omit<QuickProductPreset, 'isOpen'>) => void;
  closeQuickProductModal: () => void;
  products: Product[];
  publishedProducts: Product[];
  categories: CategoryInfo[];
  activeCategories: CategoryInfo[];
  blogPosts: BlogPost[];
  publishedBlogPosts: BlogPost[];
  siteSettings: SiteSettings;
  publishedHomepageBlocks: HomepageBlock[];
  draftHomepageBlocks: HomepageBlock[];
  mediaAssets: MediaAsset[];
  orders: OrderRecord[];
  pagesContent: EditablePageContent[];
  refreshAll: () => Promise<void>;
  saveProduct: (product: Product) => Promise<Product>;
  deleteProduct: (productId: string) => Promise<void>;
  duplicateProduct: (productId: string) => Promise<Product | null>;
  saveCategory: (category: CategoryInfo) => Promise<CategoryInfo>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveBlogPost: (post: BlogPost) => Promise<BlogPost>;
  deleteBlogPost: (postId: string) => Promise<void>;
  duplicateBlogPost: (postId: string) => Promise<BlogPost | null>;
  uploadMedia: (
    file: File,
    options: {
      bucket: 'product-images' | 'brand-assets';
      folder: 'productos' | 'logo' | 'banners' | 'paginas';
      preserveFormat?: boolean;
    }
  ) => Promise<MediaAsset>;
  deleteMedia: (assetId: string) => Promise<void>;
  saveSiteSettings: (settings: SiteSettings) => Promise<SiteSettings>;
  saveDraftHomepageBlocks: (blocks: HomepageBlock[]) => Promise<HomepageBlock[]>;
  publishHomepageBlocks: (blocks: HomepageBlock[]) => Promise<HomepageBlock[]>;
  createOrder: (order: Omit<OrderRecord, 'id' | 'createdAt'>) => Promise<OrderRecord>;
  savePageContent: (page: EditablePageContent) => Promise<EditablePageContent>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveEditMode, setIsLiveEditMode] = useState(false);
  const [quickProductPreset, setQuickProductPreset] = useState<QuickProductPreset>({
    isOpen: false,
  });

  const openQuickProductModal = (preset?: Omit<QuickProductPreset, 'isOpen'>) => {
    setQuickProductPreset({
      isOpen: true,
      category: preset?.category || 'mamelucos',
      featured: preset?.featured ?? true,
      sectionLabel: preset?.sectionLabel || 'Catálogo Pequeñitos',
    });
  };

  const closeQuickProductModal = () => {
    setQuickProductPreset({ isOpen: false });
  };
  const [products, setProducts] = useState<Product[]>(() =>
    PRODUCTS.map((p, idx) => ({
      ...p,
      status: p.status || 'published',
      sortOrder: p.sortOrder ?? idx + 1,
      variants: buildDefaultVariantsForProduct(p),
    }))
  );
  const [categories, setCategories] = useState<CategoryInfo[]>(() =>
    CATEGORIES.map((c, idx) => ({
      ...c,
      sortOrder: idx + 1,
      status: 'active',
    }))
  );
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [publishedHomepageBlocks, setPublishedHomepageBlocks] =
    useState<HomepageBlock[]>(INITIAL_HOMEPAGE_BLOCKS);
  const [draftHomepageBlocks, setDraftHomepageBlocks] =
    useState<HomepageBlock[]>(INITIAL_HOMEPAGE_BLOCKS);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(INITIAL_MEDIA_ASSETS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_DEMO_ORDERS);
  const [pagesContent, setPagesContent] = useState<EditablePageContent[]>(INITIAL_PAGES_CONTENT);

  const dataMode: 'DEMO' | 'SUPABASE' = isSupabaseConfigured() ? 'SUPABASE' : 'DEMO';

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const [
        loadedProducts,
        loadedCategories,
        loadedBlogPosts,
        loadedSettings,
        loadedPubBlocks,
        loadedDraftBlocks,
        loadedMedia,
        loadedOrders,
        loadedPages,
      ] = await Promise.all([
        productService.listAll(),
        categoryService.listAll(),
        blogService.listAll(),
        settingsService.getSettings(),
        homepageService.getPublishedBlocks(),
        homepageService.getDraftBlocks(),
        mediaService.listAll(),
        orderService.listOrders(),
        pageService.listPages(),
      ]);

      setProducts(loadedProducts);
      setCategories(loadedCategories);
      setBlogPosts(loadedBlogPosts);
      setSiteSettings(loadedSettings);
      setPublishedHomepageBlocks(loadedPubBlocks);
      setDraftHomepageBlocks(loadedDraftBlocks);
      setMediaAssets(loadedMedia);
      setOrders(loadedOrders);
      setPagesContent(loadedPages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Dynamically update favicon when configured in siteSettings
  useEffect(() => {
    if (siteSettings.faviconUrl) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = siteSettings.faviconUrl;
    }
  }, [siteSettings.faviconUrl]);

  const publishedProducts = useMemo(
    () =>
      products
        .filter((p) => !p.status || p.status === 'published')
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [products]
  );

  const activeCategories = useMemo(
    () =>
      categories
        .filter((c) => !c.status || c.status === 'active')
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [categories]
  );

  const publishedBlogPosts = useMemo(
    () =>
      blogPosts
        .filter((b) => !b.status || b.status === 'published')
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [blogPosts]
  );

  const saveProduct = async (product: Product) => {
    const saved = await productService.saveProduct(product);
    const updatedList = await productService.listAll();
    setProducts(updatedList);
    return saved;
  };

  const deleteProduct = async (productId: string) => {
    await productService.deleteProduct(productId);
    const updatedList = await productService.listAll();
    setProducts(updatedList);
  };

  const duplicateProduct = async (productId: string) => {
    const copy = await productService.duplicateProduct(productId);
    const updatedList = await productService.listAll();
    setProducts(updatedList);
    return copy;
  };

  const saveCategory = async (category: CategoryInfo) => {
    const saved = await categoryService.saveCategory(category);
    const updatedList = await categoryService.listAll();
    setCategories(updatedList);
    return saved;
  };

  const deleteCategory = async (categoryId: string) => {
    await categoryService.deleteCategory(categoryId);
    const updatedList = await categoryService.listAll();
    setCategories(updatedList);
  };

  const saveBlogPost = async (post: BlogPost) => {
    const saved = await blogService.saveBlogPost(post);
    const updatedList = await blogService.listAll();
    setBlogPosts(updatedList);
    return saved;
  };

  const deleteBlogPost = async (postId: string) => {
    await blogService.deleteBlogPost(postId);
    const updatedList = await blogService.listAll();
    setBlogPosts(updatedList);
  };

  const duplicateBlogPost = async (postId: string) => {
    const copy = await blogService.duplicateBlogPost(postId);
    const updatedList = await blogService.listAll();
    setBlogPosts(updatedList);
    return copy;
  };

  const uploadMedia = async (
    file: File,
    options: {
      bucket: 'product-images' | 'brand-assets';
      folder: 'productos' | 'logo' | 'banners' | 'paginas';
      preserveFormat?: boolean;
    }
  ) => {
    const asset = await mediaService.uploadImage(file, options);
    const updatedMedia = await mediaService.listAll();
    setMediaAssets(updatedMedia);
    return asset;
  };

  const deleteMedia = async (assetId: string) => {
    await mediaService.deleteMedia(assetId);
    const updatedMedia = await mediaService.listAll();
    setMediaAssets(updatedMedia);
  };

  const saveSiteSettings = async (settings: SiteSettings) => {
    const saved = await settingsService.saveSettings(settings);
    setSiteSettings(saved);
    return saved;
  };

  const saveDraftHomepageBlocks = async (blocks: HomepageBlock[]) => {
    const saved = await homepageService.saveDraftBlocks(blocks);
    setDraftHomepageBlocks(saved);
    return saved;
  };

  const publishHomepageBlocks = async (blocks: HomepageBlock[]) => {
    const published = await homepageService.publishBlocks(blocks);
    setPublishedHomepageBlocks(published);
    setDraftHomepageBlocks(published);
    return published;
  };

  const createOrder = async (order: Omit<OrderRecord, 'id' | 'createdAt'>) => {
    const created = await orderService.createOrder(order);
    const updatedOrders = await orderService.listOrders();
    setOrders(updatedOrders);
    return created;
  };

  const savePageContent = async (page: EditablePageContent) => {
    const saved = await pageService.savePage(page);
    const updatedPages = await pageService.listPages();
    setPagesContent(updatedPages);
    return saved;
  };

  return (
    <StoreContext.Provider
      value={{
        dataMode,
        isLoading,
        isLiveEditMode,
        setIsLiveEditMode,
        quickProductPreset,
        openQuickProductModal,
        closeQuickProductModal,
        products,
        publishedProducts,
        categories,
        activeCategories,
        blogPosts,
        publishedBlogPosts,
        siteSettings,
        publishedHomepageBlocks,
        draftHomepageBlocks,
        mediaAssets,
        orders,
        pagesContent,
        refreshAll,
        saveProduct,
        deleteProduct,
        duplicateProduct,
        saveCategory,
        deleteCategory,
        saveBlogPost,
        deleteBlogPost,
        duplicateBlogPost,
        uploadMedia,
        deleteMedia,
        saveSiteSettings,
        saveDraftHomepageBlocks,
        publishHomepageBlocks,
        createOrder,
        savePageContent,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore debe utilizarse dentro de un StoreProvider');
  }
  return ctx;
};
