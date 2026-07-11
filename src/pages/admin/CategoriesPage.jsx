import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  BookOpen,
  Briefcase,
  Camera,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Megaphone,
  MessageCircle,
  Palette,
  Pencil,
  ShoppingBag,
  Smartphone,
  Trash2,
  Video,
  Wrench,
} from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../../api/categoryApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Button from '../../components/common/Button';
import FileUploader from '../../components/common/FileUploader';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import Textarea from '../../components/common/Textarea';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

const ICON_OPTIONS = [
  { value: 'cpu', label: 'Teknologi', icon: Cpu },
  { value: 'graduation-cap', label: 'Pendidikan', icon: GraduationCap },
  { value: 'palette', label: 'Kreatif', icon: Palette },
  { value: 'message-circle', label: 'Konsultasi', icon: MessageCircle },
  { value: 'shopping-bag', label: 'Perdagangan', icon: ShoppingBag },
  { value: 'briefcase', label: 'Bisnis', icon: Briefcase },
  { value: 'smartphone', label: 'Aplikasi', icon: Smartphone },
  { value: 'book-open', label: 'Belajar', icon: BookOpen },
  { value: 'heart-handshake', label: 'Pendampingan', icon: HeartHandshake },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'camera', label: 'Foto', icon: Camera },
  { value: 'laptop', label: 'Laptop', icon: Laptop },
  { value: 'wrench', label: 'Servis', icon: Wrench },
  { value: 'megaphone', label: 'Marketing', icon: Megaphone },
];

const EMPTY_FORM = {
  name: '',
  description: '',
  icon: '',
  color: '#2563EB',
  sort_order: 0,
  is_active: true,
  image: null,
};

function IconPicker({ value, onChange, error }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-dark">Ikon Kategori</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ICON_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors ${
                isSelected
                  ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/10'
                  : 'border-border bg-white text-dark hover:border-primary/40 hover:bg-background'
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  isSelected ? 'bg-primary text-white' : 'bg-background text-muted'
                }`}
              >
                <Icon size={17} strokeWidth={2.1} />
              </span>
              <span className="min-w-0 truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => onChange('')}
        className="w-fit text-xs font-medium text-muted hover:text-primary"
      >
        Tidak pakai ikon
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default function CategoriesPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [existingImage, setExistingImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchCategories({ page, q: search || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setCategories(data);
          setMeta(responseMeta);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, refreshToken]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    setRefreshToken((token) => token + 1);
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setExistingImage(null);
    setErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#2563EB',
      sort_order: category.sort_order,
      is_active: category.is_active,
      image: null,
    });
    setExistingImage(category.image);
    setErrors({});
    setIsModalOpen(true);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await createCategory(form);
        toast.success('Kategori berhasil ditambahkan');
      }
      setIsModalOpen(false);
      setRefreshToken((token) => token + 1);
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan kategori');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(category) {
    const confirmed = await confirm({
      title: 'Hapus Kategori',
      message: `Yakin ingin menghapus kategori "${category.name}"?`,
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteCategory(category.id);
      toast.success('Kategori berhasil dihapus');
      setRefreshToken((token) => token + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus kategori');
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Kategori',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt={row.name} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: row.color || '#2563EB' }}
            >
              {row.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-dark">{row.name}</p>
            <p className="text-xs text-muted">{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'services_count', label: 'Layanan', render: (row) => row.services_count ?? 0 },
    { key: 'sort_order', label: 'Urutan' },
    { key: 'is_active', label: 'Status', render: (row) => <StatusBadge status={row.is_active} /> },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionIconButton label="Edit" icon={Pencil} onClick={() => openEditModal(row)} variant="primary" />
          <ActionIconButton label="Hapus" icon={Trash2} onClick={() => handleDelete(row)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Kategori Layanan — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Kategori Layanan"
        description="Kelola kategori untuk mengelompokkan layanan Apapun Bisa."
        action={<Button onClick={openCreateModal}>+ Tambah Kategori</Button>}
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex max-w-sm gap-2">
        <Input
          placeholder="Cari kategori..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>

      <Table columns={columns} data={categories} isLoading={isLoading} emptyMessage="Belum ada kategori" />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Kategori' : 'Tambah Kategori'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama Kategori"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name?.[0]}
            required
          />
          <Textarea
            label="Deskripsi"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={errors.description?.[0]}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr,160px]">
            <IconPicker
              value={form.icon}
              onChange={(value) => setForm((prev) => ({ ...prev, icon: value }))}
              error={errors.icon?.[0]}
            />
            <Input label="Warna" name="color" type="color" value={form.color} onChange={handleChange} className="h-11 p-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Urutan"
              name="sort_order"
              type="number"
              value={form.sort_order}
              onChange={handleChange}
              error={errors.sort_order?.[0]}
            />
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-dark">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              Aktif
            </label>
          </div>
          <FileUploader
            label="Gambar Kategori"
            value={existingImage}
            onChange={(file) => setForm((prev) => ({ ...prev, image: file }))}
          />

          <div className="mt-2 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
