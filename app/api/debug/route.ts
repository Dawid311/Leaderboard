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
    // Test Vercel Blob
    const { put } = await import('@vercel/blob');
    const testData = { test: 'data', timestamp: new Date().toISOString() };
    
    const blob = await put('test.json', JSON.stringify(testData), {
      access: 'public',
      contentType: 'application/json',
    });
    
    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Blob test failed', 
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
