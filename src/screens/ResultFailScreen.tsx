import React from 'react';
import {RootStackParamList} from 'src/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Layout, Text} from '@ui-kitten/components';
import styled from 'styled-components/native';
import FailImg from '@assets/result_fail.png';
import {Image} from 'react-native';

type ResultFailProps = NativeStackScreenProps<RootStackParamList, 'ResultFail'>;

export const ResultFailScreen = ({navigation}: ResultFailProps) => {
  return (
    <Main>
      <ChonboImage source={FailImg} />
      <Text category="h4">실패(정보 입력 오류, 역없음 등)</Text>
      <BackButton
        status="warning"
        appearance="outline"
        onPress={() => {
          navigation.pop();
        }}>
        이전 화면으로
      </BackButton>
      <BackButton
        status="danger"
        appearance="outline"
        onPress={() => {
          navigation.popToTop();
        }}>
        메인 화면으로
      </BackButton>
    </Main>
  );
};

const Main = styled(Layout)`
  height: 100%;
  padding: 15px;
  align-items: center;
`;

const ChonboImage = styled.Image`
  width: 100%;
`;

const BackButton = styled(Button)`
  margin-top: 10px;
  width: 100%;
`;
