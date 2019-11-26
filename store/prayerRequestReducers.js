import {
  FETCH_PRAYERS_REQUESTS_BEGIN,
  FETCH_PRAYERS_REQUESTS_SUCCESS,
  FETCH_PRAYERS_REQUESTS_FAILURE
} from './prayerRequestActions';

const initialState = {
  items: [],
  loading: false,
  error: null
};

export default function prayerRequestReducer(state = initialState, action) {
  switch(action.type) {
    case FETCH_PRAYERS_REQUESTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_PRAYERS_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload.prayerRequests
      };

    case FETCH_PRAYERS_REQUESTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: []
      };

    default:
      // ALWAYS have a default case in a reducer
      return state;
  }
}
