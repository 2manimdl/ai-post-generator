import React from 'react';
import { captionStyles } from '@/lib/utils'; // Mengambil daftar gaya dari utils
import { RefreshCcw } from 'lucide-react';

export default function TabStrategy({ content, setContent, handleRewrite }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-left-5">
        
        {/* GENERATOR CAPTION */}
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-black text-orange-600 uppercase">Caption Instagram</p>
                
                {/* Dropdown Gaya Bahasa */}
                <select 
                    className="text-[9px] p-1 rounded border border-orange-200 bg-white outline-none cursor-pointer hover:border-orange-500 transition-all"
                    onChange={(e) => handleRewrite('caption', e.target.value)}
                >
                    <option value="standar">Pilih Gaya...</option>
                    {captionStyles.map(style => (
                        <option key={style.name} value={style.value}>{style.name}</option>
                    ))}
                </select>
            </div>
            
            <textarea 
                value={content.caption} 
                onChange={e => setContent({...content, caption: e.target.value})} 
                className="w-full p-2 text-xs bg-white rounded border h-40 focus:outline-none focus:border-orange-500 mb-2 resize-none"
                placeholder="Caption otomatis akan muncul di sini..."
            />
            
            {/* Tombol Regenerate Khusus Caption */}
            <button 
                onClick={() => handleRewrite('caption', 'standar')} 
                className="text-[10px] flex items-center gap-1 text-orange-600 font-bold hover:bg-orange-100 px-2 py-1 rounded transition-all"
            >
                <RefreshCcw size={10}/> ULANGI BUAT CAPTION
            </button>
        </div>

        {/* HASHTAGS */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-xs font-black text-slate-500 uppercase mb-2">Hashtags</p>
            <textarea 
                value={content.hashtags} 
                onChange={e => setContent({...content, hashtags: e.target.value})} 
                className="w-full p-2 text-xs bg-white rounded border h-24 text-blue-600 focus:outline-none focus:border-blue-500 font-mono"
            />
        </div>
    </div>
  );
}