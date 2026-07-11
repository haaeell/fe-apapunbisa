export const DEFAULT_SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://apapunbisa.id').replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  if (!path) return DEFAULT_SITE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${DEFAULT_SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
