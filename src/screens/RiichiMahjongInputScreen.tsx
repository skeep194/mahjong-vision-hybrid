import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Icon, IconElement, Input, Layout, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { HandImage } from 'src/components/HandImage';
import { HandProtocolHelp } from 'src/components/HandProtocolHelp';
import { RootStackParamList } from 'src/types';
import styled from 'styled-components/native';

type RiichiMahjongInputScreenProps = NativeStackScreenProps<RootStackParamList, "RiichiMahjongInput">

const PictureIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='image-outline'
  />
)

export const RiichiMahjongInputScreen = ({ navigation, route }: RiichiMahjongInputScreenProps) => {
  const [handString, handUpdate] = useState<string>('')
  return <Main>
    <Input placeholder='손패 (후로 제외)' onChangeText={(text: string) => {
      handUpdate(text);
    }} />
    <HandImage handString={handString} />
    <InputButton status='basic' accessoryLeft={PictureIcon}>
      사진으로 입력
    </InputButton>
    <InputButton status='success'>
      완료!
    </InputButton>
    <HandProtocolHelp />
  </Main>
}

const Main = styled(Layout)`
  padding: 20px;
  height: 100%;
`
const InputButton = styled(Button)`
  padding: 5px;
  margin: 10px;  
`
