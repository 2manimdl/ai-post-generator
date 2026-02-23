import React from 'react';

// Komponen Kecil: Input Warna + Text Hex
const ColorInput = ({ label, value, onChange }) => (
    <div className="flex justify-between items-center">
        <span className="text-xs font-bold">{label}</span>
        <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute -top-2 -left-2 w-10 h-10 cursor-pointer p-0 border-0"
                />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-16 text-[10px] p-1 border rounded uppercase font-mono text-center focus:border-orange-500 outline-none"
                placeholder="#000000"
            />
        </div>
    </div>
);

export default function TabDesign({ controls, setControls }) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-5">

            {/* UKURAN FONT */}
            <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 border-b pb-2">Ukuran Font</p>
                {['titleSize', 'subtitleSize', 'dateSize'].map((key) => (
                    <div key={key} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold capitalize">
                            <span>{key.replace('Size', '')}</span>
                            <span>{controls[key]}px</span>
                        </div>
                        <input
                            type="range"
                            min="8"
                            max="100"
                            value={controls[key]}
                            onChange={e => setControls({ ...controls, [key]: e.target.value })}
                            className="w-full accent-slate-900"
                        />
                    </div>
                ))}
            </div>

            {/* WARNA TEKS */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 border-b pb-2">Warna Teks</p>
                <ColorInput label="Judul" value={controls.titleColor} onChange={v => setControls({ ...controls, titleColor: v })} />
                <ColorInput label="Subtitle" value={controls.subtitleColor} onChange={v => setControls({ ...controls, subtitleColor: v })} />
                <ColorInput label="Teks Tanggal" value={controls.dateColor} onChange={v => setControls({ ...controls, dateColor: v })} />
                <ColorInput label="Bg Tanggal" value={controls.dateBgColor} onChange={v => setControls({ ...controls, dateBgColor: v })} />
            </div>
        </div>
    );
}