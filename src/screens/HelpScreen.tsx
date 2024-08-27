import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {styled} from 'styled-components/native';

const HelpScreen = () => (
  <HelpScreenLayout>
    <Text>문의</Text>
    <Text>jongunj82@gmail.com</Text>
    <Text>버전</Text>
    <Text>alpha-0.0.1</Text>
  </HelpScreenLayout>
);

const HelpScreenLayout = styled(Layout)`
  flex: 1;
  padding: 15px;
`;

export default HelpScreen;
