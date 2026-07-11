import api from './axios';

export function fetchPublicPortfolios(params = {}) {
  return api.get('/portfolios', { params }).then((res) => res.data);
}

export function fetchPublicPortfolioBySlug(slug) {
  return api.get(`/portfolios/${slug}`).then((res) => res.data);
}
