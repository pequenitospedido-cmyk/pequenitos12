import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryInfo } from '../types/product';

interface CategoryCardProps {
  category: CategoryInfo;
  featuredLarge?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, featuredLarge = false }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/${category.slug}`}
      className={`group relative overflow-hidden rounded-3xl bg-[#F7F3EC] block transition-transform duration-200 hover:-translate-y-0.5 ${
        featuredLarge ? 'md:col-span-2 aspect-16/10' : 'aspect-4/3'
      }`}
    >
      {!imgError ? (
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ backgroundColor: category.softBg }}
        >
          <span className="font-display text-2xl text-[#2D2A26]">{category.name}</span>
        </div>
      )}

      {/* Measured contrast scrim for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col justify-end text-white">
        <h3 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-white">
          {category.name}
        </h3>
        <p className="text-xs sm:text-sm text-white/85 mt-1 line-clamp-2 max-w-md">
          {category.subtitle}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#FACC48] transition-colors">
          <span>Ver colección</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};
