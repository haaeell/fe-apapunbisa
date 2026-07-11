import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, BriefcaseBusiness, FileText, Images, Info, Save, SearchCheck, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories } from '../../api/categoryApi';
import { createPortfolio, fetchPortfolio, updatePortfolio } from '../../api/portfolioApi';
import { fetchServices } from '../../api/serviceApi';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FileUploader from '../../components/common/FileUploader';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import RichTextEditor from '../../components/common/RichTextEditor';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { externalUrl } from '../../utils/url';
import { useToast } from '../../hooks/useToast';

const TABS = [
  { key: 'general', label: 'Informasi Umum', description: 'Judul, klien, kategori, dan sampul.', icon: Info },
  { key: 'detail', label: 'Detail Proyek', description: 'Cerita proyek, tantangan, solusi, dan hasil.', icon: FileText },
  { key: 'services', label: 'Layanan Terkait', description: 'Hubungkan portofolio dengan layanan.', icon: BriefcaseBusiness },
  { key: 'gallery', label: 'Galeri', description: 'Kelola foto pendukung proyek.', icon: Images },
  { key: 'publish', label: 'SEO & Publikasi', description: 'Status tampil, unggulan, dan metadata.', icon: SearchCheck },
];

function initialForm() {
  return {
    category_id: '',
    title: '',
    summary: '',
    client_name: '',
    project_date: '',
    duration: '',
    location: '',
    description: '',
    challenge: '',
    solution: '',
    result: '',
    technologiesText: '',
    video_url: '',
    website_url: '',
    is_published: true,
    is_featured: false,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    service_ids: [],
    cover_image: null,
  };
}

function FormSectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="border-b border-border bg-background/70 px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon size={20} strokeWidth={2.1} />
        </span>
        <div>
          <h2 className="font-heading text-lg font-bold text-dark">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('general');
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [existingGalleries, setExistingGalleries] = useState([]);
  const [newGalleries, setNewGalleries] = useState([]);
  const [removeGalleryIds, setRemoveGalleryIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories().then(({ data }) => setCategories(data));
    fetchServices({ per_page: 100 }).then(({ data }) => setServices(data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    fetchPortfolio(id)
      .then(({ data }) => {
        setForm({
          category_id: data.category_id || '',
          title: data.title,
          summary: data.summary || '',
          client_name: data.client_name || '',
          project_date: data.project_date ? data.project_date.substring(0, 10) : '',
          duration: data.duration || '',
          location: data.location || '',
          description: data.description || '',
          challenge: data.challenge || '',
          solution: data.solution || '',
          result: data.result || '',
          technologiesText: (data.technologies || []).join(', '),
          video_url: data.video_url || '',
          website_url: data.website_url || '',
          is_published: data.is_published,
          is_featured: data.is_featured,
          sort_order: data.sort_order,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          service_ids: (data.services || []).map((service) => service.id),
          cover_image: null,
        });
        setCoverImagePreview(data.cover_image);
        setExistingGalleries(data.galleries || []);
      })
      .finally(() => setIsLoading(false));
  }, [id, isEdit]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    updateField(name, type === 'checkbox' ? checked : value);
  }

  function toggleService(serviceId) {
    setForm((prev) => ({
      ...prev,
      service_ids: prev.service_ids.includes(serviceId)
        ? prev.service_ids.filter((sid) => sid !== serviceId)
        : [...prev.service_ids, serviceId],
    }));
  }

  function handleNewGalleryFiles(event) {
    const files = Array.from(event.target.files || []);
    setNewGalleries((prev) => [...prev, ...files]);
    event.target.value = '';
  }

  function toggleRemoveExistingGallery(galleryId) {
    setRemoveGalleryIds((prev) => (prev.includes(galleryId) ? prev.filter((gid) => gid !== galleryId) : [...prev, galleryId]));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      category_id: form.category_id || null,
      title: form.title,
      summary: form.summary,
      client_name: form.client_name,
      project_date: form.project_date || null,
      duration: form.duration,
      location: form.location,
      description: form.description,
      challenge: form.challenge,
      solution: form.solution,
      result: form.result,
      technologies: form.technologiesText.split(',').map((t) => t.trim()).filter(Boolean),
      video_url: form.video_url,
      website_url: form.website_url ? externalUrl(form.website_url) : '',
      is_published: form.is_published,
      is_featured: form.is_featured,
      sort_order: form.sort_order,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      meta_keywords: form.meta_keywords,
      service_ids: form.service_ids,
      new_galleries: newGalleries,
      remove_gallery_ids: removeGalleryIds,
    };

    if (form.cover_image) {
      payload.cover_image = form.cover_image;
    }

    try {
      if (isEdit) {
        await updatePortfolio(id, payload);
        toast.success('Portofolio berhasil diperbarui');
      } else {
        await createPortfolio(payload);
        toast.success('Portofolio berhasil ditambahkan');
      }
      navigate('/admin/portfolios');
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan portofolio');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Memuat data portofolio...</p>;
  }

  const activeTabConfig = TABS.find((tab) => tab.key === activeTab) || TABS[0];

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Portofolio' : 'Tambah Portofolio'} — Admin Apapun Bisa</title>
      </Helmet>

      <Breadcrumb
        items={[
          { label: 'Portofolio', to: '/admin/portfolios' },
          { label: isEdit ? 'Edit Portofolio' : 'Tambah Portofolio' },
        ]}
      />
      <PageHeader
        title={isEdit ? 'Edit Portofolio' : 'Tambah Portofolio'}
        description="Susun portofolio dengan informasi utama, cerita proyek, layanan terkait, galeri, dan pengaturan publikasi."
      />

      <form onSubmit={handleSubmit}>
        <div className="mb-5 overflow-x-auto rounded-2xl border border-border bg-surface p-2">
          <div className="grid min-w-[920px] grid-cols-5 gap-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    isActive ? 'bg-primary text-white shadow-sm' : 'text-muted hover:bg-background hover:text-dark'
                  }`}
                >
                  <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? 'bg-white/15' : 'bg-background'}`}>
                    <Icon size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold">{tab.label}</span>
                    <span className={`mt-0.5 block text-xs leading-5 ${isActive ? 'text-white/80' : 'text-muted'}`}>{tab.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Card className="overflow-hidden p-0">
          <FormSectionHeader
            icon={activeTabConfig.icon}
            title={activeTabConfig.label}
            description={activeTabConfig.description}
          />
          <div className="p-5 sm:p-6">
          {activeTab === 'general' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Judul Portofolio" name="title" value={form.title} onChange={handleChange} error={errors.title?.[0]} required />
                <Select label="Kategori" name="category_id" value={form.category_id} onChange={handleChange}>
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Textarea label="Ringkasan" name="summary" value={form.summary} onChange={handleChange} error={errors.summary?.[0]} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="Nama Klien" name="client_name" value={form.client_name} onChange={handleChange} />
                <Input label="Tanggal Proyek" name="project_date" type="date" value={form.project_date} onChange={handleChange} />
                <Input label="Durasi" name="duration" placeholder="2 bulan" value={form.duration} onChange={handleChange} />
              </div>
              <Input label="Lokasi" name="location" value={form.location} onChange={handleChange} />
              <FileUploader
                label="Gambar Sampul"
                value={coverImagePreview}
                onChange={(file) => updateField('cover_image', file)}
              />
            </div>
          )}

          {activeTab === 'detail' && (
            <div className="flex flex-col gap-4">
              <RichTextEditor label="Deskripsi Lengkap" value={form.description} onChange={(value) => updateField('description', value)} />
              <RichTextEditor label="Tantangan" value={form.challenge} onChange={(value) => updateField('challenge', value)} />
              <RichTextEditor label="Solusi" value={form.solution} onChange={(value) => updateField('solution', value)} />
              <RichTextEditor label="Hasil" value={form.result} onChange={(value) => updateField('result', value)} />
              <Input
                label="Teknologi / Tools (pisahkan dengan koma)"
                name="technologiesText"
                value={form.technologiesText}
                onChange={handleChange}
                placeholder="Laravel, React, Figma"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="URL Video" name="video_url" value={form.video_url} onChange={handleChange} />
                <Input
                  label="URL Website Proyek"
                  name="website_url"
                  value={form.website_url}
                  onChange={handleChange}
                  placeholder="tokosepatu.com"
                />
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="flex flex-col gap-2">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">Pilih satu atau lebih layanan yang terkait dengan portofolio ini.</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {form.service_ids.length} layanan dipilih
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                      form.service_ids.includes(service.id)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-dark hover:border-primary/40 hover:bg-background'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.service_ids.includes(service.id)}
                      onChange={() => toggleService(service.id)}
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted">
                Gambar sampul diatur pada tab Informasi Umum. Galeri di sini dipakai untuk detail proyek publik.
              </div>
              {existingGalleries.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {existingGalleries.map((gallery) => (
                    <div key={gallery.id} className={`relative overflow-hidden rounded-lg border ${removeGalleryIds.includes(gallery.id) ? 'opacity-40' : ''}`}>
                      <img src={gallery.image} alt="" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => toggleRemoveExistingGallery(gallery.id)}
                        className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                      >
                        {removeGalleryIds.includes(gallery.id) ? 'Batal' : 'Hapus'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newGalleries.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {newGalleries.map((file, index) => (
                    <div key={index} className="relative overflow-hidden rounded-lg border">
                      <img src={URL.createObjectURL(file)} alt="" className="h-24 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewGalleries((prev) => prev.filter((_, i) => i !== index))}
                        className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="w-fit cursor-pointer rounded-lg border border-border px-4 py-2 text-sm font-medium text-dark hover:bg-background">
                + Tambah Gambar Galeri
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleNewGalleryFiles} />
              </label>
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-bold text-dark">
                  <Sparkles size={16} className="text-primary" />
                  Pengaturan Tampil
                </div>
                <p className="mt-1 text-sm text-muted">Atur apakah portofolio terlihat di website publik dan optimalkan metadata SEO.</p>
              </div>
              <Input label="Meta Title" name="meta_title" value={form.meta_title} onChange={handleChange} />
              <Textarea label="Meta Description" name="meta_description" value={form.meta_description} onChange={handleChange} />
              <Input label="Meta Keywords" name="meta_keywords" value={form.meta_keywords} onChange={handleChange} />
              <label className="flex items-center gap-2 text-sm font-medium text-dark">
                <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} />
                Tampilkan portofolio ini di website publik
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-dark">
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
                Jadikan portofolio unggulan
              </label>
              <Input label="Urutan Tampil" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="max-w-[200px]" />
            </div>
          )}
          </div>
        </Card>

        <div className="sticky bottom-0 z-20 mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lg shadow-dark/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {isEdit ? 'Perubahan akan tersimpan ke portofolio ini.' : 'Data baru akan ditambahkan ke daftar portofolio.'}
          </p>
          <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/portfolios')}>
            <ArrowLeft size={16} />
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Save size={16} />
            Simpan Portofolio
          </Button>
          </div>
        </div>
      </form>
    </>
  );
}
