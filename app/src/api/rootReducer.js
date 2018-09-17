import { combineReducers } from 'redux';
import newExercises from './newExercises';
import daysExercised from './daysExercised';
import exercises from './exercises';
import auth from './auth';

export default combineReducers({
  auth,
  daysExercised,
  exercises,
  newExercises
});
