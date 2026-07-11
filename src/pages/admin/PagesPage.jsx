import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchLandingPage, updateLandingPage } from '../../api/pageApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FileUploader from '../../components/common/FileUploader';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import Textarea from '../../components/common/Textarea';
import { useToast } from '../../hooks/useToast';

function stringifySettings(value) {
  if (!value) return '';
  return JSON.stringify(value, null, 2);
}

export default function PagesPage() {
  const toast = useToast();
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLandingPage()
      .then(({ data }) => {
        setSections(
          (data.sections || []).map((section) => ({
            ...section,
            image_file: null,
            settings_json_text: stringifySettings(section.settings_json),
          })),
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  function updateSection(index, key, value) {
    setSections((prev) => prev.map((section, currentIndex) => (
      currentIndex === index ? { ...section, [key]: value } : section
    )));
  }

  function moveSection(index, direction) {
    setSections((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const cloned = [...prev];
      const [item] = cloned.splice(index, 1);
      cloned.splice(nextIndex, 0, item);
      return cloned.map((section, currentIndex) => ({
        ...section,
        sort_order: currentIndex,
      }));
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const payload = {
        sections: sections.map((section, index) => {
          let parsedSettings = null;
          if (section.settings_json_text?.trim()) {
            parsedSettings = JSON.parse(section.settings_json_text);
          }

          return {
            section_key: section.section_key,
            title: section.title || '',
            subtitle: section.subtitle || '',
            description: section.description || '',
            image: section.image_file || null,
            button_text: section.button_text || '',
            button_url: section.button_url || '',
            button_text_two: section.button_text_two || '',
            button_url_two: section.button_url_two || '',
            settings_json: parsedSettings,
            sort_order: index,
            is_active: section.is_active,
          };
        }),
      };

      await updateLandingPage(payload);
      toast.success('Landing page berhasil diperbarui');
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('JSON pada salah satu section tidak valid');
      } else {
        const response = error.response?.data;
        if (response?.errors) setErrors(response.errors);
        toast.error(response?.message || 'Gagal memperbarui landing page');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Landing Page — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Landing Page"
        description="Atur urutan, visibilitas, dan konten section landing page tanpa mengubah kode."
      />

      {isLoading ? (
        <p className="text-sm text-muted">Memuat section landing page...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <Card key={section.section_key}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{section.section_key}</p>
                    <h2 className="font-heading text-xl font-bold text-dark">{section.title || 'Section tanpa judul'}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-dark">
                      <input type="checkbox" checked={section.is_active} onChange={(event) => updateSection(index, 'is_active', event.target.checked)} />
                      Aktif
                    </label>
                    <Button type="button" variant="secondary" onClick={() => moveSection(index, -1)}>Naik</Button>
                    <Button type="button" variant="secondary" onClick={() => moveSection(index, 1)}>Turun</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Judul" value={section.title || ''} onChange={(event) => updateSection(index, 'title', event.target.value)} error={errors[`sections.${index}.title`]?.[0]} />
                  <Input label="Subjudul" value={section.subtitle || ''} onChange={(event) => updateSection(index, 'subtitle', event.target.value)} error={errors[`sections.${index}.subtitle`]?.[0]} />
                </div>

                <Textarea label="Deskripsi" value={section.description || ''} onChange={(event) => updateSection(index, 'description', event.target.value)} error={errors[`sections.${index}.description`]?.[0]} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Teks Tombol 1" value={section.button_text || ''} onChange={(event) => updateSection(index, 'button_text', event.target.value)} />
                  <Input label="URL Tombol 1" value={section.button_url || ''} onChange={(event) => updateSection(index, 'button_url', event.target.value)} />
                  <Input label="Teks Tombol 2" value={section.button_text_two || ''} onChange={(event) => updateSection(index, 'button_text_two', event.target.value)} />
                  <Input label="URL Tombol 2" value={section.button_url_two || ''} onChange={(event) => updateSection(index, 'button_url_two', event.target.value)} />
                </div>

                <FileUploader label="Gambar Section" value={section.image} onChange={(file) => updateSection(index, 'image_file', file)} />

                <Textarea
                  label="settings_json (JSON)"
                  value={section.settings_json_text || ''}
                  onChange={(event) => updateSection(index, 'settings_json_text', event.target.value)}
                  rows={8}
                  error={errors[`sections.${index}.settings_json`]?.[0]}
                />
              </div>
            </Card>
          ))}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Landing Page'}</Button>
          </div>
        </form>
      )}
    </>
  );
}
