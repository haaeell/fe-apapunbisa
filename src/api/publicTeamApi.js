import api from './axios';

export function fetchPublicTeams() {
  return api.get('/teams').then((res) => res.data);
}
