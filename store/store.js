import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import prayerRequest from './reducers/PrayerRequest/index'; //Import the reducer
import prayerCounter from './reducers/PrayerRequest/prayerCounter'; //Import the reducer

const reducer = combineReducers({
    prayerRequest: prayerRequest,
    prayerCounter: prayerCounter
})

// Connect our store to the reducers
export default createStore(reducer, applyMiddleware(thunk));
