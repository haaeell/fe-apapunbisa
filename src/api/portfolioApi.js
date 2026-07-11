import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchPortfolios(params = {}) {
  return api.get('/admin/portfolios', { params }).then((res) => res.data);
}

export function fetchPortfolio(id) {
  return api.get(`/admin/portfolios/${id}`).then((res) => res.data);
}

export function createPortfolio(payload) {
  return api.post('/admin/portfolios', buildFormData(payload)).then((res) => res.data);
}

export function updatePortfolio(id, payload) {
  return api
    .post(`/admin/portfolios/${id}`, buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}

export function deletePortfolio(id) {
  return api.delete(`/admin/portfolios/${id}`).then((res) => res.data);
}
