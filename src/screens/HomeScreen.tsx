import React from 'react';
import { Button, Layout, Text, Icon, IconElement } from '@ui-kitten/components';
import { GestureResponderEvent, Image, StyleSheet, View, useColorScheme } from 'react-native';
import JansouImg from '@assets/jansou.png';

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

const HomeScreen = ({ navigation }) => (
  <Layout style={styles.layout}>
    <View style={styles.main}>
      <Text
        category='h1'
        style={styles.title}
      >
        mahjong vision
      </Text>
      <Image
        style={styles.mainLogo}
        source={JansouImg}
      />
      <Button>
        4명이 모였나요?
      </Button>
    </View>
    <View style={styles.upperButtonView}>
      <Button
        appearance='ghost'
        accessoryLeft={HelpIcon}
        onPress={(event: GestureResponderEvent) => {
          navigation.navigate('Help');
        }}
      />
    </View>
  </Layout>
);

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    flexDirection: 'column',
  },
  upperButtonView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 25,
    position: 'absolute',
    width: '100%',
  },
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  mainLogo: {
    width: 300,
    height: 300,
    marginVertical: 30,
  },
  title: {
    paddingBottom: 20,
  }
})

export default HomeScreen;