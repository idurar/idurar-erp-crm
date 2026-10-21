const dateOnly = (value) => new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));

const workingDays = (from, to, workDaysPerWeek = 5) => {
  let count = 0;
  const allowedDays = Math.max(1, Math.min(7, Number(workDaysPerWeek) || 5));
  for (let day = dateOnly(from); day <= to; day.setUTCDate(day.getUTCDate() + 1)) {
    const weekday = day.getUTCDay() === 0 ? 7 : day.getUTCDay();
    if (weekday <= allowedDays) count += 1;
  }
  return count;
};

const capPeriodAtToday = (periodStart, periodEnd, today = new Date()) => {
  const todayEnd = new Date(Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
    23, 59, 59, 999
  ));
  if (periodStart > todayEnd) return new Date(periodStart.getTime() - 1);
  return periodEnd > todayEnd ? todayEnd : periodEnd;
};

const calculateWorkedHours = ({ startTime, endTime, breakMinutes = 0 }) => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  const startMatch = timePattern.exec(String(startTime || ''));
  const endMatch = timePattern.exec(String(endTime || ''));
  if (!startMatch || !endMatch) {
    return { valid: false, message: 'Bitte Kommt- und Geht-Zeit vollständig angeben.' };
  }
  const start = Number(startMatch[1]) * 60 + Number(startMatch[2]);
  const end = Number(endMatch[1]) * 60 + Number(endMatch[2]);
  if (end <= start) {
    return { valid: false, message: 'Die Geht-Zeit muss nach der Kommt-Zeit liegen.' };
  }
  const grossMinutes = end - start;
  let normalizedBreak = Number(breakMinutes) || 0;
  if (normalizedBreak < 0 || normalizedBreak > 120) {
    return { valid: false, message: 'Die Pause muss zwischen 0 und 120 Minuten liegen.' };
  }
  if (normalizedBreak > 0 && normalizedBreak < 30) normalizedBreak = 30;
  if (grossMinutes >= 360 && normalizedBreak < 30) normalizedBreak = 30;
  if (normalizedBreak >= grossMinutes) {
    return { valid: false, message: 'Die Pause muss kürzer als die Anwesenheitszeit sein.' };
  }
  return {
    valid: true,
    grossMinutes,
    breakMinutes: normalizedBreak,
    hours: Number(((grossMinutes - normalizedBreak) / 60).toFixed(2)),
  };
};

const calculateTimeAccount = ({ employee, entries, periodStart, periodEnd, yearEntries = entries }) => {
  const weeklyTarget = Number(employee.weeklyTargetHours) || 0;
  const workDays = Number(employee.workDaysPerWeek) || 5;
  const dailyTarget = workDays > 0 ? weeklyTarget / workDays : 0;
  const firstRecordedDay = yearEntries.length
    ? new Date(Math.min(...yearEntries.map((entry) => new Date(entry.workDate).getTime())))
    : null;
  const accountStart = employee.timeAccountStart
    ? new Date(employee.timeAccountStart)
    : firstRecordedDay;
  const possibleStarts = accountStart
    ? [periodStart, accountStart, employee.employmentStart && new Date(employee.employmentStart)]
      .filter((value) => value && !Number.isNaN(value.getTime()))
    : [];
  const start = possibleStarts.length ? new Date(Math.max(...possibleStarts.map((value) => value.getTime()))) : null;
  const targetHours = !start || start > periodEnd ? 0 : workingDays(start, periodEnd, workDays) * dailyTarget;
  const creditedTypes = new Set(['work', 'vacation', 'sick', 'holiday', 'overtime', 'correction']);
  const actualHours = entries.reduce((sum, entry) =>
    sum + (creditedTypes.has(entry.entryType || 'work') ? Number(entry.hours) || 0 : 0), 0);
  const balance = (Number(employee.initialTimeBalance) || 0) + actualHours - targetHours;
  const vacationDates = new Set(yearEntries
    .filter((entry) => entry.entryType === 'vacation')
    .map((entry) => new Date(entry.workDate).toISOString().slice(0, 10)));
  const vacationEntitlement = (Number(employee.annualVacationDays) || 0) + (Number(employee.vacationCarryover) || 0);
  return {
    targetHours,
    actualHours,
    balance,
    overtimeHours: Math.max(0, balance),
    minusHours: Math.max(0, -balance),
    vacationEntitlement,
    vacationUsed: vacationDates.size,
    vacationRemaining: vacationEntitlement - vacationDates.size,
  };
};

module.exports = { calculateTimeAccount, workingDays, capPeriodAtToday, calculateWorkedHours };
