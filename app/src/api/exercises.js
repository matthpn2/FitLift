import moment from 'moment-timezone';
import firebase from './firebase';

const initialState = {};

export const TypeKeys = {
  RECEIVE_EXERCISES: 'RECEIVE_EXERCISES',
  REQUEST_EXERCISES: 'REQUEST_EXERCISES'
};

const requestExercises = user => ({
  type: TypeKeys.REQUEST_EXERCISES,
  user
});

const receiveExercises = data => ({
  data,
  type: TypeKeys.RECEIVE_EXERCISES
});

export const fetchExercises = day => dispatch => {
  const user = firebase.auth().currentUser.uid;
  dispatch(requestExercises(user));
  const dayArray = day.split('-');
  const formattedDate = [dayArray[2], dayArray[0], dayArray[1]].join('-');

  const startTime = Number(
    moment(formattedDate)
      .tz('America/Los_Angeles')
      .format('x')
  );
  const endTime = startTime + 86400000;
  firebase
    .database()
    .ref(`exercises/${user}`)
    .orderByChild('timeStamp')
    .startAt(startTime)
    .endAt(endTime)
    .on('value', data => {
      dispatch(receiveExercises(data.val()));
    });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TypeKeys.RECEIVE_EXERCISES:
      return {
        ...state,
        ...action.data
      };
    default:
      return state;
  }
};
