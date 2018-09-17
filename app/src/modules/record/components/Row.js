import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import NumberInput from './NumberInput';
import SubmitButton from './SubmitButton';
import {
  StyledRowCell,
  StyledExercise,
  RowStyle
} from '../../../components/Row';

export default class Row extends PureComponent {
  static propTypes = {
    display: PropTypes.string,
    id: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    reps: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    submitButtonOnPress: PropTypes.func.isRequired,
    timeStamp: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    display: false,
    reps: '',
    weight: ''
  };

  onChange = (id, key) => value => this.props.onChange(id, key, value);

  render() {
    const {
      id,
      type,
      reps,
      display,
      submitButtonOnPress,
      timeStamp,
      weight
    } = this.props;
    return (
      <RowStyle>
        <StyledExercise>
          <Text>{type}</Text>
          <Text>{timeStamp}</Text>
        </StyledExercise>
        <StyledRowCell>
          <NumberInput onChange={this.onChange(id, 'reps')} value={reps} />
        </StyledRowCell>
        <StyledRowCell>
          <NumberInput onChange={this.onChange(id, 'weight')} value={weight} />
        </StyledRowCell>
        <StyledRowCell>
          <SubmitButton
            id={id}
            display={display}
            onPress={submitButtonOnPress}
          />
        </StyledRowCell>
      </RowStyle>
    );
  }
}
