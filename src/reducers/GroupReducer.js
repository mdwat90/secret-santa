import * as type from "../actions/types";

const initialState = {
    groupExistsErr: null,
    joinGroupErr: null
  };
  

  export default (state = initialState, action) => {
    switch (action.type) {
    case type.CREATE_GROUP_SUCCESS: {
      console.log('GROUP REDUCER ACTION:', action);
      return Object.assign({}, state, { groupExistsErr: null });
    }
    case type.JOIN_GROUP_SUCCESS: {
      console.log('GROUP REDUCER ACTION:', action);
      return Object.assign({}, state, { joinGroupErr: null });
    }
    case type.GROUP_EXISTS_ERROR: {
      console.log('GROUP REDUCER ACTION:', action);
      return Object.assign({}, state, { groupExistsErr: true });
    }
    
    case type.JOIN_GROUP_ERROR: {
      console.log('GROUP REDUCER ACTION:', action);
      return Object.assign({}, state, { joinGroupErr: action.payload });
    }
    
    default:{
      return state;
    }
  }
}
  