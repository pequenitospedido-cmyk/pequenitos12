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
  Archive,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatCOP } from '../../data/products';
import { Product, ProductStatus } from '../../types/product';

export const AdminProductsPage: React.FC = () => {
  const { products, categories, saveProduct, deleteProduct, duplicateProduct } = useStore();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        const status = p.status || 'published';
        if (statusFilter !== 'all' && status !== statusFilter) return false;
        if (search.trim() !== '') {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q) ||
            (p.sku || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [products, categoryFilter, statusFilter, search]);

  const handleToggleFeatured = async (product: Product) => {
    await saveProduct({
      ...product,
      featured: !product.featured,
    });
  };

  const handleToggleNew = async (product: Product) => {
    await saveProduct({
      ...product,
      new: !product.new,
    });
  };

  const handleToggleVisibility = async (product: Product) => {
    const currentStatus = product.status || 'published';
    const nextStatus: ProductStatus = currentStatus === 'published' ? 'hidden' : 'published';
    await saveProduct({
      ...product,
      status: nextStatus,
    });
  };

  const handleArchiveProduct = async (product: Product) => {
    await saveProduct({
      ...product,
      status: 'archived',
      featured: false,
    });
    setProductToDelete(null);
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredProducts.length) return;

    const itemA = filteredProducts[index];
    const itemB = filteredProducts[targetIndex];

    const orderA = itemA.sortOrder ?? index + 1;
    const orderB = itemB.sortOrder ?? targetIndex + 1;

    await saveProduct({ ...itemA, sortOrder: orderB });
    await saveProduct({ ...itemB, sortOrder: orderA });
  };

  const statusLabels: Record<string, { text: string; color: string }> = {
    published: { text: 'Publicado', color: 'text-[#53C59B]' },
    draft: { text: 'Borrador', color: 'text-[#EAB308]' },
    hidden: { text: 'Oculto', color: 'text-[#6E685F]' },
    archived: { text: 'Archivado', color: 'text-[#F48B7B]' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">Catálogo administrable</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Productos ({filteredProducts.length})
          </h1>
        </div>

        <Link
          to="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FACC48]" />
          <span>+ Agregar producto</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/6 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, slug o SKU..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-[#FDFBF7] border border-black/10 text-xs sm:text-sm text-[#2D2A26] focus:outline-none focus:border-[#4FA6EE]"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
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
            <option value="archived">Archivado</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-black/6 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] border-b border-black/6">
                <th className="py-3.5 px-4">Orden</th>
                <th className="py-3.5 px-4">Imagen</th>
                <th className="py-3.5 px-4">Producto</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-center">Destacado (Inicio)</th>
                <th className="py-3.5 px-4 text-center">Novedad</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/6 text-xs sm:text-sm">
              {filteredProducts.map((product, idx) => {
                const statusInfo = statusLabels[product.status || 'published'];
                const catName =
                  categories.find((c) => c.slug === product.category)?.name || product.category;

                return (
                  <tr key={product.id} className="hover:bg-[#FDFBF7] transition-colors">
                    {/* Sort Order Controls */}
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
                          disabled={idx === filteredProducts.length - 1}
                          className="p-1 rounded-lg hover:bg-[#F7F3EC] disabled:opacity-30 cursor-pointer"
                          title="Bajar posición"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Image */}
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/admin/productos/${product.id}`}
                        className="block w-12 h-14 rounded-xl overflow-hidden bg-[#F7F3EC]"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                    </td>

                    {/* Product Name & SKU */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <Link
                        to={`/admin/productos/${product.id}`}
                        className="font-semibold text-[#2D2A26] hover:text-[#4FA6EE] transition-colors block truncate"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] text-[#6E685F] tabular-nums">
                        SKU: {product.sku || product.id} · /{product.slug}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs text-[#6E685F]">{catName}</td>

                    {/* Price */}
                    <td className="py-3.5 px-4 tabular-nums">
                      <span className="font-semibold text-[#2D2A26]">
                        {formatCOP(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="block text-[11px] text-[#6E685F] line-through">
                          {formatCOP(product.oldPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4 tabular-nums">
                      <span
                        className={`font-semibold ${
                          product.stock <= 5
                            ? 'text-[#F48B7B]'
                            : product.stock <= 12
                            ? 'text-[#EAB308]'
                            : 'text-[#2D2A26]'
                        }`}
                      >
                        {product.stock} unid.
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-semibold ${statusInfo.color}`}>
                        {statusInfo.text}
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product)}
                        className={`w-10 h-6 rounded-full transition-colors p-0.5 inline-flex items-center cursor-pointer ${
                          product.featured ? 'bg-[#4FA6EE] justify-end' : 'bg-black/15 justify-start'
                        }`}
                        title="Mostrar en 'Los favoritos de nuestros Pequeñitos'"
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                      </button>
                    </td>

                    {/* New Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleNew(product)}
                        className={`w-10 h-6 rounded-full transition-colors p-0.5 inline-flex items-center cursor-pointer ${
                          product.new ? 'bg-[#53C59B] justify-end' : 'bg-black/15 justify-start'
                        }`}
                        title="Mostrar en 'Novedades'"
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-2xs" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1">
                        <Link
                          to={`/admin/productos/${product.id}`}
                          className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#EBF5FD] hover:text-[#4FA6EE] transition-colors"
                          title="Editar producto"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => duplicateProduct(product.id)}
                          className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                          title="Duplicar producto"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(product)}
                          className="p-2 rounded-xl text-[#2D2A26] hover:bg-[#F7F3EC] transition-colors cursor-pointer"
                          title={
                            (product.status || 'published') === 'published'
                              ? 'Ocultar producto'
                              : 'Publicar producto'
                          }
                        >
                          {(product.status || 'published') === 'published' ? (
                            <EyeOff className="w-4 h-4 text-[#6E685F]" />
                          ) : (
                            <Eye className="w-4 h-4 text-[#53C59B]" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="p-2 rounded-xl text-[#6E685F] hover:bg-[#FEF1EF] hover:text-[#F48B7B] transition-colors cursor-pointer"
                          title="Eliminar o archivar producto"
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

      {/* Delete / Archive Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2D2A26]/40 backdrop-blur-xs"
            onClick={() => setProductToDelete(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl z-10 space-y-5 animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF1EF] text-[#F48B7B] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-[#2D2A26]">
                ¿Está seguro de eliminar este producto?
              </h3>
              <p className="text-xs sm:text-sm text-[#6E685F] mt-2 leading-relaxed">
                Vas a eliminar <strong>{productToDelete.name}</strong>. También puedes optar por{' '}
                <strong>Archivar</strong> si deseas ocultarlo de la tienda sin perder su historial.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold hover:bg-[#ECE6DA] transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => handleArchiveProduct(productToDelete)}
                className="px-4 py-2.5 rounded-full bg-[#FEF9E7] text-[#2D2A26] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#FACC48]/40 transition-colors cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archivar</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
                className="px-5 py-2.5 rounded-full bg-[#F48B7B] text-white text-xs font-semibold hover:bg-[#E06D5D] transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
