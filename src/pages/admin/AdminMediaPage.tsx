import React, { useState } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MediaAsset } from '../../types/product';

type FolderFilter = 'all' | 'productos' | 'logo' | 'banners' | 'paginas';

export const AdminMediaPage: React.FC = () => {
  const { mediaAssets, uploadMedia, deleteMedia } = useStore();

  const [activeFolder, setActiveFolder] = useState<FolderFilter>('all');
  const [uploadFolder, setUploadFolder] = useState<'productos' | 'logo' | 'banners' | 'paginas'>(
    'productos'
  );
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const filteredAssets = mediaAssets.filter((m) =>
    activeFolder === 'all' ? true : m.folder === activeFolder
  );

  const handleUploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadMedia(file, {
          bucket: uploadFolder === 'logo' ? 'brand-assets' : 'product-images',
          folder: uploadFolder,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#4FA6EE]">
            Supabase Storage · Buckets: product-images & brand-assets
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
            Biblioteca Multimedia ({filteredAssets.length})
          </h1>
        </div>

        {/* Upload Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value as any)}
            className="px-3.5 py-2.5 rounded-full bg-white border border-black/10 text-xs font-semibold text-[#2D2A26]"
          >
            <option value="productos">Destino: Fotografías de productos</option>
            <option value="logo">Destino: Logo / Marca</option>
            <option value="banners">Destino: Banners</option>
            <option value="paginas">Destino: Imágenes de páginas</option>
          </select>

          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold hover:bg-[#3F3B36] transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#FACC48]" />
            <span>{uploading ? 'Subiendo...' : 'Subir archivo'}</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUploadFiles(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Folder Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Todos los archivos' },
          { id: 'productos', label: 'Fotografías de productos' },
          { id: 'logo', label: 'Logo' },
          { id: 'banners', label: 'Banners' },
          { id: 'paginas', label: 'Imágenes de páginas' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFolder(tab.id as FolderFilter)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              activeFolder === tab.id
                ? 'bg-[#2D2A26] text-white'
                : 'bg-white text-[#6E685F] hover:text-[#2D2A26]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Visual Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-3xl p-3 border border-black/6 shadow-2xs flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-[#F7F3EC] relative mb-2.5">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewAsset(asset)}
                    className="w-9 h-9 rounded-full bg-white text-[#2D2A26] inline-flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    title="Ver imagen"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset)}
                    className="w-9 h-9 rounded-full bg-white text-[#2D2A26] inline-flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                    title="Copiar URL"
                  >
                    {copiedId === asset.id ? (
                      <Check className="w-4 h-4 text-[#53C59B]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-xs font-semibold text-[#2D2A26] truncate">{asset.name}</p>
              <p className="text-[11px] text-[#6E685F]">
                Carpeta: {asset.folder} · {asset.bucket}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-black/6 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => handleCopyUrl(asset)}
                className="font-semibold text-[#4FA6EE] hover:underline cursor-pointer"
              >
                {copiedId === asset.id ? '¡URL copiada!' : 'Copiar URL'}
              </button>

              <button
                type="button"
                onClick={() => deleteMedia(asset.id)}
                className="text-[#6E685F] hover:text-[#F48B7B] p-1 cursor-pointer"
                title="Eliminar archivo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#2D2A26]/60 backdrop-blur-xs"
            onClick={() => setPreviewAsset(null)}
          />
          <div className="relative bg-white rounded-3xl max-w-2xl w-full p-5 shadow-2xl z-10 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-[#2D2A26]">{previewAsset.name}</h3>
                <p className="text-xs text-[#6E685F]">Bucket: {previewAsset.bucket}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="p-2 rounded-full hover:bg-[#F7F3EC]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-hidden rounded-2xl bg-[#F7F3EC] flex items-center justify-center">
              <img
                src={previewAsset.url}
                alt={previewAsset.name}
                className="max-h-[65vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
