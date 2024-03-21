import { createContext, useContext, useEffect, useState } from 'react';
import mondaySdk from 'monday-sdk-js';

import { authAPI } from '../api/auth';
import { AUTH_CHECK_STATUS } from '../utils/constants';

const monday = mondaySdk();

const AuthContext = createContext({ status: AUTH_CHECK_STATUS.UNKNOWN });

const AuthProvider = ({ children }) => {
  const [authContext, setAuthContext] = useState({ status: AUTH_CHECK_STATUS.UNKNOWN });

  const handleInitialisation = async () => {
    try {
      const mondayContext = await monday.get('context');
      const { workspaceId, user } = mondayContext.data;

      const response = await authAPI.check({ workspace: workspaceId, user: user.id });

      if (response.ok) {
        const { status } = await response.json();

        if (status === 'found') {
          setAuthContext({ status: AUTH_CHECK_STATUS.AUTHENTICATED, user, workspace: workspaceId });
        } else {
          setAuthContext({ status: AUTH_CHECK_STATUS.NEEDS_SETUP });
        }
      } else {
        setAuthContext({ status: AUTH_CHECK_STATUS.FAILED });
      }
    } catch (e) {
      console.error(e);
      setAuthContext({ status: AUTH_CHECK_STATUS.FAILED });
    }
  }

  useEffect(() => {
    // Notice this method notifies the monday platform that user gains a first value in an app.
    // Read more about it here: https://developer.monday.com/apps/docs/mondayexecute#value-created-for-user/
    // monday.execute("valueCreatedForUser");
    handleInitialisation();
  }, []);

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
