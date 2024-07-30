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
import {Alert, ScrollView, View} from 'react-native';
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

const MinusIcon = (props: any): IconElement => (
  <Icon {...props} name="minus-circle-outline" />
);

export const RiichiMahjongInputScreen = ({
  navigation,
  route,
}: RiichiMahjongInputScreenProps) => {
  const [hand, handUpdate] = useState<string>('');
  const [huro, huroUpdate] = useState<string[][]>([]);
  const [dora, doraUpdate] = useState<string>('');
  const [agari, agariUpdate] = useState<string>('');
  const [inputLevel, inputLevelUpdate] = useState<number>(0);
  const NextButton = () => (
    <MarginButton
      status="info"
      appearance="outline"
      onPress={() => {
        inputLevelUpdate(inputLevel + 1);
      }}>
      다음
    </MarginButton>
  );
  const CompleteButton = () => (
    <MarginButton
      status="success"
      onPress={() => {
        navigation.navigate('InformationInput');
      }}>
      완료
    </MarginButton>
  );

  return (
    <Main>
      <ScrollView>
        <HandView>
          <Text>손패 (후로, 오름패 제외)</Text>
          <MarginInput
            placeholder="ex) 1112345678999p"
            onChangeText={(text: string) => {
              handUpdate(text);
            }}
          />
        </HandView>
        <HandImage handString={hand} />
        {inputLevel >= 1 && (
          <HandView>
            <Text>후로패</Text>
            {huro.map((value: string[], index: number) => (
              <View key={value[1]}>
                <FadeInView
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <HuroInput
                    placeholder="치퐁깡당 하나씩만, 안깡은 맨앞에 -"
                    onChangeText={(text: string) => {
                      huro[index][0] = text;
                      huroUpdate([...huro]);
                    }}
                  />
                  <HuroDeleteButton
                    status="danger"
                    appearance="ghost"
                    accessoryLeft={MinusIcon}
                    onPress={() => {
                      huro.splice(index, 1);
                      huroUpdate([...huro]);
                    }}
                  />
                </FadeInView>
                <HandImage handString={value[0]} />
              </View>
            ))}
          </HandView>
        )}
        {inputLevel >= 1 && (
          <MarginButton
            status="warning"
            appearance="outline"
            onPress={() => {
              huro.push(['', crypto.randomUUID()]);
              huroUpdate([...huro]);
            }}>
            후로패 추가
          </MarginButton>
        )}
        {inputLevel >= 2 && (
          <HandView>
            <Text>도라표지패</Text>
            <FadeInView style={{}}>
              <MarginInput
                placeholder="아카도라는 다음 화면에서 입력"
                onChangeText={(text: string) => {
                  doraUpdate(text);
                }}
              />
            </FadeInView>
            <HandImage handString={dora} />
          </HandView>
        )}
        {inputLevel >= 3 && (
          <HandView>
            <Text>화료패</Text>
            <FadeInView style={{}}>
              <MarginInput
                placeholder="론, 쯔모 선언패"
                onChangeText={(text: string) => {
                  agariUpdate(text);
                }}
              />
            </FadeInView>
            <HandImage handString={agari} />
          </HandView>
        )}
        {inputLevel === 3 ? <CompleteButton /> : <NextButton />}
        {inputLevel >= 1 && (
          <MarginButton
            status="danger"
            appearance="outline"
            onPress={() => {
              switch (inputLevel) {
                case 1:
                  huroUpdate([]);
                  break;
                case 2:
                  doraUpdate('');
                  break;
                case 3:
                  agariUpdate('');
                  break;
                default:
                  //TODO: change it to toast
                  console.log('invalid button level');
              }
              inputLevelUpdate(inputLevel - 1);
            }}>
            이전
          </MarginButton>
        )}
        <MarginButton status="basic" accessoryLeft={PictureIcon}>
          사진으로 입력
        </MarginButton>
        <HandProtocolHelp />
      </ScrollView>
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

const HandView = styled.View`
  padding-top: 10px;
`;

const HuroDeleteButton = styled(Button)`
  margin-top: 3px;
  flex: 1;
`;

const HuroInput = styled(MarginInput)`
  margin-top: 3px;
  flex: 9;
`;
