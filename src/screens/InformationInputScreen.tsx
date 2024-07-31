import React, {useState} from 'react';
import {
  Button,
  ButtonGroup,
  CheckBox,
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

export class handInformation {
  constructor() {
    this.closedPart = [];
    this.openPart = [];
    this.winTile = 0;
    this.dora = [];
  }
  closedPart: number[];
  openPart: {open: boolean; tiles: number[]}[];
  winTile: number;
  dora: number[];
}

type MahjongInformation = {
  hand: handInformation;
  winMethod?: 'tsumo' | 'ron';
  /**
   * @value 0 - not riichi
   * @value 1 - riichi
   * @value 2 - double riichi
   */
  riichi?: 0 | 1 | 2;
  ippatsu?: boolean;
  /**
   * @value 27 - east
   * @value 28 - south
   * @value 29 - west
   * @value 30 - north
   */
  seatWind?: 27 | 28 | 29 | 30;
  /**
   * @value 27 - east
   * @value 28 - south
   * @value 29 - west
   * @value 30 - north
   */
  roundWind?: 27 | 28 | 29 | 30;
  specialAgari?: 'after_kkang' | 'haitei' | 'none';
  /**
   * count of aka dora
   */
  aka?: number;
};

export const InformationInputScreen = ({
  navigation,
  route,
}: InformationInputScreenProps) => {
  const [information, setInformation] = useState<MahjongInformation>({
    hand: route.params,
  });
  return (
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
        <CheckBox
          style={{marginBottom: 10}}
          checked={information.ippatsu}
          onChange={nextChecked => {
            information.ippatsu = nextChecked;
            setInformation({...information});
          }}>
          일발
        </CheckBox>
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
          <Radio>창깡/영상개화</Radio>
          <Radio>하저로어/해저로월</Radio>
          <Radio>없음</Radio>
        </HorizontalRadioGroup>
        <Text>아카도라(개수)</Text>

        <Button status="success">완료</Button>
      </ScrollView>
    </Main>
  );
};

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
