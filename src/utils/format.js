export function formatPrice(value) {
  if (value === null || value === undefined) return '';

  const number = Number(value);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

export function formatDate(dateString) {
  if (!dateString) return '';

  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function packagePriceLabel(pkg) {
  if (pkg.price_type === 'contact') return 'Hubungi Kami';
  if (pkg.price_type === 'starting') return `Mulai dari ${formatPrice(pkg.price)}`;
  return formatPrice(pkg.price);
}
