export function createUser(params) {
  return fetch("https://blessme-serveur.herokuapp.com/api/v1/users", {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: params['currentUserEmail'],
                  username: params['username']
                })
              })
}
