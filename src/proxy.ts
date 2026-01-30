import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = url.searchParams.get('t');

  // If the token is present in the URL
  if (token) {
    // Remove the token from the query params
    url.searchParams.delete('t');
    
    // Create a redirect response to the clean URL
    const response = NextResponse.redirect(url);
    
    // Set the token in a httpOnly cookie
    response.cookies.set('valentine_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
