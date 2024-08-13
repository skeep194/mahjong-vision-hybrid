import {HandInformation} from './screens/InformationInputScreen';
import {RiichiResult} from '@skeep194/riichi-ts/dist/riichi';

export type RootStackParamList = {
  Home: undefined;
  Help: undefined;
  RiichiMahjongInput: undefined;
  InformationInput: HandInformation;
  Result: RiichiResult;
  ResultFail: undefined;
  Loading: undefined;
};
