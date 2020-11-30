import { combineReducers } from 'redux';
import user from './UserReducer';
import item from './ItemReducer';
import group from './GroupReducer';

export default combineReducers({
  item,
  user,
  group,
});
