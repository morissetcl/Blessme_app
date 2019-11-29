import Constants from 'expo-constants';
import { getApiUrl } from './GetApiUrl';

export function getAllPrayersRequests(test) {
  const search = keyword ? `/?keyword=test` : ''
  const url = `${getApiUrl()}/prayers_requests/?keyword=test`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getUserPrayersRequests(email) {
  const url = `${getApiUrl()}/user_prayers_requests/` + email;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function getPrayerRequest(prayerId) {
  const url = `${getApiUrl()}/prayers_requests/` + prayerId;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

export function createPrayerRequestAndRedirect(params) {
  const prayerId = params['prayerId'];
  const navigation = params['navigation'];
  fetch(`${getApiUrl()}/prayers_requests`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params['currentUserEmail'],
      title: params['title'],
      body: params['body'],
    }),
  }).then(response => response.json())
    .then(json => {
      navigation.navigate("Prayer", { prayerId: json.id,
        currentUserEmail: params['currentUserEmail']
      });
    });
}

export function destroyPrayerResquest(params) {
  const prayerRequestId = params['prayerRequestId'];
  const navigation = params['navigation'];
  const url = `${getApiUrl()}/prayers_requests/${prayerRequestId}`;
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prayer_request_id: prayerRequestId,
    }),
  }).then(response => response)
    .then(json => {
      navigation.navigate('Homepage');
    });
}

export function editPrayerRequest(params) {
  const prayerRequestId = params['prayerRequestId'];
  const navigation = params['navigation'];
  return fetch(`${getApiUrl()}/prayers_requests/${prayerRequestId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params['currentUserEmail'],
      title: params['title'],
      body: params['body'],
      prayer_request_id: prayerRequestId
    }),
  }).then(response => response.json())
    .then(json => {
      navigation.navigate('Homepage');
    });
}
