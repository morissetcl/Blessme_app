import { combineReducers } from 'redux';

import { PRAYER_COUNTER } from "../../actions/PrayerRequest/prayerCounter";

let dataState = { writingsCount: [], audiosCount: [], loading: true };

const dataReducer = (state = dataState, action) => {
  switch (action.type) {
    case PRAYER_COUNTER:
      return { ...state, writingsCount: action.writingsCount, audiosCount: action.audiosCount, loading: false };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  dataReducer,
});

export default rootReducer;
