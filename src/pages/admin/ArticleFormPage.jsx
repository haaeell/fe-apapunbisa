import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { createArticleCategory, fetchArticleCategories } from '../../api/articleCategoryApi';
import { createArticle, fetchArticle, updateArticle } from '../../api/articleApi';
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

function initialForm() {
  return {
    article_category_id: '',
    title: '',
    summary: '',
    content: '',
    status: 'draft',
    is_featured: false,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    tagsText: '',
    thumbnail: null,
  };
}

export default function ArticleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [form, setForm] = useState(initialForm());
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function loadCategories() {
    fetchArticleCategories().then(({ data }) => setCategories(data));
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!isEdit) return;

    fetchArticle(id)
      .then(({ data }) => {
        setForm({
          article_category_id: data.article_category_id || '',
          title: data.title,
          summary: data.summary || '',
          content: data.content,
          status: data.status,
          is_featured: data.is_featured,
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          tagsText: (data.tags || []).join(', '),
          thumbnail: null,
        });
        setThumbnailPreview(data.thumbnail);
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

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;

    try {
      const { data } = await createArticleCategory(newCategoryName.trim());
      setNewCategoryName('');
      loadCategories();
      updateField('article_category_id', data.id);
      toast.success('Kategori artikel berhasil ditambahkan');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambah kategori');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const payload = {
      article_category_id: form.article_category_id || null,
      title: form.title,
      summary: form.summary,
      content: form.content,
      status: form.status,
      is_featured: form.is_featured,
      meta_title: form.meta_title,
      meta_description: form.meta_description,
      meta_keywords: form.meta_keywords,
      tags: form.tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (form.thumbnail) {
      payload.thumbnail = form.thumbnail;
    }

    try {
      if (isEdit) {
        await updateArticle(id, payload);
        toast.success('Artikel berhasil diperbarui');
      } else {
        await createArticle(payload);
        toast.success('Artikel berhasil ditambahkan');
      }
      navigate('/admin/articles');
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal menyimpan artikel');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted">Memuat data artikel...</p>;
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit Artikel' : 'Tambah Artikel'} — Admin Apapun Bisa</title>
      </Helmet>

      <Breadcrumb items={[{ label: 'Artikel', to: '/admin/articles' }, { label: isEdit ? 'Edit Artikel' : 'Tambah Artikel' }]} />
      <PageHeader title={isEdit ? 'Edit Artikel' : 'Tambah Artikel'} />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <Input label="Judul Artikel" name="title" value={form.title} onChange={handleChange} error={errors.title?.[0]} required />
            <div className="mt-4">
              <Textarea label="Ringkasan" name="summary" value={form.summary} onChange={handleChange} error={errors.summary?.[0]} />
            </div>
            <div className="mt-4">
              <RichTextEditor label="Konten Artikel" value={form.content} onChange={(value) => updateField('content', value)} />
            </div>
          </Card>

          <Card>
            <Input label="Meta Title" name="meta_title" value={form.meta_title} onChange={handleChange} />
            <div className="mt-4">
              <Textarea label="Meta Description" name="meta_description" value={form.meta_description} onChange={handleChange} />
            </div>
            <div className="mt-4">
              <Input label="Meta Keywords" name="meta_keywords" value={form.meta_keywords} onChange={handleChange} />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <Select label="Status" name="status" value={form.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
            <label className="mt-3 flex items-center gap-2 text-sm font-medium text-dark">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} />
              Jadikan artikel unggulan
            </label>
          </Card>

          <Card>
            <Select label="Kategori Artikel" name="article_category_id" value={form.article_category_id} onChange={handleChange}>
              <option value="">Tanpa kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="Kategori baru"
                value={newCategoryName}
                onChange={(event) => setNewCategoryName(event.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={handleAddCategory}>
                Tambah
              </Button>
            </div>
          </Card>

          <Card>
            <Input
              label="Tag (pisahkan dengan koma)"
              value={form.tagsText}
              onChange={(event) => updateField('tagsText', event.target.value)}
              placeholder="Website, Bisnis"
            />
          </Card>

          <Card>
            <FileUploader
              label="Thumbnail"
              value={thumbnailPreview}
              onChange={(file) => updateField('thumbnail', file)}
            />
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => navigate('/admin/articles')}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Simpan Artikel
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
