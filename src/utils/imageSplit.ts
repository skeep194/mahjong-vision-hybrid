export interface Rectangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence?: number;
  classNum?: number;
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

export const labels = [
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
