import React, { Children } from "react";
import { Image, View } from "react-native";
import styled from "styled-components";

type HandImageProps = {
  handString: string;
};

type handImagesType = {
  [key: string]: NodeRequire[]
  p: NodeRequire[]
  s: NodeRequire[]
  m: NodeRequire[]
  z: NodeRequire[]
}

const handImages: handImagesType = {
  p: [
    require('@assets/pai/1p.png'),
    require('@assets/pai/2p.png'),
    require('@assets/pai/3p.png'),
    require('@assets/pai/4p.png'),
    require('@assets/pai/5p.png'),
    require('@assets/pai/6p.png'),
    require('@assets/pai/7p.png'),
    require('@assets/pai/8p.png'),
    require('@assets/pai/9p.png'),
  ],
  s: [
    require('@assets/pai/1s.png'),
    require('@assets/pai/2s.png'),
    require('@assets/pai/3s.png'),
    require('@assets/pai/4s.png'),
    require('@assets/pai/5s.png'),
    require('@assets/pai/6s.png'),
    require('@assets/pai/7s.png'),
    require('@assets/pai/8s.png'),
    require('@assets/pai/9s.png'),
  ],
  m: [
    require('@assets/pai/1m.png'),
    require('@assets/pai/2m.png'),
    require('@assets/pai/3m.png'),
    require('@assets/pai/4m.png'),
    require('@assets/pai/5m.png'),
    require('@assets/pai/6m.png'),
    require('@assets/pai/7m.png'),
    require('@assets/pai/8m.png'),
    require('@assets/pai/9m.png'),
  ],
  z: [
    require('@assets/pai/1z.png'),
    require('@assets/pai/2z.png'),
    require('@assets/pai/3z.png'),
    require('@assets/pai/4z.png'),
    require('@assets/pai/5z.png'),
    require('@assets/pai/6z.png'),
    require('@assets/pai/7z.png'),
  ]
};

const handStringToImageArray = (hand: string): any[] => {
  const result: NodeRequire[] = [];
  let here: string = '';
  for (let i = 0; i < hand.length; ++i) {
    if (hand[i] == 'p' || hand[i] == 'm' || hand[i] == 's' || hand[i] == 'z') {
      for (let j = 0; j < here.length; ++j) {
        let pos = parseInt(here[j]) - 1;
        if (0 <= pos && pos < handImages[hand[i]].length) {
          result.push(handImages[hand[i]][pos]);
        }
      }
      here = '';
    }
    else {
      here += hand[i];
    }
  }
  return result;
}

/**
 * given string hand to mahjong image component
 * @property {string} handString - represent hand
 * @example 1p2p3p4z
*/
export const HandImage = ({ handString }: HandImageProps) => {
  const data = handStringToImageArray(handString);
  return <Main>
    {data.map((item, index) => {
      return <Hand source={item} key={index} />
    })}
  </Main>
}

const Hand = styled(Image)`
  width: 25px;
  height: 40px;
  margin-vertical: 15px;
`

const Main = styled(View)`
  flex-direction: row;
`