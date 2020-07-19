import { getApiUrl } from './GetApiUrl';

export function createAnswer(params) {
  const prayerRequestId = params['prayerRequestId'];
  const prayerId = params['prayerId'];
  const body = params['body'];
  const userId = params['userId'];
  const navigation = params['navigation'];
  console.log(prayerRequestId)
  console.log(prayerId)
  console.log(body['body'])
  console.log(userId)
  console.log('$$$$$$$$$$$$$$$$$$$$')
  return fetch(`${getApiUrl()}/prayers_requests/${prayerRequestId}/prayers/${prayerId}/answers`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prayer_id: prayerId,
      body: body['body'],
      user_id: userId
    }),
  }).then(response => response.json())
    .then(json => {
      navigation.navigate("PrayerRequest", { editedPr: false });
    });
}
