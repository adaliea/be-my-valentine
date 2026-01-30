import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const token = url.searchParams.get('token');

  // If the token is present in the URL
  if (token) {
    // Remove the token from the query params
    url.searchParams.delete('token');
    
    // Create a redirect response to the clean URL
    const response = NextResponse.redirect(url);
    
    // Set the token in a httpOnly cookie
    const isSecure = url.protocol === 'https:';
    
    response.cookies.set('valentine_token', token, {
      httpOnly: true,
      secure: isSecure,
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