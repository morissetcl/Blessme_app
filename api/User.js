import { getApiUrl } from './GetApiUrl';

export function createUser(params) {
  return fetch(`${getApiUrl()}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params['currentUserEmail'],
      username: params['username'],
    }),
  });
}

export function updateUser(params) {
  var avatarParams = params['avatarUrl'] || undefined
  var usernameParams = params['username']  || undefined
  var biographyParams = params['biography']  || undefined
  return fetch(`${getApiUrl()}/users//${params['email']}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar: avatarParams,
      username: usernameParams,
      biography: biographyParams
    }),
  }).then(response => response)
    .then(json => {
      params['navigation'].navigate('Profile');
    });
}

export function getUsers(email) {
  const url = `${getApiUrl()}/users/${email}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
