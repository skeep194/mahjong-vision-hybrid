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
import {Image, ScrollView} from 'react-native';

type InformationInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InformationInput'
>;

type MahjongWind = 'E' | 'S' | 'W' | 'N';

type MahjongInformation = {
  win_method: 'tsumo' | 'ron';
  /**
   * @value 0 - not riichi
   * @value 1 - riichi
   * @value 2 - double riichi
   */
  riichi: 0 | 1 | 2;
  ippatsu: boolean;
  seat_wind: MahjongWind;
  prevalent_wind: MahjongWind;
  chankkang: boolean;
  haitei: boolean;
  rinchan: boolean;
  aka: number;
};

export const InformationInputScreen = ({
  navigation,
}: InformationInputScreenProps) => (
  <Main>
    <ScrollView>
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
    </ScrollView>
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
