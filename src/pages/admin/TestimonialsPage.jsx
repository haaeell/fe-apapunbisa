import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Pencil, Trash2 } from 'lucide-react';
import { fetchServices } from '../../api/serviceApi';
import { fetchPortfolios } from '../../api/portfolioApi';
import {
  createTestimonial,
  deleteTestimonial,
  fetchTestimonials,
  updateTestimonial,
} from '../../api/testimonialApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import FileUploader from '../../components/common/FileUploader';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import Textarea from '../../components/common/Textarea';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

const EMPTY_FORM = {
  client_name: '',
  client_position: '',
  content: '',
  rating: 5,
  service_id: '',
  portfolio_id: '',
  is_featured: false,
  is_active: true,
  sort_order: 0,
  photo: null,
};

export default function TestimonialsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [testimonials, setTestimonials] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [existingPhoto, setExistingPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices({ per_page: 100 }).then(({ data }) => setServices(data));
    fetchPortfolios({ per_page: 100 }).then(({ data }) => setPortfolios(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchTestimonials({ page, q: search || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (!isMounted) return;
        setTestimonials(data);
        setMeta(responseMeta);
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
    setRefreshToken((value) => value + 1);
  }

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setExistingPhoto(null);
    setErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm({
      client_name: item.client_name || '',
      client_position: item.client_position || '',
      content: item.content || '',
      rating: item.rating || 5,
      service_id: item.service_id || '',
      portfolio_id: item.portfolio_id || '',
      is_featured: item.is_featured,
      is_active: item.is_active,
      sort_order: item.sort_order || 0,
      photo: null,
    });
    setExistingPhoto(item.photo);
    setErrors({});
    setIsModalOpen(true);
  }

  function handleChange(event) {
    const { name, value, checked, type } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const payload = {
      ...form,
      service_id: form.service_id || null,
      portfolio_id: form.portfolio_id || null,
    };

    try {
      if (editingId) {
        await updateTestimonial(editingId, payload);
        toast.success('Testimoni berhasil diperbarui');
      } else {
        await createTestimonial(payload);
        toast.success('Testimoni berhasil ditambahkan');
      }
      setIsModalOpen(false);
      setRefreshToken((value) => value + 1);
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan testimoni');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item) {
    if (!(await confirm({
      title: 'Hapus Testimoni',
      message: `Yakin ingin menghapus testimoni dari "${item.client_name}"?`,
      variant: 'danger',
    }))) {
      return;
    }

    try {
      await deleteTestimonial(item.id);
      toast.success('Testimoni berhasil dihapus');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus testimoni');
    }
  }

  const columns = [
    {
      key: 'client_name',
      label: 'Klien',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt={row.client_name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {row.client_name?.charAt(0) || 'K'}
            </div>
          )}
          <div>
            <p className="font-medium text-dark">{row.client_name}</p>
            <p className="text-xs text-muted">{row.client_position || '-'}</p>
          </div>
        </div>
      ),
    },
    { key: 'rating', label: 'Rating', render: (row) => `${row.rating}/5` },
    {
      key: 'relations',
      label: 'Terkait',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.service?.name && <Badge variant="secondary">{row.service.name}</Badge>}
          {row.portfolio?.title && <Badge variant="secondary">{row.portfolio.title}</Badge>}
          {!row.service?.name && !row.portfolio?.title && '-'}
        </div>
      ),
    },
    {
      key: 'flags',
      label: 'Status',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={row.is_active} />
          {row.is_featured && <Badge variant="primary">Unggulan</Badge>}
        </div>
      ),
    },
    { key: 'sort_order', label: 'Urutan' },
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
        <title>Testimoni — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Testimoni"
        description="Kelola testimoni klien yang tampil di landing page dan detail layanan."
        action={<Button onClick={openCreateModal}>+ Tambah Testimoni</Button>}
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex max-w-sm gap-2">
        <Input placeholder="Cari nama klien..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button type="submit" variant="secondary">Cari</Button>
      </form>

      <Table columns={columns} data={testimonials} isLoading={isLoading} emptyMessage="Belum ada testimoni" />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Testimoni' : 'Tambah Testimoni'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nama Klien" name="client_name" value={form.client_name} onChange={handleChange} error={errors.client_name?.[0]} required />
            <Input label="Jabatan / Perusahaan" name="client_position" value={form.client_position} onChange={handleChange} error={errors.client_position?.[0]} />
          </div>
          <Textarea label="Isi Testimoni" name="content" value={form.content} onChange={handleChange} error={errors.content?.[0]} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Rating" name="rating" type="number" min="1" max="5" value={form.rating} onChange={handleChange} error={errors.rating?.[0]} required />
            <Select label="Layanan Terkait" name="service_id" value={form.service_id} onChange={handleChange} error={errors.service_id?.[0]}>
              <option value="">Tidak ada</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </Select>
            <Select label="Portofolio Terkait" name="portfolio_id" value={form.portfolio_id} onChange={handleChange} error={errors.portfolio_id?.[0]}>
              <option value="">Tidak ada</option>
              {portfolios.map((portfolio) => (
                <option key={portfolio.id} value={portfolio.id}>{portfolio.title}</option>
              ))}
            </Select>
          </div>
          <FileUploader label="Foto Klien" value={existingPhoto} onChange={(file) => setForm((prev) => ({ ...prev, photo: file }))} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Urutan" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} error={errors.sort_order?.[0]} />
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-dark">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
              Tampilkan sebagai unggulan
            </label>
            <label className="flex items-center gap-2 self-end pb-2.5 text-sm font-medium text-dark">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
              Aktif
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
