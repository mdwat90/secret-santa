import { combineReducers } from 'redux';
import user from './UserReducer';
import item from './ItemReducer';

export default combineReducers({
    item,
    user
});
