import { InjectionRecord, BodySide, BodyArea } from './storage';

export type BodyPart = `${BodySide}-${BodyArea}`;

export interface BodyPartStatistics {
  part: BodyPart;
  count: number;
  percentage: number;
  color: string;
}

// Color palette for pie chart
const PART_COLORS: Record<BodyPart, string> = {
  'left-arm': '#FF6B6B',
  'right-arm': '#4ECDC4',
  'left-abdomen': '#FFE66D',
  'right-abdomen': '#95E1D3',
  'left-thigh': '#C7CEEA',
  'right-thigh': '#FF8B94',
};

/**
 * Calculate body part statistics for the past N days
 */
export function calculateBodyPartStatistics(
  records: InjectionRecord[],
  days: number = 30
): BodyPartStatistics[] {
  const now = Date.now();
  const cutoffTime = now - days * 24 * 60 * 60 * 1000;

  // Filter records from the past N days
  const recentRecords = records.filter(
    (record) => new Date(record.timestamp).getTime() >= cutoffTime
  );

  if (recentRecords.length === 0) {
    return [];
  }

  // Count occurrences of each body part
  const partCounts: Partial<Record<BodyPart, number>> = {};
  recentRecords.forEach((record) => {
    const part: BodyPart = `${record.side}-${record.area}`;
    partCounts[part] = (partCounts[part] || 0) + 1;
  });

  const total = recentRecords.length;

  // Convert to statistics array
  const statistics: BodyPartStatistics[] = Object.entries(partCounts).map(
    ([part, count]) => ({
      part: part as BodyPart,
      count: count as number,
      percentage: ((count as number) / total) * 100,
      color: PART_COLORS[part as BodyPart],
    })
  );

  // Sort by count descending
  statistics.sort((a, b) => b.count - a.count);

  return statistics;
}

/**
 * Get the most and least used body parts
 */
export function getMostAndLeastUsedParts(
  statistics: BodyPartStatistics[]
): {
  mostUsed: BodyPartStatistics | null;
  leastUsed: BodyPartStatistics | null;
} {
  if (statistics.length === 0) {
    return { mostUsed: null, leastUsed: null };
  }

  return {
    mostUsed: statistics[0],
    leastUsed: statistics[statistics.length - 1],
  };
}
