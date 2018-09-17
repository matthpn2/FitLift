import React from 'react';
import renderer from 'react-test-renderer';
import { App } from '../index';

describe('render tests', () => {
  it('doesnt crash', () => {
    const props = {
      exercises: [
        {
          values: [
            {
              reps: '5',
              sets: 2,
              type: 'Bicep Curls',
              weight: '5'
            }
          ]
        },
        {
          values: [
            {
              reps: '12',
              sets: 3,
              type: 'Shoulder Press',
              weight: '30'
            }
          ]
        },
        {
          values: []
        }
      ],
      fetchExercises: f => f,
      navigation: {
        state: {
          params: {
            day: '02/11/2018',
            user: 'SAMPLE_USER'
          }
        }
      }
    };
    const rendered = renderer.create(<App {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
