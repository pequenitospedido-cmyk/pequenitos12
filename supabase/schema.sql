-- ============================================================================
-- PEQUEÑITOS — Esquema Completo de Base de Datos para Supabase (PostgreSQL)
-- Incluye: Tablas, Relaciones, Índices, Triggers updated_at, Storage Buckets y RLS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Función automática para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. PROFILES (Administradores vinculados a auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función helper para verificar si el usuario autenticado es administrador
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'editor')
      )
      OR NOT EXISTS (SELECT 1 FROM public.profiles)
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image TEXT,
  accent_color TEXT DEFAULT '#4FA6EE',
  soft_bg TEXT DEFAULT '#EBF5FD',
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_status_order ON public.categories(status, sort_order);

CREATE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  short_description TEXT NOT NULL DEFAULT '',
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(12, 2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category_slug TEXT NOT NULL DEFAULT 'mamelucos',
  sku TEXT,
  age_range TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_gift BOOLEAN NOT NULL DEFAULT FALSE,
  badge TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'hidden', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  materials TEXT,
  care_instructions TEXT[] DEFAULT '{}',
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 12,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category_slug ON public.products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_sort_order ON public.products(sort_order);

CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. PRODUCT_VARIANTS (Control de inventario por talla, color, SKU y precio opcional)
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL DEFAULT '#A9D6F5',
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  price NUMERIC(12, 2),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);

CREATE TRIGGER trg_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. PRODUCT_IMAGES (Galería ordenada del producto; la posición 0 es la imagen principal)
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id, sort_order);

-- 6. HOMEPAGE_SECTIONS (Bloques estilo Gutenberg con soporte draft y published)
CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id TEXT PRIMARY KEY,
  block_type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  button_text TEXT,
  button_link TEXT,
  secondary_button_text TEXT,
  secondary_button_link TEXT,
  image_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  config JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_sections_order ON public.homepage_sections(sort_order);

CREATE TRIGGER trg_homepage_sections_updated_at
BEFORE UPDATE ON public.homepage_sections
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. SITE_SETTINGS (Identidad de marca, Logo, WhatsApp, Contacto, Redes, SEO)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  site_name TEXT NOT NULL DEFAULT 'PEQUEÑITOS',
  site_description TEXT NOT NULL DEFAULT 'Ropita para pequeños momentos grandes.',
  logo_url TEXT,
  favicon_url TEXT,
  contact_person TEXT NOT NULL DEFAULT 'Milena Vargas',
  whatsapp_number TEXT NOT NULL DEFAULT '305 230 0566',
  whatsapp_raw TEXT NOT NULL DEFAULT '573052300566',
  contact_email TEXT NOT NULL DEFAULT 'pequenitospedido@gmail.com',
  schedule TEXT NOT NULL DEFAULT 'Lunes a Sábado: 8:30 a.m. – 6:30 p.m.',
  instagram_url TEXT DEFAULT 'https://instagram.com/pequenitos_colombia',
  facebook_url TEXT DEFAULT 'https://facebook.com/pequenitoscolombia',
  tiktok_url TEXT DEFAULT 'https://tiktok.com/@pequenitoscolombia',
  seo_title TEXT NOT NULL DEFAULT 'Pequeñitos — Ropa para Bebés y Niños en Colombia',
  seo_description TEXT NOT NULL DEFAULT 'Ropita para pequeños momentos grandes. Descubre mamelucos para bebé, conjuntos, camisetas para niños y regalos para recién nacido con envíos a toda Colombia.',
  og_image_url TEXT,
  free_shipping_threshold NUMERIC(12, 2) NOT NULL DEFAULT 120000,
  standard_shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 12900,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. BLOG_POSTS (Artículos de contenido de valor para posicionamiento SEO)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'Consejos para Bebés',
  author TEXT NOT NULL DEFAULT 'Milena Vargas',
  read_time TEXT NOT NULL DEFAULT '4 min de lectura',
  published_at TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  seo_title TEXT,
  seo_description TEXT,
  focus_keyword TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'hidden')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_order ON public.blog_posts(status, sort_order);

-- 9. PAGES (Páginas editables como Nosotros, Guía de Tallas, Contacto)
CREATE TABLE IF NOT EXISTS public.pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_image TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. MEDIA (Biblioteca multimedia: productos, logo, banners, páginas)
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'product-images',
  storage_path TEXT,
  folder TEXT NOT NULL DEFAULT 'productos' CHECK (folder IN ('productos', 'logo', 'banners', 'paginas')),
  mime_type TEXT,
  size_bytes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media(folder, created_at DESC);

-- 9. ORDERS & ORDER_ITEMS (Preparado para pasarelas de pago Wompi, Mercado Pago, PayU)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_department TEXT NOT NULL,
  notes TEXT,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_gateway TEXT DEFAULT 'wompi',
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled' CHECK (fulfillment_status IN ('unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  variant_size TEXT,
  variant_color TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  line_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Lectura Pública (Visitantes de la tienda solo ven contenido publicado / activo)
CREATE POLICY "Public can read active categories"
  ON public.categories FOR SELECT
  USING (status = 'active' OR public.is_admin());

CREATE POLICY "Public can read published products"
  ON public.products FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Public can read product variants"
  ON public.product_variants FOR SELECT
  USING (true);

CREATE POLICY "Public can read product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Public can read homepage sections"
  ON public.homepage_sections FOR SELECT
  USING (true);

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public can read published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Public can read pages"
  ON public.pages FOR SELECT
  USING (true);

CREATE POLICY "Public can read media"
  ON public.media FOR SELECT
  USING (true);

-- Creación pública de pedidos desde Checkout
CREATE POLICY "Public can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

-- Permisos Totales para Administradores Autenticados
CREATE POLICY "Admins full access profiles"
  ON public.profiles FOR ALL
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins full access categories"
  ON public.categories FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access products"
  ON public.products FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access product_images"
  ON public.product_images FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access homepage_sections"
  ON public.homepage_sections FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access site_settings"
  ON public.site_settings FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access blog_posts"
  ON public.blog_posts FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access pages"
  ON public.pages FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access media"
  ON public.media FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access orders"
  ON public.orders FOR ALL
  USING (public.is_admin());

CREATE POLICY "Admins full access order_items"
  ON public.order_items FOR ALL
  USING (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS (product-images & brand-assets)
-- ============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('product-images', 'brand-assets'));

CREATE POLICY "Admins upload access storage"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id IN ('product-images', 'brand-assets') AND auth.role() = 'authenticated');

CREATE POLICY "Admins update access storage"
  ON storage.objects FOR UPDATE
  USING (bucket_id IN ('product-images', 'brand-assets') AND auth.role() = 'authenticated');

CREATE POLICY "Admins delete access storage"
  ON storage.objects FOR DELETE
  USING (bucket_id IN ('product-images', 'brand-assets') AND auth.role() = 'authenticated');
