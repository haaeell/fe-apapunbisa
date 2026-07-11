import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories } from '../../api/categoryApi';
import { createService, fetchService, updateService } from '../../api/serviceApi';
import Breadcrumb from '../../components/common/Breadcrumb';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FileUploader from '../../components/common/FileUploader';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import RichTextEditor from '../../components/common/RichTextEditor';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import { useToast } from '../../hooks/useToast';

const TABS = [
  { key: 'general', label: 'Informasi Umum' },
  { key: 'description', label: 'Deskripsi & Konten' },
  { key: 'features', label: 'Cakupan Layanan' },
  { key: 'targets', label: 'Target Pelanggan' },
  { key: 'processes', label: 'Proses' },
  { key: 'packages', label: 'Paket' },
  { key: 'gallery', label: 'Galeri' },
  { key: 'faqs', label: 'FAQ' },
  { key: 'seo', label: 'SEO' },
  { key: 'publish', label: 'Publikasi' },
];

const EMPTY_SECTIONS = {
  about: { title: 'Tentang Layanan', content: '' },
  problem: { title: 'Masalah yang Sering Dihadapi', content: '' },
  solution: { title: 'Solusi dari Apapun Bisa', content: '' },
  technology: { title: 'Teknologi / Peralatan', items: [] },
  cta: { title: '', subtitle: '' },
};

function initialForm() {
  return {
    category_id: '',
    name: '',
    short_description: '',
    description: '',
    icon: '',
    cover_image: null,
    status: true,
    is_featured: false,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    features: [{ title: '', description: '' }],
    targets: [{ title: '', description: '' }],
    processes: [{ title: '', description: '' }],
    packages: [
      { name: '', price_type: 'starting', price: '', old_price: '', description: '', is_recommended: false, itemsText: '' },
    ],
    faqs: [{ question: '', answer: '' }],
    sections: EMPTY_SECTIONS,
    technologyText: '',
  };
}

export default function ServiceFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('general');
  const [categories, setCategories] = useState([]);
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
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    fetchService(id)
      .then(({ data }) => {
        const sectionsByType = {};
        (data.sections || []).forEach((section) => {
          sectionsByType[section.section_type] = section;
        });

        setForm({
          category_id: data.category_id || '',
          name: data.name,
          short_description: data.short_description,
          description: data.description,
          icon: data.icon || '',
          cover_image: null,
          status: data.status,
          is_featured: data.is_featured,
          sort_order: data.sort_order,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          features: data.features?.length ? data.features.map((f) => ({ title: f.title, description: f.description || '' })) : [{ title: '', description: '' }],
          targets: data.targets?.length ? data.targets.map((t) => ({ title: t.title, description: t.description || '' })) : [{ title: '', description: '' }],
          processes: data.processes?.length ? data.processes.map((p) => ({ title: p.title, description: p.description || '' })) : [{ title: '', description: '' }],
          packages: data.packages?.length
            ? data.packages.map((p) => ({
                name: p.name,
                price_type: p.price_type,
                price: p.price || '',
                old_price: p.old_price || '',
                description: p.description || '',
                is_recommended: p.is_recommended,
                itemsText: (p.items || []).map((item) => (typeof item === 'string' ? item : item.feature_text)).join('\n'),
              }))
            : [{ name: '', price_type: 'starting', price: '', old_price: '', description: '', is_recommended: false, itemsText: '' }],
          faqs: data.faqs?.length ? data.faqs.map((f) => ({ question: f.question, answer: f.answer })) : [{ question: '', answer: '' }],
          sections: {
            about: { title: sectionsByType.about?.title || 'Tentang Layanan', content: sectionsByType.about?.content || '' },
            problem: { title: sectionsByType.problem?.title || 'Masalah yang Sering Dihadapi', content: sectionsByType.problem?.content || '' },
            solution: { title: sectionsByType.solution?.title || 'Solusi dari Apapun Bisa', content: sectionsByType.solution?.content || '' },
            technology: { title: sectionsByType.technology?.title || 'Teknologi / Peralatan', items: sectionsByType.technology?.settings_json || [] },
            cta: { title: sectionsByType.cta?.title || '', subtitle: sectionsByType.cta?.subtitle || '' },
          },
          technologyText: (sectionsByType.technology?.settings_json || []).map((i) => i.name).join(', '),
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

  function updateSectionField(type, key, value) {
    setForm((prev) => ({ ...prev, sections: { ...prev.sections, [type]: { ...prev.sections[type], [key]: value } } }));
  }

  function updateArrayItem(field, index, key, value) {
    setForm((prev) => {
      const items = [...prev[field]];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, [field]: items };
    });
  }

  function addArrayItem(field, empty) {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], empty] }));
  }

  function removeArrayItem(field, index) {
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  }

  function handleNewGalleryFiles(event) {
    const files = Array.from(event.target.files || []);
    setNewGalleries((prev) => [...prev, ...files]);
    event.target.value = '';
  }

  function toggleRemoveExistingGallery(galleryId) {
    setRemoveGalleryIds((prev) => (prev.includes(galleryId) ? prev.filter((id_) => id_ !== galleryId) : [...prev, galleryId]));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const technologyItems = form.technologyText
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ name }));

    const payload = {
      category_id: form.category_id,
      name: form.name,
      short_description: form.short_description,
      description: form.description,
      icon: form.icon,
      status: form.status,
      is_featured: form.is_featured,
      sort_order: form.sort_order,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      meta_keywords: form.meta_keywords,
      features: form.features.filter((f) => f.title),
      targets: form.targets.filter((t) => t.title),
      processes: form.processes.filter((p) => p.title),
      packages: form.packages
        .filter((p) => p.name)
        .map((p) => ({
          name: p.name,
          price_type: p.price_type,
          price: p.price || null,
          old_price: p.old_price || null,
          description: p.description,
          is_recommended: p.is_recommended,
          items: p.itemsText.split('\n').map((line) => line.trim()).filter(Boolean),
        })),
      faqs: form.faqs.filter((f) => f.question && f.answer),
      sections: [
        { section_type: 'about', title: form.sections.about.title, content: form.sections.about.content },
        { section_type: 'problem', title: form.sections.problem.title, content: form.sections.problem.content },
        { section_type: 'solution', title: form.sections.solution.title, content: form.sections.solution.content },
        { section_type: 'technology', title: form.sections.technology.title, settings_json: technologyItems },
        { section_type: 'cta', title: form.sections.cta.title, subtitle: form.sections.cta.subtitle },
      ],
      new_galleries: newGalleries,
      remove_gallery_ids: removeGalleryIds,
    };

    if (form.cover_image) {
      payload.cover_image = form.cover_image;
    }

    try {
      if (isEdit) {
        await updateService(id, payload);
        toast.success('Layanan berhasil diperbarui');
      } else {
        await createService(payload);
        toast.success('Layanan berhasil ditambahkan');
      }
      navigate('/admin/services');
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan layanan');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Memuat data layanan...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Layanan' : 'Tambah Layanan'} — Admin Apapun Bisa</title>
      </Helmet>

      <Breadcrumb
        items={[
          { label: 'Layanan', to: '/admin/services' },
          { label: isEdit ? 'Edit Layanan' : 'Tambah Layanan' },
        ]}
      />
      <PageHeader title={isEdit ? 'Edit Layanan' : 'Tambah Layanan'} />

      <form onSubmit={handleSubmit}>
        <div className="mb-4 overflow-x-auto rounded-xl border border-border bg-surface p-1.5">
          <div className="flex min-w-max gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key ? 'bg-primary text-white' : 'text-muted hover:bg-background'
              }`}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        <Card>
          {activeTab === 'general' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="Kategori" name="category_id" value={form.category_id} onChange={handleChange} error={errors.category_id?.[0]} required>
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <Input label="Nama Layanan" name="name" value={form.name} onChange={handleChange} error={errors.name?.[0]} required />
              </div>
              <Input label="Ikon (nama ikon)" name="icon" placeholder="globe, smartphone, dll." value={form.icon} onChange={handleChange} error={errors.icon?.[0]} />
              <Textarea label="Ringkasan Singkat" name="short_description" value={form.short_description} onChange={handleChange} error={errors.short_description?.[0]} required />
              <FileUploader
                label="Gambar Sampul"
                value={coverImagePreview}
                onChange={(file) => updateField('cover_image', file)}
              />
            </div>
          )}

          {activeTab === 'description' && (
            <div className="flex flex-col gap-6">
              <RichTextEditor label="Deskripsi Lengkap" value={form.description} onChange={(value) => updateField('description', value)} />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Textarea
                  label="Masalah yang Diselesaikan"
                  rows={4}
                  value={form.sections.problem.content}
                  onChange={(e) => updateSectionField('problem', 'content', e.target.value)}
                />
                <Textarea
                  label="Solusi yang Ditawarkan"
                  rows={4}
                  value={form.sections.solution.content}
                  onChange={(e) => updateSectionField('solution', 'content', e.target.value)}
                />
              </div>

              <Input
                label="Teknologi / Peralatan (pisahkan dengan koma, opsional)"
                value={form.technologyText}
                onChange={(e) => updateField('technologyText', e.target.value)}
                placeholder="Laravel, React, MySQL"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input
                  label="Judul CTA (ajakan konsultasi)"
                  value={form.sections.cta.title}
                  onChange={(e) => updateSectionField('cta', 'title', e.target.value)}
                />
                <Input
                  label="Subjudul CTA"
                  value={form.sections.cta.subtitle}
                  onChange={(e) => updateSectionField('cta', 'subtitle', e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <RepeaterSection
              items={form.features}
              onAdd={() => addArrayItem('features', { title: '', description: '' })}
              onRemove={(index) => removeArrayItem('features', index)}
              renderItem={(item, index) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input placeholder="Judul fitur" value={item.title} onChange={(e) => updateArrayItem('features', index, 'title', e.target.value)} />
                  <Input placeholder="Deskripsi (opsional)" value={item.description} onChange={(e) => updateArrayItem('features', index, 'description', e.target.value)} />
                </div>
              )}
              addLabel="+ Tambah Cakupan Layanan"
            />
          )}

          {activeTab === 'targets' && (
            <RepeaterSection
              items={form.targets}
              onAdd={() => addArrayItem('targets', { title: '', description: '' })}
              onRemove={(index) => removeArrayItem('targets', index)}
              renderItem={(item, index) => (
                <Input placeholder="Target pelanggan" value={item.title} onChange={(e) => updateArrayItem('targets', index, 'title', e.target.value)} />
              )}
              addLabel="+ Tambah Target Pelanggan"
            />
          )}

          {activeTab === 'processes' && (
            <RepeaterSection
              items={form.processes}
              onAdd={() => addArrayItem('processes', { title: '', description: '' })}
              onRemove={(index) => removeArrayItem('processes', index)}
              renderItem={(item, index) => (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input placeholder={`Langkah ${index + 1}`} value={item.title} onChange={(e) => updateArrayItem('processes', index, 'title', e.target.value)} />
                  <Input placeholder="Deskripsi (opsional)" value={item.description} onChange={(e) => updateArrayItem('processes', index, 'description', e.target.value)} />
                </div>
              )}
              addLabel="+ Tambah Langkah Proses"
            />
          )}

          {activeTab === 'packages' && (
            <RepeaterSection
              items={form.packages}
              onAdd={() =>
                addArrayItem('packages', { name: '', price_type: 'starting', price: '', old_price: '', description: '', is_recommended: false, itemsText: '' })
              }
              onRemove={(index) => removeArrayItem('packages', index)}
              renderItem={(item, index) => (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Input placeholder="Nama paket" value={item.name} onChange={(e) => updateArrayItem('packages', index, 'name', e.target.value)} />
                    <Select value={item.price_type} onChange={(e) => updateArrayItem('packages', index, 'price_type', e.target.value)}>
                      <option value="fixed">Harga Tetap</option>
                      <option value="starting">Harga Mulai Dari</option>
                      <option value="contact">Hubungi Kami</option>
                    </Select>
                    <Input
                      type="number"
                      placeholder="Harga (Rp)"
                      value={item.price}
                      onChange={(e) => updateArrayItem('packages', index, 'price', e.target.value)}
                      disabled={item.price_type === 'contact'}
                    />
                  </div>
                  <Textarea placeholder="Deskripsi paket" rows={2} value={item.description} onChange={(e) => updateArrayItem('packages', index, 'description', e.target.value)} />
                  <Textarea
                    placeholder={'Daftar fasilitas (1 baris = 1 fasilitas)'}
                    rows={3}
                    value={item.itemsText}
                    onChange={(e) => updateArrayItem('packages', index, 'itemsText', e.target.value)}
                  />
                  <label className="flex items-center gap-2 text-sm text-dark">
                    <input
                      type="checkbox"
                      checked={item.is_recommended}
                      onChange={(e) => updateArrayItem('packages', index, 'is_recommended', e.target.checked)}
                    />
                    Tandai sebagai paket rekomendasi
                  </label>
                </div>
              )}
              addLabel="+ Tambah Paket"
            />
          )}

          {activeTab === 'gallery' && (
            <div className="flex flex-col gap-4">
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

          {activeTab === 'faqs' && (
            <RepeaterSection
              items={form.faqs}
              onAdd={() => addArrayItem('faqs', { question: '', answer: '' })}
              onRemove={(index) => removeArrayItem('faqs', index)}
              renderItem={(item, index) => (
                <div className="flex flex-col gap-2">
                  <Input placeholder="Pertanyaan" value={item.question} onChange={(e) => updateArrayItem('faqs', index, 'question', e.target.value)} />
                  <Textarea placeholder="Jawaban" rows={2} value={item.answer} onChange={(e) => updateArrayItem('faqs', index, 'answer', e.target.value)} />
                </div>
              )}
              addLabel="+ Tambah FAQ"
            />
          )}

          {activeTab === 'seo' && (
            <div className="flex flex-col gap-4">
              <Input label="Meta Title" name="meta_title" value={form.meta_title} onChange={handleChange} error={errors.meta_title?.[0]} />
              <Textarea label="Meta Description" name="meta_description" value={form.meta_description} onChange={handleChange} error={errors.meta_description?.[0]} />
              <Input label="Meta Keywords" name="meta_keywords" value={form.meta_keywords} onChange={handleChange} error={errors.meta_keywords?.[0]} />
            </div>
          )}

          {activeTab === 'publish' && (
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-2 text-sm font-medium text-dark">
                <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
                Aktifkan layanan ini (tampil di website publik)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-dark">
                <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
                Jadikan layanan unggulan
              </label>
              <Input label="Urutan Tampil" name="sort_order" type="number" value={form.sort_order} onChange={handleChange} className="max-w-[200px]" />
            </div>
          )}
        </Card>

        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/services')}>
            Batal
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Simpan Layanan
          </Button>
        </div>
      </form>
    </>
  );
}

function RepeaterSection({ items, onAdd, onRemove, renderItem, addLabel }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-border p-4">
          <div className="mb-2 flex justify-end">
            {items.length > 1 && (
              <button type="button" onClick={() => onRemove(index)} className="text-xs font-medium text-red-500 hover:underline">
                Hapus
              </button>
            )}
          </div>
          {renderItem(item, index)}
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={onAdd} className="w-fit">
        {addLabel}
      </Button>
    </div>
  );
}
