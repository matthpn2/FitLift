import feed from '../modules/feed/App';
import { feedTabIcon } from '../components/icons';

export default {
  feed: {
    navigationOptions: {
      tabBarIcon: feedTabIcon
    },
    screen: feed
  }
};
