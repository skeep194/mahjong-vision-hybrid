import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import { useColorScheme } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default () => (
  <ApplicationProvider {...eva} theme={useColorScheme() === 'dark' ? eva.dark : eva.light}>
    <HomeScreen />
  </ApplicationProvider>
);