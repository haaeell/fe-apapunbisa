import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function CtaBanner({ title, subtitle, buttonText, buttonUrl }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-dark px-6 py-10 text-white sm:px-10">
      <div className="absolute inset-0 hero-grid-pattern opacity-30" />
      <div className="relative grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/75">
            <Sparkles size={16} />
            Siap dibuat lebih rapi?
          </span>
          <h2 className="max-w-2xl font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-dark">
              <MessageCircle size={20} />
            </span>
            <p className="text-sm font-semibold text-white/80">Konsultasi awal, scope jelas, lanjut eksekusi.</p>
          </div>
          <Button as={Link} to={buttonUrl || '/konsultasi'} variant="accent" className="w-full rounded-xl">
            {buttonText || 'Konsultasikan Kebutuhan'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
