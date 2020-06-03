import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import prayerRequestReducer  from './reducers/prayerRequestReducer'; //Import the reducer

const reducer = combineReducers({
  prayerRequestReducer: prayerRequestReducer
});

export default function configureStore() {
  return createStore(
    reducer,
    applyMiddleware(thunk)
  )
}
