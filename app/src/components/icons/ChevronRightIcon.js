import React, { PureComponent } from 'react';
import { Entypo } from '@expo/vector-icons';

export default class ChevronRightIcon extends PureComponent {
  render() {
    return (
      <Entypo
        name="chevron-thin-right"
        size={20}
        style={{
          color: 'grey',
          marginRight: 10,
        }}
      />
    );
  }
}
