import {HandInformation} from './screens/InformationInputScreen';
import {hairi} from 'riichi-ts/dist/shanten';

export type RootStackParamList = {
  Home: undefined;
  Help: undefined;
  RiichiMahjongInput: undefined;
  InformationInput: HandInformation;
  Result: RiichiResult;
  ResultFail: undefined;
  Loading: undefined;
};

export type RiichiResult = {
  isAgari: boolean;
  yakuman: number;
  yaku: Record<string, number>;
  han: number;
  fu: number;
  ten: number;
  name: string;
  text: string;
  error: boolean;
  hairi?: ReturnType<typeof hairi>;
  hairi7and13?: ReturnType<typeof hairi>;
};
