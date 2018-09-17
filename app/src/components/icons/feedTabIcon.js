import React from 'react';
import PropTypes from 'prop-types';
import { Foundation } from '@expo/vector-icons';

export default function feedTabIcon({ tintColor }) {
  return (
    <Foundation
      name="list-bullet"
      size={33}
      style={{ color: tintColor }}
    />
  );
}

feedTabIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};
