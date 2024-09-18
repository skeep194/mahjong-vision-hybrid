import {
  HuroWithUUID,
  RiichiMahjongInput,
} from 'src/screens/RiichiMahjongInputScreen';

export interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence?: number;
  handNum?: number;
  label?: 'dora' | 'hand' | 'agari' | 'huro';
}

const area = ({x1, x2, y1, y2}: Rectangle): number => {
  'worklet';
  return (x2 - x1) * (y2 - y1);
};

/**
 * apply nms algorithm to detected objects
 */
export const nms = (
  rectangles: Rectangle[],
  confidenceThreshold: number = 0.7,
  IOUThreshold: number = 0.5,
): Rectangle[] => {
  'worklet';
  let disabled: boolean[] = new Array(rectangles.length).fill(false);
  for (let i = 0; i < rectangles.length; i++) {
    if (disabled[i]) continue;
    for (let j = i + 1; j < rectangles.length; j++) {
      const intersect: Rectangle = {
        x1: Math.max(rectangles[i].x1, rectangles[j].x1),
        x2: Math.min(rectangles[i].x2, rectangles[j].x2),
        y1: Math.max(rectangles[i].y1, rectangles[j].y1),
        y2: Math.min(rectangles[i].y2, rectangles[j].y2),
      };
      if (intersect.x1 > intersect.x2 || intersect.y1 > intersect.y2) {
        continue;
      }
      const a2 = area(intersect);
      const a1 = area(rectangles[i]) + area(rectangles[j]) - a2;
      if (a1 * IOUThreshold <= a2) {
        if (rectangles[i].confidence! < rectangles[j].confidence!) {
          disabled[i] = true;
          break;
        } else {
          disabled[j] = true;
        }
      }
    }
  }
  return rectangles.filter((value: Rectangle, index: number) => {
    return !disabled[index] && value.confidence! > confidenceThreshold;
  });
};

export const convertDisplay = (
  rectangles: Rectangle[],
  position: {x: number; y: number},
): Rectangle[] => {
  'worklet';
  const midX = (rectangle: Rectangle) => {
    return (rectangle.x1 + rectangle.x2) / 2;
  };
  rectangles = Array.from(rectangles).sort((a, b) => {
    const ax = midX(a);
    const bx = midX(b);
    return bx - ax;
  });
  let findHand = false;

  return rectangles.map(value => {
    const x = (value.x1 + value.x2) / 2;
    const y = (value.y1 + value.y2) / 2;
    if (y < position.y) {
      value.label = 'dora';
    } else {
      if (x < position.x) {
        if (findHand) {
          value.label = 'hand';
        } else {
          findHand = true;
          value.label = 'agari';
        }
      } else {
        value.label = 'huro';
      }
    }
    return value;
  });
};

export const convertInputData = (
  rectangles: Rectangle[],
): RiichiMahjongInput => {
  rectangles = [...rectangles].reverse();
  const result: RiichiMahjongInput = {
    hand: '',
    huro: [],
    dora: '',
    agari: '',
    inputLevel: 3,
  };
  result.hand = rectanglesToHand(
    rectangles.filter(value => {
      return value.label === 'hand';
    }),
  );
  result.dora = rectanglesToHand(
    rectangles.filter(value => {
      return value.label === 'dora';
    }),
  );
  result.agari = rectanglesToHand(
    rectangles.filter(value => {
      return value.label === 'agari';
    }),
  );
  const handLength = result.hand.length / 2;
  if ((13 - handLength) % 3 !== 0) {
    throw '후로패 개수가 올바르지 않습니다.';
  }
  const huroSize = (13 - handLength) / 3;
  result.huro = huroSplit(
    rectangles.filter(value => {
      return value.label === 'huro';
    }),
    huroSize,
  );
  return result;
};

const rectanglesToHand = (rectangles: Rectangle[]): string => {
  let result = '';
  rectangles.forEach(value => {
    if (value.handNum != null) {
      result += labels[value.handNum];
    }
  });
  return result;
};

const huroSplit = (huros: Rectangle[], size: number): HuroWithUUID[] => {
  const result: HuroWithUUID[] = [];
  const isValidChi = (values: string[]): boolean => {
    values.sort();
    return (
      values[0][1] === values[1][1] &&
      values[1][1] === values[2][1] &&
      parseInt(values[0][0]) + 1 === parseInt(values[1][0]) &&
      parseInt(values[1][0]) + 1 === parseInt(values[2][0]) &&
      values[0][1] !== 'z'
    );
  };
  const isValidPong = (values: string[]): boolean => {
    return values[0] === values[1] && values[1] === values[2];
  };
  const isValidMinkkang = (values: string[]): boolean => {
    return (
      values[0] === values[1] &&
      values[1] === values[2] &&
      values[2] === values[3]
    );
  };
  const isValidAnkkang = (values: string[]): boolean => {
    return values[0] === values[1];
  };
  const huroDfs = (remain: number, start: number): boolean => {
    if (remain === 0) return start === huros.length;
    huros.slice;
    const values: string[] = [];
    for (let i = start; i < huros.length; i++) {
      values.push(labels[huros[i].handNum!]);
      if (values.length === 2) {
        if (isValidAnkkang(values)) {
          result.push(new HuroWithUUID('-' + values.join() + values.join()));
          if (huroDfs(remain - 1, start + 2)) {
            return true;
          }
          result.pop();
        }
      } else if (values.length === 3) {
        if (isValidChi(values)) {
          result.push(new HuroWithUUID(values.join()));
          if (huroDfs(remain - 1, start + 3)) {
            return true;
          }
          result.pop();
        }
        if (isValidPong(values)) {
          result.push(new HuroWithUUID(values.join()));
          if (huroDfs(remain - 1, start + 3)) {
            return true;
          }
          result.pop();
        }
      } else if (values.length === 4) {
        if (isValidMinkkang(values)) {
          result.push(new HuroWithUUID(values.join()));
          if (huroDfs(remain - 1, start + 4)) {
            return true;
          }
          result.pop();
        }
        break;
      }
    }
    return false;
  };
  if (!huroDfs(size, 0)) {
    throw '올바르지 않은 후로입니다.';
  }
  return result;
};

export const labels = [
  '0b',
  '0m',
  '0p',
  '0s',
  '1m',
  '1p',
  '1s',
  '1z',
  '2m',
  '2p',
  '2s',
  '2z',
  '3m',
  '3p',
  '3s',
  '3z',
  '4m',
  '4p',
  '4s',
  '4z',
  '5m',
  '5p',
  '5s',
  '5z',
  '6m',
  '6p',
  '6s',
  '6z',
  '7m',
  '7p',
  '7s',
  '7z',
  '8m',
  '8p',
  '8s',
  '9m',
  '9p',
  '9s',
];
