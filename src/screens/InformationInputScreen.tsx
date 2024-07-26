import React from 'react';
import {
  Button,
  ButtonGroup,
  Layout,
  Radio,
  RadioGroup,
  Text,
} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/types';
import {styled} from 'styled-components';
import InformationInputImg from '@assets/information_input.png';
import {Image} from 'react-native';

type InformationInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InformationInput'
>;

export const InformationInputScreen = ({
  navigation,
}: InformationInputScreenProps) => (
  <Main>
    <LogoImage source={InformationInputImg} />
    <Text>화료 방법</Text>
    <HorizontalRadioGroup>
      <Radio>쯔모</Radio>
      <Radio>론</Radio>
    </HorizontalRadioGroup>
    <Text>리치</Text>
    <HorizontalRadioGroup>
      <Radio>리치 하지 않음</Radio>
      <Radio>리치</Radio>
      <Radio>더블 리치</Radio>
    </HorizontalRadioGroup>
    <Text>자풍패</Text>
    <HorizontalRadioGroup>
      <Radio>동</Radio>
      <Radio>남</Radio>
      <Radio>서</Radio>
      <Radio>북</Radio>
    </HorizontalRadioGroup>
    <Text>장풍패</Text>
    <HorizontalRadioGroup>
      <Radio>동</Radio>
      <Radio>남</Radio>
      <Radio>서</Radio>
      <Radio>북</Radio>
    </HorizontalRadioGroup>
    <Text>특수화료</Text>
    <HorizontalRadioGroup>
      <Radio>창깡</Radio>
      <Radio>영상개화</Radio>
      <Radio>해저</Radio>
    </HorizontalRadioGroup>
  </Main>
);

const Main = styled(Layout)`
  height: 100%;
  padding: 20px;
`;

const LogoImage = styled(Image)`
  width: 100%;
  max-height: 300px;
`;

const HorizontalRadioGroup = styled(RadioGroup)`
  flex-direction: row;
  margin-bottom: 10px;
`;
