import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { Image, StyleSheet } from 'react-native';
import JansouImg from '@assets/jansou.png';

const HomeScreen = () => (
  <Layout style={styles.layout}>
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
  </Layout>
);

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogo: {
    width: 300,
    height: 300,
    marginVertical: 30,
  },
  title: {
    paddingVertical: 20,
  }
})

export default HomeScreen;