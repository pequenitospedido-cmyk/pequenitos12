import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductGrid } from './ProductGrid';
import { useStore } from '../context/StoreContext';
import { HomepageBlock } from '../types/product';

interface FeaturedProductsProps {
  block?: HomepageBlock;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ block }) => {
  const { publishedProducts } = useStore();
  const featured = publishedProducts.filter((p) => p.featured).slice(0, 8);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-medium text-[#6E685F]">
              {block?.subtitle || 'Selección especial'}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1">
              {block?.title || 'Los favoritos de nuestros Pequeñitos'}
            </h2>
          </div>

          <Link
            to={block?.buttonLink || '/tienda'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors whitespace-nowrap"
          >
            <span>{block?.buttonText || 'Ver toda la tienda'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid
          products={featured}
          quickAddCategory="mamelucos"
          quickAddFeatured={true}
          quickAddLabel={block?.title || 'Los favoritos de nuestros Pequeñitos'}
        />
      </div>
    </section>
  );
};
