import api from './axios';

export function fetchPublicCategories() {
  return api.get('/categories').then((res) => res.data);
}
