export function fetchPrayersRequests() {
  return dispatch => {
    dispatch(fetchPrayersRequestsBegin());
    return fetch("https://blessme-serveur.herokuapp.com/api/v1/prayers_requests")
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchPrayersRequestsSuccess(json.prayers_requests));
        return json.prayers_requests;
      })
      .catch(error => dispatch(fetchPrayersRequestsFailure(error)));
  };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const FETCH_PRAYERS_REQUESTS_BEGIN   = 'FETCH_PRAYERS_REQUESTS_BEGIN';
export const FETCH_PRAYERS_REQUESTS_SUCCESS = 'FETCH_PRAYERS_REQUESTS_SUCCESS';
export const FETCH_PRAYERS_REQUESTS_FAILURE = 'FETCH_PRAYERS_REQUESTS_FAILURE';

export const fetchPrayersRequestsBegin = () => ({
  type: FETCH_PRAYERS_REQUESTS_BEGIN
});

export const fetchPrayersRequestsSuccess = products => ({
  type: FETCH_PRAYERS_REQUESTS_SUCCESS,
  payload: { prayersRequests }
});

export const fetchPrayersRequestsFailure = error => ({
  type: FETCH_PRAYERS_REQUESTS_FAILURE,
  payload: { error }
});
