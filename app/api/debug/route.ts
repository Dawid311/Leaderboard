import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const env = {
      NODE_ENV: process.env.NODE_ENV,
      hasBlob: !!process.env.BLOB_READ_WRITE_TOKEN,
      blobToken: process.env.BLOB_READ_WRITE_TOKEN ? 'SET' : 'NOT_SET'
    };
    
    return NextResponse.json(env);
  } catch (error) {
    return NextResponse.json({ error: 'Debug failed', details: String(error) }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Erstelle eine prizes.json Datei mit Standard-Preisen
    const defaultPrizes = [
      {"position":1,"description":"🥇 1. Platz - Gold","value":"5000€"},
      {"position":2,"description":"🥈 2. Platz - Silber","value":"2500€"}, 
      {"position":3,"description":"🥉 3. Platz - Bronze","value":"1250€"},
      {"position":4,"description":"4. Platz","value":"625€"},
      {"position":5,"description":"5. Platz","value":"300€"}
    ];
    
    const { put } = await import('@vercel/blob');
    const blob = await put('prizes.json', JSON.stringify(defaultPrizes), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    });
    
    return NextResponse.json({ success: true, url: blob.url, data: defaultPrizes });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to create prizes', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
