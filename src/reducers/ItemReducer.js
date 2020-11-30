// const initialState = {
//     link: null,
//     notes: null
//   };

//   const updateItem = (item, key, data, id) => {
//     const updatedItem = Object.assign({}, item, { [key]: data }, id);
//     return updatedItem;
//   };

//   export default function UserReducer(state = initialState, action) {
//     switch (action.type) {
//     case "SET_USER_ID":
//       return Object.assign({}, state, { user_id: action.user_id });

//     case 'SET_USER_INDEX':
//       return Object.assign({}, state, { userIndex: action.payload });

//     case 'SET_USER_PROFILE_DATA':{
//       const userProfileData = updateItem(state.userProfileData, action.key, action.data);
//       return Object.assign({}, state, { userProfileData });
//     }
//     default:
//       return state;
//     }
//   }
