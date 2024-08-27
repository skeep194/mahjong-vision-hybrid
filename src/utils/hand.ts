export const toRiichiArray = (
  hand: string,
  maxLength?: number,
  acceptAka?: boolean,
): number[] => {
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
  const akaIndex: handType = {
    m: 34,
    p: 35,
    s: 36,
    z: 0,
  };
  const result: number[] = [];
  let here: string = '';
  for (let i = 0; i < hand.length; ++i) {
    if (hand[i] == 'p' || hand[i] == 'm' || hand[i] == 's' || hand[i] == 'z') {
      for (let j = 0; j < here.length; ++j) {
        const pos = parseInt(here[j]) - 1;
        if (0 <= pos && pos < handMaximum[hand[i]]) {
          result.push(pos + handOffset[hand[i]]);
        } else if (pos === -1 && hand[i] !== 'z') {
          result.push(acceptAka ? akaIndex[hand[i]] : 4 + handOffset[hand[i]]);
        }
      }
      here = '';
    } else {
      here += hand[i];
    }
  }
  return result.slice(0, maxLength);
};

export const countAka = (hand: number[]): number => {
  return hand.filter(value => 34 <= value && value <= 36).length;
};

/**
 * count total 5m, 5s, 5p
 * @param hand - RiichiArray of hand
 * @returns number - 3 bit number represents exist 5m, 5s, 5p
 * @example when 5s, 5p are exist, result is 011
 */
export const countFive = (hand: number[]): number => {
  let result = 0;
  hand.forEach((value: number) => {
    if (value === 4) {
      result |= 1 << 2;
    } else if (value === 13) {
      result |= 1 << 1;
    } else if (value === 22) {
      result |= 1 << 0;
    }
  });
  return result;
};
