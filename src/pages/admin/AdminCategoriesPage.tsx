import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryInfo } from '../../types/product';
import { BRAND_IMAGES } from '../../data/products';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const AdminCategoriesPage: React.FC = () => {
  const { categories, saveCategory, deleteCategory, uploadMedia } = useStore();

  const [editingCat, setEditingCat] = useState<CategoryInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<CategoryInfo>({
    id: '',
    name: '',
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    image: BRAND_IMAGES.mamelucoOsito,
    accentColor: '#4FA6EE',
    softBg: '#EBF5FD',
    sortOrder: categories.length + 1,
    status: 'active',
  });

  const openCreateModal = () => {
    setForm({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      title: '',
      subtitle: '',
      description: '',
      image: BRAND_IMAGES.mamelucoOsito,
      accentColor: '#4FA6EE',
      softBg: '#EBF5FD',
      sortOrder: categories.length + 1,
      status: 'active',
    });
    setEditingCat(null);
    setIsCreating(true);
  };

  const openEditModal = (cat: CategoryInfo) => {
    setForm({
      ...cat,
      sortOrder: cat.sortOrder ?? 1,
      status: cat.status || 'active',
    });
    setEditingCat(cat);
    setIsCreating(true);
  };

  const handleImageUpload = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'product-images',
        folder: 'banners',
      });
      setForm((prev) => ({ ...prev, image: asset.url }));
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const finalSlug = form.slug.trim() || slugify(form.name);
    await saveCategory({
      ...form,
      slug: finalSlug,
      title: form.title.trim() || form.name.trim(),
      subtitle: form.subtitle.trim() || form.description.trim(),
    });
    setIsCreating(false);
    setEditingCat(null);
  };

  const handleToggleStatus = async (cat: CategoryInfo) => {
    await saveCategory({
      ...cat,
      status: cat.status === 'hidden' ? 'active' : 'hidden',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">Organización del catálogo</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Categorías ({categories.length})
          </h1>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FACC48]" />
          <span>+ Agregar categoría</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl overflow-hidden border border-black/6 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="aspect-16/9 bg-[#F7F3EC] relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold text-[#2D2A26]">
                  Orden #{cat.sortOrder ?? 1}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-semibold">
                  {cat.status === 'hidden' ? (
                    <span className="text-[#6E685F]">Oculta</span>
                  ) : (
                    <span className="text-[#53C59B]">Activa</span>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                    {cat.name}
                  </h2>
                  <span className="text-xs font-mono text-[#6E685F]">/{cat.slug}</span>
                </div>
                <p className="text-xs text-[#6E685F] line-clamp-2 leading-relaxed">
                  {cat.description || cat.subtitle}
                </p>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[#FDFBF7] border-t border-black/6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => openEditModal(cat)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D2A26] hover:text-[#4FA6EE] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(cat)}
                  className="p-2 rounded-xl text-[#6E685F] hover:bg-white hover:text-[#2D2A26] cursor-pointer"
                  title={cat.status === 'hidden' ? 'Mostrar categoría' : 'Ocultar categoría'}
                >
                  {cat.status === 'hidden' ? (
                    <Eye className="w-4 h-4 text-[#53C59B]" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 rounded-xl text-[#6E685F] hover:bg-[#FEF1EF] hover:text-[#F48B7B] cursor-pointer"
                  title="Eliminar categoría"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs"
            onClick={() => setIsCreating(false)}
          />
          <form
            onSubmit={handleSave}
            className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl z-10 space-y-4 max-h-[90vh] overflow-y-auto animate-fade-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/6">
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">
                {editingCat ? `Editar ${editingCat.name}` : 'Nueva Categoría'}
              </h2>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-1.5 rounded-full text-[#6E685F] hover:text-[#2D2A26]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name: val,
                      slug: editingCat ? prev.slug : slugify(val),
                      title: prev.title || val,
                    }));
                  }}
                  placeholder="Ej. Pijamas"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))}
                  placeholder="pijamas"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm font-mono text-[#2D2A26]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                Descripción corta / Subtítulo
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Breve frase para la tarjeta de categoría..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                Descripción completa
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Orden
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm tabular-nums text-[#2D2A26]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      status: e.target.value as 'active' | 'hidden',
                    }))
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
                >
                  <option value="active">Activa</option>
                  <option value="hidden">Oculta</option>
                </select>
              </div>
            </div>

            {/* Category Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2D2A26]">
                Imagen de categoría
              </label>
              <div className="flex items-center gap-4">
                <img
                  src={form.image}
                  alt={form.name || 'Categoría'}
                  className="w-20 h-16 rounded-xl object-cover bg-[#F7F3EC] border border-black/10"
                  referrerPolicy="no-referrer"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD] cursor-pointer">
                  <Upload className="w-4 h-4 text-[#4FA6EE]" />
                  <span>{uploading ? 'Subiendo...' : 'Subir imagen'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-black/6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-full bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 text-[#53C59B]" />
                <span>Guardar categoría</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
