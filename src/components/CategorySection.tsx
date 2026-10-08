import React from 'react';
import { CategoryCard } from './CategoryCard';
import { useStore } from '../context/StoreContext';
import { HomepageBlock } from '../types/product';

interface CategorySectionProps {
  block?: HomepageBlock;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ block }) => {
  const { activeCategories } = useStore();

  const mainCategories = activeCategories
    .filter((c) => c.slug !== 'novedades')
    .slice(0, 5);

  return (
    <section className="py-14 md:py-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-medium text-[#6E685F]">
              {block?.subtitle || 'Categorías Pequeñitos'}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26] mt-1">
              {block?.title || 'Explora Pequeñitos'}
            </h2>
          </div>
          <p className="text-sm text-[#6E685F] max-w-md">
            {block?.description ||
              'Prendas suaves y versátiles organizadas para que encuentres fácilmente lo que tu bebé o niño necesita hoy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mainCategories.map((cat, idx) => (
            <CategoryCard key={cat.id} category={cat} featuredLarge={idx === 0} />
          ))}
        </div>
      </div>
    </section>
  );
};
