import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchCategories(params = {}) {
  return api.get('/admin/categories', { params }).then((res) => res.data);
}

export function fetchCategory(id) {
  return api.get(`/admin/categories/${id}`).then((res) => res.data);
}

export function createCategory(payload) {
  return api.post('/admin/categories', buildFormData(payload)).then((res) => res.data);
}

export function updateCategory(id, payload) {
  return api
    .post(`/admin/categories/${id}`, buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}

export function deleteCategory(id) {
  return api.delete(`/admin/categories/${id}`).then((res) => res.data);
}
