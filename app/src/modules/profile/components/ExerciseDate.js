import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChevronRightIcon, DumbbellIcon } from '../../../components/icons/';

// prettier-ignore
const Button = styled.TouchableHighlight`
  backgroundColor: #F7F8FC;
  borderRadius: 4px;
  marginHorizontal: 10px;
  marginVertical: 5px;
  paddingVertical: 10px;
`;

// prettier-ignore
const View = styled.View`
  alignItems: center;
  flexDirection: row;
  justifyContent: space-between;
`;

// prettier-ignore
const Text = styled.Text`
  fontSize: 20px;
`;

export default class ExerciseDate extends PureComponent {
  static propTypes = {
    item: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired
  };

  onPress = () => this.props.onPress(this.props.item);

  render() {
    const { item } = this.props;
    return (
      <Button onPress={this.onPress} underlayColor="white">
        <View>
          <DumbbellIcon />
          <Text>{item}</Text>
          <ChevronRightIcon />
        </View>
      </Button>
    );
  }
}
