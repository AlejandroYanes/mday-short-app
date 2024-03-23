import { APP_STATUS } from './constants';
import { updateAuthStatus } from '../providers/auth';

export async function handle401(response) {
  if (response.status === 401) {
    console.log('handling 401 error');
    updateAuthStatus(APP_STATUS.AUTH_FAILED);
    throw new Error('Unauthorized');
  }
  return response;
}
