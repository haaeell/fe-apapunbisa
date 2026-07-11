import api from './axios';

export function fetchArticleCategories() {
  return api.get('/admin/article-categories').then((res) => res.data);
}

export function createArticleCategory(name) {
  return api.post('/admin/article-categories', { name }).then((res) => res.data);
}
