import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  MessageCircle,
  Search,
  Tag,
  User,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';

export const BlogPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const { publishedBlogPosts, siteSettings } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(publishedBlogPosts.map((p) => p.category))).filter(Boolean);
    return ['Todas', ...unique];
  }, [publishedBlogPosts]);

  const filteredPosts = useMemo(() => {
    return publishedBlogPosts.filter((post) => {
      if (selectedCategory !== 'Todas' && post.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(q);
        const inExcerpt = post.excerpt.toLowerCase().includes(q);
        const inTags = (post.tags || []).some((t) => t.toLowerCase().includes(q));
        const inKeyword = (post.focusKeyword || '').toLowerCase().includes(q);
        if (!inTitle && !inExcerpt && !inTags && !inKeyword) return false;
      }
      return true;
    });
  }, [publishedBlogPosts, selectedCategory, searchQuery]);

  const activePost = slug
    ? publishedBlogPosts.find((post) => post.slug === slug)
    : undefined;

  const whatsappConsultUrl = `https://wa.me/${siteSettings.whatsappRaw || '573052300566'}?text=${encodeURIComponent(
    'Hola Milena, estuve leyendo el Blog de Pequeñitos y me gustaría hacerte una consulta.'
  )}`;

  // Single Blog Article View (/blog/:slug) — Pure Value Content & SEO
  if (slug && activePost) {
    const relatedPosts = publishedBlogPosts
      .filter((p) => p.id !== activePost.id)
      .slice(0, 2);

    return (
      <div className="py-6 md:py-12">
        <SEOHead
          title={activePost.seoTitle || `${activePost.title} — Blog Pequeñitos`}
          description={activePost.seoDescription || activePost.excerpt}
          blogPost={activePost}
          breadcrumbs={[
            { name: 'Blog', path: '/blog' },
            { name: activePost.title, path: `/blog/${activePost.slug}` },
          ]}
        />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { name: 'Blog Pequeñitos', path: '/blog' },
              { name: activePost.title },
            ]}
          />

          <div className="mt-4 mb-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E685F] hover:text-[#2D2A26] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a todos los artículos del Blog</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-black/6 shadow-xs">
            <div className="aspect-16/9 bg-[#F7F3EC] overflow-hidden">
              <img
                src={activePost.image}
                alt={activePost.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 sm:p-10 lg:p-12 space-y-6">
              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#6E685F]">
                <span className="px-3 py-1 rounded-full bg-[#EBF5FD] text-[#4FA6EE] font-semibold">
                  {activePost.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#F48B7B]" />
                  <span>Por {activePost.author || siteSettings.contactPerson || 'Milena Vargas'}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#53C59B]" />
                  <span>{activePost.readTime}</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#4FA6EE]" />
                  <span>{activePost.publishedAt}</span>
                </span>
              </div>

              {/* H1 Title */}
              <h1 className="font-display text-2xl sm:text-4xl font-semibold text-[#2D2A26] leading-tight">
                {activePost.title}
              </h1>

              {/* Lead Excerpt */}
              <p className="text-base sm:text-lg text-[#6E685F] font-medium leading-relaxed border-l-4 border-[#4FA6EE] pl-4">
                {activePost.excerpt}
              </p>

              {/* Editorial Body Paragraphs */}
              <div className="space-y-4 pt-2 text-sm sm:text-base text-[#2D2A26]/90 leading-relaxed">
                {activePost.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* SEO Tags */}
              {activePost.tags && activePost.tags.length > 0 && (
                <div className="pt-4 border-t border-black/6 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E685F]">
                    <Tag className="w-3.5 h-3.5 text-[#4FA6EE]" />
                    <span>Temas relacionados:</span>
                  </span>
                  {activePost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-[#F7F3EC] text-xs font-medium text-[#2D2A26]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Author Editorial Box */}
              <div className="mt-8 p-6 rounded-2xl bg-[#FDFBF7] border border-black/8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#53C59B]">
                    Contenido educativo por {activePost.author || siteSettings.contactPerson || 'Milena Vargas'}
                  </p>
                  <h3 className="font-display text-lg font-semibold text-[#2D2A26]">
                    ¿Tienes alguna duda sobre el cuidado o la etapa de tu bebé?
                  </h3>
                  <p className="text-xs text-[#6E685F]">
                    Escríbenos directamente por WhatsApp ({siteSettings.whatsappNumber}) y conversamos contigo.
                  </p>
                </div>

                <a
                  href={whatsappConsultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-[#25D366] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-colors shrink-0 shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Escribir a Milena</span>
                </a>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 space-y-6">
              <h2 className="font-display text-2xl font-semibold text-[#2D2A26]">
                Continúa leyendo en nuestro Blog
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-white rounded-3xl overflow-hidden border border-black/6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-16/9 bg-[#F7F3EC] overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 space-y-2.5">
                        <span className="text-xs font-semibold text-[#4FA6EE]">
                          {post.category} · {post.readTime}
                        </span>
                        <h3 className="font-display text-lg font-semibold text-[#2D2A26] group-hover:text-[#4FA6EE] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[#6E685F] line-clamp-2 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-[#2D2A26]">
                      <span>Leer artículo completo</span>
                      <ArrowRight className="w-4 h-4 text-[#4FA6EE] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  // Blog Index View (/blog) — Pure Educational & SEO Value Content
  return (
    <div className="py-6 md:py-12">
      <SEOHead
        title="Blog Pequeñitos — Guías de Cuidado del Bebé, Consejos y Maternidad"
        description="Artículos educativos, consejos prácticos para mamás y papás, cuidado de la piel del recién nacido y bienestar infantil en Colombia por Milena Vargas."
        breadcrumbs={[{ name: 'Blog Pequeñitos', path: '/blog' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: 'Blog Pequeñitos' }]} />

        {/* Editorial Hero Header (No Product Pitch — Pure Value Content) */}
        <div className="rounded-3xl bg-[#EBF5FD] border border-[#4FA6EE]/15 p-7 sm:p-12 mt-2 mb-8 space-y-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#4FA6EE]">
              <BookOpen className="w-4 h-4" />
              <span>
                Espacio Educativo Pequeñitos · Escrito por {siteSettings.contactPerson || 'Milena Vargas'}
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#2D2A26]">
              Guías y consejos prácticos para acompañar el crecimiento de tu bebé
            </h1>
            <p className="text-sm sm:text-base text-[#6E685F] leading-relaxed">
              Un rincón creado para compartir información de valor con las familias en Colombia:
              cuidado de la piel sensible, lavado de prendas de algodón, etapas de desarrollo y
              recomendaciones para los primeros meses en casa.
            </p>
          </div>

          {/* Search & Topic Filters */}
          <div className="pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {categories.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#2D2A26] text-white'
                        : 'bg-white text-[#6E685F] hover:text-[#2D2A26]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tema o consejo..."
                className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-black/10 text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
              />
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-black/6 space-y-3">
            <p className="font-display text-xl text-[#2D2A26]">
              No encontramos artículos con ese criterio.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Todas');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold cursor-pointer"
            >
              Ver todos los artículos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-black/6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block aspect-4/3 bg-[#F7F3EC] overflow-hidden"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#6E685F]">
                      <span className="px-3 py-1 rounded-full bg-[#F7F3EC] text-[#2D2A26] font-semibold">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>

                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="font-display text-xl font-semibold text-[#2D2A26] group-hover:text-[#4FA6EE] transition-colors leading-snug">
                        {post.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#6E685F] leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] text-[#6E685F] bg-[#FDFBF7] px-2.5 py-0.5 rounded-full border border-black/6"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-black/6 flex items-center justify-between text-xs">
                  <span className="text-[#6E685F]">Por {post.author}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#4FA6EE] hover:text-[#2D2A26] transition-colors"
                  >
                    <span>Leer artículo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
