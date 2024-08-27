import React, {Children} from 'react';
import {Image, View} from 'react-native';
import styled from 'styled-components';

type HandImageProps = {
  data: number[];
  ankkang?: boolean;
};

const handImages = [
  require('@assets/pai/1m.png'),
  require('@assets/pai/2m.png'),
  require('@assets/pai/3m.png'),
  require('@assets/pai/4m.png'),
  require('@assets/pai/5m.png'),
  require('@assets/pai/6m.png'),
  require('@assets/pai/7m.png'),
  require('@assets/pai/8m.png'),
  require('@assets/pai/9m.png'),
  require('@assets/pai/1p.png'),
  require('@assets/pai/2p.png'),
  require('@assets/pai/3p.png'),
  require('@assets/pai/4p.png'),
  require('@assets/pai/5p.png'),
  require('@assets/pai/6p.png'),
  require('@assets/pai/7p.png'),
  require('@assets/pai/8p.png'),
  require('@assets/pai/9p.png'),
  require('@assets/pai/1s.png'),
  require('@assets/pai/2s.png'),
  require('@assets/pai/3s.png'),
  require('@assets/pai/4s.png'),
  require('@assets/pai/5s.png'),
  require('@assets/pai/6s.png'),
  require('@assets/pai/7s.png'),
  require('@assets/pai/8s.png'),
  require('@assets/pai/9s.png'),
  require('@assets/pai/1z.png'),
  require('@assets/pai/2z.png'),
  require('@assets/pai/3z.png'),
  require('@assets/pai/4z.png'),
  require('@assets/pai/5z.png'),
  require('@assets/pai/6z.png'),
  require('@assets/pai/7z.png'),
  require('@assets/pai/0m.png'),
  require('@assets/pai/0p.png'),
  require('@assets/pai/0s.png'),
  require('@assets/pai/back.png'),
];

/**
 * given number array to mahjong image component
 * @property {number} data - represent hand(0-8 man, 9-17 pin, 18-26 sou, 27-33 honor 34-36 akadora)
 * @example [1, 2, 3, 4]
 */
export const HandImage = ({data, ankkang}: HandImageProps) => {
  if (ankkang && data.length === 4) {
    data[0] = handImages.length - 1;
    data[data.length - 1] = handImages.length - 1;
  }
  return (
    <Main>
      {data.map((item, index) => {
        return <Hand source={handImages[item]} key={index} />;
      })}
    </Main>
  );
};

const Hand = styled(Image)`
  width: 25px;
  height: 40px;
  margin-vertical: 15px;
`;

const Main = styled(View)`
  flex-direction: row;
`;
