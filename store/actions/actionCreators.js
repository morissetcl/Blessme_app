import { DELETE_PRAYER_REQUEST, ALL_PRAYERS_REQUESTS_AVAILABLE, EDIT_PRAYER_REQUEST, ADD_PRAYER_REQUEST, SET_CURRENT_USER } from './actionTypes'

export function deletePrayerRequest(id) {
  return { type: DELETE_PRAYER_REQUEST, id }
};

export function loadPrayersRequests(prayers_requests) {
  return { type: ALL_PRAYERS_REQUESTS_AVAILABLE, prayers_requests }
};

export function getUserPrayersRequests(prayers_requests) {
  return { type: ALL_PRAYERS_REQUESTS_AVAILABLE, prayers_requests }
};

export function updatePrayerRequest(id, title, body, category, color) {
  return { type: EDIT_PRAYER_REQUEST, id, title, body, category, color }
};

export function newPrayerRequest(prayerRequest) {
  return { type: ADD_PRAYER_REQUEST, prayerRequest }
};

export function setCurrentUser(userToken) {
  return { type: SET_CURRENT_USER, userToken }
};
