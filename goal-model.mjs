export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function weekBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - (start.getDay()+6)%7);
  const end = new Date(start); end.setDate(end.getDate()+6);
  return [localDay(start), localDay(end)];
}
export function inPeriod(goal, period, date = new Date()) {
  if(goal.period !== period) return false;
  if(period === 'long') return true;
  if(period === 'daily') return goal.date === localDay(date);
  const [start,end] = weekBounds(date);
  return goal.date >= start && goal.date <= end;
}
