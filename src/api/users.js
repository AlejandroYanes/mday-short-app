import { API_URL } from '../utils/constants';
import { handle401 } from '../utils/auth';
import { resolveSessionToken } from '../providers/auth';

export const usersAPI = {
  list: () => fetch(`${API_URL}/users/list`, {
    headers: {
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
  }).then(handle401).then((res) => res.json()),

  invite: ({ name, email, role }) => fetch(`${API_URL}/users/invite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ name, email, role }),
  }).then(handle401),

  join: ({ email, workspace }) => fetch(`${API_URL}/users/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ email, workspace }),
  }).then(handle401),

  changeStatus: (id, status) => fetch(`${API_URL}/users/change-status/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resolveSessionToken()}`,
    },
    body: JSON.stringify({ status }),
  }).then(handle401),

  changeRole: (id, role) => fetch(`${API_URL}/users/change-role/${id}`, {
    method: 'PATCH',
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
