import { Activity, ChartNoAxesCombined, Trophy, UsersRound } from 'lucide-react';

const STAT_ICONS = [Trophy, UsersRound, Activity, ChartNoAxesCombined];

export default function StatBlock({ statistics }) {
  if (!statistics || statistics.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {statistics.map((stat, index) => {
        const Icon = STAT_ICONS[index % STAT_ICONS.length];

        return (
          <div key={stat.label} className="group rounded-[1.35rem] border border-border bg-surface p-5 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon size={20} />
            </span>
            <span className="block font-heading text-3xl font-extrabold text-dark sm:text-4xl">{stat.value}</span>
            <span className="mt-1 block text-sm font-medium text-muted">{stat.label}</span>
          </div>
        );
      })}
    </div>
  );
}
