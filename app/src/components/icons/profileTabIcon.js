import React from 'react';
import PropTypes from 'prop-types';
import { MaterialIcons } from '@expo/vector-icons';

export default function profileTabIcon({ tintColor, focused }) {
  return (
    <MaterialIcons
      name={focused ? 'person' : 'person-outline'}
      size={33}
      style={{ color: tintColor }}
    />
  );
}

profileTabIcon.propTypes = {
  focused: PropTypes.bool.isRequired,
  tintColor: PropTypes.string.isRequired,
};
