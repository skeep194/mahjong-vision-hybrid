import React from 'react';
import {Layout, Text} from '@ui-kitten/components';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from 'src/types';

type InformationInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'InformationInput'
>;

export const InformationInputScreen = ({
  navigation,
}: InformationInputScreenProps) => (
  <Layout>
    <Text>information</Text>
  </Layout>
);
