import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuthConfig, findOrCreateOAuthUser } from '@/lib/oauth';
import { createSession, sessionCookie, sessionDuration } from '@/lib/auth';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const baseUrl = requestUrl.origin;

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

    // 1. إنشاء الجلسة في قاعدة البيانات
    const { token, expiresAt } = await createSession(userId);

    // 2. تعيين الكوكيز مباشرة في الـ CookieStore
    cookieStore.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(expiresAt),
    });

    // 3. حذف كوكيز الـ state القديمة
    cookieStore.delete('google_oauth_state');

    // 4. إنشاء التوجيه بعد تثبيت الكوكيز
    const response = NextResponse.redirect(new URL('/home', baseUrl));

    // 5. تأكيد تعيين الكوكيز على كائن الاستجابة أيضاً لضمان قبولها في Vercel
    response.cookies.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(expiresAt),
    });

    return response;
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', baseUrl));
  }
}
