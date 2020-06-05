import { DELETE_PRAYER_REQUEST, ALL_PRAYERS_REQUESTS_AVAILABLE, EDIT_PRAYER_REQUEST } from './actionTypes'

export function deletePrayerRequest(id) {
  return { type: DELETE_PRAYER_REQUEST, id }
};

export function loadPrayersRequests(prayers_requests) {
  return { type: ALL_PRAYERS_REQUESTS_AVAILABLE, prayers_requests }
};

export function getUserPrayersRequests(prayers_requests) {
  return { type: ALL_PRAYERS_REQUESTS_AVAILABLE, prayers_requests }
};

export function updatePrayerRequest(id, title, body) {
  return { type: EDIT_PRAYER_REQUEST, id, title, body }
};
