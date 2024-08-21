import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text} from '@ui-kitten/components';
import React from 'react';
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';
import {RootStackParamList} from 'src/types';
import {useResizePlugin} from 'vision-camera-resize-plugin';
import {useTensorflowModel} from 'react-native-fast-tflite';
import Model from '../models/mahjong.tflite';
import {StyleSheet} from 'react-native';
import {PaintStyle, Skia, useFont} from '@shopify/react-native-skia';
import {Rectangle, labels, nms} from 'src/utils/imageSplit';
import {ISharedValue, useSharedValue} from 'react-native-worklets-core';
import Roboto from '../fonts/Roboto-Regular.ttf';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export const CameraScreen = () => {
  const {hasPermission, requestPermission} = useCameraPermission();
  if (!hasPermission) {
    requestPermission();
    return <></>;
  }

  const font = useFont(Roboto, 36, err => {
    console.log(err);
  });

  const device = useCameraDevice('back');
  if (device == null) {
    return <Text>camera not found</Text>;
  }
  const format = useCameraFormat(device, [{videoResolution: 'max'}]);

  const objectDetection = useTensorflowModel(Model, 'android-gpu');
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  const {resize} = useResizePlugin();
  let allDetections: ISharedValue<Rectangle[]> = useSharedValue([]);

  const frameProcessor = useSkiaFrameProcessor(
    frame => {
      'worklet';
      frame.render();

      //draw split line
      const paint = Skia.Paint();
      paint.setColor(Skia.Color('red'));
      paint.setStrokeWidth(10);

      frame.drawLine(frame.width / 2, 0, frame.width / 2, frame.height, paint);
      //draw detected objects
      allDetections.value.forEach(value => {
        const rect = Skia.XYWHRect(
          value.x1 * frame.height + (frame.width - frame.height) / 2,
          value.y1 * frame.height,
          (value.x2 - value.x1) * frame.height,
          (value.y2 - value.y1) * frame.height,
        );
        const rectPaint = Skia.Paint();
        rectPaint.setColor(Skia.Color('red'));
        rectPaint.setStrokeWidth(3);
        rectPaint.setStyle(PaintStyle.Stroke);
        frame.drawRect(rect, rectPaint);

        if (font != null) {
          // console.log('ok');
          frame.drawText(
            labels[value.classNum!],
            value.x1 * frame.height + (frame.width - frame.height) / 2,
            value.y1 * frame.height,
            Skia.Paint(),
            font,
          );
        }
      });

      if (model == null) return;
      // TODO: change to async
      runAtTargetFps(1, () => {
        'worklet';
        const resized = resize(frame, {
          scale: {
            width: 640,
            height: 640,
          },
          pixelFormat: 'rgb',
          dataType: 'float32',
        });

        const outputs = model.runSync([resized])[0];
        const numDetections = 8400;
        allDetections.value = [];

        for (let i = 0; i < numDetections; i++) {
          const x = outputs[i] as number;
          const y = outputs[i + numDetections * 1] as number;
          const width = outputs[i + numDetections * 2] as number;
          const height = outputs[i + numDetections * 3] as number;
          for (let j = 4; j < 38; j++) {
            const confidence = outputs[i + numDetections * j] as number;
            if (confidence > 0.7) {
              allDetections.value.push({
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
        allDetections.value = nms(allDetections.value);
      });
    },
    [model, allDetections],
  );
  return (
    <Camera
      device={device}
      style={{flex: 1, width: '100%'}}
      isActive={true}
      frameProcessor={frameProcessor}
      format={format}
    />
  );
};
