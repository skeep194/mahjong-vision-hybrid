import React from 'react';
import {Image, View} from 'react-native';
import CameraHelpImg from '@assets/camera_help.png';

export const CameraHelp = () => {
  return (
    <View>
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
  );
};
