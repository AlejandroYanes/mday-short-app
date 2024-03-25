import { API_URL } from '../utils/constants';

export const authAPI = {
  check: ({ workspace, name, email, token }) => (
    fetch(`${API_URL}/auth/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspace, name, email, token }),
    })
  ),

  setup: ({ user, workspace, token }) => (
    fetch(`${API_URL}/auth/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user, workspace, token }),
    })
  ),
};
