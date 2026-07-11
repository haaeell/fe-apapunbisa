import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteService, fetchServices } from '../../api/serviceApi';
import { fetchCategories } from '../../api/categoryApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

export default function ServicesPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchServices({ page, q: search || undefined, category_id: categoryId || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setServices(data);
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
  }, [page, categoryId, refreshToken]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    setRefreshToken((token) => token + 1);
  }

  async function handleDelete(service) {
    const confirmed = await confirm({
      title: 'Hapus Layanan',
      message: `Yakin ingin menghapus layanan "${service.name}"?`,
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteService(service.id);
      toast.success('Layanan berhasil dihapus');
      setRefreshToken((token) => token + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus layanan');
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Layanan',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.cover_image ? (
            <img src={row.cover_image} alt={row.name} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {row.name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-dark">{row.name}</p>
            <p className="text-xs text-muted">{row.category?.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Unggulan',
      render: (row) => (row.is_featured ? <Badge variant="primary">Unggulan</Badge> : '-'),
    },
    { key: 'sort_order', label: 'Urutan' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionIconButton label="Edit" icon={Pencil} to={`/admin/services/${row.id}/edit`} variant="primary" />
          <ActionIconButton label="Hapus" icon={Trash2} onClick={() => handleDelete(row)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Layanan — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Layanan"
        description="Kelola seluruh katalog layanan Apapun Bisa."
        action={
          <Button as={Link} to="/admin/services/create">
            + Tambah Layanan
          </Button>
        }
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-wrap gap-2">
        <Input
          placeholder="Cari layanan..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-xs"
        />
        <Select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }} className="max-w-[200px]">
          <option value="">Semua Kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>

      <Table columns={columns} data={services} isLoading={isLoading} emptyMessage="Belum ada layanan" />
      <Pagination meta={meta} onPageChange={setPage} />
    </>
  );
}
