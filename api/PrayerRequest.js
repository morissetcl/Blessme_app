export function getAllPrayersRequests() {
  const url = 'https://blessme-serveur.herokuapp.com/api/v1/prayers_requests'
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

export function getUserPrayersRequests(email) {
  const url = 'https://blessme-serveur.herokuapp.com/api/v1/user_prayers_requests/' + email
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

export function getPrayerRequest(prayerId) {
  const url = 'https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/' + prayerId
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}

export function createPrayerRequestAndRedirect(params) {
  const prayerId = params['prayerId']
  const navigation = params['navigation']
  fetch(`https://blessme-serveur.herokuapp.com/api/v1/prayers_requests`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params['currentUserEmail'],
      title: params['title'],
      body: params['body']
    })
  }).then(response => response.json())
    .then(json => {
      navigation.navigate("Prayer", { prayerId: json.id, currentUserEmail: params['currentUserEmail'], fromForm: params['fromForm'] })
    });
}
