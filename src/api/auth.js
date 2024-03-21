import { BASE_URL } from '../utils/constants';

export const authAPI = {
  check: ({ workspace, user }) => (
    fetch(`${BASE_URL}/api/mday/auth/check?workspace=${workspace}&user=${user}`)
  ),
  setup: ({ user, workspace, wslug }) => (
    fetch(`${BASE_URL}/api/mday/auth/setup?workspace=${workspace}&user=${user}`)
  ),
};
