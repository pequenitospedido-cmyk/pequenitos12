export type CategorySlug =
  | 'mamelucos'
  | 'camisetas'
  | 'conjuntos'
  | 'regalos'
  | string;

export type SizeOption =
  | '0-3M'
  | '3-6M'
  | '6-12M'
  | '12-18M'
  | '18-24M'
  | '2T'
  | '3T'
  | '4T'
  | '5T'
  | '6T';

export type AgeRange =
  | '0-3 meses'
  | '3-6 meses'
  | '6-12 meses'
  | '12-18 meses'
  | '18-24 meses'
  | '2-3 años'
  | '3-4 años'
  | '4-5 años'
  | '5-6 años';

export type ProductStatus = 'published' | 'draft' | 'hidden' | 'archived';

export type PaymentMethodType = 'nequi' | 'transferencia' | 'otro';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  size: SizeOption;
  colorName: string;
  colorHex: string;
  stock: number;
  sku: string;
  price?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice?: number;
  compareAtPrice?: number;
  category: CategorySlug;
  categoryId?: string;
  sku?: string;
  sizes: SizeOption[];
  colors: ProductColor[];
  variants?: ProductVariant[];
  images: string[];
  featured: boolean;
  new: boolean;
  isGift?: boolean;
  badge?: string;
  stock: number;
  status?: ProductStatus;
  sortOrder?: number;
  ageRange: AgeRange[];
  rating?: number;
  reviewsCount?: number;
  materials?: string;
  careInstructions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInfo {
  id: string;
  slug: CategorySlug;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  accentColor: string;
  softBg: string;
  sortOrder?: number;
  status?: 'active' | 'hidden';
}

export interface SizeGuideRow {
  age: AgeRange;
  sizeCode: SizeOption;
  heightCm: string;
  weightKg: string;
  stageTip: string;
}

export interface CartItem {
  product: Product;
  selectedSize: SizeOption;
  selectedColor: ProductColor;
  quantity: number;
}

export type HomepageBlockType =
  | 'hero'
  | 'benefits'
  | 'categories'
  | 'featured_products'
  | 'promo_banner'
  | 'mamelucos_section'
  | 'blog_section'
  | 'gifts_section'
  | 'size_guide'
  | 'newsletter'
  | 'custom_products'
  | 'custom_text'
  | 'whatsapp_cta';

export interface HomepageBlock {
  id: string;
  type: HomepageBlockType;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl?: string;
  categoryFilter?: string;
  bgColor?: string;
  visible: boolean;
  sortOrder: number;
  status: 'published' | 'draft';
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactPerson: string;
  logoUrl: string;
  faviconUrl: string;
  whatsappNumber: string;
  whatsappRaw: string;
  contactEmail: string;
  schedule: string;
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  tiktokUrl: string;
  tiktokHandle: string;
  seoTitle: string;
  seoDescription: string;
  ogImageUrl: string;
  freeShippingThreshold: number;
  standardShippingCost: number;
  announcementText: string;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  bucket: 'product-images' | 'brand-assets';
  folder: 'productos' | 'logo' | 'banners' | 'paginas';
  mimeType: string;
  sizeBytes?: number;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  department: string;
  notes?: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentGateway: PaymentMethodType | string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  fulfillmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  itemsCount: number;
  createdAt: string;
  isDemo?: boolean;
}

export interface EditablePageContent {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  quote?: string;
  body: string;
  imageUrl: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

export type BlogPostStatus = 'published' | 'draft' | 'hidden';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  author: string;
  readTime: string;
  publishedAt: string;
  image: string;
  tags?: string[];
  focusKeyword?: string;
  seoTitle?: string;
  seoDescription?: string;
  featured?: boolean;
  status?: BlogPostStatus;
  sortOrder?: number;
  updatedAt?: string;
}
