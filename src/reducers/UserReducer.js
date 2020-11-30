import * as type from '../actions/types';

const initialState = {
  user_info: null,
  loggedIn: false,
  passwordResetStatus: false,
  loginErr: null,
  connectionErr: null,
  userExistsErr: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case type.SET_USER_INFO: {
      // console.log('LOGIN INFO', action.payload)
      return Object.assign({}, state, {
        user_info: action.payload,
        loggedIn: true,
        loginErr: null,
        connectionErr: null,
        userExistsErr: null,
      });
    }

    case type.SET_PASSWORD_RESET: {
      // console.log('LOGIN INFO', action.payload)
      return Object.assign({}, state, {
        passwordResetStatus: action.payload,
      });
    }

    case type.LOGOUT_USER: {
      return Object.assign({}, state, {
        user_info: null,
        loggedIn: false,
        loginErr: null,
        connectionErr: null,
        userExistsErr: null,
      });
    }

    case type.LOGIN_ERROR: {
      return Object.assign({}, state, { loginErr: action.payload });
    }

    case type.CONNECTION_ERROR: {
      return Object.assign({}, state, { connectionErr: action.payload });
    }

    case type.USER_EXISTS_ERROR: {
      return Object.assign({}, state, { userExistsErr: action.payload });
    }

    default: {
      return state;
    }
  }
};
