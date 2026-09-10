import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createOAuthState, getAppUrl, getOAuthConfig } from '@/lib/oauth';

export async function GET() {
  try {
    const { clientId } = getOAuthConfig('facebook');
    const state = createOAuthState();
    const callbackUrl = `${getAppUrl()}/api/auth/facebook/callback`;
    const authorizationUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth');

    authorizationUrl.searchParams.set('client_id', clientId);
    authorizationUrl.searchParams.set('redirect_uri', callbackUrl);
    authorizationUrl.searchParams.set('response_type', 'code');
    authorizationUrl.searchParams.set('scope', 'email,public_profile');
    authorizationUrl.searchParams.set('state', state);

    (await cookies()).set('facebook_oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 600,
    });

    return NextResponse.redirect(authorizationUrl);
  } catch {
    return NextResponse.redirect(new URL('/login?error=facebook_config', getAppUrl()));
  }
}
