import { API_URL } from '../utils/constants';

export const authAPI = {
  check: ({ workspace, user, name }) => (
    fetch(`${API_URL}/auth/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspace, user, name }),
    })
  ),
  setup: ({ user, workspace }) => (
    fetch(`${API_URL}/auth/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, workspace }),
    })
  ),
};
