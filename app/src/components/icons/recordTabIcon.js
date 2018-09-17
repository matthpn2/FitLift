import React from 'react';
import PropTypes from 'prop-types';
import { Foundation } from '@expo/vector-icons';

export default function recordTabIcon({ tintColor }) {
  return (
    <Foundation
      name="record"
      size={33}
      style={{ color: tintColor }}
    />
  );
}

recordTabIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
