import {
  BookOpen,
  Briefcase,
  Camera,
  Cpu,
  GraduationCap,
  HeartHandshake,
  Laptop,
  Megaphone,
  MessageCircle,
  Palette,
  ShoppingBag,
  Smartphone,
  Video,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ICONS = {
  'book-open': BookOpen,
  briefcase: Briefcase,
  camera: Camera,
  cpu: Cpu,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  laptop: Laptop,
  megaphone: Megaphone,
  'message-circle': MessageCircle,
  palette: Palette,
  'shopping-bag': ShoppingBag,
  smartphone: Smartphone,
  video: Video,
  wrench: Wrench,
};

export default function CategoryCard({ category }) {
  const Icon = ICONS[category.icon] || Briefcase;
  const color = category.color || '#2563EB';

  return (
    <Link
      to={`/layanan?category=${category.slug}`}
      className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-border bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-10 transition-transform group-hover:scale-125" style={{ backgroundColor: color }} />
      <div className="relative">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:rotate-3 group-hover:scale-110"
          style={{ backgroundColor: color }}
        >
          <Icon size={22} />
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold text-dark">{category.name}</h3>
        {category.description && <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{category.description}</p>}
      </div>
      {typeof category.services_count === 'number' && (
        <span className="relative mt-4 w-fit rounded-full bg-background px-3 py-1.5 text-xs font-bold text-primary">
          {category.services_count} Layanan
        </span>
      )}
    </Link>
  );
}
