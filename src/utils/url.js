export function externalUrl(url) {
  if (!url) return '';
  const trimmedUrl = String(url).trim();
  if (!trimmedUrl) return '';

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}
