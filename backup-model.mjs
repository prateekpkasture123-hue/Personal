export const HABITS_KEY = 'day-by-day-v1';
export const GOALS_KEY = 'day-by-day-goals-v1';
const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
const text = (value, max) => typeof value === 'string' && value.length <= max;
export function validateBackup(data) {
  if (!data || data.app !== 'day-by-day' || data.version !== 1 || !Array.isArray(data.habits) || !Array.isArray(data.goals) || data.habits.length > 10000 || data.goals.length > 10000) throw new Error('This is not a supported Day by day backup.');
  for (const habit of data.habits) {
    if (!habit || !text(habit.id, 100) || !habit.id || !text(habit.name, 80) || !habit.name.trim() || !Array.isArray(habit.days) || !habit.days.every(isDate)) throw new Error('The backup contains an invalid habit.');
  }
  for (const goal of data.goals) {
    if (!goal || !text(goal.id, 100) || !goal.id || !text(goal.name, 160) || !goal.name.trim() || !text(goal.plan, 10000) || !['daily', 'weekly', 'long'].includes(goal.period) || !isDate(goal.date) || typeof goal.done !== 'boolean') throw new Error('The backup contains an invalid goal.');
  }
  if (typeof data.reminder !== 'string' || (data.reminder !== '' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.reminder))) throw new Error('The backup contains an invalid reminder time.');
  return data;
}
export function readBackup(storage) {
  const habits = JSON.parse(storage.getItem(HABITS_KEY) || '[]');
  const state = JSON.parse(storage.getItem(GOALS_KEY) || '{"goals":[],"reminder":""}');
  return validateBackup({app:'day-by-day', version:1, habits, goals:state.goals, reminder:state.reminder});
}
export function restoreBackup(storage, incoming) {
  validateBackup(incoming);
  const current = readBackup(storage);
  // Preserve existing items when a backup contains the same ID.
  const merge = (existing, added) => {
    const result = new Map(existing.map(item => [item.id, item]));
    for (const item of added) if (!result.has(item.id)) result.set(item.id, item);
    return [...result.values()];
  };
  const habits = merge(current.habits, incoming.habits);
  const goals = merge(current.goals, incoming.goals);
  const beforeHabits = storage.getItem(HABITS_KEY);
  const beforeGoals = storage.getItem(GOALS_KEY);
  try {
    storage.setItem(HABITS_KEY, JSON.stringify(habits));
    storage.setItem(GOALS_KEY, JSON.stringify({goals, reminder:current.reminder || incoming.reminder}));
  } catch (error) {
    // Restore both keys if either write fails (for example, storage quota).
    for (const [key, value] of [[HABITS_KEY, beforeHabits], [GOALS_KEY, beforeGoals]]) {
      if (storage.getItem(key) !== value) {
        if (value === null) storage.removeItem(key); else storage.setItem(key, value);
      }
    }
    throw error;
  }
  return {habits:habits.length-current.habits.length, goals:goals.length-current.goals.length};
}
