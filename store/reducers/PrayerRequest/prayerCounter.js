// not used yet //
import { combineReducers } from 'redux';

import { PRAYER_COUNTER } from "../../actions/PrayerRequest/prayerCounter"

let dataState = { numberOfWritingPrayer: [], numberOfAudioPrayer: [], loading: true };

const dataReducer = (state = dataState, action) => {
    switch (action.type) {
        case PRAYER_COUNTER:
          return { ...state, numberOfWritingPrayer: action.numberOfWritingPrayer, numberOfAudioPrayer: action.numberOfAudioPrayer, loading: false }
        default:
          return state;
    }
};

const rootReducer = combineReducers({
  dataReducer
})

export default rootReducer;
