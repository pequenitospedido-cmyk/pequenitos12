import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Trash2,
  Plus,
  Check,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Globe,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BlogPost, BlogPostStatus } from '../../types/product';
import { BRAND_IMAGES } from '../../data/products';

const BLOG_CATEGORIES = [
  'Cuidado del Bebé',
  'Consejos para Familias',
  'Guía de Telas y Cuidado',
  'Etapas de Crecimiento',
  'Maternidad y Bienestar',
  'Ideas para Baby Shower',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminBlogEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { blogPosts, mediaAssets, siteSettings, saveBlogPost, uploadMedia } = useStore();

  const isEditing = Boolean(id && id !== 'nuevo');
  const existingPost = isEditing ? blogPosts.find((p) => p.id === id) : undefined;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  const [author, setAuthor] = useState(siteSettings.contactPerson || 'Milena Vargas');
  const [readTime, setReadTime] = useState('4 min de lectura');
  const [publishedAt, setPublishedAt] = useState('Octubre 2026');
  const [image, setImage] = useState(BRAND_IMAGES.mamelucoOsito);
  const [paragraphs, setParagraphs] = useState<string[]>([
    'Escribe aquí el primer párrafo introductorio de tu artículo de valor para mamás y papás...',
    'Desarrolla aquí los consejos prácticos, recomendaciones de cuidado del bebé o tips que ayuden a las familias y posicionen a Pequeñitos en Google.',
  ]);
  const [focusKeyword, setFocusKeyword] = useState('');
  const [tags, setTags] = useState<string[]>(['Cuidado del bebé', 'Ropa infantil Colombia']);
  const [newTagInput, setNewTagInput] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [featured, setFeatured] = useState(true);
  const [status, setStatus] = useState<BlogPostStatus>('published');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setExcerpt(existingPost.excerpt);
      setCategory(existingPost.category);
      setAuthor(existingPost.author || siteSettings.contactPerson || 'Milena Vargas');
      setReadTime(existingPost.readTime || '4 min de lectura');
      setPublishedAt(existingPost.publishedAt || 'Octubre 2026');
      setImage(existingPost.image || BRAND_IMAGES.mamelucoOsito);
      setParagraphs(
        existingPost.content.length > 0 ? existingPost.content : ['']
      );
      setFocusKeyword(existingPost.focusKeyword || '');
      setTags(existingPost.tags || []);
      setSeoTitle(existingPost.seoTitle || existingPost.title);
      setSeoDescription(existingPost.seoDescription || existingPost.excerpt);
      setFeatured(existingPost.featured ?? true);
      setStatus(existingPost.status || 'published');
    }
  }, [existingPost, siteSettings.contactPerson]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing) {
      setSlug(slugify(val));
      if (!seoTitle) {
        setSeoTitle(`${val} | Blog Pequeñitos`);
      }
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!isEditing && !seoDescription) {
      setSeoDescription(val);
    }
  };

  // Automatically estimate reading time from total words
  const wordCount = useMemo(() => {
    const allText = [title, excerpt, ...paragraphs].join(' ').trim();
    if (!allText) return 0;
    return allText.split(/\s+/).length;
  }, [title, excerpt, paragraphs]);

  const handleAutoCalculateReadTime = () => {
    const mins = Math.max(2, Math.ceil(wordCount / 160));
    setReadTime(`${mins} min de lectura`);
  };

  const handleUpdateParagraph = (idx: number, text: string) => {
    setParagraphs((prev) => prev.map((p, i) => (i === idx ? text : p)));
  };

  const handleAddParagraph = () => {
    setParagraphs((prev) => [...prev, '']);
  };

  const handleRemoveParagraph = (idx: number) => {
    if (paragraphs.length <= 1) return;
    setParagraphs((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveParagraph = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= paragraphs.length) return;
    setParagraphs((prev) => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleCoverUpload = async (file?: File) => {
    if (!file) return;
    setUploadingImage(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'product-images',
        folder: 'paginas',
      });
      setImage(asset.url);
    } finally {
      setUploadingImage(false);
    }
  };

  // Real-time SEO Checklist evaluation
  const seoChecks = useMemo(() => {
    const effectiveSeoTitle = (seoTitle || title).trim();
    const effectiveSeoDesc = (seoDescription || excerpt).trim();
    const kw = focusKeyword.trim().toLowerCase();

    return [
      {
        label: 'Palabra clave principal definida',
        passed: kw.length >= 3,
        hint: kw ? `"${focusKeyword}"` : 'Define la frase con la que quieres aparecer en Google',
      },
      {
        label: 'Palabra clave presente en el título o título SEO',
        passed:
          kw.length >= 3 &&
          (title.toLowerCase().includes(kw) ||
            effectiveSeoTitle.toLowerCase().includes(kw) ||
            kw.split(' ').some((w) => w.length > 3 && title.toLowerCase().includes(w))),
        hint: 'Incluye términos principales de búsqueda en el título',
      },
      {
        label: 'Longitud de Meta Description óptima (80 a 165 caracteres)',
        passed: effectiveSeoDesc.length >= 80 && effectiveSeoDesc.length <= 165,
        hint: `Longitud actual: ${effectiveSeoDesc.length} caracteres`,
      },
      {
        label: 'Contenido de valor completo (mínimo 3 párrafos)',
        passed: paragraphs.filter((p) => p.trim().length > 20).length >= 3,
        hint: `${paragraphs.filter((p) => p.trim().length > 20).length} párrafos redactados (${wordCount} palabras)`,
      },
      {
        label: 'Imagen de portada y etiquetas SEO configuradas',
        passed: Boolean(image) && tags.length >= 2,
        hint: `${tags.length} etiquetas asignadas`,
      },
    ];
  }, [title, seoTitle, seoDescription, excerpt, focusKeyword, paragraphs, wordCount, image, tags]);

  const handleSave = async (targetStatus: BlogPostStatus) => {
    if (!title.trim()) return;

    const finalSlug = slug.trim() || slugify(title);
    const cleanParagraphs = paragraphs.map((p) => p.trim()).filter(Boolean);

    const payload: BlogPost = {
      id: existingPost ? existingPost.id : `blog-${Date.now()}`,
      slug: finalSlug,
      title: title.trim(),
      excerpt: excerpt.trim() || cleanParagraphs[0] || title.trim(),
      content: cleanParagraphs.length > 0 ? cleanParagraphs : [title.trim()],
      category,
      author: author.trim() || 'Milena Vargas',
      readTime: readTime.trim() || '4 min de lectura',
      publishedAt: publishedAt.trim() || 'Octubre 2026',
      image: image || BRAND_IMAGES.mamelucoOsito,
      focusKeyword: focusKeyword.trim(),
      tags,
      seoTitle: seoTitle.trim() || `${title.trim()} | Blog Pequeñitos`,
      seoDescription: seoDescription.trim() || excerpt.trim(),
      featured,
      status: targetStatus,
      sortOrder: existingPost?.sortOrder ?? blogPosts.length + 1,
    };

    await saveBlogPost(payload);
    setStatus(targetStatus);
    setSavedNotice(
      targetStatus === 'published'
        ? '¡Artículo SEO publicado exitosamente en /blog!'
        : targetStatus === 'draft'
        ? 'Borrador del artículo guardado correctamente.'
        : 'Artículo guardado como oculto.'
    );
    setTimeout(() => setSavedNotice(''), 3000);

    if (!isEditing) {
      navigate('/admin/blog');
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/blog"
            className="w-10 h-10 rounded-full bg-white border border-black/8 inline-flex items-center justify-center text-[#2D2A26] hover:bg-[#EBF5FD] transition-colors"
            aria-label="Volver a artículos del blog"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <p className="text-xs font-semibold text-[#4FA6EE]">
              {isEditing ? `Editando artículo · /blog/${slug}` : 'Crear contenido de valor SEO'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
              {isEditing ? title || 'Editar artículo' : 'Nuevo Artículo del Blog'}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-4 py-2.5 rounded-full bg-white border border-black/10 text-xs font-semibold text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
          >
            Guardar borrador
          </button>

          <button
            type="button"
            onClick={() => handleSave('hidden')}
            className="px-4 py-2.5 rounded-full bg-[#F7F3EC] text-xs font-semibold text-[#6E685F] hover:text-[#2D2A26] transition-colors cursor-pointer"
          >
            Ocultar
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#3F3B36] transition-colors cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4 text-[#53C59B]" />
            <span>Publicar artículo</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-[#ECF9F4] border border-[#53C59B]/40 text-xs sm:text-sm font-semibold text-[#2D2A26] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>{savedNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Content & SEO Optimization */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Basic Article Details */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-5">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              1. Título e Introducción del Artículo
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Título principal del artículo (H1) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ej. Cómo elegir la ropita ideal para los primeros días de tu bebé"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Slug URL amigable para Google (/blog/...)
                </label>
                <div className="flex items-center rounded-xl bg-[#FDFBF7] border border-black/10 px-3.5 py-2">
                  <span className="text-xs font-mono text-[#6E685F] select-none">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(slugify(e.target.value))}
                    placeholder="como-elegir-la-ropa-ideal-para-un-recien-nacido"
                    className="w-full bg-transparent text-xs sm:text-sm font-mono text-[#2D2A26] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Resumen / Introducción atractiva (aparece en la tarjeta del blog y como extracto) *
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="Breve resumen de 2 líneas que invite a las familias a leer el artículo completo..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
              />
            </div>
          </div>

          {/* 2. Value Content Block Editor */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
                  2. Desarrollo del Contenido de Valor (Párrafos y Consejos)
                </h2>
                <p className="text-xs text-[#6E685F] mt-0.5">
                  Escribe o pega cada párrafo o consejo práctico. Puedes ordenarlos con las flechas
                  o añadir todos los bloques que necesites.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#4FA6EE] tabular-nums">
                {wordCount} palabras · {paragraphs.length} bloques
              </span>
            </div>

            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#FDFBF7] border border-black/8 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-[#6E685F]">
                    <span className="font-semibold text-[#2D2A26]">
                      Párrafo / Sección #{index + 1}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveParagraph(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-white border border-black/8 hover:bg-[#EBF5FD] disabled:opacity-30 cursor-pointer"
                        title="Subir párrafo"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveParagraph(index, 'down')}
                        disabled={index === paragraphs.length - 1}
                        className="p-1.5 rounded-lg bg-white border border-black/8 hover:bg-[#EBF5FD] disabled:opacity-30 cursor-pointer"
                        title="Bajar párrafo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {paragraphs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveParagraph(index)}
                          className="p-1.5 rounded-lg bg-white border border-black/8 text-[#F48B7B] hover:bg-[#FEF1EF] cursor-pointer ml-1"
                          title="Eliminar párrafo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={paragraph}
                    onChange={(e) => handleUpdateParagraph(index, e.target.value)}
                    placeholder={`Escribe el contenido del párrafo #${index + 1}...`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-sm text-[#2D2A26] leading-relaxed focus:outline-none focus:border-[#4FA6EE]"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddParagraph}
              className="w-full py-3 px-4 rounded-2xl border-2 border-dashed border-[#4FA6EE]/40 bg-[#EBF5FD]/30 hover:bg-[#EBF5FD]/70 text-xs font-semibold text-[#2D2A26] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#4FA6EE]" />
              <span>+ Agregar nuevo párrafo o consejo al artículo</span>
            </button>
          </div>

          {/* 3. SEO & Google Search Preview Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/6 shadow-2xs space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
                  3. Configuración SEO para Buscadores (Google)
                </h2>
                <p className="text-xs text-[#6E685F]">
                  Optimiza cómo aparecerá este artículo cuando las mamás y papás busquen consejos en
                  Google Colombia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                  Palabra clave principal (Focus Keyword)
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  placeholder="Ej. cómo elegir ropa para recién nacido en Colombia"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#2D2A26]">
                    Título SEO (Meta Title)
                  </label>
                  <span className="text-[11px] text-[#6E685F] tabular-nums">
                    {(seoTitle || title).length} / 65 caracteres
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={`${title || 'Título del artículo'} | Blog Pequeñitos`}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#2D2A26]">
                    Descripción SEO (Meta Description)
                  </label>
                  <span className="text-[11px] text-[#6E685F] tabular-nums">
                    {(seoDescription || excerpt).length} / 160 caracteres
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Descripción persuasiva de 120 a 160 caracteres para resultados de Google..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
                />
              </div>
            </div>

            {/* Tags / Secondary Keywords */}
            <div className="space-y-2 pt-2 border-t border-black/6">
              <label className="block text-xs font-semibold text-[#2D2A26]">
                Etiquetas y palabras clave secundarias
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F3EC] text-xs font-medium text-[#2D2A26]"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#6E685F] hover:text-[#F48B7B] cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 max-w-md pt-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Nueva etiqueta (ej. Algodón pima)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-xl bg-[#2D2A26] text-white text-xs font-semibold cursor-pointer"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Live Google SERP Preview */}
            <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-black/8 space-y-2">
              <p className="text-[11px] font-semibold text-[#6E685F] uppercase tracking-wider">
                Vista previa en Google Search:
              </p>
              <div className="bg-white p-4 rounded-xl border border-black/6 space-y-1">
                <p className="text-xs text-[#202124] truncate">
                  pequenitos.co › blog › {slug || 'nuevo-articulo'}
                </p>
                <p className="text-base font-medium text-[#1a0dab] hover:underline truncate">
                  {seoTitle || `${title || 'Título del artículo'} | Blog Pequeñitos`}
                </p>
                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {seoDescription ||
                    excerpt ||
                    'Aprende consejos prácticos para el cuidado, bienestar y comodidad de tu bebé en el Blog oficial de Pequeñitos Colombia.'}
                </p>
              </div>
            </div>

            {/* Real-Time SEO Checklist */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-[#2D2A26]">
                Diagnóstico SEO del artículo:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {seoChecks.map((chk, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 p-3 rounded-xl bg-[#FDFBF7] border border-black/6 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {chk.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#53C59B] shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0" />
                      )}
                      <span className="font-medium text-[#2D2A26]">{chk.label}</span>
                    </div>
                    <span className="text-[11px] text-[#6E685F] shrink-0">{chk.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Cover Image, Category, Author & Publication */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cover Image */}
          <div className="bg-white rounded-3xl p-6 border border-black/6 shadow-2xs space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Imagen de Portada
            </h2>

            <div className="aspect-16/10 rounded-2xl overflow-hidden bg-[#F7F3EC] border border-black/8">
              <img
                src={image}
                alt={title || 'Portada del artículo'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="w-full py-2.5 px-4 rounded-xl bg-[#2D2A26] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#3F3B36] transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-[#FACC48]" />
                <span>{uploadingImage ? 'Optimizando imagen...' : 'Subir portada desde equipo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCoverUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowMediaPicker((prev) => !prev)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#EBF5FD] transition-colors cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-[#4FA6EE]" />
                <span>Elegir de Biblioteca Media</span>
              </button>
            </div>

            {showMediaPicker && (
              <div className="pt-3 border-t border-black/6 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {mediaAssets.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      setImage(asset.url);
                      setShowMediaPicker(false);
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer ${
                      image === asset.url ? 'border-[#4FA6EE]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Classification & Author */}
          <div className="bg-white rounded-3xl p-6 border border-black/6 shadow-2xs space-y-4">
            <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
              Clasificación y Autoría
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Categoría temática
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26]"
              >
                {BLOG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1.5">
                Autora / Responsable
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Tiempo de lectura
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26]"
                />
                <button
                  type="button"
                  onClick={handleAutoCalculateReadTime}
                  className="text-[11px] font-semibold text-[#4FA6EE] hover:underline mt-1 cursor-pointer"
                >
                  Calcular automático
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Fecha visible
                </label>
                <input
                  type="text"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  placeholder="Octubre 2026"
                  className="w-full px-3 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs text-[#2D2A26]"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-black/6 space-y-3">
              <label className="flex items-center justify-between gap-3 cursor-pointer">
                <span className="text-xs font-semibold text-[#2D2A26]">
                  Destacar en la página de Inicio
                </span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#4FA6EE]"
                />
              </label>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Estado de visibilidad
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs font-semibold text-[#2D2A26]"
                >
                  <option value="published">Publicado (Visible en /blog)</option>
                  <option value="draft">Borrador (Solo en admin)</option>
                  <option value="hidden">Oculto</option>
                </select>
              </div>
            </div>

            {isEditing && slug && (
              <div className="pt-2">
                <Link
                  to={`/blog/${slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#EBF5FD] text-[#2D2A26] text-xs font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#D8ECFA] transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-[#4FA6EE]" />
                  <span>Ver cómo luce este artículo</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
