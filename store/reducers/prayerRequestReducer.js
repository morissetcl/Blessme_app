/* eslint-disable no-case-declarations */
import { DELETE_PRAYER_REQUEST, ALL_PRAYERS_REQUESTS_AVAILABLE, EDIT_PRAYER_REQUEST, ADD_PRAYER_REQUEST, UPDATE_COUNTER } from '../actions/actionTypes'

function prayerRequestReducer(state = [], action)
{
  switch(action.type) {
    case ALL_PRAYERS_REQUESTS_AVAILABLE:
      return { ...state, data: action.prayers_requests, loading: false };

    case DELETE_PRAYER_REQUEST:
      return { data: state.data.filter(pr => pr.id !== action.id )}

    case ADD_PRAYER_REQUEST:
      return {
        ...state,
        data: [...state.data, action.prayerRequest]
      }

    case UPDATE_COUNTER:
      const prayerIndex = state.data.findIndex(pr => pr.id === action.id);
      const prayerRequest = [...state.data];
      const pr = state.data.filter(pr => pr.id === action.id)[0];
      if (action.typeOfPrayer == 'writing') {
        const operation = action.increment ? (pr.writings_count + 1) : (pr.writings_count - 1)
        prayerRequest[prayerIndex] = {...prayerRequest[prayerIndex], writings_count: operation };
      } else {
        const operation = action.increment ? (pr.writings_count + 1) : (pr.audios_count - 1)
        prayerRequest[prayerIndex] = {...prayerRequest[prayerIndex], audios_count: operation };
      }
      return { data: prayerRequest }

    case EDIT_PRAYER_REQUEST:
      const index = state.data.findIndex(pr => pr.id === action.id);
      const prayersRequests = [...state.data];
      prayersRequests[index] = {...prayersRequests[index], body: action.body, title: action.title, category: { label: action.category, color: action.color } };
      return { data: prayersRequests }

    default:
      return state;
  }
}

export default prayerRequestReducer
