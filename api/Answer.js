import { getApiUrl } from './GetApiUrl';

export function createAnswer(params) {
  const prayerId = params['prayerId'];
  const body = params['body'];
  const userId = params['userId'];
  const navigation = params['navigation'];

  return fetch(`${getApiUrl()}/prayers/${prayerId}/answers`, {
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
