import { NextResponse } from 'next/server';
import { createOAuthState, getAppUrl, getOAuthConfig } from '@/lib/oauth';

export async function GET() {
  try {
    const { clientId } = getOAuthConfig('google');
    const state = createOAuthState();
    const callbackUrl = `${getAppUrl()}/api/auth/callback/google`;
    const authorizationUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('redirect_uri', callbackUrl);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'openid email profile');
    authorizationUrl.searchParams.set('state', state);
    authorizationUrl.searchParams.set('access_type', 'online');

    // إنشاء التوجيه لصفحة Google
    const response = NextResponse.redirect(authorizationUrl);

    // تعيين الكوكيز مباشرة على كائن الاستجابة لتثبيتها بنجاح
    response.cookies.set('google_oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 600,
    });

    return response;
  } catch {
    return NextResponse.redirect(new URL('/login?error=google_config', getAppUrl()));
  }
}