import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { RowStyle, RowCell, ExerciseRowCell } from '../../../components/Row';

export default class Row extends PureComponent {
  static propTypes = {
    exercise: PropTypes.shape({
      reps: PropTypes.string.isRequired,
      sets: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      weight: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { exercise: { type, sets, reps, weight } } = this.props;
    return (
      <RowStyle>
        <ExerciseRowCell text={type} />
        <RowCell text={sets} />
        <RowCell text={reps} />
        <RowCell text={weight} />
      </RowStyle>
    );
  }
}
