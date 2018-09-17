import { exercisesSelector } from '../redux';

describe('selector tests', () => {
  it('should work', () => {
    const state = {
      db: {
        exercises: {
          '-L5wtK18VNAWE3sINej7': {
            reps: 5,
            timeStamp: 1519292600524,
            type: 'Bicep Curls',
            weight: '5'
          },
          '-L5wtKJ-6u_j8fCLt7dy': {
            reps: 5,
            timeStamp: 1519292601668,
            type: 'Bicep Curls',
            weight: '5'
          }
        }
      }
    };
    expect(exercisesSelector(state)).toMatchSnapshot();
  });
});
