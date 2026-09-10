import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createSession } from '@/lib/auth';
import { findOrCreateOAuthUser, getAppUrl, getOAuthConfig } from '@/lib/oauth';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieStore = await cookies();
  const savedState = cookieStore.get('google_oauth_state')?.value;
  const redirectToLogin = () => NextResponse.redirect(new URL('/login?error=google', getAppUrl()));

  cookieStore.delete('google_oauth_state');
  if (!code || !state || state !== savedState) return redirectToLogin();

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
    if (!tokenResponse.ok) return redirectToLogin();

    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenData.access_token) return redirectToLogin();

    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    if (!profileResponse.ok) return redirectToLogin();

    const profile = await profileResponse.json() as {
      given_name?: string;
      name?: string;
      email?: string;
      email_verified?: boolean;
    };
    if (!profile.email || profile.email_verified === false) return redirectToLogin();

    const userId = await findOrCreateOAuthUser(profile.given_name || profile.name || 'User', profile.email);
    await createSession(userId);
    return NextResponse.redirect(new URL('/home', getAppUrl()));
  } catch {
    return redirectToLogin();
  }
}
