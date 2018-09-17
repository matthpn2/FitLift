import omit from 'lodash/omit';
import firebase from './firebase';

const initialState = {};

export const TypeKeys = {
  ATTEMPT_CREATE_USER: 'ATTEMPT_CREATE_USER',
  CREATE_USER_FAIL: 'CREATE_USER_FAIL',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  ATTEMPT_LOGIN: 'ATTEMPT_LOGIN',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'logout'
};

const attemptCreateUser = () => ({
  type: TypeKeys.ATTEMPT_CREATE_USER
});

const createUserSuccess = user => ({
  type: TypeKeys.CREATE_USER_SUCCESS,
  user
});

const createUserFail = error => ({
  type: TypeKeys.CREATE_USER_FAIL,
  error
});

const attemptLogin = () => ({
  type: TypeKeys.ATTEMPT_LOGIN
});

const loginSuccess = user => ({
  type: TypeKeys.LOGIN_SUCCESS,
  user
});

const loginFail = error => ({
  type: TypeKeys.LOGIN_FAIL,
  error
});

const logout = () => ({
  type: TypeKeys.LOGOUT
});

export const alreadyLoggedIn = user => dispatch => {
  return dispatch(loginSuccess(user));
};

export const logoutUser = () => async dispatch => {
  try {
    await firebase.auth().signOut();
    return dispatch(logout());
  } catch (error) {
    console.log(error);
  }
};

export const createNewUser = (email, password) => async dispatch => {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    return dispatch(createUserSuccess(email));
  } catch (error) {
    return dispatch(createUserFail(error.message));
  }
};

export const loginUser = (email, password) => async dispatch => {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
    return dispatch(loginSuccess(email));
  } catch (error) {
    return dispatch(loginFail(error.message));
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TypeKeys.LOGIN_SUCCESS:
    case TypeKeys.CREATE_USER_SUCCESS:
      return {
        ...state,
        user: action.user
      };
    case 'logout':
      return initialState;
    default:
      return state;
  }
};
