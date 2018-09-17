import React, { PureComponent } from 'react';
import { TouchableHighlight, Text, View, Button } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginUser, alreadyLoggedIn, logoutUser } from '../../api/auth';
import { updateInput } from './redux';
import FormView from '../../components/FormView';
import firebase from '../../api/firebase';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loginUser,
      updateInput,
      alreadyLoggedIn,
      logoutUser
    },
    dispatch
  );

export const mapStateToProps = state => ({
  username: state.login.username,
  password: state.login.password,
  error: state.login.error
});

export class App extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Log In'
  });

  render() {
    const { username, password, error } = this.props;
    return (
      <FormView
        {...this.props}
        buttonText="Login"
        bottomText="Don't have an account?"
        bottomButtonText="Sign up"
        buttonOnPress={this.props.loginUser}
        bottomButtonNavigationRouteName="signup"
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
