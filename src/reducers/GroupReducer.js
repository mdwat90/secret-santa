import * as type from "../actions/types";

const initialState = {
    groupExistsErr: null,
    joinGroupErr: null
  };
  

  export default (state = initialState, action) => {
    switch (action.type) {
    case type.CREATE_GROUP_SUCCESS: {
      return Object.assign({}, state, { groupExistsErr: null });
    }
    case type.JOIN_GROUP_SUCCESS: {
      return Object.assign({}, state, { joinGroupErr: null });
    }
    case type.GROUP_EXISTS_ERROR: {
      return Object.assign({}, state, { groupExistsErr: true });
    }
    case type.JOIN_GROUP_ERROR: {
      return Object.assign({}, state, { joinGroupErr: action.payload });
    }
    
    default:{
      return state;
    }
  }
}
  