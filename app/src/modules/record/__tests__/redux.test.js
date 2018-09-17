import reducer, {
  TypeKeys,
  updateNewExercise,
  exercisesToRecordSelector
} from '../redux';
import { new_exercises as allNewExercises } from '../../../api/db.json';

const newExercises = allNewExercises.SAMPLE_USER;

describe('selector tests', () => {
  it('it should work', () => {
    expect(
      exercisesToRecordSelector({
        db: {
          newExercises
        },
        record: {
          modifiedExercises: {
            '-L5GDNmo8uZxet9S7mE2': {
              reps: 12,
              weight: 35
            },
            '-L5GDeJnjbOj1SkQRJK8': {
              reps: 5,
              weight: 15
            },
            '-L5GDeeBKCPlTnm-yCiX': {
              reps: 6,
              weight: 45
            }
          }
        }
      })
    ).toMatchSnapshot();
  });
});

describe('reducer tests', () => {
  it('TypeKeys.LOGIN should work', () => {
    expect(
      reducer(
        {
          isLoading: false
        },
        {
          type: TypeKeys.LOGIN
        }
      )
    ).toEqual({
      isLoading: true
    });
  });

  it('TypeKeys.RECEIVE_NEW_EXERCISES should work', () => {
    expect(
      reducer(
        {
          isLoading: true,
          modifiedExercises: {}
        },
        {
          data: newExercises,
          type: TypeKeys.RECEIVE_NEW_EXERCISES
        }
      )
    ).toEqual({
      isLoading: false,
      modifiedExercises: {
        '-L5GDNmo8uZxet9S7mE2': {
          reps: 12
        },
        '-L5GDeJnjbOj1SkQRJK8': {
          reps: 5
        },
        '-L5GDeeBKCPlTnm-yCiX': {
          reps: 6
        }
      }
    });
  });

  it('TypeKeys.UPDATE_NEW_EXERCISE should work', () => {
    expect(
      reducer(
        {
          isLoading: false,
          modifiedExercises: {
            '-1': {
              reps: 12,
              timeStamp: 1518407604,
              type: 'Bicep Curls',
              weight: 35
            },
            '-2': {
              reps: 5,
              timeStamp: 1518407604,
              type: 'Shoulder Press',
              weight: 85
            }
          }
        },
        updateNewExercise('-1', 'weight', 25)
      )
    ).toMatchSnapshot();
  });

  it('TypeKeys.UPDATE_NEW_EXERCISE should work', () => {
    expect(
      reducer(
        {
          isLoading: false,
          modifiedExercises: {
            '-1': {
              reps: 12,
              timeStamp: 1518407604,
              type: 'Bicep Curls',
              weight: 35
            },
            '-2': {
              reps: 5,
              timeStamp: 1518407604,
              type: 'Shoulder Press',
              weight: 85
            }
          }
        },
        updateNewExercise('-2', 'reps', 25)
      )
    ).toMatchSnapshot();
  });
});
