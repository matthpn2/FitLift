import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  addNavigationHelpers,
  TabNavigator,
  StackNavigator
} from 'react-navigation';
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener
} from 'react-navigation-redux-helpers';
import login from '../modules/login';
import exerciseDay from '../modules/exerciseDay';
import signup from '../modules/signup';
import feed from './feed';
import record from './record';
import profile from './profile';

export const tabScreenNavigator = TabNavigator(
  {
    ...record,
    ...profile
  },
  {
    animationEnabled: true,
    initialRouteName: 'record',
    paths: {
      record: 'feed'
    },
    swipeEnabled: true,
    tabBarOptions: {
      activeTintColor: '#fc4c02',
      labelStyle: {
        fontSize: 15
      },
      style: {
        height: 60
      }
    },
    tabBarPosition: 'bottom'
  }
);

export const Navigation = StackNavigator({
  exerciseDay: { screen: exerciseDay },
  loggedIn: { screen: tabScreenNavigator },
  login: { screen: login },
  signup: { screen: signup }
});

export const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.navigation
);

const addListener = createReduxBoundAddListener('root');

const mapStateToProps = state => ({
  navigation: state.navigation
});

class Router extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      index: PropTypes.number,
      routes: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.any,
          routeName: PropTypes.string,
          type: PropTypes.any
        })
      )
    }).isRequired
  };

  render() {
    const { dispatch, navigation } = this.props;
    return (
      <Navigation
        navigation={addNavigationHelpers({
          addListener,
          dispatch,
          state: navigation
        })}
      />
    );
  }
}

export default connect(mapStateToProps)(Router);
