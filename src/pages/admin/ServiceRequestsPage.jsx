import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, Trash2 } from 'lucide-react';
import {
  deleteAdminServiceRequest,
  downloadServiceRequestAttachment,
  fetchAdminServiceRequest,
  fetchAdminServiceRequests,
  updateAdminServiceRequest,
} from '../../api/adminServiceRequestApi';
import { fetchServices } from '../../api/serviceApi';
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
import { formatDate } from '../../utils/format';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Baru' },
  { value: 'contacted', label: 'Sudah Dihubungi' },
  { value: 'processing', label: 'Diproses' },
  { value: 'done', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' },
];

export default function ServiceRequestsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [services, setServices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [draftStatus, setDraftStatus] = useState('new');
  const [draftNote, setDraftNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServices({ per_page: 100 }).then(({ data }) => setServices(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchAdminServiceRequests({
      page,
      q: search || undefined,
      status: status || undefined,
      service_id: serviceId || undefined,
      per_page: 10,
    })
      .then(({ data, meta: responseMeta }) => {
        if (!isMounted) return;
        setItems(data);
        setMeta(responseMeta);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, serviceId, refreshToken]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    setRefreshToken((value) => value + 1);
  }

  async function openDetail(item) {
    try {
      const { data } = await fetchAdminServiceRequest(item.id);
      setSelectedItem(data);
      setDraftStatus(data.status || 'new');
      setDraftNote(data.internal_note || '');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil detail permintaan');
    }
  }

  async function handleSave() {
    if (!selectedItem) return;
    setIsSaving(true);
    try {
      const { data } = await updateAdminServiceRequest(selectedItem.id, {
        status: draftStatus,
        internal_note: draftNote,
      });
      setSelectedItem((prev) => ({ ...prev, ...data }));
      toast.success('Permintaan layanan berhasil diperbarui');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui permintaan');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!(await confirm({
      title: 'Hapus Permintaan',
      message: `Yakin ingin menghapus permintaan dari "${item.name}"?`,
      variant: 'danger',
    }))) {
      return;
    }

    try {
      await deleteAdminServiceRequest(item.id);
      if (selectedItem?.id === item.id) setSelectedItem(null);
      toast.success('Permintaan layanan berhasil dihapus');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus permintaan');
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Pemohon',
      render: (row) => (
        <div>
          <p className="font-medium text-dark">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    { key: 'title', label: 'Judul Permintaan' },
    { key: 'service', label: 'Layanan', render: (row) => row.service?.name || '-' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'created_at', label: 'Masuk', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionIconButton label="Buka" icon={Eye} onClick={() => openDetail(row)} variant="primary" />
          <ActionIconButton label="Hapus" icon={Trash2} onClick={() => handleDelete(row)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Permintaan Layanan — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Permintaan Layanan"
        description="Kelola lead konsultasi, status tindak lanjut, dan lampiran dari form publik."
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Cari nama atau email..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-xs" />
        <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="max-w-[180px]">
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
        <Select value={serviceId} onChange={(event) => { setServiceId(event.target.value); setPage(1); }} className="max-w-[220px]">
          <option value="">Semua Layanan</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">Cari</Button>
      </form>

      <Table columns={columns} data={items} isLoading={isLoading} emptyMessage="Belum ada permintaan layanan" />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} title="Detail Permintaan Layanan" size="xl">
        {selectedItem && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Nama" value={selectedItem.name || ''} readOnly />
              <Input label="Email" value={selectedItem.email || ''} readOnly />
              <Input label="WhatsApp" value={selectedItem.whatsapp || '-'} readOnly />
              <Input label="Metode Komunikasi" value={selectedItem.communication_method || '-'} readOnly />
              <Input label="Layanan" value={selectedItem.service?.name || '-'} readOnly />
              <Input label="Estimasi Budget" value={selectedItem.budget_estimate || '-'} readOnly />
              <Input label="Target Tanggal" value={selectedItem.target_date || '-'} readOnly />
              <Input label="Dibuat" value={formatDate(selectedItem.created_at)} readOnly />
            </div>
            <Input label="Judul Permintaan" value={selectedItem.title || ''} readOnly />
            <Textarea label="Deskripsi Kebutuhan" value={selectedItem.description || ''} readOnly rows={6} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select label="Status" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-sm font-medium text-dark">Lampiran</p>
                <div className="mt-2 flex flex-col gap-2">
                  {(selectedItem.attachments || []).length ? selectedItem.attachments.map((attachment) => (
                    <button
                      key={attachment.id}
                      type="button"
                      onClick={() => downloadServiceRequestAttachment(selectedItem.id, attachment)}
                      className="text-left text-sm font-medium text-primary hover:underline"
                    >
                      {attachment.original_name}
                    </button>
                  )) : <p className="text-sm text-muted">Tidak ada lampiran.</p>}
                </div>
              </div>
            </div>
            <Textarea label="Catatan Internal" value={draftNote} onChange={(event) => setDraftNote(event.target.value)} rows={4} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setSelectedItem(null)}>Tutup</Button>
              <Button type="button" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
