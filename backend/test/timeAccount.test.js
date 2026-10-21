const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateTimeAccount, workingDays, capPeriodAtToday, calculateWorkedHours } = require('../src/services/timeAccountService');

test('working days respect the configured days per week', () => {
  assert.equal(workingDays(new Date('2026-10-05T00:00:00Z'), new Date('2026-10-11T23:59:59Z'), 5), 5);
  assert.equal(workingDays(new Date('2026-10-05T00:00:00Z'), new Date('2026-10-11T23:59:59Z'), 3), 3);
});

test('current periods accrue target hours only up to today', () => {
  const end = capPeriodAtToday(
    new Date('2026-10-01T00:00:00Z'),
    new Date('2026-10-31T23:59:59.999Z'),
    new Date('2026-10-20T12:00:00Z')
  );
  assert.equal(end.toISOString(), '2026-10-20T23:59:59.999Z');
});

test('future periods do not accrue target hours', () => {
  const start = new Date('2026-11-01T00:00:00Z');
  const end = capPeriodAtToday(start, new Date('2026-11-30T23:59:59.999Z'), new Date('2026-10-20T12:00:00Z'));
  assert.equal(workingDays(start, end, 5), 0);
});

test('worked hours are calculated from arrival, break and departure', () => {
  assert.deepEqual(calculateWorkedHours({ startTime: '08:00', endTime: '16:30', breakMinutes: 30 }), {
    valid: true,
    grossMinutes: 510,
    breakMinutes: 30,
    hours: 8,
  });
});

test('six hours automatically include the statutory 30 minute break', () => {
  const result = calculateWorkedHours({ startTime: '08:00', endTime: '14:00', breakMinutes: 0 });
  assert.equal(result.breakMinutes, 30);
  assert.equal(result.hours, 5.5);
});

test('breaks are limited to two hours and short breaks normalize to 30 minutes', () => {
  assert.equal(calculateWorkedHours({ startTime: '08:00', endTime: '12:00', breakMinutes: 15 }).breakMinutes, 30);
  assert.equal(calculateWorkedHours({ startTime: '08:00', endTime: '16:00', breakMinutes: 121 }).valid, false);
});

test('time account calculates target, overtime and vacation balance', () => {
  const employee = {
    weeklyTargetHours: 40,
    workDaysPerWeek: 5,
    annualVacationDays: 25,
    vacationCarryover: 2,
    initialTimeBalance: 1,
  };
  const entries = [
    { workDate: new Date('2026-10-05T00:00:00Z'), entryType: 'work', hours: 9 },
    { workDate: new Date('2026-10-06T00:00:00Z'), entryType: 'work', hours: 8 },
    { workDate: new Date('2026-10-07T00:00:00Z'), entryType: 'work', hours: 8 },
    { workDate: new Date('2026-10-08T00:00:00Z'), entryType: 'vacation', hours: 8 },
    { workDate: new Date('2026-10-09T00:00:00Z'), entryType: 'sick', hours: 8 },
  ];
  const result = calculateTimeAccount({
    employee,
    entries,
    yearEntries: entries,
    periodStart: new Date('2026-10-05T00:00:00Z'),
    periodEnd: new Date('2026-10-11T23:59:59Z'),
  });
  assert.equal(result.targetHours, 40);
  assert.equal(result.actualHours, 41);
  assert.equal(result.balance, 2);
  assert.equal(result.overtimeHours, 2);
  assert.equal(result.vacationRemaining, 26);
});

test('a legacy employee without entries starts with a neutral time balance', () => {
  const result = calculateTimeAccount({
    employee: { weeklyTargetHours: 19.25, workDaysPerWeek: 5 },
    entries: [],
    yearEntries: [],
    periodStart: new Date('2026-10-01T00:00:00Z'),
    periodEnd: new Date('2026-10-21T23:59:59Z'),
  });
  assert.equal(result.targetHours, 0);
  assert.equal(result.balance, 0);
});

test('time targets begin at the dedicated time account start', () => {
  const result = calculateTimeAccount({
    employee: {
      weeklyTargetHours: 19.25,
      workDaysPerWeek: 5,
      employmentStart: new Date('2026-01-01T00:00:00Z'),
      timeAccountStart: new Date('2026-10-20T00:00:00Z'),
    },
    entries: [],
    yearEntries: [],
    periodStart: new Date('2026-10-01T00:00:00Z'),
    periodEnd: new Date('2026-10-21T23:59:59Z'),
  });
  assert.equal(result.targetHours, 7.7);
  assert.equal(result.balance, -7.7);
});
