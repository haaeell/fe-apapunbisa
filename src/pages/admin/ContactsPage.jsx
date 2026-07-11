import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, Trash2 } from 'lucide-react';
import {
  deleteAdminContact,
  fetchAdminContact,
  fetchAdminContacts,
  updateAdminContact,
} from '../../api/adminContactApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Table from '../../components/common/Table';
import Textarea from '../../components/common/Textarea';
import { formatDate } from '../../utils/format';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

export default function ContactsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [readFilter, setReadFilter] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchAdminContacts({
      page,
      q: search || undefined,
      is_read: readFilter === '' ? undefined : readFilter,
      per_page: 10,
    })
      .then(({ data, meta: responseMeta }) => {
        if (!isMounted) return;
        setContacts(data);
        setMeta(responseMeta);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, readFilter, refreshToken]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    setRefreshToken((value) => value + 1);
  }

  async function openDetail(contact) {
    try {
      const { data } = await fetchAdminContact(contact.id);
      setSelectedContact(data);
      setNote(data.internal_note || '');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil detail pesan');
    }
  }

  async function handleSave() {
    if (!selectedContact) return;
    setIsSaving(true);

    try {
      const { data } = await updateAdminContact(selectedContact.id, {
        is_read: selectedContact.is_read,
        internal_note: note,
      });
      setSelectedContact(data);
      toast.success('Catatan pesan berhasil diperbarui');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal memperbarui pesan');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(contact) {
    if (!(await confirm({
      title: 'Hapus Pesan',
      message: `Yakin ingin menghapus pesan dari "${contact.name}"?`,
      variant: 'danger',
    }))) {
      return;
    }

    try {
      await deleteAdminContact(contact.id);
      if (selectedContact?.id === contact.id) {
        setSelectedContact(null);
      }
      toast.success('Pesan berhasil dihapus');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus pesan');
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Pengirim',
      render: (row) => (
        <div>
          <p className="font-medium text-dark">{row.name}</p>
          <p className="text-xs text-muted">{row.email}</p>
        </div>
      ),
    },
    { key: 'subject', label: 'Subjek', render: (row) => row.subject || 'Tanpa subjek' },
    { key: 'service', label: 'Layanan', render: (row) => row.service?.name || '-' },
    { key: 'is_read', label: 'Status', render: (row) => row.is_read ? <Badge variant="success">Sudah dibaca</Badge> : <Badge variant="warning">Belum dibaca</Badge> },
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
        <title>Pesan Masuk — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Pesan Masuk"
        description="Lihat pesan dari form kontak publik, tandai terbaca, dan simpan catatan internal."
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Cari nama atau email..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-xs" />
        <Select value={readFilter} onChange={(event) => { setReadFilter(event.target.value); setPage(1); }} className="max-w-[180px]">
          <option value="">Semua Status</option>
          <option value="1">Sudah dibaca</option>
          <option value="0">Belum dibaca</option>
        </Select>
        <Button type="submit" variant="secondary">Cari</Button>
      </form>

      <Table columns={columns} data={contacts} isLoading={isLoading} emptyMessage="Belum ada pesan masuk" />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={Boolean(selectedContact)} onClose={() => setSelectedContact(null)} title="Detail Pesan" size="lg">
        {selectedContact && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Nama" value={selectedContact.name || ''} readOnly />
              <Input label="Email" value={selectedContact.email || ''} readOnly />
              <Input label="WhatsApp" value={selectedContact.whatsapp || '-'} readOnly />
              <Input label="Layanan" value={selectedContact.service?.name || '-'} readOnly />
            </div>
            <Input label="Subjek" value={selectedContact.subject || 'Tanpa subjek'} readOnly />
            <Textarea label="Pesan" value={selectedContact.message || ''} readOnly rows={6} />
            <Textarea label="Catatan Internal" value={note} onChange={(event) => setNote(event.target.value)} rows={4} />
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-muted">Pesan dibuka pada admin otomatis ditandai sudah dibaca.</p>
              <div className="flex gap-3">
                <Button type="button" variant="secondary" onClick={() => setSelectedContact(null)}>Tutup</Button>
                <Button type="button" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Menyimpan...' : 'Simpan Catatan'}</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
