import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Use private env vars (without NEXT_PUBLIC_)
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'zyndrix2026';

    if (username === adminUser && password === adminPass) {
      return NextResponse.json({ 
        success: true, 
        message: 'Acceso concedido',
        token: 'active_session_token_' + Date.now() // Mock token
      });
    }

    return NextResponse.json(
      { success: false, error: 'Identificador o clave incorrectos.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error en el servidor de autenticación.' },
      { status: 500 }
    );
  }
}
