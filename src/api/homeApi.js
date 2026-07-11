import api from './axios';

export function fetchHome() {
  return api.get('/home').then((res) => res.data);
}
