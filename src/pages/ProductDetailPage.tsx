import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ProductDetail } from '../components/ProductDetail';
import { ProductGrid } from '../components/ProductGrid';
import { SEOHead } from '../components/SEOHead';
import { useStore } from '../context/StoreContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { publishedProducts, categories } = useStore();
  const product = publishedProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-display text-3xl text-[#2D2A26]">Prenda no encontrada</h1>
        <p className="text-sm text-[#6E685F]">
          La prenda que buscas no está disponible públicamente en este momento.
        </p>
        <Link
          to="/tienda"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la tienda</span>
        </Link>
      </div>
    );
  }

  const categoryObj = categories.find((c) => c.slug === product.category);
  const relatedProducts = publishedProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, 4);

  return (
    <div className="py-6 md:py-10">
      <SEOHead
        title={`${product.name} — Pequeñitos`}
        description={product.shortDescription}
        product={product}
        breadcrumbs={[
          { name: 'Tienda', path: '/tienda' },
          {
            name: categoryObj?.name || 'Colección',
            path: `/${product.category}`,
          },
          { name: product.name, path: `/producto/${product.slug}` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Tienda', path: '/tienda' },
            {
              name: categoryObj?.name || 'Colección',
              path: `/${product.category}`,
            },
            { name: product.name },
          ]}
        />

        <div className="mt-4">
          <ProductDetail product={product} />
        </div>

        {/* Related Products Section */}
        <section className="mt-16 pt-12 border-t border-black/6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-medium text-[#6E685F]">Combina perfecto con</p>
              <h2 className="font-display text-2xl font-semibold text-[#2D2A26] mt-1">
                También te puede gustar
              </h2>
            </div>
            <Link
              to={`/${product.category}`}
              className="text-xs sm:text-sm font-semibold text-[#4FA6EE] hover:underline"
            >
              Ver más en {categoryObj?.name || 'la tienda'}
            </Link>
          </div>

          <ProductGrid products={relatedProducts} />
        </section>
      </div>
    </div>
  );
};
