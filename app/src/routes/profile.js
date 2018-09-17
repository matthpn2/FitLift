import profile from '../modules/profile';
import { profileTabIcon } from '../components/icons';

export default {
  profile: {
    navigationOptions: {
      tabBarIcon: profileTabIcon
    },
    screen: profile
  }
};
