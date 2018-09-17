import { createSelector } from 'reselect';
import omit from 'lodash/omit';
import { TypeKeys as api } from '../../api/newExercises';

export const initialState = {
  isLoading: false,
  modifiedExercises: {}
};

export const TypeKeys = {
  LOGIN: 'login',
  RECEIVE_NEW_EXERCISES: api.RECEIVE_NEW_EXERCISES,
  REMOVE_NEW_EXERCISE: api.REMOVE_NEW_EXERCISE,
  REQUEST_NEW_EXERCISES: api.REQUEST_NEW_EXERCISES,
  UPDATE_NEW_EXERCISE: 'UPDATE_NEW_EXERCISE'
};

// actions

export const updateNewExercise = (id, key, value) => ({
  id,
  key,
  type: TypeKeys.UPDATE_NEW_EXERCISE,
  value
});

// selectors

const newExercisesSelector = state => state.db.newExercises;
const modifiedExercisesSelector = state => state.record.modifiedExercises;

export const exercisesToRecordSelector = createSelector(
  newExercisesSelector,
  modifiedExercisesSelector,
  (newExercises, modifiedExercises) => {
    if (Object.keys(newExercises).length !== 0) {
      return Object.keys(newExercises).map(x => ({
        ...newExercises[x],
        id: x,
        ...modifiedExercises[x]
      }));
    }
    return null;
  }
);

// reducer

export default (state = initialState, action) => {
  switch (action.type) {
    case TypeKeys.REQUEST_NEW_EXERCISES:
      return {
        ...state,
        isLoading: true
      };
    case TypeKeys.RECEIVE_NEW_EXERCISES:
      return {
        isLoading: false,
        modifiedExercises: {
          ...state.modifiedExercises,
          ...Object.keys(action.data).reduce(
            (acc, x) => ({
              ...acc,
              [x]: {
                reps: action.data[x].reps
              }
            }),
            {}
          )
        }
      };
    case TypeKeys.UPDATE_NEW_EXERCISE: {
      const { id, key, value } = action;
      const newValue = value ? value : undefined;
      return {
        ...state,
        modifiedExercises: {
          ...state.modifiedExercises,
          [id]: {
            ...state.modifiedExercises[id],
            [key]: newValue
          }
        }
      };
    }
    case TypeKeys.REMOVE_NEW_EXERCISE:
      return {
        ...state,
        modifiedExercises: omit(state.modifiedExercises, action.id)
      };
    case TypeKeys.LOGIN:
      return {
        ...state,
        isLoading: true
      };
    case TypeKeys.CONFIRMING_NEW_EXERCISE:
      return {
        ...state,
        modifiedExercises: {
          ...state.modifiedExercises,
          [action.id]: {
            ...state.modifiedExercises[action.id],
            isConfirming: true
          }
        }
      };
    default:
      return state;
  }
};
