export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const API_URL = `${BASE_URL}/api/mndy`;

export const DEFAULT_WORKSPACE = (
  window.origin.startsWith('http://localhost') && process.env.REACT_APP_DEFAULT_WORKSPACE
    ? Number(process.env.REACT_APP_DEFAULT_WORKSPACE)
    : null
);
export const DEFAULT_NAME = (
  window.origin.startsWith('http://localhost') && process.env.REACT_APP_DEFAULT_NAME
    ? process.env.REACT_APP_DEFAULT_NAME
    : null
);
export const DEFAULT_EMAIL = (
  window.origin.startsWith('http://localhost') && process.env.REACT_APP_DEFAULT_EMAIL
    ? process.env.REACT_APP_DEFAULT_EMAIL
    : null
);

export const APP_STATUS = {
  AUTHENTICATED: 'AUTHENTICATED',
  NEEDS_SETUP: 'NEEDS_SETUP',
  PENDING: 'PENDING',
  INVITED: 'INVITED',
  INACTIVE: 'INACTIVE',
  UNKNOWN: 'UNKNOWN',
  AUTH_FAILED: 'FAILED',
}

export const KEBAB_CASE_REGEX = /^[a-z]+(-[a-z]+)*$/;
