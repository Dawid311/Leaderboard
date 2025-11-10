import { NextRequest, NextResponse } from 'next/server';

// Hier sollte in der Produktion ein sicheres Passwort-Hashing verwendet werden
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Erfolgreiche Authentifizierung
    return NextResponse.json({ 
      success: true,
      token: btoa(`authenticated_${Date.now()}`) // Einfaches Token für die Session
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}