import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConfirmProvider } from './contexts/ConfirmContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ToastContainer from './components/common/ToastContainer';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import ServicesListPage from './pages/public/ServicesListPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import PortfoliosListPage from './pages/public/PortfoliosListPage';
import PortfolioDetailPage from './pages/public/PortfolioDetailPage';
import ArticlesListPage from './pages/public/ArticlesListPage';
import ArticleDetailPage from './pages/public/ArticleDetailPage';
import ContactPage from './pages/public/ContactPage';
import ServiceRequestPage from './pages/public/ServiceRequestPage';
import NotFoundPage from './pages/public/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import ServicesPage from './pages/admin/ServicesPage';
import ServiceFormPage from './pages/admin/ServiceFormPage';
import PortfoliosPage from './pages/admin/PortfoliosPage';
import PortfolioFormPage from './pages/admin/PortfolioFormPage';
import ArticlesPage from './pages/admin/ArticlesPage';
import ArticleFormPage from './pages/admin/ArticleFormPage';
import TestimonialsPage from './pages/admin/TestimonialsPage';
import FaqsPage from './pages/admin/FaqsPage';
import TeamsPage from './pages/admin/TeamsPage';
import ContactsPage from './pages/admin/ContactsPage';
import ServiceRequestsPage from './pages/admin/ServiceRequestsPage';
import PagesPage from './pages/admin/PagesPage';
import SettingsPage from './pages/admin/SettingsPage';
import MediaPage from './pages/admin/MediaPage';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <ConfirmProvider>
            <SettingsProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<PublicLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="tentang-kami" element={<AboutPage />} />
                    <Route path="layanan" element={<ServicesListPage />} />
                    <Route path="layanan/:slug" element={<ServiceDetailPage />} />
                    <Route path="portofolio" element={<PortfoliosListPage />} />
                    <Route path="portofolio/:slug" element={<PortfolioDetailPage />} />
                    <Route path="artikel" element={<ArticlesListPage />} />
                    <Route path="artikel/:slug" element={<ArticleDetailPage />} />
                    <Route path="kontak" element={<ContactPage />} />
                    <Route path="konsultasi" element={<ServiceRequestPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>

                  <Route path="/admin/login" element={<LoginPage />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="dashboard" replace />} />
                      <Route path="dashboard" element={<DashboardPage />} />

                      <Route path="categories" element={<CategoriesPage />} />

                      <Route path="services" element={<ServicesPage />} />
                      <Route path="services/create" element={<ServiceFormPage />} />
                      <Route path="services/:id/edit" element={<ServiceFormPage />} />

                      <Route path="portfolios" element={<PortfoliosPage />} />
                      <Route path="portfolios/create" element={<PortfolioFormPage />} />
                      <Route path="portfolios/:id/edit" element={<PortfolioFormPage />} />

                      <Route path="articles" element={<ArticlesPage />} />
                      <Route path="articles/create" element={<ArticleFormPage />} />
                      <Route path="articles/:id/edit" element={<ArticleFormPage />} />

                      <Route path="testimonials" element={<TestimonialsPage />} />
                      <Route path="faqs" element={<FaqsPage />} />
                      <Route path="teams" element={<TeamsPage />} />
                      <Route path="contacts" element={<ContactsPage />} />
                      <Route path="service-requests" element={<ServiceRequestsPage />} />
                      <Route path="pages" element={<PagesPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="media" element={<MediaPage />} />
                    </Route>
                  </Route>
                </Routes>
              </BrowserRouter>
              <ToastContainer />
            </SettingsProvider>
          </ConfirmProvider>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
