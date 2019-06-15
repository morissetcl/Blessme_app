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


export function getUsers(email) {
  const url = `https://blessme-serveur.herokuapp.com/api/v1/users/${email}`
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}
