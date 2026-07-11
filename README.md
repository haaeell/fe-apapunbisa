# Apapun Bisa — Frontend (React + Vite)

Single Page Application untuk website publik dan admin panel **apapunbisa.id**. Dibangun
dengan React (tanpa TypeScript), React Router DOM, Axios, Tailwind CSS v4, dan Context API
untuk autentikasi.

## Prasyarat

- Node.js >= 20
- Backend API sudah berjalan (lihat `../backend/README.md`)

## Instalasi

```bash
cd frontend
npm install
cp .env.example .env
```

Sesuaikan `VITE_API_BASE_URL` di `.env` jika backend tidak berjalan di `http://localhost:8000`.

Jalankan dev server:

```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`.

## Struktur Folder

```text
src/
├── api/          # instance axios + fungsi pemanggil endpoint per resource
├── assets/       # gambar, ikon statis
├── components/
│   ├── common/   # komponen reusable (Button, Input, dst.)
│   ├── public/   # komponen khusus halaman publik
│   └── admin/    # komponen khusus admin panel
├── contexts/     # AuthContext (Context API)
├── hooks/        # custom hooks (useAuth, dst.)
├── layouts/      # PublicLayout, AdminLayout
├── pages/
│   ├── public/   # halaman publik (beranda, layanan, portofolio, dst.)
│   ├── auth/     # halaman login admin
│   └── admin/    # halaman-halaman admin panel
├── routes/       # ProtectedRoute, dsb.
├── services/     # logika/servis tambahan (upload, dsb.)
├── utils/        # helper (token storage, formatter)
├── App.jsx
└── main.jsx
```

## Autentikasi Admin

- Login memakai bearer token (Sanctum) yang disimpan di `localStorage` lewat
  `src/utils/tokenStorage.js`.
- `src/api/axios.js` otomatis menyisipkan header `Authorization: Bearer <token>` pada setiap
  request, dan akan menghapus token + redirect ke `/admin/login` bila menerima respons 401.
- `src/routes/ProtectedRoute.jsx` melindungi seluruh route `/admin/*` (kecuali `/admin/login`).
- Login admin default (dari seeder backend): `admin@apapunbisa.id` / `password`.

## Desain

Warna dan font mengikuti design token pada `src/index.css` (Tailwind v4 `@theme`):
primary `#2563EB`, dark `#0F172A`, accent `#F59E0B`, heading font **Plus Jakarta Sans**,
body font **Inter**.

## Status Pengerjaan

Tahap 1, 3, 4, dan mayoritas implementasi frontend Tahap 5 sudah tersedia: autentikasi
admin, dashboard, seluruh halaman publik, modul admin lanjutan, SEO dasar, dan media
library — semua datanya diambil dari API, tidak ada data hardcode.

Halaman publik yang sudah berfungsi penuh: `/` (landing page lengkap), `/tentang-kami`,
`/layanan` + `/layanan/:slug`, `/portofolio` + `/portofolio/:slug`, `/artikel` +
`/artikel/:slug`, `/kontak` (form pesan), `/konsultasi` (form permintaan layanan dengan
lampiran).

Admin panel yang sudah berfungsi penuh:

- `/admin/dashboard` — statistik total data, grafik pesan masuk & permintaan layanan
  (Recharts), layanan paling diminati, daftar pesan & permintaan terbaru.
- `/admin/categories` — CRUD lewat modal.
- `/admin/services`, `/admin/services/create`, `/admin/services/:id/edit` — CRUD dengan
  form 10 tab (info umum, deskripsi & konten, cakupan, target, proses, paket, galeri, FAQ,
  SEO, publikasi).
- `/admin/portfolios`, `/admin/portfolios/create`, `/admin/portfolios/:id/edit` — CRUD
  dengan relasi banyak-layanan dan galeri.
- `/admin/articles`, `/admin/articles/create`, `/admin/articles/:id/edit` — CRUD dengan
  rich text editor (TipTap), tag bebas, dan kategori artikel dengan tambah cepat.
- `/admin/testimonials` — CRUD testimoni (foto, rating, relasi layanan/portofolio,
  unggulan, aktif, urutan).
- `/admin/faqs` — CRUD FAQ global maupun per layanan.
- `/admin/teams` — CRUD anggota tim dengan keahlian dan social links.
- `/admin/contacts` — list pesan masuk, buka detail, auto-mark as read, catatan internal,
  hapus.
- `/admin/service-requests` — list lead konsultasi, update status, catatan internal, dan
  unduh lampiran.
- `/admin/pages` — editor section landing page lengkap dengan toggle aktif dan reordering.
- `/admin/media` — browse grid media, upload file baru, hapus media.
- `/admin/settings` — form pengaturan website khusus role `super_admin`.

Tambahan Tahap 5 di frontend:

- `src/components/common/Seo.jsx` — helper SEO reusable untuk semua halaman publik:
  canonical URL, Open Graph, Twitter card, dan optional JSON-LD.
- Structured data untuk `ServiceDetailPage` dan `ArticleDetailPage`.
- `frontend/public/robots.txt` yang mengarah ke `https://apapunbisa.id/sitemap.xml`.
- Tab bar form admin `ServiceFormPage` dan `PortfolioFormPage` kini aman di mobile dengan
  horizontal scroll.

Komponen reusable: `Table`, `Pagination`, `Modal`, `ConfirmDialog`, `Toast`, `Badge`,
`StatusBadge`, `EmptyState`, `LoadingSkeleton`, `PageHeader`, `Breadcrumb`, `Textarea`,
`Select`, `Card`, `SectionTitle`, `Alert`, `FileUploader`, `RichTextEditor` — semua di
`src/components/common/`.
