const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong. Please try again.');
  }

  return data;
}

export function getJobs(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return request(`/jobs${query ? `?${query}` : ''}`);
}

export function getJob(id) {
  return request(`/jobs/${id}`);
}

export function createJob(payload) {
  return request('/jobs', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateJob(id, payload) {
  return request(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteJob(id) {
  return request(`/jobs/${id}`, {
    method: 'DELETE'
  });
}
