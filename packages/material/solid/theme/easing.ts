import { svgPathProperties as SVGPathProperties } from "svg-path-properties";

export type LinearData = [position: number, value: number][];

const pointsLength = 10_000;
export const processSVGData = (pathData: string): LinearData => {
  const parsedPath = new SVGPathProperties(pathData);
  const totalLength = parsedPath.getTotalLength();

  if (totalLength === 0) throw new TypeError("Path is zero length");

  let lastX = -Infinity;

  const points: LinearData = Array.from(
    { length: pointsLength },
    (_, i) => {
      const pos = (i / (pointsLength - 1)) * totalLength;
      const point = parsedPath.getPointAtLength(pos);

      // Prevent paths going back on themselves
      lastX = Math.max(lastX, point.x);
      return [lastX, point.y];
    }
  );

  return points;
}




// square distance from a point to a segment
function getSqSegDist(
  p: [number, number],
  p1: [number, number],
  p2: [number, number],
) {
  let x = p1[0];
  let y = p1[1];
  let dx = p2[0] - x;
  let dy = p2[1] - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy); // TODO: it was `var` before. WHY?

    if (t > 1) {
      x = p2[0];
      y = p2[1];
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;

  return dx * dx + dy * dy;
}

function simplifyDPStep(
  points: LinearData,
  first: number,
  last: number,
  sqTolerance: number,
  simplified: LinearData,
) {
  let maxSqDist = sqTolerance;
  let index: number;

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index! - first > 1) {
      simplifyDPStep(points, first, index!, sqTolerance, simplified);
    }

    simplified.push(points[index!]);

    if (last - index! > 1) {
      simplifyDPStep(points, index!, last, sqTolerance, simplified);
    }
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points: LinearData, tolerance: number) {
  if (points.length <= 1) return points;
  const sqTolerance = tolerance * tolerance;
  const last = points.length - 1;
  const simplified: LinearData = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);

  return simplified;
}

export function useOptimizedPoints(
  fullPoints: LinearData,
  simplify: number = 0.00001,
  round: number = 5,
): LinearData {
  // x is represented as a percentage, so no point rounding less than 2 places
  const xRounding = Math.max(round, 2);

  return simplifyDouglasPeucker(fullPoints, simplify)
    .map(
      ([x, y]) => [
        Math.round(x * 10 ** xRounding) / 10 ** xRounding,
        Math.round(y * 10 ** round) / 10 ** round,
      ],
    ) as LinearData;
}


export default function useLinearSyntax(
  points: LinearData,
  round: number,
): string[] {
  const xFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.max(round - 2, 0),
  });
  const yFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: round,
  });

  const pointsValue = points;
  const valuesWithRedundantX = new Set<[number, number]>();
  const maxDelta = 1 / 10 ** round;

  // Figure out entries that don't need an explicit position value
  for (const [i, value] of pointsValue.entries()) {
    const [x] = value;
    // If the first item's position is 0, then we don't need to state the position
    if (i === 0) {
      if (x === 0) valuesWithRedundantX.add(value);
      continue;
    }
    // If the last entry's position is 1, and the item before it is less than 1, then we don't need to state the position
    if (i === pointsValue.length - 1) {
      const previous = pointsValue[i - 1][0];
      if (x === 1 && previous <= 1) valuesWithRedundantX.add(value);
      continue;
    }

    // If the position is the average of the previous and next positions, then we don't need to state the position
    const previous = pointsValue[i - 1][0];
    const next = pointsValue[i + 1][0];

    const averagePos = (next - previous) / 2 + previous;
    const delta = Math.abs(x - averagePos);

    if (delta < maxDelta) valuesWithRedundantX.add(value);
  }

  // Group into sections with same y
  const groupedValues: LinearData[] = [[pointsValue[0]]];

  for (const value of pointsValue.slice(1)) {
    if (value[1] === groupedValues.at(-1)![0][1]) {
      groupedValues.at(-1)!.push(value);
    } else {
      groupedValues.push([value]);
    }
  }

  const outputValues = groupedValues.map((group) => {
    const yValue = yFormat.format(group[0][1]);

    const regularValue = group
      .map((value) => {
        const [x] = value;
        let output = yValue;

        if (!valuesWithRedundantX.has(value)) {
          output += ' ' + xFormat.format(x * 100) + '%';
        }

        return output;
      })
      .join(', ');

    if (group.length === 1) return regularValue;

    // Maybe it's shorter to provide a value that skips steps?
    const xVals = [group[0][0], group.at(-1)![0]];
    const positionalValues = xVals
      .map((x) => xFormat.format(x * 100) + '%')
      .join(' ');

    const skipValue = `${yValue} ${positionalValues}`;

    return skipValue.length > regularValue.length ? regularValue : skipValue;
  });

  return outputValues;
}
