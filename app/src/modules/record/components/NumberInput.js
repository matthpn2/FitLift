import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// prettier-ignore
const StyledInput = styled.TextInput`
  borderColor: gray;
  borderRadius: 4px;
  borderWidth: 1px;
  fontSize: 18px;
  height: 40px;
  textAlign: center;
  width: 40px;
`;

export default class NumberInput extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  };

  onChangeText = e => {
    this.props.onChange(e);
  };

  render() {
    const { value } = this.props;
    return (
      <StyledInput
        maxLength={2}
        keyboardType="numeric"
        value={`${value}`}
        onChangeText={this.onChangeText}
      />
    );
  }
}
