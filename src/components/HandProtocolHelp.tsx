import { Text } from "@ui-kitten/components";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";

/**
 * hand string procol help message component
 */
export const HandProtocolHelp = () => {
  return <View>
    <MarginText>
      패 입력 시 천봉 계산기와 같은 방법을 사용함
    </MarginText>
    <MarginText>
      p: 통수
    </MarginText>
    <MarginText>
      m: 만수
    </MarginText>
    <MarginText>
      s: 삭수
    </MarginText>
    <MarginText>
      z: 자패 (동남서북백발중을 각각 1~7의 숫자로)
    </MarginText>
    <MarginText>
      1p1p2p: 1통 1통 2통
    </MarginText>
    <MarginText>
      123p345m345s12z: 1통 2통 3통 3만 4만 5만 3삭 4삭 5삭 동 남
    </MarginText>
    <MarginText>
      234p56m, 2p3p4p5m6m, 324p65m, 23p56m4p 은 전부 동일
    </MarginText>
  </View>
}

const MarginText = styled(Text)`
  margin: 2px;
`