import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import { App } from '../index';

describe('render tests', () => {
  it('doesnt crash', () => {
    const props = {
      navigation: {},
      login: {
        username: '',
        password: '',
        error: ''
      }
    };
    const rendered = renderer.create(<App {...props} />).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
