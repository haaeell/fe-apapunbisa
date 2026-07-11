import { Helmet } from 'react-helmet-async';
import { useSettings } from '../../hooks/useSettings';
import { absoluteUrl } from '../../utils/seo';

export default function Seo({
  title,
  description,
  image,
  path = '/',
  type = 'website',
  keywords,
  jsonLd,
  noIndex = false,
}) {
  const { settings } = useSettings();
  const siteName = settings?.site_name || 'Apapun Bisa';
  const finalTitle = title || settings?.seo?.title || siteName;
  const finalDescription = description || settings?.seo?.description || settings?.tagline || '';
  const finalImage = image || settings?.seo?.image || settings?.logo || undefined;
  const canonicalUrl = absoluteUrl(path);

  return (
    <Helmet>
      <title>{finalTitle}</title>
      {finalDescription && <meta name="description" content={finalDescription} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      {finalDescription && <meta property="og:description" content={finalDescription} />}
      <meta property="og:url" content={canonicalUrl} />
      {finalImage && <meta property="og:image" content={absoluteUrl(finalImage)} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      {finalDescription && <meta name="twitter:description" content={finalDescription} />}
      {finalImage && <meta name="twitter:image" content={absoluteUrl(finalImage)} />}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
