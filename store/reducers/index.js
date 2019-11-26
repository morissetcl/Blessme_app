import { combineReducers } from 'redux';

import { ALL_PRAYERS_REQUESTS_AVAILABLE } from "../actions/index" //Import the actions types constant we defined in our actions

let dataState = { data: [], loading:true };

const dataReducer = (state = dataState, action) => {
    console.log(action.type)
    switch (action.type) {
        case ALL_PRAYERS_REQUESTS_AVAILABLE:
          state = Object.assign({}, state, { data: action.data, loading: false });
          return state;
        default:
          return state;
    }
};

const rootReducer = combineReducers({
  dataReducer
})

export default rootReducer;
