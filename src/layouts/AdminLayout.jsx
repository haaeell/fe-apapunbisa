import { useState } from 'react';
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  ChevronRight,
  FolderKanban,
  HelpCircle,
  Image,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  PanelLeftClose,
  Settings,
  Sparkles,
  Tags,
  UsersRound,
} from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const MENU_GROUPS = [
  {
    label: 'Utama',
    items: [
      { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Katalog',
    items: [
      { label: 'Layanan', to: '/admin/services', icon: BriefcaseBusiness },
      { label: 'Kategori Layanan', to: '/admin/categories', icon: Tags },
      { label: 'Portofolio', to: '/admin/portfolios', icon: FolderKanban },
    ],
  },
  {
    label: 'Konten',
    items: [
      { label: 'Artikel', to: '/admin/articles', icon: Newspaper },
      { label: 'Testimoni', to: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'FAQ', to: '/admin/faqs', icon: HelpCircle },
      { label: 'Tim', to: '/admin/teams', icon: UsersRound },
    ],
  },
  {
    label: 'Leads',
    items: [
      { label: 'Pesan Masuk', to: '/admin/contacts', icon: Inbox },
      { label: 'Permintaan Layanan', to: '/admin/service-requests', icon: BookOpenText },
    ],
  },
  {
    label: 'Website',
    items: [
      { label: 'Landing Page', to: '/admin/pages', icon: Sparkles },
      { label: 'Media Library', to: '/admin/media', icon: Image },
      { label: 'Pengaturan', to: '/admin/settings', icon: Settings, superAdminOnly: true },
    ],
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const visibleMenuGroups = MENU_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.superAdminOnly || user?.role?.slug === 'super_admin'),
  })).filter((group) => group.items.length > 0);

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="flex min-h-screen bg-background lg:items-start">
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-72 transform flex-col border-r border-border bg-white text-dark shadow-xl shadow-dark/5 transition-transform lg:sticky lg:top-0 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-5">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <BarChart3 size={20} strokeWidth={2.2} />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-base font-bold text-dark">Apapun Bisa</span>
              <span className="text-xs font-medium text-muted">Admin Panel</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-dark lg:hidden"
            aria-label="Tutup menu sidebar"
          >
            <PanelLeftClose size={19} />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain px-4 py-5">
          {visibleMenuGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-1.5">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wide text-muted">{group.label}</p>
              {group.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary ring-1 ring-primary/10'
                          : 'text-slate-600 hover:bg-background hover:text-dark'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-primary'
                          }`}
                        >
                          <Icon size={18} strokeWidth={2.1} />
                        </span>
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        <ChevronRight
                          size={16}
                          className={`shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-border bg-white p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-background px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-dark">{user?.name}</p>
              <p className="truncate text-xs text-muted">{user?.role?.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-background"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-0">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-dark lg:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            aria-label="Buka menu sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-dark">{user?.name}</p>
              <p className="text-xs text-muted">{user?.role?.name}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
