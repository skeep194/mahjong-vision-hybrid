import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Icon, Text} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {
  Camera,
  Frame,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import {RootStackParamList} from 'src/types';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import {useTensorflowModel} from 'react-native-fast-tflite';
import Model from '../models/mahjong.tflite';
import {PaintStyle, Skia, useFont} from '@shopify/react-native-skia';
import {
  convertDisplay,
  Rectangle,
  labels,
  nms,
  convertInputData,
} from 'src/utils/imageSplit';
import {ISharedValue, useSharedValue} from 'react-native-worklets-core';
import Roboto from '../fonts/Roboto-Regular.ttf';
import {styled} from 'styled-components/native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {CameraHelp} from 'src/components/CameraHelp';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackComponent,
  View,
} from 'react-native';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export const CameraScreen = ({navigation}: CameraScreenProps) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  useEffect(() => {
    if (!hasPermission) {
      const getPermission = async () => {
        if (!(await requestPermission())) {
          Toast.show({
            type: 'error',
            text1: '카메라 권한이 필요합니다.',
          });
          navigation.goBack();
        }
      };
      getPermission();
    }
  }, []);

  const font = useFont(Roboto, 36, err => {
    console.log(err);
  });

  const device = useCameraDevice('back');
  if (device == null) {
    return <Text>camera not found</Text>;
  }
  const format = useCameraFormat(device, []);

  const {resize} = useResizePlugin();
  const trigger = useSharedValue(false);

  const objectDetection = useTensorflowModel(Model, 'android-gpu');
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  const allDetections: ISharedValue<Rectangle[]> = useSharedValue([]);
  const splitTrigger = useSharedValue(false);

  const goBack = (result: Rectangle[]) => {
    navigation.navigate('RiichiMahjongInput', convertInputData(result));
  };
  const detect = (frame: Frame) => {
    'worklet';
    if (model == null) {
      return [];
    }
    const length = Math.min(frame.height, frame.width);
    const result = [];
    for (
      let pos = 0;
      pos < Math.max(frame.height, frame.width);
      pos += length / 2
    ) {
      const resized = resize(frame, {
        scale: {
          width: 640,
          height: 640,
        },
        crop: {
          x: frame.height < frame.width ? pos : 0,
          y: frame.height < frame.width ? 0 : pos,
          width: length,
          height: length,
        },
        pixelFormat: 'rgb',
        dataType: 'float32',
        rotation: '0deg',
      });
      const outputs = model.runSync([resized])[0];
      const numDetections = 8400;
      let here: Rectangle[] = [];
      for (let i = 0; i < numDetections; i++) {
        const x = outputs[i] as number;
        const y = outputs[i + numDetections * 1] as number;
        const width = outputs[i + numDetections * 2] as number;
        const height = outputs[i + numDetections * 3] as number;
        for (let j = 4; j < 42; j++) {
          const confidence = outputs[i + numDetections * j] as number;
          if (confidence > 0.7) {
            here.push({
              x1: x * length + pos,
              y1: y * length,
              x2: (x + width) * length + pos,
              y2: (y + height) * length,
              confidence: confidence,
              handNum: j - 4,
            });
          }
        }
      }
      result.push(...nms(here));
    }
    return nms(result);
  };

  const splitPosition = useSharedValue<{x: number; y: number} | null>(null);

  const frameProcessor = useSkiaFrameProcessor(
    frame => {
      'worklet';
      frame.render();
      //draw split line
      if (splitPosition.value != null) {
        const paint = Skia.Paint();
        paint.setColor(Skia.Color('#87CEEB'));
        paint.setStrokeWidth(10);
        frame.drawLine(
          splitPosition.value.x * frame.width,
          frame.height - splitPosition.value.y * frame.height,
          splitPosition.value.x * frame.width,
          frame.height,
          paint,
        );
        frame.drawLine(
          0,
          frame.height - splitPosition.value.y * frame.height,
          frame.width,
          frame.height - splitPosition.value.y * frame.height,
          paint,
        );
      }

      allDetections.value.forEach(value => {
        const rect = Skia.XYWHRect(
          value.x1,
          value.y1,
          value.x2 - value.x1,
          value.y2 - value.y1,
        );
        const rectPaint = Skia.Paint();
        const color = {
          dora: Skia.Color('red'),
          huro: Skia.Color('green'),
          hand: Skia.Color('blue'),
          agari: Skia.Color('white'),
        };
        if (value.label) {
          rectPaint.setColor(color[value.label]);
        }
        rectPaint.setStrokeWidth(3);
        rectPaint.setStyle(PaintStyle.Stroke);
        frame.drawRect(rect, rectPaint);

        if (font != null) {
          const fontPaint = Skia.Paint();
          frame.drawText(
            labels[value.handNum!],
            value.x1,
            value.y1,
            fontPaint,
            font,
          );
        }
      });

      if (splitTrigger.value) {
        splitTrigger.value = false;
        if (splitPosition.value != null) {
          allDetections.value = convertDisplay(allDetections.value, {
            x: splitPosition.value.x * frame.width,
            y: frame.height - splitPosition.value.y * frame.height,
          });
        }
      }

      if (trigger.value) {
        trigger.value = false;
        if (model == null) {
          return;
        }
        allDetections.value = detect(frame);
      }
    },
    [model, font],
  );
  return !hasPermission ? null : (
    <TouchableOpacity
      activeOpacity={1}
      onPress={event => {
        // NEED VERIFY: should test vary circumstance(android, iPhone, not galaxy ...)
        splitPosition.value = {
          y: event.nativeEvent.pageY / Dimensions.get('screen').height,
          x: event.nativeEvent.pageX / Dimensions.get('screen').width,
        };
        splitTrigger.value = true;
      }}>
      <Camera
        device={device}
        style={{width: '100%', height: '100%'}}
        isActive={true}
        frameProcessor={frameProcessor}
        format={format}
      />
      {/* <CameraHelp /> */}
      <ButtonView>
        <TakeButton
          accessoryLeft={<Icon name="eye-outline" />}
          onPress={() => {
            trigger.value = true;
          }}
        />
        <TakeButton
          accessoryLeft={<Icon name="checkmark-outline" />}
          onPress={() => {
            try {
              goBack(allDetections.value);
            } catch (e) {
              Toast.show({text1: String(e), type: 'error'});
            }
          }}
        />
      </ButtonView>
    </TouchableOpacity>
  );
};

const ButtonView = styled.View`
  position: absolute;
  bottom: 30px;
  align-self: center;
  flex-direction: row;
`;

const TakeButton = styled(Button)`
  background-color: black;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border-color: white;
  bottom: 30px;
  margin-horizontal: 10px;
`;
