import * as type from "../actions/types";

const initialState = {
    user_info: null,
    loggedIn: false,
    loginErr: null,
    connectionErr: null,
    userExistsErr: null
  };
  

  export default (state = initialState, action) => {
    switch (action.type) {
    case type.SET_USER_INFO: {
      console.log('USER REDUCER ACTION:', action);
      return Object.assign({}, state, { user_info: action.payload, loggedIn: true, loginErr: null, connectionErr: null });
    }
    
    case type.LOGOUT_USER: {
      console.log('USER REDUCER ACTION:', action);
      return Object.assign({}, state, { user_info: null, loggedIn: false });
    }
  
    case type.LOGIN_ERROR: {
      console.log('USER REDUCER ACTION:', action);
      return Object.assign({}, state, { loginErr: action.payload });
    }
  
    case type.CONNECTION_ERROR: {
      console.log('USER REDUCER ACTION:', action);
      return Object.assign({}, state, { connectionErr: action.payload });
    }
  
    case type.USER_EXISTS_ERROR: {
      console.log('USER REDUCER ACTION:', action);
      return Object.assign({}, state, { userExistsErr: action.payload });
    }
  
    default:{
      return state;
    }
  }
}
  