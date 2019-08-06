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

export function updateUser(email, avatar) {
  return fetch(`${getApiUrl()}/users//${email}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar: avatar,
    }),
  });
}

export function getUsers(email) {
  const url = `${getApiUrl()}/users/${email}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
