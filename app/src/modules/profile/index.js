import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ExerciseDate from './components/ExerciseDate';
import { fetchDaysExercised, listenForNewDays } from '../../api/daysExercised';
import { daysExercisedArraySelector, displayExerciseDay } from './redux';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      displayExerciseDay,
      fetchDaysExercised,
      listenForNewDays
    },
    dispatch
  );

export const mapStateToProps = state => ({
  pastDays: daysExercisedArraySelector(state)
});

export class App extends PureComponent {
  static propTypes = {
    displayExerciseDay: PropTypes.func.isRequired,
    listenForNewDays: PropTypes.func.isRequired,
    pastDays: PropTypes.arrayOf(PropTypes.string)
  };

  static defaultProps = {
    pastDays: null
  };

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <Button
        title="Logout"
        onPress={() => navigation.dispatch({ type: 'logout' })}
      />
    ),
    title: 'Profile'
  });

  componentDidMount() {
    this.props.listenForNewDays();
  }

  onPress = day => {
    this.props.displayExerciseDay(day);
  };

  render() {
    return (
      <FlatList
        data={this.props.pastDays}
        renderItem={({ item }) => (
          <ExerciseDate item={item} onPress={this.onPress} />
        )}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
