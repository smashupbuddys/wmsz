interface DateSplitOptions {
  startDate: string;
  totalSplits: number;
  splitType: 'sequential' | 'random';
  maxGap?: number; // Maximum days gap between bills
  minGap?: number; // Minimum days gap between bills
}

export const generateSplitDates = ({
  startDate,
  totalSplits,
  splitType,
  maxGap = 4, // Default max 4 days gap
  minGap = 1  // Default min 1 day gap
}: DateSplitOptions): string[] => {
  const dates: Date[] = [new Date(startDate)];
  const baseDate = new Date(startDate);

  if (splitType === 'sequential') {
    // Generate sequential dates
    for (let i = 1; i < totalSplits; i++) {
      const nextDate = new Date(baseDate);
      nextDate.setDate(baseDate.getDate() + i);
      dates.push(nextDate);
    }
  } else {
    // Generate random dates with gaps
    for (let i = 1; i < totalSplits; i++) {
      const lastDate = dates[dates.length - 1];
      const gap = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + gap);
      dates.push(nextDate);
    }
  }

  return dates.map(date => date.toISOString().split('T')[0]);
};
