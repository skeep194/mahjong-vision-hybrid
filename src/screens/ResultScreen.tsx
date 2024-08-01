import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from '@ui-kitten/components';
import React from 'react';
import {RootStackParamList} from 'src/types';

type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

export const ResultScreen = ({route}: ResultScreenProps) => {
  return <Text>{JSON.stringify(route.params)}</Text>;
};
