/* eslint-disable no-case-declarations */
import { DELETE_PRAYER_REQUEST, ALL_PRAYERS_REQUESTS_AVAILABLE } from '../actions/actionTypes'

function prayerRequestReducer(state = [], action)
{
  switch(action.type) {
    case ALL_PRAYERS_REQUESTS_AVAILABLE:
      return { ...state, data: action.prayers_requests, loading: false };

    case DELETE_PRAYER_REQUEST:
      return { data: state.data.filter(pr => pr.id !== action.id
)}

    default:
      return state;
  }
}

export default prayerRequestReducer
