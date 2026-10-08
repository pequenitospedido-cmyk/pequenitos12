import React, { useEffect } from 'react';
import { BlogPost, Product } from '../types/product';
import { useStore } from '../context/StoreContext';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  product?: Product;
  blogPost?: BlogPost;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  breadcrumbs,
  product,
  blogPost,
}) => {
  const { siteSettings } = useStore();

  const resolvedTitle =
    (blogPost?.seoTitle || title) || siteSettings.seoTitle;
  const resolvedDescription =
    (blogPost?.seoDescription || description) || siteSettings.seoDescription;

  useEffect(() => {
    const fullTitle = resolvedTitle.includes('Pequeñitos')
      ? resolvedTitle
      : `${resolvedTitle} | ${siteSettings.siteName || 'Pequeñitos'} Colombia`;
    document.title = fullTitle;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    setMeta('meta[name="description"]', resolvedDescription);
    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', resolvedDescription);
    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', resolvedDescription);

    if (blogPost && (blogPost.focusKeyword || (blogPost.tags && blogPost.tags.length > 0))) {
      let kwMeta = document.querySelector('meta[name="keywords"]');
      if (!kwMeta) {
        kwMeta = document.createElement('meta');
        kwMeta.setAttribute('name', 'keywords');
        document.head.appendChild(kwMeta);
      }
      const keywordsList = [
        ...(blogPost.focusKeyword ? [blogPost.focusKeyword] : []),
        ...(blogPost.tags || []),
      ].join(', ');
      kwMeta.setAttribute('content', keywordsList);
    }

    const ogTargetImage = blogPost?.image || siteSettings.ogImageUrl;
    if (ogTargetImage) {
      let ogImg = document.querySelector('meta[property="og:image"]');
      if (!ogImg) {
        ogImg = document.createElement('meta');
        ogImg.setAttribute('property', 'og:image');
        document.head.appendChild(ogImg);
      }
      ogImg.setAttribute('content', ogTargetImage);
    }

    // Dynamic Canonical tag
    if (typeof window !== 'undefined') {
      let canonical = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.origin + window.location.pathname;
    }
  }, [resolvedTitle, resolvedDescription, siteSettings.siteName, siteSettings.ogImageUrl, blogPost]);

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://pequenitos.co';

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((item, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            name: item.name,
            item: `${origin}${item.path}`,
          })),
        }
      : null;

  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.images.map((img) => (img.startsWith('http') ? img : `${origin}${img}`)),
        sku: product.sku || product.id,
        brand: {
          '@type': 'Brand',
          name: siteSettings.siteName || 'Pequeñitos',
        },
        offers: {
          '@type': 'Offer',
          url: `${origin}/producto/${product.slug}`,
          priceCurrency: 'COP',
          price: product.price,
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        ...(product.rating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: product.rating,
                reviewCount: product.reviewsCount || 15,
              },
            }
          : {}),
      }
    : null;

  const blogPostingSchema = blogPost
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogPost.seoTitle || blogPost.title,
        description: blogPost.seoDescription || blogPost.excerpt,
        image: blogPost.image.startsWith('http') ? blogPost.image : `${origin}${blogPost.image}`,
        author: {
          '@type': 'Person',
          name: blogPost.author || siteSettings.contactPerson || 'Milena Vargas',
        },
        publisher: {
          '@type': 'Organization',
          name: siteSettings.siteName || 'Pequeñitos',
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${origin}/blog/${blogPost.slug}`,
        },
        keywords: [
          ...(blogPost.focusKeyword ? [blogPost.focusKeyword] : []),
          ...(blogPost.tags || []),
        ].join(', '),
        articleSection: blogPost.category,
        articleBody: blogPost.content.join('\n\n'),
      }
    : null;

  return (
    <>
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {blogPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
        />
      )}
    </>
  );
};
