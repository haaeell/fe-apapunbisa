import api from './axios';
import { buildFormData } from '../utils/buildFormData';

export function fetchTeams(params = {}) {
  return api.get('/admin/teams', { params }).then((res) => res.data);
}

export function fetchTeam(id) {
  return api.get(`/admin/teams/${id}`).then((res) => res.data);
}

export function createTeam(payload) {
  return api.post('/admin/teams', buildFormData(payload)).then((res) => res.data);
}

export function updateTeam(id, payload) {
  return api
    .post(`/admin/teams/${id}`, buildFormData({ ...payload, _method: 'PUT' }))
    .then((res) => res.data);
}

export function deleteTeam(id) {
  return api.delete(`/admin/teams/${id}`).then((res) => res.data);
}
