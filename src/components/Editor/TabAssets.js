import React from 'react';
import { Layers, Stamp, ImageIcon, XCircle } from 'lucide-react';
import { overlayOptions, fontOptions, logoOptions } from '@/lib/utils';

export default function TabAssets({ content, setContent, controls, setControls, handleUpload }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-5">

            {/* FONT */}
            <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400">Jenis Font (Google Fonts)</p>
                <select
                    value={controls.fontFamily}
                    onChange={(e) => setControls({ ...controls, fontFamily: e.target.value })}
                    className="w-full p-2 text-[10px] font-bold border rounded bg-white text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
                >
                    {[...new Set(fontOptions.map(f => f.category))].map(category => (
                        <optgroup label={category} key={category}>
                            {fontOptions.filter(f => f.category === category).map(font => (
                                <option value={font.value} key={font.value}>{font.name}</option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            {/* LOGO */}
            <div className="space-y-2">
                <div className="flex justify-between items-center"><p className="text-[10px] font-black uppercase text-slate-400">Pilih Logo</p><button onClick={() => setContent(prev => ({ ...prev, logo: null }))} className="text-[9px] text-red-500 flex items-center gap-1 hover:bg-red-50 px-2 rounded"><XCircle size={10} /> Hapus Logo</button></div>
                <div className="grid grid-cols-3 gap-2">
                    {logoOptions.map((logo, idx) => (
                        <button key={idx} type="button" onClick={() => setContent(prev => ({ ...prev, logo: logo.src }))} className={`p-2 border rounded cursor-pointer hover:border-orange-500 flex flex-col items-center justify-center bg-white h-20 transition-all ${content.logo === logo.src ? 'border-orange-500 ring-2 ring-orange-100' : ''}`}>
                            <div className="w-full h-8 flex items-center justify-center mb-1"><img src={logo.src} alt="logo" className="max-h-full max-w-full object-contain" /></div>
                            <span className="text-[8px] text-center leading-tight truncate w-full px-1">{logo.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* OVERLAY SECTION */}
            <div className="space-y-2 pt-4 border-t">
                <p className="text-[10px] font-black uppercase text-slate-400">Pilih Overlay</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    {overlayOptions.map((asset, idx) => (
                        <button key={idx} type="button" onClick={() => setContent(prev => ({ ...prev, overlayAsset: asset }))} className={`p-3 border rounded-lg cursor-pointer hover:border-orange-500 transition-all flex items-center gap-2 text-left ${content.overlayAsset?.name === asset.name ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-200' : 'bg-white'}`}>
                            <Layers size={16} className="text-slate-500 shrink-0" /> <p className="text-[9px] font-bold uppercase truncate">{asset.name}</p>
                        </button>
                    ))}
                </div>

                {/* KONTROL KHUSUS DPF GRADIENT */}
                {content.overlayAsset?.styleType === 'dpf-gradient' && (
                    <div className="p-3 bg-orange-50 border border-orange-100 rounded-lg space-y-2">
                        <p className="text-[9px] font-bold text-orange-600 uppercase">Warna Gradient (Top - Mid - Bottom)</p>
                        <div className="flex justify-between gap-1">
                            <input type="color" value={controls.gradientColors.from} onChange={(e) => setControls({ ...controls, gradientColors: { ...controls.gradientColors, from: e.target.value } })} className="flex-1 h-8 border rounded cursor-pointer" title="Warna Atas" />
                            <input type="color" value={controls.gradientColors.via} onChange={(e) => setControls({ ...controls, gradientColors: { ...controls.gradientColors, via: e.target.value } })} className="flex-1 h-8 border rounded cursor-pointer" title="Warna Tengah" />
                            <input type="color" value={controls.gradientColors.to} onChange={(e) => setControls({ ...controls, gradientColors: { ...controls.gradientColors, to: e.target.value } })} className="flex-1 h-8 border rounded cursor-pointer" title="Warna Bawah" />
                        </div>
                    </div>
                )}

                {/* KONTROL WARNA OVERLAY CSS (Non-Gradient) */}
                {content.overlayAsset?.type === 'css' && content.overlayAsset?.styleType !== 'dpf-gradient' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                        <p className="text-[9px] font-bold text-slate-600 uppercase">Warna Overlay</p>
                        <input type="color" value={controls.singleOverlayColor} onChange={(e) => setControls({ ...controls, singleOverlayColor: e.target.value })} className="w-full h-8 border rounded cursor-pointer" title="Warna Overlay" />
                    </div>
                )}

                {/* KONTROL OPACITY GLOBAL UNTUK SEMUA OVERLAY */}
                {content.overlayAsset && content.overlayAsset.type !== 'none' && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex justify-between text-[9px] mb-1 font-bold"><span>Intensitas Overlay</span><span>{Math.round(controls.assetOverlayOpacity * 100)}%</span></div>
                        <input type="range" min="0" max="1" step="0.1" value={controls.assetOverlayOpacity} onChange={e => setControls({ ...controls, assetOverlayOpacity: e.target.value })} className="w-full accent-slate-900" />
                    </div>
                )}
            </div>

            {/* FOOTER SETTINGS */}
            <div className="space-y-4 pt-4 border-t">
                <div className="flex justify-between items-center"><p className="text-[10px] font-black uppercase text-slate-400">Footer Informasi</p><button onClick={() => setContent(prev => ({ ...prev, footer: { ...prev.footer, show: !prev.footer?.show } }))} className={`text-[9px] px-2 py-0.5 rounded border ${content.footer?.show ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500'}`}>{content.footer?.show ? 'ON' : 'OFF'}</button></div>
                {content.footer?.show && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                        <div className="flex gap-2">
                            <button onClick={() => setContent({ ...content, footer: { ...content.footer, permitType: 'bwi' } })} className={`flex-1 p-2 rounded text-[9px] font-bold border ${content.footer.permitType === 'bwi' ? 'bg-orange-500 text-white' : 'bg-white'}`}>IZIN BWI</button>
                            <button onClick={() => setContent({ ...content, footer: { ...content.footer, permitType: 'amil' } })} className={`flex-1 p-2 rounded text-[9px] font-bold border ${content.footer.permitType === 'amil' ? 'bg-orange-500 text-white' : 'bg-white'}`}>IZIN AMIL</button>
                        </div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Instagram</label><input type="text" className="w-full p-2 text-[10px] border rounded" value={content.footer.ig} onChange={(e) => setContent({ ...content, footer: { ...content.footer, ig: e.target.value } })} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Website</label><input type="text" className="w-full p-2 text-[10px] border rounded" value={content.footer.web} onChange={(e) => setContent({ ...content, footer: { ...content.footer, web: e.target.value } })} /></div>
                        <div className="space-y-1"><label className="text-[9px] font-bold text-slate-500 uppercase">Facebook</label><input type="text" className="w-full p-2 text-[10px] border rounded" value={content.footer.fb} onChange={(e) => setContent({ ...content, footer: { ...content.footer, fb: e.target.value } })} /></div>
                    </div>
                )}
            </div>

            {/* UPLOAD MANUAL */}
            <div className="mt-4 border-t pt-4">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Upload Manual</p>
                <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-all"><Stamp size={18} className="text-slate-400" /><span className="text-[9px] font-bold uppercase mt-1">Logo Sendiri</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'logo')} /></label>
                    <label className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-slate-50 transition-all"><ImageIcon size={18} className="text-slate-400" /><span className="text-[9px] font-bold uppercase mt-1">Background Sendiri</span><input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'bgImage')} /></label>
                </div>
            </div>
        </div>
    );
}