const BASE_URL = 'http://localhost:8080/api';

// ─── Generic request helper ───────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

// ─── Health ───────────────────────────────────────────────────────────────────
export const checkHealth = () => request('/health');

// ─── Items ────────────────────────────────────────────────────────────────────
export const getItems = () => request('/items');

export const createItem = (itemData) =>
  request('/items', { method: 'POST', body: itemData });

// ─── Pickup Requests ──────────────────────────────────────────────────────────
export const getRequests = () => request('/requests');

export const createRequest = (requestData) =>
  request('/requests', { method: 'POST', body: requestData });

export const updateRequestStatus = (id, status) =>
  request(`/requests/${id}/status`, { method: 'PATCH', body: { status } });

export const deleteRequest = (id) =>
  request(`/requests/${id}`, { method: 'DELETE' });
