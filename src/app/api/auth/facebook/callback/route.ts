import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSession } from '@/lib/auth';
import { findOrCreateOAuthUser, getAppUrl, getOAuthConfig } from '@/lib/oauth';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieStore = await cookies();
  const savedState = cookieStore.get('facebook_oauth_state')?.value;
  const redirectToLogin = () => NextResponse.redirect(new URL('/login?error=facebook', getAppUrl()));

  cookieStore.delete('facebook_oauth_state');
  if (!code || !state || state !== savedState) return redirectToLogin();

  try {
    const { clientId, clientSecret } = getOAuthConfig('facebook');
    const redirectUri = `${getAppUrl()}/api/auth/facebook/callback`;
    const tokenUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', clientId);
    tokenUrl.searchParams.set('client_secret', clientSecret);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('code', code);

    const tokenResponse = await fetch(tokenUrl);
    if (!tokenResponse.ok) return redirectToLogin();
    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenData.access_token) return redirectToLogin();

    const profileUrl = new URL('https://graph.facebook.com/me');
    profileUrl.searchParams.set('fields', 'id,name,email');
    profileUrl.searchParams.set('access_token', tokenData.access_token);
    const profileResponse = await fetch(profileUrl);
    if (!profileResponse.ok) return redirectToLogin();

    const profile = await profileResponse.json() as { name?: string; email?: string };
    if (!profile.email) return redirectToLogin();

    const userId = await findOrCreateOAuthUser(profile.name || 'User', profile.email);
    await createSession(userId);
    return NextResponse.redirect(new URL('/home', getAppUrl()));
  } catch {
    return redirectToLogin();
  }
}
