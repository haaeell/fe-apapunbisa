import { Quote } from 'lucide-react';
import StarRating from './StarRating';

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-[1.35rem] border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute right-5 top-5 text-primary/10 transition-transform group-hover:rotate-6 group-hover:scale-110">
        <Quote size={54} />
      </div>
      <div className="relative">
        <StarRating rating={testimonial.rating} />
      </div>
      <p className="relative flex-1 text-sm leading-7 text-dark">&ldquo;{testimonial.content}&rdquo;</p>
      <div className="relative flex items-center gap-3 rounded-2xl bg-background p-3">
        {testimonial.photo ? (
          <img src={testimonial.photo} alt={testimonial.client_name} className="h-11 w-11 rounded-full object-cover" />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {testimonial.client_name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-dark">{testimonial.client_name}</p>
          {testimonial.client_position && <p className="text-xs text-muted">{testimonial.client_position}</p>}
        </div>
      </div>
    </div>
  );
}
