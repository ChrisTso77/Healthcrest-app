import { assertReleaseCommit, RELEASE_HEADER } from './release-identity.mjs';

export const PREVIEW_ORIGIN = 'https://healthcrest-9ivz4lh3f-tsotsoft.vercel.app';
export const PREVIEW_COMMIT = '9d5dbca88426152c3dad56c41d2db05a68acf7b9';
export const TRUSTED_REF = 'refs/heads/codex/healthcrest-preview-auth';
export const TRUSTED_WORKFLOW = 'Healthcrest protected Preview verification';
const header = 'x-vercel-trusted-oidc-idp-token';

export function protectedPreviewAuth(environment, origin, expectedCommit) {
  if (environment.GITHUB_ACTIONS !== 'true' || environment.GITHUB_EVENT_NAME !== 'workflow_dispatch' ||
      environment.GITHUB_REPOSITORY !== 'ChrisTso77/Healthcrest-app' ||
      environment.GITHUB_REF !== TRUSTED_REF || environment.GITHUB_WORKFLOW !== TRUSTED_WORKFLOW ||
      origin !== PREVIEW_ORIGIN || expectedCommit !== PREVIEW_COMMIT) {
    throw new Error('Protected verification requires the approved manual workflow, trusted ref and frozen Preview target.');
  }
  const token = environment.HEALTHCREST_PREVIEW_OIDC_TOKEN;
  if (typeof token !== 'string' || !token || /\s/.test(token)) throw new Error('Protected Preview OIDC credential is unavailable or invalid.');
  return Object.freeze({ origin, token });
}

export function isProtectedPreviewRequest(value, auth) {
  try {
    const url = new URL(value);
    return url.origin === PREVIEW_ORIGIN && url.origin === auth.origin && !url.username && !url.password;
  } catch { return false; }
}

export function protectedPreviewGet(request, url, options, auth) {
  if (!isProtectedPreviewRequest(url, auth)) throw new Error('Protected request target is outside the approved Preview.');
  return request.get(url, { ...options, maxRedirects: 0,
    headers: { ...options?.headers, [header]: auth.token } });
}

export function protectedPreviewRoute(route, auth) {
  if (!isProtectedPreviewRequest(route.request().url(), auth) || !['GET', 'HEAD'].includes(route.request().method())) return route.abort();
  return route.continue({ headers: { ...route.request().headers(), [header]: auth.token } });
}

export function protectedPreviewIdentity(response, expectedCommit) {
  if (expectedCommit !== PREVIEW_COMMIT || response.status() !== 200) {
    throw new Error(`Protected Preview identity requires HTTP 200 without redirects (received ${response.status()}).`);
  }
  return assertReleaseCommit(response.headers()[RELEASE_HEADER.toLowerCase()], expectedCommit);
}

export function anonymousPreviewProtection(response) {
  const status = response.status();
  if (status === 401 || status === 403) return { status, protected: true };
  if (status === 302) {
    try {
      const location = new URL(response.headers().location);
      if (location.origin === 'https://vercel.com' && location.pathname === '/sso-api') {
        return { status, protected: true, redirectOrigin: location.origin, redirectPath: location.pathname };
      }
    } catch { /* Do not retain arbitrary Location values or authentication nonces. */ }
  }
  throw new Error(`Anonymous Preview protection was not established (HTTP ${status}).`);
}

export function redactPreviewCredential(value, token) {
  const text = String(value);
  return token ? text.split(token).join('[REDACTED]') : text;
}
