import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAppUrl, getOAuthConfig, findOrCreateOAuthUser } from '@/lib/oauth';
import { createSession, sessionCookie } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const savedState = cookieStore.get('google_oauth_state')?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', getAppUrl()));
  }

  try {
    const { clientId, clientSecret } = getOAuthConfig('google');
    const redirectUri = `${getAppUrl()}/api/auth/callback/google`;

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
      return NextResponse.redirect(new URL('/login?error=token_error', getAppUrl()));
    }

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', getAppUrl()));
    }

    const userId = await findOrCreateOAuthUser(
      googleUser.name || googleUser.given_name || 'User',
      googleUser.email
    );

    // 1. إنشاء الجلسة في الداتابيز واستخراج التوكين
    const { token, expiresAt } = await createSession(userId);

    // 2. إنشاء الاستجابة للتوجيه للصفحة الرئيسية
    const response = NextResponse.redirect(new URL('/', getAppUrl()));

    // 3. تثبيت كوكيز الجلسة صراحة على كائن الاستجابة
    response.cookies.set(sessionCookie, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(expiresAt),
    });

    // 4. مسح state الكوكيز
    response.cookies.delete('google_oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', getAppUrl()));
  }
}