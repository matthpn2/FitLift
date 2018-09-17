import React from 'react';
import renderer from 'react-test-renderer';
import { App, mapStateToProps } from '../index';
import { new_exercises as allNewExercises } from '../../../api/db.json';

const newExercises = allNewExercises.SAMPLE_USER;

describe('render tests', () => {
  it('doesnt crash', () => {
    const props = {
      createNewExercise: f => f,
      deleteNewExercise: f => f,
      exercisesToRecord: [
        {
          id: '1',
          reps: 12,
          timeStamp: 1518407604,
          type: 'Bicep Curls',
          weight: 35
        },
        {
          id: '2',
          reps: 5,
          timeStamp: 1518407604,
          type: 'Shoulder Press',
          weight: 15
        },
        {
          id: '3',
          reps: 6,
          timeStamp: 1518407604,
          type: 'Lateral Raises',
          weight: 45
        }
      ],
      fetchNewExercises: f => f,
      listenForNewExercises: f => f,
      navigation: {},
      record: {
        isLoading: false
      },
      updateNewExercise: f => f
    };
    const rendered = renderer.create(<App {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});

describe('mapStateToProps tests', () => {
  it('should work with intial state', () => {
    expect(
      mapStateToProps({
        db: {
          newExercises: {}
        },
        record: {
          isLoading: false
        }
      })
    ).toEqual({
      exercisesToRecord: null,
      record: {
        isLoading: false
      }
    });
  });

  it('should work when loading', () => {
    expect(
      mapStateToProps({
        db: {
          newExercises: {}
        },
        record: {
          isLoading: true
        }
      })
    ).toEqual({
      exercisesToRecord: null,
      record: {
        isLoading: true
      }
    });
  });

  it('should work with new exercises', () => {
    expect(
      mapStateToProps({
        db: {
          newExercises
        },
        record: {
          isLoading: false,
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
