import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchPublicServices } from '../../api/publicServiceApi';
import { submitServiceRequest } from '../../api/serviceRequestApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Seo from '../../components/common/Seo';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import SectionHeading from '../../components/public/SectionHeading';

function initialForm() {
  return {
    name: '',
    email: '',
    whatsapp: '',
    service_id: '',
    title: '',
    description: '',
    budget_estimate: '',
    target_date: '',
    communication_method: 'whatsapp',
  };
}

export default function ServiceRequestPage() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchPublicServices({ per_page: 100 }).then(({ data }) => {
      setServices(data);
      const preselect = searchParams.get('layanan');
      if (preselect) {
        const match = data.find((service) => service.slug === preselect);
        if (match) setForm((prev) => ({ ...prev, service_id: match.id }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(event) {
    setAttachments(Array.from(event.target.files || []));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await submitServiceRequest({ ...form, attachments });
      setIsSuccess(true);
      setForm(initialForm());
      setAttachments([]);
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) setErrors(response.errors);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-3xl text-success">
          &#10003;
        </span>
        <h1 className="font-heading text-2xl font-bold text-dark">Permintaan Terkirim!</h1>
        <p className="text-muted">
          Terima kasih, tim Apapun Bisa akan segera menghubungi Anda untuk mendiskusikan kebutuhan lebih lanjut.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Ajukan Permintaan Lain</Button>
      </section>
    );
  }

  return (
    <>
      <Seo
        title="Konsultasikan Kebutuhan — Apapun Bisa"
        description="Ceritakan kebutuhan Anda dan biarkan tim Apapun Bisa membantu menemukan solusi yang tepat."
        path={`/konsultasi${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
      />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          label="Konsultasi Gratis"
          title="Konsultasikan Kebutuhan Anda"
          description="Isi formulir berikut, tim kami akan menghubungi Anda untuk mendiskusikan solusi terbaik."
        />

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nama" name="name" value={form.name} onChange={handleChange} error={errors.name?.[0]} required />
            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Nomor WhatsApp" name="whatsapp" value={form.whatsapp} onChange={handleChange} error={errors.whatsapp?.[0]} required />
            <Select label="Jenis Layanan" name="service_id" value={form.service_id} onChange={handleChange}>
              <option value="">Pilih layanan (opsional)</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </div>

          <Input label="Judul Kebutuhan" name="title" value={form.title} onChange={handleChange} error={errors.title?.[0]} required />
          <Textarea
            label="Deskripsi Kebutuhan"
            name="description"
            rows={5}
            value={form.description}
            onChange={handleChange}
            error={errors.description?.[0]}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Perkiraan Anggaran"
              name="budget_estimate"
              placeholder="mis. 5-10 juta"
              value={form.budget_estimate}
              onChange={handleChange}
              error={errors.budget_estimate?.[0]}
            />
            <Input label="Target Selesai" name="target_date" type="date" value={form.target_date} onChange={handleChange} error={errors.target_date?.[0]} />
          </div>

          <Select
            label="Metode Komunikasi yang Diinginkan"
            name="communication_method"
            value={form.communication_method}
            onChange={handleChange}
            error={errors.communication_method?.[0]}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="phone">Telepon</option>
          </Select>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-dark">Lampiran (opsional, maks. 5 file)</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="rounded-lg border border-border px-4 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
            />
            {errors.attachments && <span className="text-xs text-red-500">{errors.attachments[0]}</span>}
            {attachments.length > 0 && (
              <p className="text-xs text-muted">{attachments.length} file dipilih: {attachments.map((f) => f.name).join(', ')}</p>
            )}
          </div>

          <Button type="submit" isLoading={isSubmitting} className="mt-2 justify-center">
            Kirim Permintaan
          </Button>
        </form>
      </section>
    </>
  );
}
