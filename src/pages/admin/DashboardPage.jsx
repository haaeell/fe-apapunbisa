import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchDashboard } from '../../api/dashboardApi';
import { useAuth } from '../../hooks/useAuth';
import StatTile from '../../components/admin/StatTile';
import Card from '../../components/common/Card';
import SectionTitle from '../../components/common/SectionTitle';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';

function formatDateLabel(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetchDashboard()
      .then(({ data }) => {
        if (isMounted) setDashboard(data);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingSkeleton rows={8} />;
  }

  if (!dashboard) {
    return <EmptyState title="Data dashboard tidak tersedia" />;
  }

  const chartData = dashboard.charts.contacts.map((item, index) => ({
    date: formatDateLabel(item.date),
    'Pesan Masuk': item.total,
    'Permintaan Layanan': dashboard.charts.service_requests[index]?.total ?? 0,
  }));

  return (
    <>
      <Helmet>
        <title>Dashboard Admin — Apapun Bisa</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-dark">Selamat datang, {user?.name}</h1>
        <p className="text-sm text-muted">Ringkasan aktivitas website Apapun Bisa.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatTile label="Layanan" value={dashboard.totals.services} />
        <StatTile label="Kategori" value={dashboard.totals.categories} />
        <StatTile label="Portofolio" value={dashboard.totals.portfolios} />
        <StatTile label="Artikel" value={dashboard.totals.articles} />
        <StatTile label="Testimoni" value={dashboard.totals.testimonials} />
        <StatTile
          label="Pesan Masuk"
          value={dashboard.totals.contacts}
          hint={`${dashboard.totals.unread_contacts} belum dibaca`}
        />
        <StatTile
          label="Permintaan Layanan"
          value={dashboard.totals.service_requests}
          hint={`${dashboard.totals.new_service_requests} baru`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle title="Pesan & Permintaan Layanan (14 Hari Terakhir)" />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Line type="monotone" dataKey="Pesan Masuk" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Permintaan Layanan" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle title="Layanan Paling Diminati" description="Berdasarkan jumlah permintaan layanan" />
          {dashboard.top_services.length === 0 ? (
            <EmptyState title="Belum ada data" />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboard.top_services}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tick={{ fontSize: 12, fill: '#0f172a' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#e2e8f0', fontSize: 13 }} />
                  <Bar dataKey="requests_count" name="Permintaan" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle title="Pesan Terbaru" />
          {dashboard.recent_contacts.length === 0 ? (
            <EmptyState title="Belum ada pesan masuk" />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {dashboard.recent_contacts.map((contact) => (
                <li key={contact.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-dark">{contact.name}</p>
                    <p className="truncate text-xs text-muted">{contact.subject || contact.email}</p>
                  </div>
                  {!contact.is_read && <StatusBadge status="new" />}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <SectionTitle title="Permintaan Layanan Terbaru" />
          {dashboard.recent_service_requests.length === 0 ? (
            <EmptyState title="Belum ada permintaan layanan" />
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {dashboard.recent_service_requests.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-dark">{item.title}</p>
                    <p className="truncate text-xs text-muted">{item.name} — {item.service?.name || 'Umum'}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
