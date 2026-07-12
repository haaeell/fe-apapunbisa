import { MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchPublicServices } from '../../api/publicServiceApi';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Textarea from '../common/Textarea';

const EMPTY_FORM = {
  name: '',
  phone: '',
  service_id: '',
  question: '',
};

function normalizePhone(phone) {
  return phone?.replace(/\D+/g, '') || '';
}

export default function WhatsAppLeadWidget({ phone, siteName = 'Apapun Bisa' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || services.length > 0) return;

    fetchPublicServices({ per_page: 100 })
      .then(({ data }) => setServices(data || []))
      .catch(() => setServices([]));
  }, [isOpen, services.length]);

  const whatsappUrl = useMemo(() => {
    const normalizedBusinessPhone = normalizePhone(phone);

    if (!normalizedBusinessPhone) return null;

    const selectedService = services.find((service) => String(service.id) === String(form.service_id));
    const lines = [
      `Halo ${siteName}, saya ingin konsultasi.`,
      '',
      `Nama: ${form.name}`,
      `No. Telepon: ${form.phone}`,
      `Layanan: ${selectedService?.name || '-'}`,
      `Pertanyaan/Kebutuhan: ${form.question}`,
    ];

    return `https://wa.me/${normalizedBusinessPhone}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [form.name, form.phone, form.question, form.service_id, phone, services, siteName]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleClose() {
    setIsOpen(false);
    setErrors({});
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Nama wajib diisi';
    if (!form.phone.trim()) nextErrors.phone = 'Nomor telepon wajib diisi';
    if (!form.service_id) nextErrors.service_id = 'Pilih layanan yang dibutuhkan';
    if (!form.question.trim()) nextErrors.question = 'Pertanyaan wajib diisi';

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !whatsappUrl) return;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setForm(EMPTY_FORM);
    handleClose();
  }

  if (!phone) return null;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg transition-transform hover:scale-105"
          aria-label="Buka formulir WhatsApp"
        >
          <MessageCircle size={24} />
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose} title="Lanjut ke WhatsApp" size="md">
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted">
            Isi dulu data singkat ini, nanti kami arahkan langsung ke WhatsApp dengan pesan yang sudah rapi.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nama" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
            <Input
              label="Nomor Telepon / WhatsApp"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />
            <Select
              label="Membutuhkan Layanan Apa?"
              name="service_id"
              value={form.service_id}
              onChange={handleChange}
              error={errors.service_id}
              required
            >
              <option value="">Pilih layanan</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
            <Textarea
              label="Pertanyaan / Kebutuhan"
              name="question"
              rows={5}
              value={form.question}
              onChange={handleChange}
              error={errors.question}
              required
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Batal
              </Button>
              <Button type="submit">Lanjut ke WhatsApp</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
