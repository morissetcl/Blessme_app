export const ALL_PRAYERS_REQUESTS_AVAILABLE = 'ALL_PRAYERS_REQUESTS_AVAILABLE';
export const USER_PRAYERS_REQUESTS_AVAILABLE = 'USER_PRAYERS_REQUESTS_AVAILABLE';
//Import the sample data

export function getAllPrayersRequests(){
    return (dispatch) => {
      const url = `https://blessme-serveur.herokuapp.com/api/v1/prayers_requests`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => dispatch({type: ALL_PRAYERS_REQUESTS_AVAILABLE, data: data }) )
        .catch((error) => console.error(error));
    };
}

export function getUserPrayersRequests(email){
  console.log('getUserPrayersRequests')
    return (dispatch) => {
      const url = `https://blessme-serveur.herokuapp.com/api/v1/user_prayers_requests/${email}`;
      return fetch(url)
        .then((response) => response.json())
        .then((data) => dispatch({type: USER_PRAYERS_REQUESTS_AVAILABLE, userData: data }) )
        .catch((error) => console.error(error));
    };
}
