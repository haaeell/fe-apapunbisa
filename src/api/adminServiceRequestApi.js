import api from './axios';

export function fetchAdminServiceRequests(params = {}) {
  return api.get('/admin/service-requests', { params }).then((res) => res.data);
}

export function fetchAdminServiceRequest(id) {
  return api.get(`/admin/service-requests/${id}`).then((res) => res.data);
}

export function updateAdminServiceRequest(id, payload) {
  return api.put(`/admin/service-requests/${id}`, payload).then((res) => res.data);
}

export async function downloadServiceRequestAttachment(serviceRequestId, attachment) {
  const response = await api.get(
    `/admin/service-requests/${serviceRequestId}/attachments/${attachment.id}/download`,
    { responseType: 'blob' },
  );

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = attachment.original_name || 'lampiran';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function deleteAdminServiceRequest(id) {
  return api.delete(`/admin/service-requests/${id}`).then((res) => res.data);
}
