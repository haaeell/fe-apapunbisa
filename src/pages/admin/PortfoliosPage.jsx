import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BriefcaseBusiness, CalendarDays, Clock3, ExternalLink, Eye, Image as ImageIcon, MapPin, Pencil, Trash2, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deletePortfolio, fetchPortfolio, fetchPortfolios } from '../../api/portfolioApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import Table from '../../components/common/Table';
import { formatDate } from '../../utils/format';
import { externalUrl } from '../../utils/url';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

function InfoItem({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <Icon size={14} />
        {label}
      </div>
      <p className="text-sm font-semibold text-dark">{value}</p>
    </div>
  );
}

function HtmlPreview({ title, html }) {
  if (!html) return null;

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h3 className="mb-2 font-heading text-sm font-bold text-dark">{title}</h3>
      <div
        className="prose prose-sm max-w-none text-muted"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  );
}

export default function PortfoliosPage() {
  const toast = useToast();
  const confirm = useConfirm();

  const [portfolios, setPortfolios] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchPortfolios({ page, q: search || undefined, per_page: 10 })
      .then(({ data, meta: responseMeta }) => {
        if (isMounted) {
          setPortfolios(data);
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

  async function handleDelete(portfolio) {
    const confirmed = await confirm({
      title: 'Hapus Portofolio',
      message: `Yakin ingin menghapus portofolio "${portfolio.title}"?`,
      variant: 'danger',
    });

    if (!confirmed) return;

    try {
      await deletePortfolio(portfolio.id);
      toast.success('Portofolio berhasil dihapus');
      setRefreshToken((token) => token + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus portofolio');
    }
  }

  async function openDetail(portfolio) {
    setIsDetailLoading(true);
    setSelectedPortfolio(portfolio);

    try {
      const { data } = await fetchPortfolio(portfolio.id);
      setSelectedPortfolio(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengambil detail portofolio');
    } finally {
      setIsDetailLoading(false);
    }
  }

  const columns = [
    {
      key: 'title',
      label: 'Portofolio',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.cover_image ? (
            <img src={row.cover_image} alt={row.title} className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {row.title.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-medium text-dark">{row.title}</p>
            <p className="text-xs text-muted">{row.client_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'is_featured',
      label: 'Unggulan',
      render: (row) => (row.is_featured ? <Badge variant="primary">Unggulan</Badge> : '-'),
    },
    {
      key: 'website_url',
      label: 'Website',
      sortable: false,
      render: (row) => row.website_url ? (
        <a
          href={externalUrl(row.website_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-[180px] items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/30 hover:bg-primary/10"
        >
          <ExternalLink size={14} />
          <span className="truncate">{row.website_url}</span>
        </a>
      ) : '-',
    },
    { key: 'is_published', label: 'Status', render: (row) => <StatusBadge status={row.is_published} /> },
    {
      key: 'actions',
      label: 'Aksi',
      render: (row) => (
        <div className="flex items-center gap-2">
          <ActionIconButton label="Detail" icon={Eye} onClick={() => openDetail(row)} variant="neutral" />
          <ActionIconButton label="Edit" icon={Pencil} to={`/admin/portfolios/${row.id}/edit`} variant="primary" />
          <ActionIconButton label="Hapus" icon={Trash2} onClick={() => handleDelete(row)} variant="danger" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Portofolio — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Portofolio"
        description="Kelola proyek dan pekerjaan yang pernah dikerjakan Apapun Bisa."
        action={
          <Button as={Link} to="/admin/portfolios/create">
            + Tambah Portofolio
          </Button>
        }
      />

      <form onSubmit={handleSearchSubmit} className="mb-4 flex max-w-sm gap-2">
        <Input placeholder="Cari portofolio..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button type="submit" variant="secondary">
          Cari
        </Button>
      </form>

      <Table columns={columns} data={portfolios} isLoading={isLoading} emptyMessage="Belum ada portofolio" />
      <Pagination meta={meta} onPageChange={setPage} />

      <Modal
        isOpen={Boolean(selectedPortfolio)}
        onClose={() => setSelectedPortfolio(null)}
        title="Detail Portofolio"
        size="xl"
      >
        {selectedPortfolio && (
          <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              {selectedPortfolio.cover_image ? (
                <img src={selectedPortfolio.cover_image} alt={selectedPortfolio.title} className="h-56 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center text-muted">
                  <ImageIcon size={34} />
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {selectedPortfolio.category?.name && <Badge variant="secondary">{selectedPortfolio.category.name}</Badge>}
                      {selectedPortfolio.is_featured && <Badge variant="primary">Unggulan</Badge>}
                      <StatusBadge status={selectedPortfolio.is_published} />
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-dark">{selectedPortfolio.title}</h2>
                    {selectedPortfolio.summary && <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{selectedPortfolio.summary}</p>}
                  </div>
                  {selectedPortfolio.website_url && (
                    <Button as="a" href={externalUrl(selectedPortfolio.website_url)} target="_blank" rel="noopener noreferrer" variant="secondary" className="shrink-0">
                      <ExternalLink size={16} />
                      Lihat Website
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {isDetailLoading ? (
              <p className="text-sm text-muted">Memuat detail portofolio...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem icon={UserRound} label="Klien" value={selectedPortfolio.client_name} />
                  <InfoItem icon={CalendarDays} label="Tanggal" value={selectedPortfolio.project_date ? formatDate(selectedPortfolio.project_date) : null} />
                  <InfoItem icon={Clock3} label="Durasi" value={selectedPortfolio.duration} />
                  <InfoItem icon={MapPin} label="Lokasi" value={selectedPortfolio.location} />
                </div>

                {selectedPortfolio.services?.length > 0 && (
                  <section className="rounded-xl border border-border bg-white p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-dark">
                      <BriefcaseBusiness size={16} />
                      Layanan Terkait
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPortfolio.services.map((service) => (
                        <Badge key={service.id} variant="secondary">{service.name}</Badge>
                      ))}
                    </div>
                  </section>
                )}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <HtmlPreview title="Deskripsi" html={selectedPortfolio.description} />
                  <HtmlPreview title="Tantangan" html={selectedPortfolio.challenge} />
                  <HtmlPreview title="Solusi" html={selectedPortfolio.solution} />
                  <HtmlPreview title="Hasil" html={selectedPortfolio.result} />
                </div>

                {selectedPortfolio.technologies?.length > 0 && (
                  <section className="rounded-xl border border-border bg-white p-4">
                    <h3 className="mb-3 font-heading text-sm font-bold text-dark">Teknologi / Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPortfolio.technologies.map((technology) => (
                        <span key={technology} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-dark">
                          {technology}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {selectedPortfolio.galleries?.length > 0 && (
                  <section className="rounded-xl border border-border bg-white p-4">
                    <h3 className="mb-3 font-heading text-sm font-bold text-dark">Galeri</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {selectedPortfolio.galleries.map((gallery) => (
                        <img key={gallery.id} src={gallery.image} alt={gallery.caption || selectedPortfolio.title} className="aspect-square rounded-xl object-cover" />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
