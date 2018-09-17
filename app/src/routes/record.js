import record from '../modules/record';
import { recordTabIcon } from '../components/icons';

export default {
  record: {
    navigationOptions: {
      tabBarIcon: recordTabIcon
    },
    screen: record
  }
};
