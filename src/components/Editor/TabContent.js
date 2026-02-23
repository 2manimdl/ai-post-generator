import React from 'react';
import { Wand2, FileText, RefreshCcw, ImageIcon } from 'lucide-react';

export default function TabContent({ content, setContent, promptInput, setPromptInput, loading, handleGenerateContent, handleGenerateImage, handleRewrite, handleUpload }) {
  return (
    <div className="space-y-6">
        {/* INPUT URL */}
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Input Link Berita</label>
            <div className="flex gap-2">
                <input value={promptInput} onChange={e => setPromptInput(e.target.value)} className="flex-1 p-3 border rounded-xl text-sm" placeholder="Paste URL..." />
                <button onClick={() => handleGenerateContent('url')} disabled={loading} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-black">
                    {loading ? <RefreshCcw className="animate-spin" size={18}/> : <Wand2 size={18}/>}
                </button>
            </div>
        </div>

        {/* UPLOAD DOC */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange-500 relative bg-slate-50 group transition-all">
            <FileText className="mx-auto text-slate-400 mb-2 group-hover:text-orange-500"/>
            <p className="text-xs font-bold text-slate-500">{content.docName || "Upload Dokumen (PDF/TXT)"}</p>
            <input type="file" accept=".pdf,.txt,.doc" onChange={(e) => handleUpload(e, 'doc')} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
        {content.docName && <button onClick={() => handleGenerateContent('doc')} className="w-full py-2 bg-orange-500 text-white font-bold rounded-xl text-xs">GENERATE DARI DOKUMEN</button>}

        {/* EDITOR TEXT */}
        <div className="pt-4 border-t space-y-4">
            <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase">Judul</label><button onClick={() => handleRewrite('title')} className="text-[10px] text-orange-500 font-bold hover:underline">REWRITE</button></div>
            <input value={content.title} onChange={e => setContent({...content, title: e.target.value.toUpperCase()})} className="w-full p-3 border rounded-xl font-bold text-sm" />
            
            <div className="flex justify-between items-center"><label className="text-[10px] font-bold uppercase">Subtitle</label><button onClick={() => handleRewrite('subtitle')} className="text-[10px] text-orange-500 font-bold hover:underline">REWRITE</button></div>
            <textarea value={content.subtitle} onChange={e => setContent({...content, subtitle: e.target.value})} className="w-full p-3 border rounded-xl text-sm h-20" />
        </div>

        {/* RE-GENERATE IMAGE */}
        <button onClick={() => handleGenerateImage(null)} disabled={loading} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900">
            <ImageIcon size={18}/> {loading ? "MEMPROSES..." : "RE-GENERATE GAMBAR (FLUX)"}
        </button>
    </div>
  );
}