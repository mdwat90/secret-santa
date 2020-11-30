import * as type from './types';

export const login = (payload) => ({
  type: type.SET_USER_INFO,
  payload,
});

export const logOut = () => ({
  type: type.LOGOUT_USER,
  payload: 'logout',
});

export const loginError = (error) => ({
  type: type.LOGIN_ERROR,
  payload: error,
});

export const connectionError = (error) => ({
  type: type.CONNECTION_ERROR,
  payload: error,
});

export const userExistsError = () => ({
  type: type.USER_EXISTS_ERROR,
  payload: 'error',
});
