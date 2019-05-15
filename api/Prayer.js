export function createPrayer(params) {
  const prayerId = params['prayerId']
  return fetch(`https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/${prayerId}/comments`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: params['currentUserEmail'],
                  body: params['body'],
                  prayer_request_id: prayerId
                })
              })
}
