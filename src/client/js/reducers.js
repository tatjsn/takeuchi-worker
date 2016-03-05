import { combineReducers } from 'redux';
import { CHILD_ADDED } from './actions';

const dataList = (state = [], { type, payload }) => {
  switch (type) {
    case CHILD_ADDED:
      return [payload, ...state]
    default:
      return state;
  }
}

export default combineReducers({
  dataList
});
