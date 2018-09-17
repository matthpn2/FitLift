import { NavigationActions } from 'react-navigation';
import { Navigation } from './index';

const initialState = Navigation.router.getStateForAction(
  Navigation.router.getActionForPathAndParams('login')
);

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'CREATE_USER_SUCCESS':
      return Navigation.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'loggedIn' })
      );
    case 'logout':
      return Navigation.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'login' })
      );
    case 'DISPLAY_EXERCISE_DAY':
      return Navigation.router.getStateForAction(
        NavigationActions.navigate({
          params: {
            day: action.day
          },
          routeName: 'exerciseDay'
        }),
        Navigation.router.getStateForAction(action, state)
      );
    default:
      return Navigation.router.getStateForAction(action, state);
  }
};
