import { getApiUrl } from '../../api/GetApiUrl';

export const ALL_PRAYERS_REQUESTS_AVAILABLE = 'ALL_PRAYERS_REQUESTS_AVAILABLE';
export const USER_PRAYERS_REQUESTS_AVAILABLE = 'USER_PRAYERS_REQUESTS_AVAILABLE';
//Import the sample data

export function getAllPrayersRequests(keyword = null){
    const search = keyword ? `/?keyword=${keyword}` : ''
    return (dispatch) => {
      const url = `${getApiUrl()}/prayers_requests/${search}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => dispatch({type: ALL_PRAYERS_REQUESTS_AVAILABLE, data: data }) )
        .catch((error) => console.error(error));
    };
}

export function getUserPrayersRequests(email){
    return (dispatch) => {
      const url = `${getApiUrl()}/user_prayers_requests/${email}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => dispatch({type: USER_PRAYERS_REQUESTS_AVAILABLE, userData: data }) )
        .catch((error) => console.error(error));
    };
}
