import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye, Trash2 } from 'lucide-react';
import { deleteMedia, fetchMedia, uploadMedia } from '../../api/mediaApi';
import ActionIconButton from '../../components/common/ActionIconButton';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/common/Pagination';
import Select from '../../components/common/Select';
import { useConfirm } from '../../hooks/useConfirm';
import { useToast } from '../../hooks/useToast';

export default function MediaPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [collection, setCollection] = useState('');
  const [uploadCollection, setUploadCollection] = useState('');
  const [file, setFile] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    // Resetting the loading flag at the start of each fetch (React's documented data-fetching pattern).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    fetchMedia({ page, collection: collection || undefined, per_page: 24 })
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
  }, [page, collection, refreshToken]);

  async function handleUpload(event) {
    event.preventDefault();
    if (!file) {
      toast.error('Pilih file lebih dulu');
      return;
    }

    setIsUploading(true);
    try {
      await uploadMedia({ file, collection: uploadCollection || null });
      setFile(null);
      setUploadCollection('');
      event.target.reset();
      toast.success('Media berhasil diunggah');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengunggah media');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(item) {
    if (!(await confirm({
      title: 'Hapus Media',
      message: `Yakin ingin menghapus file "${item.original_name}"?`,
      variant: 'danger',
    }))) {
      return;
    }

    try {
      await deleteMedia(item.id);
      toast.success('Media berhasil dihapus');
      setRefreshToken((value) => value + 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menghapus media');
    }
  }

  return (
    <>
      <Helmet>
        <title>Media Library — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Media Library"
        description="Lihat semua file upload, unggah media baru, dan hapus file yang tidak dipakai."
      />

      <form onSubmit={handleUpload} className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-surface p-4 lg:grid-cols-[1fr,220px,auto]">
        <Input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        <Input placeholder="Collection (opsional)" value={uploadCollection} onChange={(event) => setUploadCollection(event.target.value)} />
        <Button type="submit" disabled={isUploading}>{isUploading ? 'Mengunggah...' : 'Upload Media'}</Button>
      </form>

      <div className="mb-4 max-w-[220px]">
        <Select value={collection} onChange={(event) => { setCollection(event.target.value); setPage(1); }}>
          <option value="">Semua Collection</option>
          <option value="media">media</option>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Memuat media...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center text-sm text-muted">
          Belum ada media yang diunggah.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {items.map((item) => {
              const isImage = item.mime_type?.startsWith('image/');
              return (
                <div key={item.id} className="overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="aspect-square bg-background">
                    {isImage ? (
                      <img src={item.url} alt={item.original_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center px-3 text-center text-xs font-medium text-muted">
                        {item.mime_type || 'File'}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-3">
                    <p className="line-clamp-2 text-sm font-medium text-dark">{item.original_name}</p>
                    <p className="text-xs text-muted">{item.collection || 'Tanpa collection'}</p>
                    <div className="flex gap-2">
                      <ActionIconButton label="Buka" icon={Eye} href={item.url} variant="primary" />
                      <ActionIconButton label="Hapus" icon={Trash2} onClick={() => handleDelete(item)} variant="danger" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination meta={meta} onPageChange={setPage} />
        </>
      )}
    </>
  );
}
