export function getAllPrayersRequests() {
  const url = 'https://blessme-serveur.herokuapp.com/api/v1/prayers_requests'
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
