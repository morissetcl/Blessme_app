import { DELETE_PRAYER_REQUEST, ALL_PRAYERS_REQUESTS_AVAILABLE, EDIT_PRAYER_REQUEST, EDIT_USER_AVATAR } from './actionTypes'

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

export function editUserAvatar(avatarUrl, userToken) {
  return { type: EDIT_USER_AVATAR, avatarUrl, userToken }
};
