import React, {useState} from 'react';
import {
  Button,
  ButtonGroup,
  CheckBox,
  Icon,
  Layout,
  Radio,
  RadioGroup,
  Text,
} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/types';
import {styled} from 'styled-components/native';
import InformationInputImg from '@assets/information_input.png';
import {GestureResponderEvent, Image, ScrollView, View} from 'react-native';
import {Formik} from 'formik';
import {Riichi} from 'riichi-ts';

type InformationInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InformationInput'
>;

export class HandInformation {
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

class MahjongInformation {
  hand: HandInformation;
  constructor(hand: HandInformation) {
    this.hand = hand;
    this.aka = 0;
  }
  /**
   * @value 0 - tsumo
   * @value 1 - ron
   */
  winMethod?: number;
  /**
   * @value 0 - not riichi
   * @value 1 - riichi
   * @value 2 - double riichi
   */
  riichi?: number;
  ippatsu?: boolean;
  /**
   * riichi array offset 27
   * @value 0 - east
   * @value 1 - south
   * @value 2 - west
   * @value 3 - north
   */
  seatWind?: number;
  /**
   * riichi array offset 27
   * @value 0 - east
   * @value 1 - south
   * @value 2 - west
   * @value 3 - north
   */
  roundWind?: number;
  /**
   * @value 0 - chankkang/rinsyan
   * @value 1 - haitei/houtei
   * @value 2 - none
   */
  specialAgari?: number;
  /**
   * count of aka dora
   */
  aka: number;
}

export const InformationInputScreen = ({
  navigation,
  route,
}: InformationInputScreenProps) => {
  return (
    <Main>
      <ScrollView>
        <LogoImage source={InformationInputImg} />
        <Formik
          initialValues={new MahjongInformation(route.params)}
          onSubmit={values => {
            if (values.winMethod === 0) {
              values.hand.closedPart.push(values.hand.winTile);
            }
            const result = new Riichi(
              values.hand.closedPart,
              values.hand.openPart,
              {
                bakaze: values.roundWind! + 27,
                jikaze: values.seatWind! + 27,
                dora: values.hand.dora,
              },
              values.winMethod === 1 ? values.hand.winTile : undefined,
              false,
              values.riichi === 1,
              values.riichi === 2,
              values.ippatsu,
              values.specialAgari === 1,
              values.specialAgari === 0,
              values.aka,
              true,
              true,
              false,
            );
            navigation.navigate('Result', result.calc());
          }}>
          {({setFieldValue, values, handleSubmit}) => (
            <>
              <Text>화료 방법</Text>
              <HorizontalRadioGroup
                onChange={(index: number) => {
                  setFieldValue('winMethod', index);
                }}
                selectedIndex={values.winMethod}>
                <Radio>쯔모</Radio>
                <Radio>론</Radio>
              </HorizontalRadioGroup>
              <Text>리치</Text>
              <HorizontalRadioGroup
                onChange={(index: number) => {
                  setFieldValue('riichi', index);
                }}
                selectedIndex={values.riichi}>
                <Radio>리치 하지 않음</Radio>
                <Radio>리치</Radio>
                <Radio>더블 리치</Radio>
              </HorizontalRadioGroup>
              <CheckBox
                style={{marginBottom: 10}}
                onChange={(checked: boolean) => {
                  setFieldValue('ippatsu', checked);
                }}
                checked={values.ippatsu}>
                일발
              </CheckBox>
              <Text>자풍패</Text>
              <HorizontalRadioGroup
                onChange={(index: number) => {
                  setFieldValue('seatWind', index);
                }}
                selectedIndex={values.seatWind}>
                <Radio>동</Radio>
                <Radio>남</Radio>
                <Radio>서</Radio>
                <Radio>북</Radio>
              </HorizontalRadioGroup>
              <Text>장풍패</Text>
              <HorizontalRadioGroup
                onChange={(index: number) => {
                  setFieldValue('roundWind', index);
                }}
                selectedIndex={values.roundWind}>
                <Radio>동</Radio>
                <Radio>남</Radio>
                <Radio>서</Radio>
                <Radio>북</Radio>
              </HorizontalRadioGroup>
              <Text>특수화료</Text>
              <HorizontalRadioGroup
                onChange={(index: number) => {
                  setFieldValue('specialAgari', index);
                }}
                selectedIndex={values.specialAgari}>
                <Radio>창깡/영상개화</Radio>
                <Radio>하저로어/해저로월</Radio>
                <Radio>없음</Radio>
              </HorizontalRadioGroup>
              <Text>아카도라(개수)</Text>
              <CountAkadoraView>
                <AdjustButton
                  accessoryLeft={<Icon name="minus-outline" fill="red" />}
                  appearance="ghost"
                  onPress={() => {
                    setFieldValue('aka', Math.max(0, values.aka - 1));
                  }}
                />
                <AkadoraText>{values.aka}</AkadoraText>
                <AdjustButton
                  accessoryLeft={<Icon name="plus-outline" />}
                  appearance="ghost"
                  onPress={() => {
                    setFieldValue('aka', Math.min(3, values.aka + 1));
                  }}
                />
              </CountAkadoraView>
              <Button
                status="success"
                onPress={handleSubmit as (e?: GestureResponderEvent) => void}>
                완료
              </Button>
            </>
          )}
        </Formik>
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

const CountAkadoraView = styled.View`
  margin-vertical: 10px;
  flex-direction: row;
  align-items: center;
`;

const AdjustButton = styled(Button)`
  width: 10px;
  height: 10px;
`;

const AkadoraText = styled(Text)`
  margin-horizontal: 5px;
`;
