import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Edit3,
  ArrowUp,
  ArrowDown,
  Check,
  Save,
  Upload,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { HomepageBlock } from '../../types/product';

export const AdminHomeEditorPage: React.FC = () => {
  const {
    draftHomepageBlocks,
    saveDraftHomepageBlocks,
    publishHomepageBlocks,
    uploadMedia,
    setIsLiveEditMode,
  } = useStore();
  const navigate = useNavigate();

  const [blocks, setBlocks] = useState<HomepageBlock[]>(draftHomepageBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [uploadingBlockImg, setUploadingBlockImg] = useState(false);

  useEffect(() => {
    setBlocks(draftHomepageBlocks);
  }, [draftHomepageBlocks]);

  const handleToggleVisible = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b))
    );
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;

    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;

    setBlocks(updated.map((b, i) => ({ ...b, sortOrder: i + 1 })));
  };

  const handleUpdateBlockField = (id: string, changes: Partial<HomepageBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b))
    );
  };

  const handleBlockImageUpload = async (id: string, file?: File) => {
    if (!file) return;
    setUploadingBlockImg(true);
    try {
      const asset = await uploadMedia(file, {
        bucket: 'product-images',
        folder: 'banners',
      });
      handleUpdateBlockField(id, { imageUrl: asset.url });
    } finally {
      setUploadingBlockImg(false);
    }
  };

  const handleSaveDraft = async () => {
    await saveDraftHomepageBlocks(blocks);
    setStatusMessage('Borrador guardado correctamente.');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handlePublish = async () => {
    await publishHomepageBlocks(blocks);
    setStatusMessage('¡Cambios publicados en la página de inicio!');
    setTimeout(() => setStatusMessage(''), 2500);
  };

  const handlePreview = async () => {
    await saveDraftHomepageBlocks(blocks);
    navigate('/?preview=draft');
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Top Gutenberg-Style Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-20 z-20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EBF5FD] text-[#4FA6EE] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#4FA6EE]">
              Editor Visual por Bloques (Estilo Gutenberg)
            </p>
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[#2D2A26]">
              Página de Inicio Pequeñitos
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setIsLiveEditMode(true);
              navigate('/');
            }}
            className="px-4 py-2.5 rounded-full bg-[#53C59B] text-[#1E1C1A] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#43B288] transition-colors cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar directamente sobre la página (Gutenberg en vivo)</span>
          </button>

          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2.5 rounded-full bg-[#EBF5FD] text-[#2D2A26] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#D8ECFA] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#4FA6EE]" />
            <span>Vista previa</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-5 py-2.5 rounded-full bg-[#F7F3EC] text-[#2D2A26] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#ECE6DA] transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar cambios</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 hover:bg-[#3F3B36] transition-colors cursor-pointer shadow-xs"
          >
            <Check className="w-4 h-4 text-[#53C59B]" />
            <span>Publicar</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#ECF9F4] border border-[#53C59B]/40 text-xs sm:text-sm font-semibold text-[#2D2A26] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Visual Blocks List */}
      <div className="space-y-4">
        {blocks.map((block, index) => {
          const isEditing = editingBlockId === block.id;

          return (
            <div
              key={block.id}
              className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                !block.visible
                  ? 'border-black/6 opacity-65'
                  : isEditing
                  ? 'border-[#4FA6EE] ring-1 ring-[#4FA6EE] shadow-md'
                  : 'border-black/8 shadow-2xs'
              }`}
            >
              {/* Block Header Card */}
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded-lg bg-[#F7F3EC] hover:bg-[#EBF5FD] disabled:opacity-30 cursor-pointer"
                      title="Subir bloque"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-semibold text-[#6E685F] tabular-nums">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 rounded-lg bg-[#F7F3EC] hover:bg-[#EBF5FD] disabled:opacity-30 cursor-pointer"
                      title="Bajar bloque"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {block.imageUrl && (
                    <img
                      src={block.imageUrl}
                      alt={block.title}
                      className="w-20 h-16 rounded-2xl object-cover bg-[#F7F3EC] shrink-0 hidden sm:block"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[#4FA6EE] uppercase tracking-wider">
                        {block.label}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className={block.visible ? 'text-[#53C59B] font-medium' : 'text-[#6E685F]'}>
                        {block.visible ? 'Visible en Inicio' : 'Oculto'}
                      </span>
                    </div>

                    <h2 className="font-display text-lg sm:text-xl font-semibold text-[#2D2A26]">
                      {block.title}
                    </h2>
                    <p className="text-xs text-[#6E685F] line-clamp-2 max-w-2xl">
                      {block.description}
                    </p>
                  </div>
                </div>

                {/* Block Controls: [Editar] [Ocultar] */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setEditingBlockId(isEditing ? null : block.id)
                    }
                    className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isEditing
                        ? 'bg-[#2D2A26] text-white'
                        : 'bg-[#F7F3EC] text-[#2D2A26] hover:bg-[#EBF5FD]'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Cerrar edición' : 'Editar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleVisible(block.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                      block.visible
                        ? 'bg-[#FDFBF7] border border-black/10 text-[#6E685F] hover:text-[#2D2A26]'
                        : 'bg-[#ECF9F4] text-[#53C59B]'
                    }`}
                  >
                    {block.visible ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Ocultar</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mostrar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expandable Block Inspector */}
              {isEditing && (
                <div className="p-6 bg-[#FDFBF7] border-t border-black/6 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                        Título del bloque
                      </label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={(e) =>
                          handleUpdateBlockField(block.id, { title: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-sm text-[#2D2A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                        Subtítulo / Etiqueta superior
                      </label>
                      <input
                        type="text"
                        value={block.subtitle}
                        onChange={(e) =>
                          handleUpdateBlockField(block.id, { subtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-sm text-[#2D2A26]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows={2}
                      value={block.description}
                      onChange={(e) =>
                        handleUpdateBlockField(block.id, { description: e.target.value })
                      }
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-sm text-[#2D2A26]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                        Texto del botón
                      </label>
                      <input
                        type="text"
                        value={block.buttonText}
                        onChange={(e) =>
                          handleUpdateBlockField(block.id, { buttonText: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-sm text-[#2D2A26]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                        Enlace del botón
                      </label>
                      <input
                        type="text"
                        value={block.buttonLink}
                        onChange={(e) =>
                          handleUpdateBlockField(block.id, { buttonLink: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl bg-white border border-black/10 text-sm font-mono text-[#2D2A26]"
                      />
                    </div>
                  </div>

                  {(block.type === 'hero' ||
                    block.type === 'promo_banner' ||
                    block.type === 'gifts_section') && (
                    <div className="pt-2 border-t border-black/6 flex flex-wrap items-center gap-4">
                      {block.imageUrl && (
                        <img
                          src={block.imageUrl}
                          alt={block.title}
                          className="w-24 h-16 rounded-xl object-cover bg-white border border-black/10"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/10 text-xs font-semibold text-[#2D2A26] hover:bg-[#EBF5FD] cursor-pointer">
                        <Upload className="w-4 h-4 text-[#4FA6EE]" />
                        <span>
                          {uploadingBlockImg ? 'Subiendo...' : 'Cambiar imagen del bloque'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleBlockImageUpload(block.id, e.target.files?.[0])
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
