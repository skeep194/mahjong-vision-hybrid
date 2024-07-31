export const toRiichiArray = (hand: string, maxLength?: number): number[] => {
  type handType = {
    [key: string]: number;
    p: number;
    m: number;
    s: number;
    z: number;
  };
  const handMaximum: handType = {
    p: 9,
    m: 9,
    s: 9,
    z: 7,
  };
  const handOffset: handType = {
    m: 0,
    p: 9,
    s: 18,
    z: 27,
  };
  const result: number[] = [];
  let here: string = '';
  for (let i = 0; i < hand.length; ++i) {
    if (hand[i] == 'p' || hand[i] == 'm' || hand[i] == 's' || hand[i] == 'z') {
      for (let j = 0; j < here.length; ++j) {
        let pos = parseInt(here[j]) - 1;
        if (0 <= pos && pos < handMaximum[hand[i]]) {
          result.push(pos + handOffset[hand[i]]);
        }
      }
      here = '';
    } else {
      here += hand[i];
    }
  }
  return result.slice(0, maxLength);
};
