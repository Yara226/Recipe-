import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuthConfig, findOrCreateOAuthUser } from '@/lib/oauth';
import { createSession, sessionCookie } from '@/lib/auth';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const baseUrl = requestUrl.origin; // يضمن استخدام نفس الدومين المطلوب تماماً

  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');

  const cookieStore = await cookies();
  const savedState = cookieStore.get('google_oauth_state')?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', baseUrl));
  }

  try {
    const { clientId, clientSecret } = getOAuthConfig('google');
    const redirectUri = `${baseUrl}/api/auth/callback/google`;

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token Error Details:', tokenData);
      return NextResponse.redirect(new URL('/login?error=token_error', baseUrl));
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', baseUrl));
    }

    const userId = await findOrCreateOAuthUser(
      googleUser.name || googleUser.given_name || 'User',
      googleUser.email
    );

    // 1. إنشاء الجلسة في الداتابيز
    const { token, expiresAt } = await createSession(userId);

    // 2. إنشاء التوجيه باستخدام نفس الـ Origin لتفادي مسح الكوكيز
    const response = NextResponse.redirect(new URL('/', baseUrl));

    // 3. ربط الكوكيز بالاستجابة
    response.cookies.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(expiresAt),
    });

    response.cookies.delete('google_oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', baseUrl));
  }
}