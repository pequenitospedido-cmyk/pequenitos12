import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit3,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Globe,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BlogPost, BlogPostStatus } from '../../types/product';

export const AdminBlogPage: React.FC = () => {
  const { blogPosts, saveBlogPost, deleteBlogPost, duplicateBlogPost } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(blogPosts.map((p) => p.category))).filter(Boolean);
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter((post) => {
        if (categoryFilter !== 'all' && post.category !== categoryFilter) return false;
        const status = post.status || 'published';
        if (statusFilter !== 'all' && status !== statusFilter) return false;
        if (search.trim() !== '') {
          const q = search.toLowerCase();
          return (
            post.title.toLowerCase().includes(q) ||
            post.slug.toLowerCase().includes(q) ||
            (post.focusKeyword || '').toLowerCase().includes(q) ||
            post.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [blogPosts, categoryFilter, statusFilter, search]);

  const handleToggleFeatured = async (post: BlogPost) => {
    await saveBlogPost({
      ...post,
      featured: !post.featured,
    });
  };

  const handleToggleVisibility = async (post: BlogPost) => {
    const currentStatus = post.status || 'published';
    const nextStatus: BlogPostStatus = currentStatus === 'published' ? 'hidden' : 'published';
    await saveBlogPost({
      ...post,
      status: nextStatus,
    });
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredPosts.length) return;

    const itemA = filteredPosts[index];
    const itemB = filteredPosts[targetIndex];

    const orderA = itemA.sortOrder ?? index + 1;
    const orderB = itemB.sortOrder ?? targetIndex + 1;

    await saveBlogPost({ ...itemA, sortOrder: orderB });
    await saveBlogPost({ ...itemB, sortOrder: orderA });
  };

  const statusLabels: Record<string, { text: string; color: string }> = {
    published: { text: 'Publicado', color: 'text-[#53C59B]' },
    draft: { text: 'Borrador', color: 'text-[#EAB308]' },
    hidden: { text: 'Oculto', color: 'text-[#6E685F]' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">
            Contenido de valor y posicionamiento en buscadores (SEO)
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Blog Pequeñitos ({filteredPosts.length})
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white border border-black/10 text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD] transition-colors"
          >
            <span>Ver Blog público</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#4FA6EE]" />
          </Link>

          <Link
            to="/admin/blog/nuevo"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-[#FACC48]" />
            <span>+ Nuevo artículo SEO</span>
          </Link>
        </div>
      </div>

      {/* SEO Guidance Banner */}
      <div className="rounded-3xl bg-[#EBF5FD] border border-[#4FA6EE]/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white text-[#4FA6EE] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-semibold text-[#2D2A26]">
              ¿Cómo funciona el Blog para posicionamiento SEO?
            </h2>
            <p className="text-xs text-[#6E685F] mt-0.5 leading-relaxed max-w-3xl">
              Aquí no se suben productos, sino artículos educativos, guías de cuidado del bebé y
              consejos para mamás y papás. Cada artículo genera automáticamente su URL amigable
              (<code>/blog/slug</code>), metadatos para Google y datos estructurados{' '}
              <code>Schema.org BlogPosting</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/6 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, palabra clave SEO o categoría..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          >
            <option value="all">Todas las temáticas</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          >
            <option value="all">Todos los estados</option>
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
            <option value="hidden">Oculto</option>
          </select>
        </div>
      </div>

      {/* Blog Articles Table */}
      <div className="bg-white rounded-3xl border border-black/6 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] border-b border-black/6">
                <th className="py-3.5 px-4">Orden</th>
                <th className="py-3.5 px-4">Portada</th>
                <th className="py-3.5 px-4">Artículo y URL SEO</th>
                <th className="py-3.5 px-4">Palabra Clave SEO</th>
                <th className="py-3.5 px-4">Temática</th>
                <th className="py-3.5 px-4">Lectura</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">En Inicio</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6 text-xs sm:text-sm">
              {filteredPosts.map((post, idx) => {
                const statusInfo = statusLabels[post.status || 'published'];

                return (
                  <tr key={post.id} className="hover:bg-[#FDFBF7] transition-colors">
                    {/* Sort Order */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg hover:bg-[#F7F3EC] disabled:opacity-30 cursor-pointer"
                          title="Subir posición"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveOrder(idx, 'down')}
                          disabled={idx === filteredPosts.length - 1}
                          className="p-1 rounded-lg hover:bg-[#F7F3EC] disabled:opacity-30 cursor-pointer"
                          title="Bajar posición"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Cover Image */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="block w-16 h-12 rounded-xl overflow-hidden bg-[#F7F3EC]"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/admin/blog/${post.id}`}
                        className="font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors block truncate"
                      >
                        {post.title}
                      </Link>
                      <span className="text-[11px] font-mono text-[#6E685F] block truncate">
                        /blog/{post.slug} · Por {post.author}
                      </span>
                    </td>

                    {/* Focus Keyword */}
                    <td className="py-3.5 px-4">
                      {post.focusKeyword ? (
                        <span className="text-xs font-medium text-[#4FA6EE]">
                          {post.focusKeyword}
                        </span>
                      ) : (
                        <span className="text-xs text-[#6E685F]">Sin definir</span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs text-[#6E685F]">{post.category}</td>

                    {/* Read Time */}
                    <td className="py-3.5 px-4 text-xs text-[#6E685F] whitespace-nowrap">
                      {post.readTime}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>

                    {/* Featured on Home */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(post)}
                        className={`w-10 h-6 rounded-full transition-colors p-0.5 inline-flex items-center cursor-pointer ${
                          post.featured ?? true
                            ? 'bg-[#4FA6EE] justify-end'
                            : 'bg-black/15 justify-start'
                        }`}
                        title="Destacar en Inicio y Blog"
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="p-2 rounded-xl text-[#6E685F] hover:bg-[#EBF5FD] hover:text-[#4FA6EE] transition-colors"
                          title="Ver artículo en el Blog público"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#EBF5FD] hover:text-[#4FA6EE] transition-colors"
                          title="Editar artículo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => duplicateBlogPost(post.id)}
                          className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                          title="Duplicar artículo"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(post)}
                          className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                          title={
                            (post.status || 'published') === 'published'
                              ? 'Ocultar artículo'
                              : 'Publicar artículo'
                          }
                        >
                          {(post.status || 'published') === 'published' ? (
                            <EyeOff className="w-4 h-4 text-[#6E685F]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[#53C59B]" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setPostToDelete(post)}
                          className="p-2 rounded-xl text-[#6E685F] hover:bg-[#FEF1EF] hover:text-[#F48B7B] transition-colors cursor-pointer"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs"
            onClick={() => setPostToDelete(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl z-10 space-y-5 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF1EF] text-[#F48B7B] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-[#2D2A26]">
                ¿Eliminar este artículo del Blog?
              </h3>
              <p className="text-xs sm:text-sm text-[#6E685F] mt-2 leading-relaxed">
                Vas a eliminar <strong>{postToDelete.title}</strong>. Si prefieres conservarlo sin
                que sea visible para los visitantes, puedes usar el botón de ocultar.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2.5 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold hover:bg-[#ECE6DA] transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={async () => {
                  await deleteBlogPost(postToDelete.id);
                  setPostToDelete(null);
                }}
                className="px-5 py-2.5 rounded-full bg-[#F48B7B] text-white text-xs font-semibold hover:bg-[#E06D5D] transition-colors cursor-pointer"
              >
                Eliminar artículo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
