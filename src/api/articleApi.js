import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchArticles(params = {}) {
  return api.get('/admin/articles', { params }).then((res) => res.data);
}

export function fetchArticle(id) {
  return api.get(`/admin/articles/${id}`).then((res) => res.data);
}

export function createArticle(payload) {
  return api.post('/admin/articles', buildFormData(payload)).then((res) => res.data);
}

export function updateArticle(id, payload) {
  return api
    .post(`/admin/articles/${id}`, buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}

export function deleteArticle(id) {
  return api.delete(`/admin/articles/${id}`).then((res) => res.data);
}
