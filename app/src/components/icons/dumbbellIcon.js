import React, { PureComponent } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default class DumbbellIcon extends PureComponent {
  render() {
    return (
      <MaterialCommunityIcons
        name="dumbbell"
        size={33}
        style={{
          color: 'grey',
          marginLeft: 10,
        }}
      />
    );
  }
}
