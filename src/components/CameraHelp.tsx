import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';
import CameraHelpImg from '@assets/camera_help.png';
import {Button, CheckBox} from '@ui-kitten/components';
import {styled} from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CameraHelp = () => {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    const check = async () => {
      const value = await AsyncStorage.getItem('cameraHep');
      if (value == null && !visible) {
        setVisible(true);
      }
    };
    check();
  }, []);
  if (!visible) {
    return <></>;
  }
  return (
    <>
      <View
        style={{
          position: 'absolute',
          top: '25%',
        }}>
        <Image
          source={CameraHelpImg}
          style={{
            width: '100%',
            height: undefined,
            aspectRatio: 1,
            resizeMode: 'center',
          }}
        />
      </View>
      <CameraHelpClose>
        <CheckBox
          checked={checked}
          onChange={() => {
            setChecked(!checked);
          }}>
          <View>
            <Text style={{color: 'white'}}>다음번엔 도움말 보지 않기</Text>
          </View>
        </CheckBox>
        <Button
          onPress={() => {
            if (checked) {
              AsyncStorage.setItem('cameraHelp', 'true');
            }
            setVisible(false);
          }}>
          도움말 닫기
        </Button>
      </CameraHelpClose>
    </>
  );
};

const CameraHelpClose = styled.View`
  background-color: rgba(178, 190, 181, 0.5);
  position: absolute;
  align-self: center;
  top: 20px;
`;
