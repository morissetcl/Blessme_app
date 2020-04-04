import { combineReducers } from 'redux';

import { ALL_PRAYERS_REQUESTS_AVAILABLE, USER_PRAYERS_REQUESTS_AVAILABLE } from "../../actions/PrayerRequest/index";

let dataState = { data: [], loading: true, userData: [] };

const dataReducer = (state = dataState, action) => {
  switch (action.type) {
    case ALL_PRAYERS_REQUESTS_AVAILABLE:
      return { ...state, data: action.data, loading: false };
    case USER_PRAYERS_REQUESTS_AVAILABLE:
      return { ...state, userData: action.userData, loading: false };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  dataReducer,
});

export default rootReducer;
