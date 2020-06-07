import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import prayerRequestReducer  from './reducers/prayerRequestReducer'; //Import the reducer
import userReducer  from './reducers/userReducer'; //Import the reducer

const reducer = combineReducers({
  prayerRequestReducer: prayerRequestReducer,
  userReducer: userReducer
});

export default function configureStore() {
  return createStore(
    reducer,
    applyMiddleware(thunk)
  )
}
