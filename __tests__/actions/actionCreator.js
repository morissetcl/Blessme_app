import * as actions from '../../store/actions/actionCreators'
import * as types from '../../store/actions/actionTypes'

describe('actions', () => {
  const id = 'id'
  const title = 'my title'
  const body = 'my body'
  const category = 'family'
  const color = '#FFFFF'
  const prayerRequest = {}
  const prayersRequests = {}
  const typeOfPrayer = 'audio'
  const increment = true
  const userToken = '12345'

  it('DELETE_PRAYER_REQUEST', () => {
    const expectedAction = {
      type: types.DELETE_PRAYER_REQUEST,
      id
    }
    expect(actions.deletePrayerRequest(id)).toEqual(expectedAction)
  });

  it('ALL_PRAYERS_REQUESTS_AVAILABLE', () => {
    const expectedAction = {
      type: types.ALL_PRAYERS_REQUESTS_AVAILABLE,
      prayersRequests
    }
    expect(actions.loadPrayersRequests(prayersRequests)).toEqual(expectedAction)
  });

  it('EDIT_PRAYER_REQUEST', () => {
    const expectedAction = {
      type: types.EDIT_PRAYER_REQUEST,
      id,
      title,
      body,
      category,
      color
    }
    expect(actions.updatePrayerRequest(id, title, body, category, color)).toEqual(expectedAction)
  });

  it('UPDATE_COUNTER', () => {
    const expectedAction = {
      type: types.UPDATE_COUNTER,
      id,
      typeOfPrayer,
      increment
    }
    expect(actions.updateCounter(id, typeOfPrayer, increment)).toEqual(expectedAction)
  });

  it('ADD_PRAYER_REQUEST', () => {
    const expectedAction = {
      type: types.ADD_PRAYER_REQUEST,
      prayerRequest
    }
    expect(actions.newPrayerRequest(prayerRequest)).toEqual(expectedAction)
  });

  it('SET_CURRENT_USER', () => {
    const expectedAction = {
      type: types.SET_CURRENT_USER,
      userToken
    }
    expect(actions.setCurrentUser(userToken)).toEqual(expectedAction)
  });
})
