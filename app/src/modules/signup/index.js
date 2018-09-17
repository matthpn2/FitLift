import React, { PureComponent } from 'react';
import { TouchableHighlight, Text, Button } from 'react-native';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createNewUser } from '../../api/auth';
import { updateInput } from './redux';
import FormView from '../../components/FormView';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createNewUser,
      updateInput
    },
    dispatch
  );

export const mapStateToProps = state => ({
  username: state.signup.username,
  password: state.signup.password,
  error: state.signup.error
});

export class App extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Sign Up'
  });

  render() {
    return (
      <FormView
        {...this.props}
        buttonText="Sign up"
        bottomText="Already have an account?"
        bottomButtonText="Log in"
        buttonOnPress={this.props.createNewUser}
        bottomButtonNavigationRouteName="goBack"
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
