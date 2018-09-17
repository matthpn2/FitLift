import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FlatList, View } from 'react-native';
import { fetchExercises } from '../../api/exercises';
import Header from '../../components/Header';
import Row from './components/Row';
import { exercisesSelector } from './redux';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchExercises
    },
    dispatch
  );

export const mapStateToProps = state => ({
  exercises: exercisesSelector(state)
});

export class App extends PureComponent {
  static propTypes = {
    exercises: PropTypes.arrayOf(
      PropTypes.shape({
        reps: PropTypes.string,
        sets: PropTypes.number,
        type: PropTypes.string,
        weight: PropTypes.string
      })
    ),
    fetchExercises: PropTypes.func.isRequired,
    navigation: PropTypes.shape({})
  };

  static defaultProps = {
    exercises: [],
    navigation: {}
  };

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.day
  });

  componentDidMount() {
    const { navigation: { state: { params: { day } } } } = this.props;
    this.props.fetchExercises(day);
  }

  render() {
    const { exercises } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header names={['Exercise', 'Sets', 'Reps', 'Weight']} />
        <FlatList
          data={exercises}
          renderItem={({ item }) =>
            Object.values(item.values).map((exercise, index) => (
              <Row key={index} exercise={exercise} />
            ))
          }
          keyExtractor={(item, index) => index}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
