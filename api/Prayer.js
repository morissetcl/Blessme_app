export function createPrayer(params) {
  const prayerId = 3
  return fetch(`https://blessme-serveur.herokuapp.com/api/v1/prayers_requests/${3}/comments`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  user_id: params['userId'],
                  body: params['b']
                })
              })
}
