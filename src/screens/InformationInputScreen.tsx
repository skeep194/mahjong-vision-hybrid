import React, {useState} from 'react';
import * as Yup from 'yup';
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
import {Riichi} from '@skeep194/riichi-ts';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {countFive} from 'src/utils/hand';
import {errorToast} from 'src/utils/toast';

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
    this.aka = 0;
  }
  closedPart: number[];
  openPart: {open: boolean; tiles: number[]}[];
  winTile: number;
  dora: number[];
  aka: number;
}

class MahjongInformation {
  hand: HandInformation;
  constructor(hand: HandInformation) {
    this.hand = hand;
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
}

const InformationSchema = Yup.object().shape({
  winMethod: Yup.number().required('화료 방법을 선택해주세요'),
  riichi: Yup.number().required('리치 여부를 선택해주세요'),
  seatWind: Yup.number().required('자풍패를 선택해주세요'),
  roundWind: Yup.number().required('장풍패를 선택해주세요'),
});

export const InformationInputScreen = ({
  navigation,
  route,
}: InformationInputScreenProps) => {
  let maxAkaBit =
    countFive(route.params.closedPart) | countFive([route.params.winTile]);
  route.params.openPart.forEach(value => {
    maxAkaBit |= countFive(value.tiles);
  });
  let maxAka = 0;
  while (maxAkaBit > 0) {
    if (maxAkaBit % 2 === 1) {
      maxAka += 1;
    }
    maxAkaBit = Math.floor(maxAkaBit / 2);
  }
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
              values.ippatsu,
              values.riichi === 2,
              values.specialAgari === 1,
              values.specialAgari === 0,
              values.hand.aka,
              true,
              true,
              false,
            );
            const calc = result.calc();
            if (calc.error || (calc.han == 0 && calc.yakuman == 0)) {
              navigation.navigate('ResultFail');
            } else {
              navigation.navigate('Result', calc);
            }
          }}
          validationSchema={InformationSchema}
          validateOnMount={true}>
          {({setFieldValue, values, errors, submitForm}) => (
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
              <Button
                status="success"
                onPress={() => {
                  errorToast(errors.roundWind);
                  errorToast(errors.seatWind);
                  errorToast(errors.riichi);
                  errorToast(errors.winMethod);
                  if (values.ippatsu && !values.riichi) {
                    errorToast('일발은 리치 했을 때만 가능합니다.');
                    return;
                  }
                  submitForm();
                }}>
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
  width: 50%;
  max-height: 200px;
  align-self: center;
`;

const HorizontalRadioGroup = styled(RadioGroup)`
  flex-direction: row;
  margin-bottom: 10px;
`;
