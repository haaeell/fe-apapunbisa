import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Seo from '../../components/common/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo
        title="Halaman Tidak Ditemukan — Apapun Bisa"
        description="Halaman yang Anda cari tidak tersedia."
        noIndex
      />
      <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-32 text-center">
        <h1 className="font-heading text-3xl font-bold text-dark">Halaman Belum Tersedia</h1>
        <p className="text-muted">
          Halaman ini sedang dalam tahap pengembangan dan akan segera hadir.
        </p>
        <Button as={Link} to="/">
          Kembali ke Beranda
        </Button>
      </section>
    </>
  );
}
