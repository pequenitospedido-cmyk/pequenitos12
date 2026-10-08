/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BlogPage } from './pages/BlogPage';

// Private CMS / Admin Routes (Not linked in the public navigation menu)
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductEditorPage } from './pages/admin/AdminProductEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBlogPage } from './pages/admin/AdminBlogPage';
import { AdminBlogEditorPage } from './pages/admin/AdminBlogEditorPage';
import { AdminHomeEditorPage } from './pages/admin/AdminHomeEditorPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminPagesEditorPage } from './pages/admin/AdminPagesEditorPage';
import { AdminLiveToolbar } from './components/admin/AdminLiveToolbar';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const PublicStorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#2D2A26]">
      <AdminLiveToolbar />
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AdminAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Private Admin CMS Routes (/admin) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="productos" element={<AdminProductsPage />} />
                <Route path="productos/nuevo" element={<AdminProductEditorPage />} />
                <Route path="productos/:id" element={<AdminProductEditorPage />} />
                <Route path="categorias" element={<AdminCategoriesPage />} />
                <Route path="blog" element={<AdminBlogPage />} />
                <Route path="blog/nuevo" element={<AdminBlogEditorPage />} />
                <Route path="blog/:id" element={<AdminBlogEditorPage />} />
                <Route path="pedidos" element={<AdminOrdersPage />} />
                <Route path="paginas" element={<AdminPagesEditorPage />} />
                <Route path="inicio" element={<AdminHomeEditorPage />} />
                <Route path="media" element={<AdminMediaPage />} />
                <Route path="configuracion" element={<AdminSettingsPage />} />
              </Route>

              {/* Public Storefront Routes */}
              <Route element={<PublicStorefrontLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/tienda" element={<ShopPage />} />
                <Route path="/mamelucos" element={<ShopPage presetCategory="mamelucos" />} />
                <Route path="/camisetas" element={<ShopPage presetCategory="camisetas" />} />
                <Route path="/conjuntos" element={<ShopPage presetCategory="conjuntos" />} />
                <Route path="/regalos" element={<ShopPage presetCategory="regalos" />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPage />} />
                <Route path="/producto/:slug" element={<ProductDetailPage />} />
                <Route path="/guia-de-tallas" element={<SizeGuidePage />} />
                <Route path="/nosotros" element={<AboutPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="*" element={<ShopPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AdminAuthProvider>
    </StoreProvider>
  );
}
