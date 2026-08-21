export const JOURNEY_STEPS = [
  ['Pray on time', 'Keep the five prayers at the heart of the day.'],
  ['Read a little Qur’an', 'Choose a manageable daily amount and stay consistent.'],
  ['Make one sincere dua', 'Pause, ask Allah, and keep hope alive.'],
  ['Do one act of kindness', 'Help someone, encourage them, or give quietly.'],
  ['Remember Allah', 'Use the Noor Dhikr counter and build a gentle habit.'],
] as const;

export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function readJourneyHistory(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem('noor-journey-history');
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getJourneyStreak(date = new Date()) {
  const history = readJourneyHistory();
  let streak = 0;
  const cursor = new Date(date);
  while (history[dateKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getJourneyDayNumber(date = new Date()) {
  const history = readJourneyHistory();
  return Object.values(history).filter(Boolean).length + 1;
}

export function markJourneyComplete(date = new Date()) {
  const history = readJourneyHistory();
  history[dateKey(date)] = true;
  localStorage.setItem('noor-journey-history', JSON.stringify(history));
  window.dispatchEvent(new Event('noor-journey-updated'));
}
