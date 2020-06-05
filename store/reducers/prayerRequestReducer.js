/* eslint-disable no-case-declarations */
import { DELETE_PRAYER_REQUEST, ALL_PRAYERS_REQUESTS_AVAILABLE, EDIT_PRAYER_REQUEST } from '../actions/actionTypes'

function prayerRequestReducer(state = [], action)
{
  switch(action.type) {
    case ALL_PRAYERS_REQUESTS_AVAILABLE:
      return { ...state, data: action.prayers_requests, loading: false };

    case DELETE_PRAYER_REQUEST:
      return { data: state.data.filter(pr => pr.id !== action.id )}

    case EDIT_PRAYER_REQUEST:
      const index = state.data.findIndex(pr => pr.id === action.id);
      const prayersRequests = [...state.data];
      prayersRequests[index] = {...prayersRequests[index], body: action.body, title: action.title };  
      return { data: prayersRequests }

    default:
      return state;
  }
}

export default prayerRequestReducer
