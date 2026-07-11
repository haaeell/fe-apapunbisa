import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Pencil, Trash2 } from 'lucide-react';
import { fetchServices } from '../../api/serviceApi';
import { createFaq, deleteFaq, fetchFaqs, updateFaq } from '../../api/faqApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Button from '../../components/common/Button';
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
  service_id: '',
  question: '',
  answer: '',
  sort_order: 0,
  is_active: true,
};

export default function FaqsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [faqs, setFaqs] = useState([]);
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [serviceId, setServiceId] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchServices({ per_page: 100 }).then(({ data }) => setServices(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchFaqs({ page, service_id: serviceId || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (!isMounted) return;
        setFaqs(data);
        setMeta(responseMeta);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, serviceId, refreshToken]);

  function openCreateModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm({
      service_id: item.service_id || '',
      question: item.question || '',
      answer: item.answer || '',
      sort_order: item.sort_order || 0,
      is_active: item.is_active,
    });
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

    const payload = { ...form, service_id: form.service_id || null };

    try {
      if (editingId) {
        await updateFaq(editingId, payload);
        toast.success('FAQ berhasil diperbarui');
      } else {
        await createFaq(payload);
        toast.success('FAQ berhasil ditambahkan');
      }
      setIsModalOpen(false);
      setRefreshToken((value) => value + 1);
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan FAQ');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item) {
    if (!(await confirm({
      title: 'Hapus FAQ',
      message: `Yakin ingin menghapus FAQ "${item.question}"?`,
      variant: 'danger',
    }))) {
      return;
    }

    try {
      await deleteFaq(item.id);
      toast.success('FAQ berhasil dihapus');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus FAQ');
    }
  }

  const columns = [
    { key: 'question', label: 'Pertanyaan', render: (row) => <div><p className="font-medium text-dark">{row.question}</p><p className="line-clamp-2 text-xs text-muted">{row.answer}</p></div> },
    { key: 'service', label: 'Layanan', render: (row) => row.service?.name || 'Global' },
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
        <title>FAQ — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="FAQ"
        description="Kelola FAQ global maupun FAQ yang melekat pada layanan tertentu."
        action={<Button onClick={openCreateModal}>+ Tambah FAQ</Button>}
      />

      <div className="mb-4 max-w-xs">
        <Select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setPage(1); }}>
          <option value="">Semua FAQ</option>
          <option value="global">Hanya Global</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </Select>
      </div>

      <Table
        columns={columns}
        data={serviceId === 'global' ? faqs.filter((faq) => !faq.service_id) : faqs}
        isLoading={isLoading}
        emptyMessage="Belum ada FAQ"
      />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit FAQ' : 'Tambah FAQ'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select label="Layanan Terkait" name="service_id" value={form.service_id} onChange={handleChange} error={errors.service_id?.[0]}>
            <option value="">Global</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </Select>
          <Input label="Pertanyaan" name="question" value={form.question} onChange={handleChange} error={errors.question?.[0]} required />
          <Textarea label="Jawaban" name="answer" value={form.answer} onChange={handleChange} error={errors.answer?.[0]} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Urutan" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} error={errors.sort_order?.[0]} />
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
