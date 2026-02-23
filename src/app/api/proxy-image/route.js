import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

  try {
    const response = await fetch(imageUrl);
    
    // Pastikan headers CORS benar-benar diizinkan
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*", // Kunci agar html2canvas tidak blokir
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}