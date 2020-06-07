/* eslint-disable no-case-declarations */
import { SET_CURRENT_USER } from '../actions/actionTypes'

function userReducer(state = [], action)
{
  switch(action.type) {
    case SET_CURRENT_USER:
      return { ...state, data: action.userToken};

    default:
      return state;
  }
}

export default userReducer
