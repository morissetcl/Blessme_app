import { combineReducers } from 'redux';

import { ALL_PRAYERS_REQUESTS_AVAILABLE, USER_PRAYERS_REQUESTS_AVAILABLE } from "../actions/index" //Import the actions types constant we defined in our actions

let dataState = { data: [], loading:true, userData: [] };

const dataReducer = (state = dataState, action) => {
    switch (action.type) {
        case ALL_PRAYERS_REQUESTS_AVAILABLE:
          state = Object.assign({}, state, { data: action.data, loading: false });
          return state;
        case USER_PRAYERS_REQUESTS_AVAILABLE:
          state = Object.assign({}, state, { userData: action.userData, loading: false });
          return state;
        default:
          return state;
    }
};

const rootReducer = combineReducers({
  dataReducer
})

export default rootReducer;
