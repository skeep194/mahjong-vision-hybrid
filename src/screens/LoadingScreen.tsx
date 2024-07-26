import React from 'react';
import {Image} from 'react-native';
import LoadingImg from '@assets/loading.png';
import {Layout, Text} from '@ui-kitten/components';
import {styled} from 'styled-components';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

const LoadingScreen = () => {
  const loadingTip: string[] = [
    '뭘 버릴지 모르겠으면 도라를 버리자',
    '일단 사람 4명을 모으자',
    '중을 버릴때는 중빔으로 대면을 쏴버리자',
    '서는 사람을 찢어',
    '이 게임은 실력게임이 아니다',
    '동서남북이라고 말하는 사람을 의심하자',
    '화료 못한 18000점보다 화료한 1000점이 낫다',
    '지가못해노코노코패산탓탓',
  ];
  return (
    <Main>
      <Image source={LoadingImg}></Image>
      <Text category="h6">{`Tip: ${
        loadingTip[getRandomInt(loadingTip.length)]
      }`}</Text>
    </Main>
  );
};

const Main = styled(Layout)`
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export default LoadingScreen;
