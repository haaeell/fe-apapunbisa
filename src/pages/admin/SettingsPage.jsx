import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchSettings, updateSettings } from '../../api/settingApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import FileUploader from '../../components/common/FileUploader';
import Input from '../../components/common/Input';
import PageHeader from '../../components/common/PageHeader';
import Textarea from '../../components/common/Textarea';
import { useToast } from '../../hooks/useToast';

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

function buildDefaultHours(hours = []) {
  return DAYS.map((day) => hours.find((item) => item.day === day) || { day, hours: '' });
}

export default function SettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSettings()
      .then(({ data }) => {
        setForm({
          site_name: data.site_name || '',
          tagline: data.tagline || '',
          email: data.email || '',
          whatsapp: data.whatsapp || '',
          phone: data.phone || '',
          address: data.address || '',
          google_maps_url: data.google_maps_url || '',
          instagram: data.instagram || '',
          facebook: data.facebook || '',
          tiktok: data.tiktok || '',
          linkedin: data.linkedin || '',
          youtube: data.youtube || '',
          footer_description: data.footer_description || '',
          copyright_text: data.copyright_text || '',
          seo_title: data.seo?.title || '',
          seo_description: data.seo?.description || '',
          google_analytics_id: data.seo?.google_analytics_id || '',
          meta_verification: data.seo?.meta_verification || '',
          operating_hours: buildDefaultHours(data.operating_hours),
          logo: null,
          logo_dark: null,
          favicon: null,
          seo_image: null,
          existing_logo: data.logo || null,
          existing_logo_dark: data.logo_dark || null,
          existing_favicon: data.favicon || null,
          existing_seo_image: data.seo?.image || null,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChange(event) {
    updateField(event.target.name, event.target.value);
  }

  function updateHours(index, value) {
    setForm((prev) => ({
      ...prev,
      operating_hours: prev.operating_hours.map((item, currentIndex) => (
        currentIndex === index ? { ...item, hours: value } : item
      )),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await updateSettings({
        ...form,
        operating_hours: form.operating_hours.filter((item) => item.hours),
      });
      toast.success('Pengaturan website berhasil diperbarui');
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
      toast.error(response?.message || 'Gagal memperbarui pengaturan');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading || !form) {
    return <p className="text-sm text-muted">Memuat pengaturan website...</p>;
  }

  return (
    <>
      <Helmet>
        <title>Pengaturan Website — Admin Apapun Bisa</title>
      </Helmet>

      <PageHeader
        title="Pengaturan Website"
        description="Kelola identitas website, kontak, aset brand, dan default SEO."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nama Website" name="site_name" value={form.site_name} onChange={handleChange} error={errors.site_name?.[0]} required />
            <Input label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} error={errors.tagline?.[0]} />
            <Input label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} />
            <Input label="WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} error={errors.whatsapp?.[0]} />
            <Input label="Telepon" name="phone" value={form.phone} onChange={handleChange} error={errors.phone?.[0]} />
            <Input label="Google Maps URL" name="google_maps_url" value={form.google_maps_url} onChange={handleChange} error={errors.google_maps_url?.[0]} />
          </div>
          <div className="mt-4">
            <Textarea label="Alamat" name="address" value={form.address} onChange={handleChange} error={errors.address?.[0]} />
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Instagram" name="instagram" value={form.instagram} onChange={handleChange} />
            <Input label="Facebook" name="facebook" value={form.facebook} onChange={handleChange} />
            <Input label="TikTok" name="tiktok" value={form.tiktok} onChange={handleChange} />
            <Input label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} />
            <Input label="YouTube" name="youtube" value={form.youtube} onChange={handleChange} />
            <Input label="Google Analytics ID" name="google_analytics_id" value={form.google_analytics_id} onChange={handleChange} />
          </div>
          <div className="mt-4">
            <Input label="Meta Verification" name="meta_verification" value={form.meta_verification} onChange={handleChange} />
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FileUploader label="Logo" value={form.existing_logo} onChange={(file) => updateField('logo', file)} />
            <FileUploader label="Logo Dark" value={form.existing_logo_dark} onChange={(file) => updateField('logo_dark', file)} />
            <FileUploader label="Favicon" value={form.existing_favicon} onChange={(file) => updateField('favicon', file)} />
            <FileUploader label="SEO Image" value={form.existing_seo_image} onChange={(file) => updateField('seo_image', file)} />
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {form.operating_hours.map((item, index) => (
              <Input key={item.day} label={item.day} value={item.hours} onChange={(event) => updateHours(index, event.target.value)} placeholder="08.00 - 17.00" />
            ))}
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-1 gap-4">
            <Textarea label="Deskripsi Footer" name="footer_description" value={form.footer_description} onChange={handleChange} error={errors.footer_description?.[0]} />
            <Input label="Copyright Text" name="copyright_text" value={form.copyright_text} onChange={handleChange} error={errors.copyright_text?.[0]} />
            <Input label="SEO Title Default" name="seo_title" value={form.seo_title} onChange={handleChange} error={errors.seo_title?.[0]} />
            <Textarea label="SEO Description Default" name="seo_description" value={form.seo_description} onChange={handleChange} error={errors.seo_description?.[0]} />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Pengaturan'}</Button>
        </div>
      </form>
    </>
  );
}
