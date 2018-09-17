import { createSelector } from 'reselect';

const initialState = {};

// selectors
const dbExercisesSelector = state => state.db.exercises;

export const exercisesMapper = createSelector(
  dbExercisesSelector,
  exercises => {
    if (Object.keys(exercises).length !== 0) {
      return Object.keys(exercises).reduce(
        (acc, x) => {
          const repsWeight = `${exercises[x].reps} ${exercises[x].weight}`;
          const sets = acc[exercises[x].type][repsWeight]
            ? (acc[exercises[x].type][repsWeight] += 1)
            : 1;
          return {
            ...acc,
            [exercises[x].type]: {
              ...acc[exercises[x].type],
              [repsWeight]: sets
            }
          };
        },
        {
          'Bicep Curls': {},
          'Single Front Raises': {},
          'Lateral Raises': {},
          'Tricep Extensions': {}
        }
      );
    }
    return null;
  }
);

export const exercisesSelector = createSelector(
  exercisesMapper,
  exercises =>
    exercises &&
    Object.keys(exercises).map(type => ({
      values: Object.keys(exercises[type]).map(x => ({
        reps: x.split(' ')[0],
        sets: exercises[type][x],
        type,
        weight: x.split(' ')[1]
      }))
    }))
);

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
