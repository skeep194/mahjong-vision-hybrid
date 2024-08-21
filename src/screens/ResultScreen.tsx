import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Card, Divider, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {RootStackParamList} from 'src/types';
import ResultSuccessImg from '@assets/result_success.png';
import {Image, ScrollView, View} from 'react-native';
import {styled} from 'styled-components/native';
import {fu} from '@skeep194/riichi-ts/dist/fu';

type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

export const ResultScreen = ({route, navigation}: ResultScreenProps) => {
  const result = route.params;
  return (
    <Main>
      <ScrollView>
        <ResultImage source={ResultSuccessImg} />
        <View style={{alignItems: 'center'}}>
          <Text category="s1" status="info">
            {result.yakuman === 0
              ? `${result.han}판 ${result.fu}부`
              : `${result.yakuman}배 역만`}
          </Text>
          <Text category="s1" status="danger">
            {result.tenTsumo.length === 0
              ? result.ten
              : result.tenTsumo.length === 1
              ? result.tenTsumo[0] + ' ALL'
              : `${result.tenTsumo[0]}, ${result.tenTsumo[1]}`}
          </Text>
        </View>
        <TitleText category="h3">역</TitleText>
        {Object.entries(result.yaku).map((value: [string, number]) => {
          return (
            <DataCard
              fupan="pan"
              {...yakuData[value[0]]}
              score={value[1]}
              key={value[0]}
            />
          );
        })}
        <TitleText category="h3">부수</TitleText>
        {result.fuReason.map((value: fu, index: number) => {
          return (
            <DataCard
              fupan="fu"
              {...fuData[value.name]}
              score={value.score}
              key={index}
            />
          );
        })}
        <Button
          status="success"
          appearance="outline"
          onPress={() => {
            navigation.popToTop();
          }}>
          메인화면으로
        </Button>
      </ScrollView>
    </Main>
  );
};

const DataCard = ({description, name, score, fupan}: dataCardProps) => {
  return (
    <ExplainCard
      header={
        <View>
          <Text category="h6">{name}</Text>
          <Text category="s1">
            {score}
            {fupan === 'fu' ? '부' : '판'}
          </Text>
        </View>
      }>
      <Text>{description}</Text>
    </ExplainCard>
  );
};

interface dataCardProps {
  score: number;
  description: string;
  name: string;
  fupan: 'fu' | 'pan';
  yakuman?: boolean;
}

interface data {
  [key: string]: explain;
}

interface explain {
  description: string;
  name: string;
}

const yakuData: data = {
  menzentsumo: {
    name: '멘젠츠모',
    description: '멘젠 상태로 츠모화료',
  },
  riichi: {
    name: '리치',
    description: '멘젠이면서 텐파이가 되었을 때 리치 선언',
  },
  ippatsu: {
    name: '일발',
    description: '리치 선언 후 순정 1순 이내에 화료',
  },
  chankan: {
    name: '창깡',
    description: '다른 사람이 가깡한 패로 론화료',
  },
  rinshan: {
    name: '영상개화',
    description: '깡을 선언하고 영상패로 쯔모화료',
  },
  haitei: {
    name: '해저로월',
    description: '패산의 마지막 패로 쯔모화료',
  },
  houtei: {
    name: '하저로워',
    description: '마지막으로 패를 버리는 사람의 패로 론화료',
  },
  pinfu: {
    name: '핑후',
    description: '멘젠이면서 부수가 없는 형태로 화료',
  },
  tanyao: {
    name: '탕야오',
    description: '2~8의 수패만 가지고 화료',
  },
  iipeikou: {
    name: '이페코',
    description: '멘젠이면서 같은 종류 수패로 똑같은 슌쯔 1쌍을 포함한 화료',
  },
  'own wind east': {
    name: '자풍패(동)',
    description: '자신의 바람이 동이면서 동 커쯔 포함 화료',
  },
  'own wind south': {
    name: '자풍패(남)',
    description: '자신의 바람이 남이면서 남 커쯔 포함 화료',
  },
  'own wind west': {
    name: '자풍패(서)',
    description: '자신의 바람이 서이면서 서 커쯔 포함 화료',
  },
  'own wind north': {
    name: '자풍패(북)',
    description: '자신의 바람이 북이면서 북 커쯔 포함 화료',
  },
  'round wind east': {
    name: '장풍패(동)',
    description: '현재 장의 바람이 동이면서 동 커쯔 포함 화료',
  },
  'round wind south': {
    name: '장풍패(남)',
    description: '현재 장의 바람이 남이면서 남 커쯔 포함 화료',
  },
  'round wind west': {
    name: '장풍패(서)',
    description: '현재 장의 바람이 서이면서 서 커쯔 포함 화료',
  },
  'round wind north': {
    name: '장풍패(북)',
    description: '현재 장의 바람이 북이면서 북 커쯔 포함 화료',
  },
  haku: {
    name: '삼원패(백)',
    description: '백 커쯔 포함 화료',
  },
  hatsu: {
    name: '삼원패(발)',
    description: '발 커쯔 포함 화료',
  },
  chun: {
    name: '삼원패(중)',
    description: '중 커쯔 포함 화료',
  },
  'daburu riichi': {
    name: '더블 리치',
    description: '순정 1순에 리치 선언',
  },
  chiitoitsu: {
    name: '치또이츠',
    description: '또이츠 7개로 화료',
  },
  chanta: {
    name: '챤타',
    description: '머리와 커쯔 넷에 모두 요구패 포함',
  },
  ittsu: {
    name: '일기통관',
    description: '같은 종류의 수패로 123, 456, 789 슌쯔 포함',
  },
  sanshoku: {
    name: '삼색동순',
    description: '세 가지 수패로 똑같은 슌쯔',
  },
  'sanshoku doukou': {
    name: '삼색동각',
    description: '세 가지 수패로 똑같은 커쯔',
  },
  sankantsu: {
    name: '산깡쯔',
    description: '깡을 세 번 치고 화료',
  },
  toitoi: {
    name: '또이또이',
    description: '모든 몸통이 커쯔',
  },
  sanankou: {
    name: '산안커',
    description: '안커 3개 포함',
  },
  shosangen: {
    name: '소삼원',
    description:
      '삼원패(백발중) 중 두 종류를 커쯔로 사용하고 하나를 머리로 사용',
  },
  honroutou: {
    name: '혼노두',
    description: '머리와 커쯔 넷을 모두 요구패로 완성',
  },
  ryanpeikou: {
    name: '량페코',
    description: '멘젠이면서 같은 종류 수패로 똑같은 슌쯔 2쌍을 포함한 화료',
  },
  junchan: {
    name: '준챤타',
    description: '모든 몸통과 머리에 노두패(1, 9)가 하나이상 포함',
  },
  honitsu: {
    name: '혼일색',
    description: '한 가지 종류의 수패와 자패만으로 화료',
  },
  chinitsu: {
    name: '청일색',
    description: '한 가지 종류의 수패만으로 화료',
  },
  renhou: {
    name: '인화',
    description: '순정 1순에 론화료',
  },
  tenhou: {
    name: '천화',
    description: '자신이 친일 때 처음부터 화료 형태가 완성된 경우',
  },
  chihou: {
    name: '지화',
    description: '자신이 자일 때 순정 1순에 쯔모화료',
  },
  daisangen: {
    name: '대삼원',
    description: '삼원패(백발중) 모두를 커쯔로 포함 화료',
  },
  suuankou: {
    name: '스안커',
    description: '안커 4개 포함 화료',
  },
  'suuankou tanki': {
    name: '스안커 단기',
    description: '안커 4개 포함 후 단기대기로 화료',
  },
  tsuuiisou: {
    name: '자일색',
    description: '자패만 사용해서 화료',
  },
  ryuuiisou: {
    name: '녹일색',
    description: '2삭, 3삭, 4삭, 6삭, 8삭, 발만 포함하여 화료',
  },
  chinroutou: {
    name: '청노두',
    description: '모든 패가 노두패(1, 9)만으로 이루어진 경우',
  },
  chuurenpoto: {
    name: '구련보등',
    description:
      '멘젠 상태일 때 한 가지 종류의 수패로 1112345678999 + 같은 종류 수패 아무거나 한장으로 화료',
  },
  'chuurenpoto 9 sides': {
    name: '순정구련보등',
    description:
      '멘젠 상태일 때 한 가지 종류의 수패로 1112345678999를 만들고 같은 종류 수패 아무거나 한장이 화료패인 경우',
  },
  kokushimusou: {
    name: '국사무쌍',
    description:
      '모든 수패의 노두패와 모든 자패를 모으고 해당 패 중 아무거나 하나를 더 모아서 화료',
  },
  'kokushimusou 13 sides': {
    name: '국사무쌍 13면대기',
    description: '모든 수패의 노두패와 모든 자패를 모으고 13면대기로 화료',
  },
  daisuushi: {
    name: '대사희',
    description: '바람패 네 가지를 모드 커쯔나 깡쯔로 가지고 화료',
  },
  shosuushi: {
    name: '소사희',
    description:
      '바람패 네 가지중 세 가지를 커쯔나 깡쯔로 가지고 한 가지를 머리로 가지고 화료',
  },
  suukantsu: {
    name: '스깡쯔',
    description: '깡을 네 번 치고 화료',
  },
  dora: {
    name: '도라',
    description: '도라표지패의 다음 패를 보유',
  },
  uradora: {
    name: '뒷도라',
    description: '리치 후 화료시 도라표지패 뒤를 봐서 뒷도라표지패로 사용',
  },
  akadora: {
    name: '아카도라',
    description: '적 5통, 적 5삭, 적 5만이 있을 시 각각 1판',
  },
};

const fuData: data = {
  base: {
    name: '부저',
    description: '기본 형태 화료일 시 주어지는 기본 부수',
  },
  kokushimusou: {
    name: '국사무쌍',
    description: '국싸무상 형태 화료',
  },
  chiitoitsu: {
    name: '치또이츠',
    description: '치또이츠 형태 화료일 시 25부 고정',
  },
  'pair wait': {
    name: '단기 대기',
    description:
      '머리 하나가 부족한 형태에서 나머지 한 장의 머리를 대기패료 화료',
  },
  'edge wait': {
    name: '변짱 대기',
    description: '1 2 혹은 8 9 형태에서 나머지 한 장으로 슌쯔를 완성하는 대기',
  },
  'closed wait': {
    name: '간짱 대기',
    description: '2 4 처럼 슌쯔 중간에 하나가 빈 형태의 대기',
  },
  tsumo: {
    name: '쯔모',
    description: '쯔모 화료 시 주어지는 부수',
  },
  'menzen ron': {
    name: '멘젠 론',
    description: '멘젠 상태로 론 화료 시 주어지는 부수',
  },
  'open triplet simple': {
    name: '중장패 밍커',
    description: '중장패 커쯔를 퐁으로 완성',
  },
  'open triplet non simple': {
    name: '요구패 밍커',
    description: '요구패 커쯔를 퐁으로 완성',
  },
  'closed triplet simple': {
    name: '중장패 안커',
    description: '중장패 커쯔를 후로하지 않고 완성',
  },
  'closed triplet non simple': {
    name: '요구패 안커',
    description: '요구패 커쯔를 후로하지 않고 완성',
  },
  'open kan simple': {
    name: '중장패 대명, 소명깡',
    description: '중장패를 대명깡 혹은 소명깡으로 완성',
  },
  'open kan non simple': {
    name: '요구패 대명, 소명깡',
    description: '요구패를 대명깡 혹은 소명깡으로 완성',
  },
  'closed kan simple': {
    name: '중장패 안깡',
    description: '중장패를 후로하지 않고 같은 종류 4개를 모아 안깡',
  },
  'closed kan non simple': {
    name: '요구패 안깡',
    description: '요구패를 후로하지 않고 같은 종류 4개를 모아 안깡',
  },
  'yakuhai pair': {
    name: '역패 머리',
    description:
      '3개 모으면 역이 되는 패(삼원패, 자풍패, 장풍패)를 머리로 완성',
  },
};

const Main = styled(Layout)`
  height: 100%;
  padding: 15px;
`;

const ResultImage = styled.Image`
  padding: 10px;
  width: 50%;
  max-height: 200px;
  align-self: center;
`;

const ExplainCard = styled(Card)`
  margin-bottom: 10px;
`;

const TitleText = styled(Text)`
  margin-vertical: 10px;
`;
