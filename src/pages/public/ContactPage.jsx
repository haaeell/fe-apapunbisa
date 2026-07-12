import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Mail, MapPin, Phone, Sparkles } from 'lucide-react';
import { fetchPublicServices } from '../../api/publicServiceApi';
import { submitContact } from '../../api/contactApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Seo from '../../components/common/Seo';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
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

      <section className="relative overflow-hidden bg-dark py-20 text-white sm:py-24">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <span className="reveal-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            <Sparkles size={16} />
            Kontak
          </span>
          <h1 className="reveal-up reveal-delay-2 font-heading text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Mari Berbicara Tentang Kebutuhan Anda
          </h1>
          <p className="reveal-up reveal-delay-3 mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75">
            Ceritakan kebutuhan Anda, tim kami siap membantu mencarikan solusi yang tepat.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="reveal-up flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {settings?.address && (
                <div className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <MapPin size={18} />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Alamat</p>
                  <p className="mt-1 text-sm text-dark">{settings.address}</p>
                </div>
              )}
              {settings?.whatsapp && (
                <div className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Phone size={18} />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">WhatsApp</p>
                  <p className="mt-1 text-sm text-dark">{settings.whatsapp}</p>
                </div>
              )}
              {settings?.email && (
                <div className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Mail size={18} />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p>
                  <p className="mt-1 text-sm text-dark">{settings.email}</p>
                </div>
              )}
              {settings?.operating_hours?.length > 0 && (
                <div className="group rounded-2xl border border-border bg-surface p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Clock size={18} />
                  </span>
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
              <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
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

          <div className="reveal-up reveal-delay-2 rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm sm:p-8">
            {isSuccess ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 size={28} />
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
                <Button type="submit" isLoading={isSubmitting} className="mt-2 justify-center rounded-xl">
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
