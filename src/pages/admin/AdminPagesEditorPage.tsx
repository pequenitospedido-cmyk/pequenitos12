import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Edit3, Check, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { EditablePageContent } from '../../types/product';

export const AdminPagesEditorPage: React.FC = () => {
  const { pagesContent, savePageContent } = useStore();
  const [editingPage, setEditingPage] = useState<EditablePageContent | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    await savePageContent(editingPage);
    setSavedMsg(`Página "${editingPage.title}" actualizada.`);
    setEditingPage(null);
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-xs font-semibold text-[#4FA6EE]">Contenido institucional</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D2A26]">
          Páginas de la Tienda
        </h1>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-[#ECF9F4] border border-[#53C59B]/40 text-xs sm:text-sm font-semibold text-[#2D2A26] flex items-center gap-2">
          <Check className="w-4 h-4 text-[#53C59B]" />
          <span>{savedMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pagesContent.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-3xl p-6 border border-black/6 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#6E685F]">
                <span className="font-mono">/{page.slug}</span>
                <span className="text-[#53C59B] font-semibold">Publicada</span>
              </div>
              <h2 className="font-display text-xl font-semibold text-[#2D2A26]">{page.title}</h2>
              <p className="text-xs text-[#6E685F] line-clamp-3 leading-relaxed">{page.body}</p>
            </div>

            <div className="pt-3 border-t border-black/6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingPage(page)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D2A26] hover:text-[#4FA6EE] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar textos</span>
              </button>

              <Link
                to={`/${page.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#4FA6EE] hover:underline"
              >
                <span>Ver página</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {editingPage && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#4FA6EE] shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-black/6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4FA6EE]" />
              <h2 className="font-display text-lg font-semibold text-[#2D2A26]">
                Editando página: /{editingPage.slug}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1">Título</label>
              <input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1">Subtítulo</label>
              <input
                type="text"
                value={editingPage.subtitle}
                onChange={(e) => setEditingPage({ ...editingPage, subtitle: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              />
            </div>
          </div>

          {editingPage.quote !== undefined && (
            <div>
              <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
                Frase destacada
              </label>
              <input
                type="text"
                value={editingPage.quote}
                onChange={(e) => setEditingPage({ ...editingPage, quote: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#2D2A26] mb-1">
              Contenido principal
            </label>
            <textarea
              rows={4}
              value={editingPage.body}
              onChange={(e) => setEditingPage({ ...editingPage, body: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#FDFBF7] border border-black/10 text-sm text-[#2D2A26]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingPage(null)}
              className="px-5 py-2.5 rounded-full bg-[#F7F3EC] text-xs font-semibold text-[#2D2A26] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#2D2A26] text-white text-xs font-semibold cursor-pointer"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
