import React from 'react';
import { Button, Layout, Text, Icon, IconElement } from '@ui-kitten/components';
import { GestureResponderEvent, Image, StyleSheet, View } from 'react-native';
import JansouImg from '@assets/jansou.png';
import styled from 'styled-components/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/types';

const LightIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='sun-outline'
  />
)

const DarkIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='moon-outline'
  />
)

const HelpIcon = (props: any): IconElement => (
  <Icon
    {...props}
    name='question-mark-circle-outline'
  />
)

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">

const HomeScreen = ({ navigation, route }: HomeScreenProps) => (
  <Layout>
    <Main>
      <Title category='h1'>
        mahjong vision
      </Title>
      <LogoImage
        source={JansouImg}
      />
      <Button
        onPress={() => {
          navigation.navigate('RiichiMahjongInput');
        }}>
        4명이 모였나요?
      </Button>
    </Main>
    <UpperButtonView>
      <Button
        appearance='ghost'
        accessoryLeft={HelpIcon}
        onPress={(event: GestureResponderEvent) => {
          navigation.navigate('Help');
        }}
      />
    </UpperButtonView>
  </Layout>
);

const Main = styled.View`
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Title = styled(Text)`
  padding-bottom: 20px;
`;

const LogoImage = styled(Image)`
  width: 300px;
  height: 300px;
  margin-vertical: 30px;
`;

const UpperButtonView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 25px;
  position: absolute;
  width: 100%;
`;

export default HomeScreen;