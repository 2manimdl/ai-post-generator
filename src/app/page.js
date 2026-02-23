"use client";

import React, { useState, useEffect } from 'react';
import { Wand2, Download, Save } from 'lucide-react';

import PosterPreview from '@/components/Canvas/PosterPreview';
import TabContent from '@/components/Editor/TabContent';
import TabDesign from '@/components/Editor/TabDesign';
import TabAssets from '@/components/Editor/TabAssets';
import TabStrategy from '@/components/Editor/TabStrategy';
import { overlayOptions } from '@/lib/utils';

import { callAPI } from '@/lib/api';
import { formatDateIndo } from '@/lib/utils';

import useFontLoader from '@/hooks/useFontLoader'; // Import hook

export default function Home() {
    const [content, setContent] = useState({
        title: 'SIAP MEMBUAT KONTEN',
        subtitle: 'Upload file atau tempel link untuk memulai narasi otomatis.',
        date: formatDateIndo(),
        image: null,
        logo: '/assets/logos/logo-dpf-white.png',
        bgImage: null,
        overlayAsset: overlayOptions[0],
        caption: '', hashtags: '', docName: '',
        footer: {
            show: true, ig: '@dpf_foundation', web: 'www.dpf.or.id', fb: 'Djalaluddin Pane Foundation', permitType: 'bwi'
        }
    });

    const [aiContext, setAiContext] = useState("");

    const [controls, setControls] = useState({
        fontFamily: 'Montserrat', // Default Font Name (Google Font)
        titleSize: 70, subtitleSize: 32, dateSize: 30,
        titleColor: '#FFFFFF', subtitleColor: '#FFFFFF',
        dateColor: '#FFFFFF', dateBgColor: 'rgba(255, 255, 255, 0.2)',
        gradientColors: { from: '#FFA500', via: '#FF8C00', to: '#FFDAB9' },
        overlayColor: '#000000', overlayOpacity: 0.1,
        assetOverlayOpacity: 1,
        logoPos: { x: 0, y: -42 },
        textPos: { x: 0, y: -25 }
    });

    // Load Font Dynamically
    useFontLoader(controls.fontFamily);

    const [activeTab, setActiveTab] = useState('content');
    const [loading, setLoading] = useState(false);
    const [promptInput, setPromptInput] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('dpf-poster-settings');
        if (saved) {
            try { setControls(prev => ({ ...prev, ...JSON.parse(saved) })); } catch (e) { }
        }
    }, []);

    const handleGenerateContent = async (source) => {
        let userInput = source === 'url' ? `Sumber URL: ${promptInput}` : `Topik Dokumen: ${content.docName}`;
        if (!userInput || (source === 'url' && !promptInput)) return alert("Input kosong!");

        setAiContext(userInput);

        const systemPrompt = `
      Anda adalah LEAD CONTENT STRATEGIST untuk "Djalaluddin Pane Foundation".
      ATURAN VISUAL: Zakat (Tangan memberi), Pendidikan (Seminar).
      FORMAT OUTPUT (Strict):
      1. [TITLE]JUDUL (Kapital, Max 7 Kata)[/TITLE]
      2. [SUBTITLE]Ringkasan Fakta (Max 20 Kata).[/SUBTITLE]
      3. [IMAGE]Prompt visual fotorealistik EN. Struktur: [Subject] + [Action] + [Env] + [Lighting]. Akhiri: "--no text"[/IMAGE]
      4. [CAPTION]3 Paragraf (Hook, Value, CTA).[/CAPTION]
      5. [HASHTAGS]Hashtag relevan.[/HASHTAGS]
      `;

        const res = await callAPI({ type: 'text', prompt: userInput, systemInstruction: systemPrompt }, setLoading);

        if (res?.choices?.[0]?.message?.content) {
            const raw = res.choices[0].message.content;
            const extract = (tag) => {
                const regex = new RegExp(`\\[${tag}\\]([\\s\\S]*?)\\[\\/${tag}\\]`, 'i');
                const match = raw.match(regex);
                return match ? match[1].trim() : "";
            };

            const newTitle = extract('TITLE').replace(/\*/g, '').toUpperCase();
            const newSubtitle = extract('SUBTITLE');
            const imagePrompt = extract('IMAGE');

            setContent(prev => ({
                ...prev,
                title: newTitle || prev.title,
                subtitle: newSubtitle || prev.subtitle,
                caption: extract('CAPTION'), hashtags: extract('HASHTAGS')
            }));

            handleGenerateImage(imagePrompt || `Topic: ${newTitle}. Context: ${newSubtitle}`);
        }
    };

    const handleGenerateImage = async (customPrompt = null) => {
        let prompt = customPrompt || `Topic: '${content.title}'. Context: ${content.subtitle}. Photorealistic, cinematic, 8k. --no text`;
        const res = await callAPI({ type: 'image', prompt: prompt }, null);
        if (res?.predictions?.[0]?.url) {
            setContent(prev => ({ ...prev, image: res.predictions[0].url, bgImage: null }));
        }
    };

    const handleRewrite = async (field, style = "standar") => {
        if (!content[field]) return;
        let instruction = "";
        if (field === 'title') instruction = "Variasi JUDUL LAIN, lebih MENARIK. Max 7 Kata. Kapital.";
        else if (field === 'subtitle') instruction = "Paraphrase ringkas, padat (Max 20 kata).";
        else if (field === 'caption') instruction = `Rewrite gaya: ${style}.`;

        const promptContext = `ASAL: "${content[field]}" INSTRUKSI: ${instruction} OUTPUT HANYA TEKS.`;
        const res = await callAPI({ type: 'text', prompt: promptContext }, setLoading);
        if (res?.choices?.[0]?.message?.content) {
            let txt = res.choices[0].message.content.replace(/"/g, '').replace(/\[.*?\]/g, '').trim();
            if (field === 'title') txt = txt.toUpperCase();
            setContent(prev => ({ ...prev, [field]: txt }));
        }
    };

    const handleUpload = (e, key) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = '';

        if (key === 'doc') {
            setContent(prev => ({ ...prev, docName: file.name }));
            alert("Dokumen siap.");
        } else {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const result = ev.target.result;
                setContent(prev => {
                    const newState = { ...prev };
                    if (key === 'bgImage') { newState.bgImage = result; newState.image = null; }
                    else if (key === 'logo') { newState.logo = result; }
                    else { newState[key] = result; }
                    return newState;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = async () => {
        const html2canvas = (await import('html2canvas')).default;
        const element = document.getElementById('poster-canvas-real');
        if (!element) return alert("Canvas element not found!");

        try {
            setLoading(true);
            await new Promise(r => setTimeout(r, 2000)); // Delay sedikit lebih lama agar gambar load sempurna

            const canvas = await html2canvas(element, {
                useCORS: true,
                scale: 3,
                width: 1080,
                height: 1350,
                backgroundColor: null,
                // PENTING: allowTaint FALSE agar CORS bekerja dengan benar untuk gambar
                allowTaint: false,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 1080,
                windowHeight: 1350
            });

            const link = document.createElement('a');
            link.download = `POSTER-DPF-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error("Download Error:", err);
            alert(`Gagal download: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-100 font-sans">
            <div className="w-full md:w-[400px] bg-white border-r p-6 flex flex-col h-screen overflow-y-auto shadow-xl z-20">
                <h1 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 tracking-tighter">
                    <Wand2 className="text-orange-500" /> DPF CREATOR <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded">PRO</span>
                </h1>

                <div className="flex bg-slate-100 p-1 rounded-lg mb-6 sticky top-0 z-10">
                    {['content', 'design', 'assets', 'strategy'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === tab ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 pb-10">
                    {activeTab === 'content' && (
                        <TabContent content={content} setContent={setContent} promptInput={promptInput} setPromptInput={setPromptInput} loading={loading} handleGenerateContent={handleGenerateContent} handleGenerateImage={handleGenerateImage} handleRewrite={handleRewrite} handleUpload={handleUpload} />
                    )}
                    {activeTab === 'design' && <TabDesign controls={controls} setControls={setControls} />}
                    {activeTab === 'assets' && (
                        <TabAssets content={content} setContent={setContent} controls={controls} setControls={setControls} handleUpload={handleUpload} />
                    )}
                    {activeTab === 'strategy' && <TabStrategy content={content} setContent={setContent} handleRewrite={handleRewrite} />}
                </div>

                <div className="mt-auto pt-4 border-t space-y-2 bg-white sticky bottom-0">
                    <button onClick={() => { localStorage.setItem('dpf-poster-settings', JSON.stringify(controls)); alert("Preset Saved!"); }} className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"><Save size={14} /> SIMPAN PRESET</button>
                    <button onClick={handleDownload} disabled={loading} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:bg-slate-400">{loading ? "PROCESSING..." : <><Download size={18} /> DOWNLOAD HD</>}</button>
                </div>
            </div>

            <div className="flex-1 bg-slate-200 flex items-center justify-center p-8 relative overflow-hidden">
                <div className="scale-[0.85] md:scale-100 shadow-2xl border-4 border-white transition-all ring-1 ring-slate-300">
                    <PosterPreview content={content} controls={controls} setControls={setControls} isReal={false} />
                </div>

                {/* Hidden Canvas untuk Download (Isolated for Layout Stability) */}
                <div style={{
                    position: 'absolute', opacity: 0, pointerEvents: 'none', zIndex: -100, top: '-5000px', left: '-5000px',
                    width: '1080px', height: '1350px', overflow: 'hidden'
                }}>
                    <PosterPreview content={content} controls={controls} isReal={true} />
                </div>
            </div>
        </div >
    );
}