import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Icon, Text} from '@ui-kitten/components';
import React from 'react';
import {
  Camera,
  DrawableFrame,
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
  BorderTypes,
  DataTypes,
  ObjectType,
  OpenCV,
} from 'react-native-fast-opencv';
import {runOnJS} from 'react-native-reanimated';
import {Clipboard} from 'react-native';

type CameraScreenProps = NativeStackScreenProps<RootStackParamList, 'Camera'>;

export const CameraScreen = ({navigation}: CameraScreenProps) => {
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

  const {resize} = useResizePlugin();
  const trigger = useSharedValue(false);

  const objectDetection = useTensorflowModel(Model, 'android-gpu');
  const model =
    objectDetection.state === 'loaded' ? objectDetection.model : undefined;

  const allDetections: ISharedValue<Rectangle[]> = useSharedValue([]);

  const goBack = (result: Rectangle[]) => {
    navigation.navigate('RiichiMahjongInput', convertInputData(result));
  };
  const detect = (frame: DrawableFrame) => {
    'worklet';
    if (model == null) {
      return [];
    }

    const height = (frame.height / frame.width) * 640;
    const width = 640;

    const resized = resize(frame, {
      scale: {
        width: width,
        height: height,
      },
      pixelFormat: 'bgr',
      dataType: 'uint8',
      rotation: '0deg',
    });
    const mat = OpenCV.frameBufferToMat(height, width, resized);
    const mat2 = OpenCV.createObject(
      ObjectType.Mat,
      width,
      width,
      DataTypes.CV_8U,
    );
    OpenCV.invoke(
      'copyMakeBorder',
      mat,
      mat2,
      0,
      width - height,
      0,
      0,
      BorderTypes.BORDER_CONSTANT,
      OpenCV.createObject(ObjectType.Scalar, 255),
    );

    const b = OpenCV.toJSValue(mat2).base64;
    console.log(b);

    const m = Float32Array.from(
      OpenCV.matToBuffer(mat2, 'uint8').buffer,
      data => data / 255,
    );
    // const data = Skia.Data.fromBytes(OpenCV.matToBuffer(mat2, 'uint8').buffer);

    const outputs = model.runSync([m])[0];
    const numDetections = 8400;
    let result: Rectangle[] = [];
    for (let i = 0; i < numDetections; i++) {
      const x = outputs[i] as number;
      const y = outputs[i + numDetections * 1] as number;
      const width = outputs[i + numDetections * 2] as number;
      const height = outputs[i + numDetections * 3] as number;
      for (let j = 4; j < 42; j++) {
        const confidence = outputs[i + numDetections * j] as number;
        if (confidence > 0.7) {
          result.push({
            x1: x,
            y1: y,
            x2: x + width,
            y2: y + height,
            confidence: confidence,
            handNum: j - 4,
          });
        }
      }
    }
    result = convertDisplay(nms(result));
    console.log(result);
    OpenCV.clearBuffers();
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

      allDetections.value.forEach(value => {
        const rect = Skia.XYWHRect(
          value.x1 * frame.width,
          value.y1 * frame.width,
          (value.x2 - value.x1) * frame.width,
          (value.y2 - value.y1) * frame.width,
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
            value.x1 * frame.width,
            value.y1 * frame.width,
            fontPaint,
            font,
          );
        }
      });

      if (trigger.value) {
        trigger.value = false;
        if (model == null) {
          return;
        }
        allDetections.value = detect(frame);
      }
    },
    [model, allDetections, trigger, font],
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
      <CameraHelp />
    </>
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
