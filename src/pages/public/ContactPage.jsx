import { useEffect, useState } from 'react';
import { fetchPublicServices } from '../../api/publicServiceApi';
import { submitContact } from '../../api/contactApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Seo from '../../components/common/Seo';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import SectionHeading from '../../components/public/SectionHeading';
import { useSettings } from '../../hooks/useSettings';

const EMPTY_FORM = { name: '', email: '', whatsapp: '', subject: '', service_id: '', message: '' };

export default function ContactPage() {
  const { settings } = useSettings();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchPublicServices({ per_page: 100 }).then(({ data }) => setServices(data));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await submitContact(form);
      setIsSuccess(true);
      setForm(EMPTY_FORM);
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Kontak — Apapun Bisa"
        description="Hubungi Apapun Bisa untuk konsultasi kebutuhan Anda."
        path="/kontak"
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading label="Kontak" title="Mari Berbicara Tentang Kebutuhan Anda" align="left" />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {settings?.address && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Alamat</p>
                  <p className="mt-1 text-sm text-dark">{settings.address}</p>
                </div>
              )}
              {settings?.whatsapp && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">WhatsApp</p>
                  <p className="mt-1 text-sm text-dark">{settings.whatsapp}</p>
                </div>
              )}
              {settings?.email && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p>
                  <p className="mt-1 text-sm text-dark">{settings.email}</p>
                </div>
              )}
              {settings?.operating_hours?.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Jam Operasional</p>
                  {settings.operating_hours.map((item) => (
                    <p key={item.day} className="mt-1 text-sm text-dark">
                      {item.day}: {item.hours}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {settings?.google_maps_url && (
              <div className="overflow-hidden rounded-2xl border border-border">
                <iframe
                  src={settings.google_maps_url}
                  title="Lokasi Apapun Bisa"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
                  &#10003;
                </span>
                <h3 className="font-heading text-lg font-semibold text-dark">Pesan Terkirim!</h3>
                <p className="text-sm text-muted">Tim kami akan segera menghubungi Anda.</p>
                <Button variant="secondary" onClick={() => setIsSuccess(false)}>
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input label="Nama" name="name" value={form.name} onChange={handleChange} error={errors.name?.[0]} required />
                <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} required />
                <Input label="Nomor WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} error={errors.whatsapp?.[0]} />
                <Select label="Layanan yang Diminati" name="service_id" value={form.service_id} onChange={handleChange}>
                  <option value="">Pilih layanan (opsional)</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
                <Input label="Subjek" name="subject" value={form.subject} onChange={handleChange} error={errors.subject?.[0]} />
                <Textarea label="Pesan" name="message" rows={4} value={form.message} onChange={handleChange} error={errors.message?.[0]} required />
                <Button type="submit" isLoading={isSubmitting} className="mt-2 justify-center">
                  Kirim Pesan
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
