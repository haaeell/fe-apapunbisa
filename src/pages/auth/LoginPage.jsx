import { useState } from 'react';
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Helmet>
        <title>Login Admin — Apapun Bisa</title>
      </Helmet>

      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="font-heading text-xl font-bold text-dark">
            Apapun<span className="text-primary">Bisa</span>
          </p>
          <p className="mt-1 text-sm text-muted">Masuk ke panel admin</p>
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
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password?.[0]}
            autoComplete="current-password"
            required
          />

          {generalError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{generalError}</p>
          )}

          <Button type="submit" isLoading={isSubmitting} className="mt-2 justify-center">
            Masuk
          </Button>
        </form>
      </div>
    </div>
  );
}
