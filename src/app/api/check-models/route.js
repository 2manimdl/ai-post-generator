import { NextResponse } from 'next/server';
// Kita pakai fetch manual biar tidak tergantung versi library SDK dulu
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(baseUrl);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json(data, { status: 500 });
    }

    // Kita filter cuma model yang bisa 'generateContent' (buat teks)
    const availableModels = data.models
      .filter(m => m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name);

    return NextResponse.json({
      message: "Sukses! Ini daftar model yang halal untuk API Key Anda:",
      models: availableModels,
      fullData: data.models // Data lengkap buat jaga-jaga
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}