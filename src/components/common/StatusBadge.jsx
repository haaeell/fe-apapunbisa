import Badge from './Badge';

const STATUS_MAP = {
  true: { label: 'Aktif', variant: 'success' },
  false: { label: 'Nonaktif', variant: 'neutral' },
  active: { label: 'Aktif', variant: 'success' },
  inactive: { label: 'Nonaktif', variant: 'neutral' },
  published: { label: 'Published', variant: 'success' },
  draft: { label: 'Draft', variant: 'neutral' },
  new: { label: 'Baru', variant: 'primary' },
  contacted: { label: 'Dihubungi', variant: 'warning' },
  processing: { label: 'Diproses', variant: 'primary' },
  done: { label: 'Selesai', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'danger' },
};

export default function StatusBadge({ status }) {
  const key = String(status);
  const entry = STATUS_MAP[key] || { label: key, variant: 'neutral' };

  return <Badge variant={entry.variant}>{entry.label}</Badge>;
}
