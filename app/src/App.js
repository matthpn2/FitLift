import React, { PureComponent } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './rootReducer';
import Router, { navigationMiddleware } from './routes';

export const store = createStore(
  reducer,
  // window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(
  applyMiddleware(thunk, navigationMiddleware)
  // )
);

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
