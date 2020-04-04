import { getApiUrl } from './GetApiUrl';

export function createUser(params) {
  return fetch(`${getApiUrl()}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params['email'],
      username: params['username'],
      token: params['token'],
    }),
  });
}

export function updateUser(params) {
  let avatarParams = params['avatar'] || undefined;
  let usernameParams = params['username'] || undefined;
  let biographyParams = params['biography'] || undefined;
  return fetch(`${getApiUrl()}/users//${params['email']}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      avatar: avatarParams,
      username: usernameParams,
      biography: biographyParams,
    }),
  }).then(response => response)
    .then(json => {
      params['navigation'].navigate('Profile');
    });
}

export function getUsers(token) {
  const url = `${getApiUrl()}/users/${token}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}
