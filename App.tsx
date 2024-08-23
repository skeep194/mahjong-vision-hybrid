import React from 'react';
import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import {useColorScheme} from 'react-native';
import HomeScreen from 'src/screens/HomeScreen';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HelpScreen from 'src/screens/HelpScreen';
import {RootStackParamList} from 'src/types';
import {RiichiMahjongInputScreen} from 'src/screens/RiichiMahjongInputScreen';
import {InformationInputScreen} from 'src/screens/InformationInputScreen';
import {ResultScreen} from 'src/screens/ResultScreen';
import {ResultFailScreen} from 'src/screens/ResultFailScreen';
import LoadingScreen from 'src/screens/LoadingScreen';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {CameraScreen} from 'src/screens/CameraScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default () => (
  <ApplicationProvider
    {...eva}
    theme={useColorScheme() === 'dark' ? eva.dark : eva.light}>
    <IconRegistry icons={EvaIconsPack} />
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen
          name="RiichiMahjongInput"
          component={RiichiMahjongInputScreen}
        />
        <Stack.Screen
          name="InformationInput"
          component={InformationInputScreen}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResultFail"
          component={ResultFailScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Camera"
          component={CameraScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    <Toast />
  </ApplicationProvider>
);
