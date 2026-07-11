import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteArticle, fetchArticles } from '../../api/articleApi';
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

export default function ArticlesPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchArticles({ page, q: search || undefined, status: status || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setArticles(data);
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
  }, [page, status, refreshToken]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(1);
    setRefreshToken((token) => token + 1);
  }

  async function handleDelete(article) {
    const confirmed = await confirm({
      title: 'Hapus Artikel',
      message: `Yakin ingin menghapus artikel "${article.title}"?`,
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await deleteArticle(article.id);
      toast.success('Artikel berhasil dihapus');
      setRefreshToken((token) => token + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus artikel');
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Artikel',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail ? (
            <img src={row.thumbnail} alt={row.title} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {row.title.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-dark">{row.title}</p>
            <p className="text-xs text-muted">{row.category?.name} &middot; {row.author?.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Unggulan',
      render: (row) => (row.is_featured ? <Badge variant="primary">Unggulan</Badge> : '-'),
    },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionIconButton label="Edit" icon={Pencil} to={`/admin/articles/${row.id}/edit`} variant="primary" />
          <ActionIconButton label="Hapus" icon={Trash2} onClick={() => handleDelete(row)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Artikel — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Artikel"
        description="Kelola artikel dan blog Apapun Bisa."
        action={
          <Button as={Link} to="/admin/articles/create">
            + Tambah Artikel
          </Button>
        }
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex flex-wrap gap-2">
        <Input placeholder="Cari artikel..." value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-xs" />
        <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="max-w-[160px]">
          <option value="">Semua Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </Select>
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>

      <Table columns={columns} data={articles} isLoading={isLoading} emptyMessage="Belum ada artikel" />
      <Pagination meta={meta} onPageChange={setPage} />
    </>
  );
}
