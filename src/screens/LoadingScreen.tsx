import React from 'react';
import LoadingImg from '@assets/loading.png';
import {Image} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';

export const LoadingScreen = () => (
  <Layout style={{height: '100%'}}>
    <Image src={LoadingImg} />
    <Text>생각중...</Text>
  </Layout>
);
