import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
} from '@ui-kitten/components';
import React, {useState} from 'react';
import {FadeInView} from 'src/components/FadeinView';
import {HandImage} from 'src/components/HandImage';
import {HandProtocolHelp} from 'src/components/HandProtocolHelp';
import {RootStackParamList} from 'src/types';
import styled from 'styled-components/native';

type RiichiMahjongInputScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RiichiMahjongInput'
>;

const PictureIcon = (props: any): IconElement => (
  <Icon {...props} name="image-outline" />
);

export const RiichiMahjongInputScreen = ({
  navigation,
  route,
}: RiichiMahjongInputScreenProps) => {
  const [handString, handUpdate] = useState<string>('');
  const [inputLevel, inputLevelUpdate] = useState<number>(0);
  const [handInformations, handInformationsUpdate] = useState<string[]>([]);
  const NextButton = () => (
    <MarginButton
      status="info"
      appearance="outline"
      onPress={() => {
        inputLevelUpdate(inputLevel + 1);
        handInformations.push(handString);
        handInformationsUpdate(handInformations);
        handUpdate('');
      }}>
      다음
    </MarginButton>
  );
  const CompleteButton = () => (
    <MarginButton
      status="success"
      onPress={() => {
        handInformations.push(handString);
        handInformationsUpdate(handInformations);
        console.log('need api call implement');
        console.log(`hand informations: ${handInformations}`);
        navigation.navigate('Loading');
      }}>
      완료
    </MarginButton>
  );
  const changeUpdte = (text: string) => {
    handUpdate(text);
  };

  return (
    <Main>
      <MarginInput
        disabled={inputLevel > 0}
        placeholder="손패 (후로 제외)"
        onChangeText={changeUpdte}
      />
      {inputLevel >= 1 && (
        <FadeInView style={{}}>
          <MarginInput
            placeholder="후로패"
            disabled={inputLevel > 1}
            onChangeText={changeUpdte}
          />
        </FadeInView>
      )}
      {inputLevel >= 2 && (
        <FadeInView style={{}}>
          <MarginInput
            placeholder="도라표지패"
            disabled={inputLevel > 2}
            onChangeText={changeUpdte}
          />
        </FadeInView>
      )}
      {inputLevel >= 3 && (
        <FadeInView style={{}}>
          <MarginInput
            placeholder="화료패(론, 쯔모 선언패)"
            disabled={inputLevel > 3}
            onChangeText={changeUpdte}
          />
        </FadeInView>
      )}
      <HandImage handString={handString} />
      <MarginButton status="basic" accessoryLeft={PictureIcon}>
        사진으로 입력
      </MarginButton>
      {inputLevel === 3 ? <CompleteButton /> : <NextButton />}
      {inputLevel >= 1 && (
        <MarginButton
          status="danger"
          appearance="outline"
          onPress={() => {
            inputLevelUpdate(inputLevel - 1);
            handUpdate(handInformations[handInformations.length - 1]);
            handInformations.pop();
            handInformationsUpdate(handInformations);
          }}>
          이전
        </MarginButton>
      )}
      <HandProtocolHelp />
    </Main>
  );
};

const Main = styled(Layout)`
  padding: 20px;
  height: 100%;
`;
const MarginButton = styled(Button)`
  padding: 5px;
  margin-top: 10px;
`;
const MarginInput = styled(Input)`
  margin-top: 10px;
`;
