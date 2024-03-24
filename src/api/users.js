import { API_URL } from '../utils/constants';
import { handle401 } from '../utils/auth';
import { resolveSessionToken } from '../providers/auth';

export const usersAPI = {
  list: () => fetch(`${API_URL}/users/list`, {
    headers: {
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401).then((res) => res.json()),
  changeStatus: (id, status) => fetch(`${API_URL}/users/change-status/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ status }),
  }).then(handle401),
  changeRole: (id, role) => fetch(`${API_URL}/users/change-role/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ role }),
  }).then(handle401),
  delete: (id) => fetch(`${API_URL}/users/delete/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401),
};
