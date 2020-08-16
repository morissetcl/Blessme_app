import Constants from 'expo-constants';
import { getApiUrl } from './GetApiUrl';

export function getPrayerRequests(keyword = '') {
  const url = `${getApiUrl()}/prayers_requests?keyword=${keyword}`;
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
  const category = params['category'] ? params['category'] : 'Autres';
  return fetch(`${getApiUrl()}/prayers_requests`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: params['currentUserToken'],
              title: params['title'],
              body: params['body'],
              category: category,
            }),
          })
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
      navigation.navigate('Connexion');
    });
}

export function editPrayerRequest(params) {

  const prayerRequestId = params['prayerRequestId'];
  const navigation = params['navigation'];
  const category = params['category'] ? params['category'] : 'Autres';
  return fetch(`${getApiUrl()}/prayers_requests/${prayerRequestId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: params['currentUserToken'],
      title: params['title'],
      body: params['body'],
      prayer_request_id: prayerRequestId,
      category: category,
    }),
  }).then(response => response.json())
    .then(prayerRequest => {
      navigation.navigate("PrayerRequest", { editedPr: true, prayerRequest: prayerRequest });
    });
}
