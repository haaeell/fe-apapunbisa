import { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Lock, LogIn, ShieldCheck, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isLoading && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/admin/dashboard'} replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setGeneralError('');
    setIsSubmitting(true);

    try {
      const user = await login(form);
      navigate(location.state?.from?.pathname || '/admin/dashboard', {
        replace: true,
        state: null,
      });
      void user;
    } catch (error) {
      const response = error.response?.data;
      if (response?.errors) {
        setErrors(response.errors);
      }
      setGeneralError(response?.message || 'Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <Helmet>
        <title>Login Admin — Apapun Bisa</title>
      </Helmet>

      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-dark text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />
        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <p className="font-heading text-2xl font-bold text-white">
            Apapun<span className="text-accent">Bisa</span>
          </p>
        </div>

        <div className="relative max-w-md">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            <Sparkles size={16} />
            Panel Admin
          </span>
          <h1 className="font-heading text-3xl font-extrabold leading-tight text-white">
            Kelola layanan, portofolio, dan konten dari satu tempat.
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Masuk untuk mengelola layanan, portofolio, artikel, dan permintaan konsultasi dari klien Apapun Bisa.
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-sm text-white/50">
          <ShieldCheck size={16} />
          Akses khusus tim internal Apapun Bisa
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <p className="font-heading text-xl font-bold text-dark">
              Apapun<span className="text-primary">Bisa</span>
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-border bg-surface p-8 shadow-sm">
            <div className="mb-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LogIn size={20} />
              </span>
              <h2 className="mt-4 font-heading text-xl font-bold text-dark">Masuk ke Panel Admin</h2>
              <p className="mt-1 text-sm text-muted">Masukkan kredensial Anda untuk melanjutkan.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Input
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="admin@apapunbisa.id"
                value={form.email}
                onChange={handleChange}
                error={errors.email?.[0]}
                autoComplete="username"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-dark">
                  Password
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted">
                    <Lock size={16} />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className={`w-full rounded-lg border py-2.5 pl-10 pr-11 text-sm text-dark placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.password?.[0] ? 'border-red-400' : 'border-border'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-muted hover:text-dark"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password?.[0] && <span className="text-xs text-red-500">{errors.password[0]}</span>}
              </div>

              {generalError && (
                <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {generalError}
                </p>
              )}

              <Button type="submit" isLoading={isSubmitting} className="mt-2 justify-center rounded-xl">
                Masuk
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
