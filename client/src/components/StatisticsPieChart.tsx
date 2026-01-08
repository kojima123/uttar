import { useMemo } from 'react';
import { BodyPartStatistics } from '../lib/statisticsHelper';
import { getBodyLabel } from '../lib/i18n';
import { getSettings } from '../lib/storage';

interface StatisticsPieChartProps {
  statistics: BodyPartStatistics[];
}

export function StatisticsPieChart({ statistics }: StatisticsPieChartProps) {
  const settings = getSettings();
  const language = settings.language;

  // Calculate SVG path for pie chart
  const pieSlices = useMemo(() => {
    if (statistics.length === 0) return [];

    const centerX = 100;
    const centerY = 100;
    const radius = 80;

    let currentAngle = -90; // Start from top

    return statistics.map((stat) => {
      const sliceAngle = (stat.percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      // Convert angles to radians
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      // Calculate start and end points
      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      // Large arc flag
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      // SVG path
      const path = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');

      currentAngle = endAngle;

      return {
        path,
        color: stat.color,
        part: stat.part,
        count: stat.count,
        percentage: stat.percentage,
      };
    });
  }, [statistics]);

  if (statistics.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        No data available for the past 30 days
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Pie Chart */}
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {pieSlices.map((slice, index) => (
            <g key={index}>
              <path
                d={slice.path}
                fill={slice.color}
                stroke="white"
                strokeWidth="2"
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {statistics.map((stat, index) => {
          const [side, area] = stat.part.split('-');
          const label = getBodyLabel(language, side as 'left' | 'right', area as 'arm' | 'abdomen' | 'thigh');

          return (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-sm flex-shrink-0"
                style={{ backgroundColor: stat.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.count} times ({stat.percentage.toFixed(1)}%)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
