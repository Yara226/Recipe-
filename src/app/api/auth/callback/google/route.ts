import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAppUrl, getOAuthConfig, findOrCreateOAuthUser } from '@/lib/oauth';
import { createSession } from '@/lib/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const cookieStore = await cookies();
  const savedState = cookieStore.get('google_oauth_state')?.value;

  // 1. التحقق من صحة الـ State لحماية الموقع
  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/login?error=invalid_state', getAppUrl()));
  }

  try {
    const { clientId, clientSecret } = getOAuthConfig('google');
    const redirectUri = `${getAppUrl()}/api/auth/callback/google`;

    // 2. تبديل الـ Code بـ Access Token من Google
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

    // 3. جلب بيانات المستخدم من Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=no_email', getAppUrl()));
    }

    // 4. إنشاء أو إيجاد المستخدم في Turso Database
    const userId = await findOrCreateOAuthUser(
      googleUser.name || googleUser.given_name || 'User',
      googleUser.email
    );

    // 5. إنشاء الجلسة وتخزين الـ Cookie
    await createSession(userId);

    // 6. التوجيه بنجاح إلى الصفحة الرئيسية
    const response = NextResponse.redirect(new URL('/', getAppUrl()));
    response.cookies.delete('google_oauth_state');
    return response;
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(new URL('/login?error=oauth_failed', getAppUrl()));
  }
}