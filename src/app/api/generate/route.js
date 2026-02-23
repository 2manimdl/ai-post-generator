import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { type, prompt, systemInstruction } = await req.json();

    // --- 1. GENERATE TEKS (GROQ) ---
    if (type === 'text') {
      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) throw new Error("GROQ_API_KEY tidak ditemukan");

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // GANTI MODEL DISINI:
          // Opsi 1 (Paling Cerdas & Cepat): "llama-3.3-70b-versatile"
          // Opsi 2 (Paling Ringan): "llama-3.1-8b-instant"
          model: "llama-3.3-70b-versatile", 
          messages: [
            { role: "system", content: systemInstruction || "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      // Cek error spesifik dari API Groq
      if (!response.ok) {
          console.error("Groq API Error Detail:", data);
          throw new Error(data.error?.message || "Groq API Error");
      }
      
      return NextResponse.json(data);
    }

    // --- 2. GENERATE GAMBAR (SILICONFLOW / FLUX) ---
    if (type === 'image') {
      const apiKey = process.env.SILICONFLOW_API_KEY;
      if (!apiKey) throw new Error("SILICONFLOW_API_KEY tidak ditemukan");

      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell", // Model Flux Speed
          prompt: prompt,
          image_size: "1024x1024",
          num_inference_steps: 4
        }),
      });

      const data = await response.json();
      const imageUrl = data?.images?.[0]?.url || data?.data?.[0]?.url;
      
      if (!response.ok || !imageUrl) {
        console.error("Silicon Error:", data);
        throw new Error(data.message || "Gagal generate gambar");
      }

      return NextResponse.json({
        predictions: [{ url: imageUrl }]
      });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}