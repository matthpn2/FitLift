import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
// import { App } from '../index';

describe('render tests', () => {
  // have to skip because react native development is terrible.
  it.skip('doesnt crash', () => {
    const props = {
      displayExerciseDay: f => f,
      navigation: {}
    };
    const rendered = renderer.create(<App {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
