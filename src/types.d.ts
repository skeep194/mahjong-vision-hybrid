import {HandInformation} from './screens/InformationInputScreen';
import {RiichiResult} from '@skeep194/riichi-ts/dist/riichi';
import {RiichiMahjongInput} from './screens/RiichiMahjongInputScreen';

export type RootStackParamList = {
  Home: undefined;
  Help: undefined;
  RiichiMahjongInput: RiichiMahjongInput;
  InformationInput: HandInformation;
  Result: RiichiResult;
  ResultFail: undefined;
  Loading: undefined;
  Camera: undefined;
};
