export interface CycleInfo {
  id: string; // e.g. "2026-10-05"
  startDate: Date;
  endDate: Date;
  startStr: string;
  endStr: string;
  label: string;
  shortLabel: string;
  daysRemaining: number;
  isCurrent: boolean;
}

export function getBudgetCycleForOffset(offsetMonths: number = 0, resetDay: number = 5): CycleInfo {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  let baseYear = currentYear;
  let baseMonth = currentMonth;

  if (currentDate < resetDay) {
    baseMonth = currentMonth - 1;
    if (baseMonth < 0) {
      baseMonth = 11;
      baseYear = currentYear - 1;
    }
  }

  // Apply offset (e.g. -1 for previous month)
  let startYear = baseYear;
  let startMonth = baseMonth + offsetMonths;
  while (startMonth < 0) {
    startMonth += 12;
    startYear -= 1;
  }
  while (startMonth > 11) {
    startMonth -= 12;
    startYear += 1;
  }

  let endYear = startYear;
  let endMonth = startMonth + 1;
  if (endMonth > 11) {
    endMonth = 0;
    endYear += 1;
  }

  const startDate = new Date(startYear, startMonth, resetDay);
  const endDate = new Date(endYear, endMonth, resetDay);

  const startMonthName = startDate.toLocaleDateString('en-US', { month: 'short' });
  const endMonthName = endDate.toLocaleDateString('en-US', { month: 'short' });
  const startYearShort = String(startYear).slice(-2);

  const diffTime = endDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const startStr = `${startYear}-${String(startMonth + 1).padStart(2, '0')}-${String(resetDay).padStart(2, '0')}`;
  const endStr = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-${String(resetDay).padStart(2, '0')}`;

  return {
    id: startStr,
    startDate,
    endDate,
    startStr,
    endStr,
    label: `${startMonthName} ${resetDay} – ${endMonthName} ${resetDay}`,
    shortLabel: `${startMonthName}'${startYearShort}`,
    daysRemaining: offsetMonths === 0 ? daysRemaining : 0,
    isCurrent: offsetMonths === 0,
  };
}

export function getCurrentBudgetCycle(resetDay: number = 5): CycleInfo {
  return getBudgetCycleForOffset(0, resetDay);
}

export function getRecentBudgetCycles(count: number = 4, resetDay: number = 5): CycleInfo[] {
  const list: CycleInfo[] = [];
  for (let i = 0; i > -count; i--) {
    list.push(getBudgetCycleForOffset(i, resetDay));
  }
  return list;
}
