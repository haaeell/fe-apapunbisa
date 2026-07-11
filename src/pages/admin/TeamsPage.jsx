import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Pencil, Trash2 } from 'lucide-react';
import {
  createTeam,
  deleteTeam,
  fetchTeams,
  updateTeam,
} from '../../api/teamApi';
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

const EMPTY_FORM = {
  name: '',
  position: '',
  description: '',
  skillsText: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  tiktok: '',
  youtube: '',
  sort_order: 0,
  is_active: true,
  photo: null,
};

function socialLinksFromForm(form) {
  return Object.fromEntries(
    Object.entries({
      instagram: form.instagram,
      facebook: form.facebook,
      linkedin: form.linkedin,
      tiktok: form.tiktok,
      youtube: form.youtube,
    }).filter(([, value]) => value),
  );
}

export default function TeamsPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [teams, setTeams] = useState([]);
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
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchTeams({ page, q: search || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (!isMounted) return;
        setTeams(data);
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
      name: item.name || '',
      position: item.position || '',
      description: item.description || '',
      skillsText: (item.skills || []).join(', '),
      instagram: item.social_links?.instagram || '',
      facebook: item.social_links?.facebook || '',
      linkedin: item.social_links?.linkedin || '',
      tiktok: item.social_links?.tiktok || '',
      youtube: item.social_links?.youtube || '',
      sort_order: item.sort_order || 0,
      is_active: item.is_active,
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
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      ...form,
      skills: form.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean),
      social_links: socialLinksFromForm(form),
    };

    try {
      if (editingId) {
        await updateTeam(editingId, payload);
        toast.success('Data tim berhasil diperbarui');
      } else {
        await createTeam(payload);
        toast.success('Anggota tim berhasil ditambahkan');
      }
      setIsModalOpen(false);
      setRefreshToken((value) => value + 1);
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan data tim');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(item) {
    if (!(await confirm({
      title: 'Hapus Anggota Tim',
      message: `Yakin ingin menghapus "${item.name}" dari tim?`,
      variant: 'danger',
    }))) {
      return;
    }

    try {
      await deleteTeam(item.id);
      toast.success('Anggota tim berhasil dihapus');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus data tim');
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Anggota Tim',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.photo ? (
            <img src={row.photo} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
              {row.name?.charAt(0) || 'T'}
            </div>
          )}
          <div>
            <p className="font-medium text-dark">{row.name}</p>
            <p className="text-xs text-muted">{row.position}</p>
          </div>
        </div>
      ),
    },
    { key: 'skills', label: 'Keahlian', render: (row) => (row.skills?.length ? row.skills.join(', ') : '-') },
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
        <title>Tim — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Tim"
        description="Kelola profil anggota tim yang tampil di halaman Tentang Kami."
        action={<Button onClick={openCreateModal}>+ Tambah Tim</Button>}
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex max-w-sm gap-2">
        <Input placeholder="Cari anggota tim..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button type="submit" variant="secondary">Cari</Button>
      </form>

      <Table columns={columns} data={teams} isLoading={isLoading} emptyMessage="Belum ada data tim" />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Anggota Tim' : 'Tambah Anggota Tim'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nama" name="name" value={form.name} onChange={handleChange} error={errors.name?.[0]} required />
            <Input label="Jabatan" name="position" value={form.position} onChange={handleChange} error={errors.position?.[0]} required />
          </div>
          <Textarea label="Deskripsi" name="description" value={form.description} onChange={handleChange} error={errors.description?.[0]} />
          <Input label="Keahlian (pisahkan dengan koma)" name="skillsText" value={form.skillsText} onChange={handleChange} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} />
            <Input label="Facebook" name="facebook" value={form.facebook} onChange={handleChange} />
            <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} />
            <Input label="TikTok / YouTube" name="tiktok" value={form.tiktok} onChange={handleChange} />
          </div>
          <Input label="YouTube" name="youtube" value={form.youtube} onChange={handleChange} />
          <FileUploader label="Foto" value={existingPhoto} onChange={(file) => setForm((prev) => ({ ...prev, photo: file }))} />
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
