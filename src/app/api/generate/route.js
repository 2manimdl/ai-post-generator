import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { type, prompt, systemInstruction } = await req.json();

    // --- 1. GENERATE TEKS (GROQ) ---
    if (type === 'text') {
      const apiKey = process.env.GROQ_API_KEY?.trim();
      if (!apiKey) throw new Error("GROQ_API_KEY tidak ditemukan di environment variables");

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", 
          messages: [
            { role: "system", content: systemInstruction || "Anda adalah asisten AI yang membantu. Jawablah selalu dalam bahasa Indonesia." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
          console.error("Groq API Error Detail:", data);
          throw new Error(data.error?.message || "Groq API Error");
      }
      
      return NextResponse.json(data);
    }

    // --- 2. GENERATE GAMBAR (POLLINATIONS AI - FLUX VIA BACKEND FETCH) ---
    if (type === 'image') {
      const encodedPrompt = encodeURIComponent(prompt);
      const MAX_RETRIES = 3;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const seed = Math.floor(Math.random() * 999999);
        // Tetap menggunakan model FLUX untuk hasil yang jernih
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

        // Atur timeout agar Vercel tidak hang jika Pollinations lambat
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 28000);

        try {
          // Fetch gambar via server Next.js (bukan browser) untuk membypass 403
          const imgResponse = await fetch(pollinationsUrl, { 
            signal: controller.signal,
            headers: { 
              'Accept': 'image/*',
              // Menyamar sebagai browser standar untuk melewati Cloudflare
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
          });
          clearTimeout(timeoutId);

          // Jika kena limit (403 dari server ke server), tunggu sebentar lalu coba lagi
          if (imgResponse.status === 403 && attempt < MAX_RETRIES - 1) {
            console.log(`[Attempt ${attempt + 1}] Pollinations memblokir (403), mencoba lagi...`);
            await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
            continue;
          }

          if (!imgResponse.ok) {
            throw new Error(`Gagal generate gambar (Status: ${imgResponse.status}). Coba lagi.`);
          }

          // Ubah menjadi Base64 agar aman ditampilkan di frontend
          const arrayBuffer = await imgResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64 = buffer.toString('base64');
          const dataUrl = `data:image/jpeg;base64,${base64}`;

          return NextResponse.json({
            predictions: [{ url: dataUrl }]
          });

        } catch (fetchErr) {
          clearTimeout(timeoutId);
          if (fetchErr.name === 'AbortError') {
             if (attempt === MAX_RETRIES - 1) throw new Error("Waktu tunggu habis. Server AI sedang sibuk, coba lagi.");
          } else {
             if (attempt === MAX_RETRIES - 1) throw fetchErr;
          }
          // Tunggu 2 detik sebelum percobaan berikutnya
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }

    return NextResponse.json({ error: "Tipe request tidak valid" }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}