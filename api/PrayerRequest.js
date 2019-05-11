export function getAllPrayersRequests() {
  const url = 'https://blessme-serveur.herokuapp.com/api/v1/prayers_requests'
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}
