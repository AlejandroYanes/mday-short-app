import { useEffect } from 'react';
import mondaySdk from 'monday-sdk-js';
import { create } from 'zustand'

import { authAPI } from '../api/auth';
import { AUTH_CHECK_STATUS } from '../utils/constants';

const monday = mondaySdk();

const useAuthStore = create((set) => ({
  status: AUTH_CHECK_STATUS.UNKNOWN,
  user: null,
  workspace: null,
  sessionToken: null,
  updateStatus: (status) => set((prev) => ({ ...prev, status })),
  initialize: (state) => set((prev) => ({ ...prev, ...state })),
}));

const useAuth = () => useAuthStore((state) => ({
  status: state.status,
  user: state.user,
  workspace: state.workspace,
}));

const resolveSessionToken = () => useAuthStore.getState().sessionToken;

const AuthProvider = ({ children }) => {
  const { initialize, updateStatus } = useAuthStore((state) => state);

  const handleInitialisation = async () => {
    try {
      const mondayContext = await monday.get('context');
      const { workspaceId, user } = mondayContext.data;

      const response = await authAPI.check({ workspace: Number(workspaceId), user: Number(user.id) });

      if (response.ok) {
        const { status, sessionToken } = await response.json();

        console.log('status', status);

        if (status === 'found') {
          initialize({
            status: AUTH_CHECK_STATUS.AUTHENTICATED,
            user,
            workspace: workspaceId,
            sessionToken,
          });
        } else {
          initialize({ status: AUTH_CHECK_STATUS.NEEDS_SETUP, user, workspace: workspaceId });
        }
      } else {
        updateStatus(AUTH_CHECK_STATUS.FAILED);
      }
    } catch (e) {
      console.error(e);
      updateStatus(AUTH_CHECK_STATUS.FAILED);
    }
  }

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    // monday.execute("valueCreatedForUser");
    handleInitialisation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export { AuthProvider, useAuth, resolveSessionToken };
