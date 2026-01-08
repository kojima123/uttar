import { BodyArea, BodySide, InjectionRecord, getRecords } from './storage';

export interface BodyPartStatus {
  side: BodySide;
  area: BodyArea;
  lastInjectionTime: number | null;
  hoursSinceLastInjection: number | null;
  isRecommended: boolean; // True if 48+ hours have passed
}

const RECOMMENDED_INTERVAL_HOURS = 48;

/**
 * Get the last injection time for a specific body part
 */
export function getLastInjectionTime(side: BodySide, area: BodyArea): number | null {
  const records = getRecords();
  const matchingRecords = records.filter(r => r.side === side && r.area === area);
  
  if (matchingRecords.length === 0) {
    return null;
  }
  
  // Sort by timestamp descending and get the most recent
  const sorted = matchingRecords.sort((a, b) => b.timestamp - a.timestamp);
  return sorted[0].timestamp;
}

/**
 * Calculate hours since last injection for a specific body part
 */
export function getHoursSinceLastInjection(side: BodySide, area: BodyArea): number | null {
  const lastTime = getLastInjectionTime(side, area);
  
  if (lastTime === null) {
    return null;
  }
  
  const now = Date.now();
  const diffMs = now - lastTime;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  return diffHours;
}

/**
 * Check if a body part is recommended for injection (48+ hours since last injection)
 */
export function isBodyPartRecommended(side: BodySide, area: BodyArea): boolean {
  const hours = getHoursSinceLastInjection(side, area);
  
  // If never injected, it's recommended
  if (hours === null) {
    return true;
  }
  
  return hours >= RECOMMENDED_INTERVAL_HOURS;
}

/**
 * Get status for all body parts
 */
export function getAllBodyPartStatuses(): BodyPartStatus[] {
  const sides: BodySide[] = ['left', 'right'];
  const areas: BodyArea[] = ['arm', 'abdomen', 'thigh'];
  
  const statuses: BodyPartStatus[] = [];
  
  for (const side of sides) {
    for (const area of areas) {
      const lastTime = getLastInjectionTime(side, area);
      const hours = getHoursSinceLastInjection(side, area);
      const isRecommended = isBodyPartRecommended(side, area);
      
      statuses.push({
        side,
        area,
        lastInjectionTime: lastTime,
        hoursSinceLastInjection: hours,
        isRecommended,
      });
    }
  }
  
  return statuses;
}

/**
 * Get recommended body parts for injection
 */
export function getRecommendedBodyParts(): Array<{ side: BodySide; area: BodyArea }> {
  const statuses = getAllBodyPartStatuses();
  return statuses
    .filter(s => s.isRecommended)
    .map(s => ({ side: s.side, area: s.area }));
}
