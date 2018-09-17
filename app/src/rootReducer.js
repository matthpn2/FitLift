import { combineReducers } from 'redux';
import db from './api/rootReducer';
import navigation from './routes/reducer';
import feed from './modules/feed/redux';
import login from './modules/login/redux';
import signup from './modules/signup/redux';
import profile from './modules/profile/redux';
import record from './modules/record/redux';
import exerciseDay from './modules/exerciseDay/redux';

export default combineReducers({
  db,
  exerciseDay,
  feed,
  login,
  navigation,
  profile,
  record,
  signup
});
