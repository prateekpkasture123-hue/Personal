export const quotes = [
  'Small steps, taken every day, become a life you are proud of.',
  'You do not need a perfect day to make a little progress.',
  'Keep the promises you make to yourself, one small choice at a time.',
  'Let today be simple: begin, be present, and try again.',
  'Your future grows from the things you repeat today.',
  'A quiet effort still moves you forward.',
  'Make room for the person you are becoming.',
  'Consistency is a kindness you give your future self.',
  'Begin where you are. Build with what you have.',
  'Every time you show up, you give yourself another chance.',
  'Your pace can be gentle and your direction can be clear.',
  'A little intention can change the shape of your day.',
  'Progress is often a small thing done with care.',
  'You can start again without starting from nothing.',
  'Choose the next good step. The whole path can wait.',
  'Give your goals a place in your everyday life.',
  'Some days you grow. Some days you learn how to grow.',
  'Today is another chance to be on your own side.',
  'Celebrate the effort you can repeat tomorrow.',
  'A meaningful life is built in ordinary moments.',
  'Keep going gently. Small beginnings count.',
  'Make your next step smaller than your excuse.',
  'Let your actions remind you of what matters.',
  'A steady rhythm carries you further than a perfect start.',
  'Do one thing today that tomorrow will thank you for.',
  'You are allowed to grow at a human pace.',
  'Turn a good intention into one real action.',
  'The little things add up. So do your efforts.',
  'Your next chapter starts with what you do today.',
  'Keep a little space for hope, and a little time for action.',
  'Show up with patience. Leave with a little progress.'
];
export function indiaWelcome(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(now).filter(p=>p.type!=='literal').map(p=>[p.type,p.value]));
  const hour=Number(parts.hour);
  const day=Math.floor(Date.UTC(Number(parts.year),Number(parts.month)-1,Number(parts.day))/86400000);
  return {greeting:hour<12?'Good morning':hour<17?'Good afternoon':'Good evening', quote:quotes[((day%quotes.length)+quotes.length)%quotes.length], date:new Intl.DateTimeFormat('en-IN',{timeZone:'Asia/Kolkata',weekday:'long',day:'numeric',month:'long'}).format(now)};
}
