import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, Layout, Text } from '@ui-kitten/components';
import { useColorScheme } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HelpScreen from 'src/screens/HelpScreen';

const Stack = createNativeStackNavigator();

export default () => (
  <ApplicationProvider {...eva} theme={useColorScheme() === 'dark' ? eva.dark : eva.light}>
    <IconRegistry icons={EvaIconsPack} />
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={HomeScreen}
        />
        <Stack.Screen
          name='Help'
          component={HelpScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </ApplicationProvider>
);