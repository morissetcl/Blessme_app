export function createPrayer(params) {
  const prayerId = params['prayerId']
  const navigation = params['navigation']
  return fetch(`https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/${prayerId}/comments`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: params['currentUserEmail'],
                  body: params['body'],
                  audio: params['audioUri'],
                  prayer_request_id: prayerId
                })
              }).then(response => response.json())
                .then(json => {
                  navigation.navigate("Prayer", { formFrom: true })
                });
}

export function editPrayer(params) {
  const prayerId = params['prayerId']
  const commentId = params['commentId']
  const navigation = params['navigation']
  return fetch(`https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/${prayerId}/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: params['currentUserEmail'],
                  body: params['body'],
                  prayer_request_id: prayerId,
                  commentId: commentId
                })
              }).then(response => response.json())
                .then(json => {
                  navigation.navigate("Prayer", { formFrom: true })
                });
}

export function getPrayers(prayerId) {
  const url = `https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/${prayerId}/comments`
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}


export function destroyPrayers(params) {
  const prayerId = params['prayerId']
  const commentId = params['commentId']
  const navigation = params['navigation']
  const url = `https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/${prayerId}/comments/${commentId}`
  return fetch(url, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  prayer_id: commentId
                })
              }).then(response => response)
                .catch((error) => console.error(error))

}
