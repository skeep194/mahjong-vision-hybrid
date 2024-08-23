import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text} from '@ui-kitten/components';
import React from 'react';
import {
  Camera,
  Frame,
  FrameInternal,
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import {RootStackParamList} from 'src/types';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import {TensorflowModel, useTensorflowModel} from 'react-native-fast-tflite';
import Model from '../models/mahjong.tflite';
import {StyleSheet} from 'react-native';
import {
  AlphaType,
  ColorType,
  PaintStyle,
  Skia,
  useFont,
} from '@shopify/react-native-skia';
import {Rectangle, labels, nms} from 'src/utils/imageSplit';
import {
  ISharedValue,
  Worklets,
  useRunOnJS,
  useSharedValue,
  worklet,
} from 'react-native-worklets-core';
import Roboto from '../fonts/Roboto-Regular.ttf';
import {styled} from 'styled-components/native';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export const CameraScreen = ({navigation}: CameraScreenProps) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  if (!hasPermission) {
    requestPermission();
    return <></>;
  }

  const device = useCameraDevice('back');
  if (device == null) {
    return <Text>camera not found</Text>;
  }
  const format = useCameraFormat(device, [{videoResolution: 'max'}]);

  const {resize} = useResizePlugin();
  const trigger = useSharedValue(false);

  const objectDetection = useTensorflowModel(Model, 'android-gpu');
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  const goBack = useRunOnJS(
    result => {
      console.log(result);
      navigation.navigate('RiichiMahjongInput', result);
    },
    [navigation],
  );

  const detect = (frame: Frame) => {
    'worklet';
    if (model == null) {
      return [];
    }
    const resized = resize(frame, {
      scale: {
        width: 640,
        height: 640,
      },
      pixelFormat: 'rgb',
      dataType: 'float32',
      rotation: '0deg',
    });
    const outputs = model.runSync([resized])[0];
    const numDetections = 8400;
    let result = [];
    for (let i = 0; i < numDetections; i++) {
      const x = outputs[i] as number;
      const y = outputs[i + numDetections * 1] as number;
      const width = outputs[i + numDetections * 2] as number;
      const height = outputs[i + numDetections * 3] as number;
      for (let j = 4; j < 38; j++) {
        const confidence = outputs[i + numDetections * j] as number;
        if (confidence > 0.7) {
          result.push({
            x1: x,
            y1: y,
            x2: x + width,
            y2: y + height,
            confidence: confidence,
            classNum: j - 4,
          });
        }
      }
    }
    result = nms(result);
    return result;
  };

  const frameProcessor = useSkiaFrameProcessor(
    frame => {
      'worklet';
      frame.render();
      //draw split line
      const paint = Skia.Paint();
      paint.setColor(Skia.Color('red'));
      paint.setStrokeWidth(10);
      frame.drawLine(frame.width / 2, 0, frame.width / 2, frame.height, paint);

      if (trigger.value) {
        trigger.value = false;
        if (model == null) {
          return;
        }
        const result = detect(frame);
        console.log(result.length);
        // goBack(result);
      }
    },
    [model],
  );
  return (
    <>
      <Camera
        device={device}
        style={{flex: 1, width: '100%'}}
        isActive={true}
        frameProcessor={frameProcessor}
        format={format}
      />
      <TakeButton
        onPress={() => {
          trigger.value = true;
        }}
      />
    </>
  );
};

const TakeButton = styled(Button)`
  position: absolute;
  align-self: center;
  background-color: white;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border-color: gray;
  bottom: 30px;
`;
