import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import Button from '../components/common/Button';
import ScrollToTop from '../components/common/ScrollToTop';
import WhatsAppLeadWidget from '../components/public/WhatsAppLeadWidget';
import { useSettings } from '../hooks/useSettings';

const NAV_ITEMS = [
  { label: 'Beranda', to: '/' },
  { label: 'Tentang Kami', to: '/tentang-kami' },
  { label: 'Layanan', to: '/layanan' },
  { label: 'Portofolio', to: '/portofolio' },
  { label: 'Artikel', to: '/artikel' },
  { label: 'Kontak', to: '/kontak' },
];

const SOCIAL_ICONS = {
  instagram: (
    <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.42.46.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.24.64.41 1.36.46 2.42.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.46 2.42-.26.66-.6 1.22-1.15 1.77-.55.55-1.11.9-1.77 1.15-.64.24-1.36.41-2.42.46-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.42-.46-.66-.26-1.22-.6-1.77-1.15-.55-.55-.9-1.11-1.15-1.77-.24-.64-.41-1.36-.46-2.42C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.46-2.42.26-.66.6-1.22 1.15-1.77.55-.55 1.11-.9 1.77-1.15.64-.24 1.36-.41 2.42-.46C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.2a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5.4-8.4a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" />
  ),
  facebook: (
    <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />
  ),
  tiktok: (
    <path d="M16.6 5.82c-.9-.86-1.4-2.05-1.4-3.32h-3.1v13.5a2.9 2.9 0 11-2.05-2.77V9.9a5.98 5.98 0 00-1-.08A6 6 0 108 21.8a6 6 0 006-6V9.15a7.5 7.5 0 004.4 1.4V7.4c-.63 0-1.24-.13-1.8-.36-.36-.15-.7-.35-1-.6z" />
  ),
  linkedin: (
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
  ),
  youtube: (
    <path d="M23.5 6.2a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3.02 3.02 0 002.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z" />
  ),
};

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettings();

  const socialLinks = ['instagram', 'facebook', 'tiktok', 'linkedin', 'youtube'].filter((key) => settings?.[key]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-dark">
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.site_name} className="h-8 w-auto" />
            ) : (
              <span>
                Apapun<span className="text-primary">Bisa</span>
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? 'text-primary' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button as={Link} to="/konsultasi">
              Konsultasikan Kebutuhan
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Buka menu navigasi"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 bg-dark" />
              <span className="h-0.5 w-5 bg-dark" />
              <span className="h-0.5 w-5 bg-dark" />
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="flex flex-col gap-1 border-t border-border bg-surface px-4 py-4 lg:hidden">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button as={Link} to="/konsultasi" className="mt-2 justify-center">
              Konsultasikan Kebutuhan
            </Button>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-dark text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <p className="font-heading text-lg font-bold">
              {settings?.logo_dark || settings?.logo ? (
                <img src={settings.logo_dark || settings.logo} alt={settings.site_name} className="h-8 w-auto" />
              ) : (
                <>
                  Apapun<span className="text-primary">Bisa</span>
                </>
              )}
            </p>
            <p className="mt-3 max-w-md text-sm text-white/60">
              {settings?.footer_description ||
                'Apapun Bisa adalah platform penyedia berbagai layanan. Semua Bisa Diatur.'}
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socialLinks.map((key) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                    aria-label={key}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                      {SOCIAL_ICONS[key]}
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Menu</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/60">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Kontak</p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/60">
              {settings?.address && <li>{settings.address}</li>}
              {settings?.whatsapp && <li>WhatsApp: {settings.whatsapp}</li>}
              {settings?.email && <li>{settings.email}</li>}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
          {settings?.copyright_text || `© ${new Date().getFullYear()} Apapun Bisa. Semua hak cipta dilindungi.`}
        </div>
      </footer>

      <WhatsAppLeadWidget phone={settings?.whatsapp} siteName={settings?.site_name} />
    </div>
  );
}
