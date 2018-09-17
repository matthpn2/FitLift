import { createSelector } from 'reselect';
import reverse from 'lodash/reverse';
import firebase from '../../api/firebase';

const initialState = {};

export const TypeKeys = {
  DISPLAY_EXERCISE_DAY: 'DISPLAY_EXERCISE_DAY',
  LOGOUT: 'LOGOUT'
};

// selectors

const daysExercisedSelector = state => state.db.daysExercised;

export const daysExercisedArraySelector = createSelector(
  daysExercisedSelector,
  daysExercised => {
    if (Object.keys(daysExercised).length !== 0) {
      return reverse(Object.keys(daysExercised).map(x => x));
    }
    return null;
  }
);

// actions

export const displayExerciseDay = day => ({
  day,
  type: TypeKeys.DISPLAY_EXERCISE_DAY
});

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
