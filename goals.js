import { localDay, weekBounds, inPeriod } from './goal-model.mjs';
const $=s=>document.querySelector(s);
const storageKey='day-by-day-goals-v1';
let state={goals:[],reminder:''},period='daily',editing=null;
try {
  const stored=JSON.parse(localStorage.getItem(storageKey)||'null');
  if(stored && Array.isArray(stored.goals)) state={goals:stored.goals.filter(g=>typeof g.id==='string' && typeof g.name==='string' && typeof g.plan==='string' && typeof g.date==='string' && ['daily','weekly','long'].includes(g.period)),reminder:typeof stored.reminder==='string'?stored.reminder:''};
} catch { $('#error').textContent='Saved goals could not be loaded. Reload before saving new goals.'; }
function persist(next) {
  try { localStorage.setItem(storageKey,JSON.stringify(next)); state=next;render();return true; }
  catch { $('#error').textContent='Goals could not be saved. Check device storage and try again.';return false; }
}
function element(tag,text,className){const el=document.createElement(tag);if(text)el.textContent=text;if(className)el.className=className;return el;}
function openEditor(goal){editing=goal?.id||null;$('#goal-dialog-title').textContent=goal?'Edit goal & plan':'Create a goal';$('#goal-name').value=goal?.name||'';$('#goal-type').value=goal?.period||period;$('#goal-date').value=goal?.date||localDay();$('#goal-plan').value=goal?.plan||'';$('#goal-dialog').showModal();}
function render(){
  const bounds=weekBounds();$('#goal-period').textContent=period==='daily'?`Today · ${localDay()}`:period==='weekly'?`This week · ${bounds[0]} to ${bounds[1]} (Monday–Sunday)`:'Your bigger picture';
  const list=$('#goals');list.replaceChildren();
  const visible=state.goals.filter(g=>inPeriod(g,period));
  // Keep unfinished goals visible after their original target date.
  const overdue=state.goals.filter(g=>g.period===period && period!=='long' && !g.done && g.date<(period==='daily'?localDay():bounds[0]));
  for(const goal of [...overdue,...visible]){
    const card=element('article',null,'goal');const row=element('div',null,'row'+(goal.done?' done':''));
    const check=element('button',goal.done?'✓':'','check');check.setAttribute('aria-label',`${goal.done?'Reopen':'Complete'} ${goal.name}`);check.setAttribute('aria-pressed',String(!!goal.done));check.onclick=()=>persist({...state,goals:state.goals.map(g=>g.id===goal.id?{...g,done:!g.done}:g)});
    const info=element('div',null,'info');info.append(element('div',goal.name,'name'),element('div',`${goal.done?'Completed':goal.date<localDay()?'Overdue':'Target'} · ${goal.date}`,'meta'));
    const edit=element('button','Edit','add');edit.onclick=()=>openEditor(goal);row.append(check,info,edit);card.append(row);
    const details=element('details');details.append(element('summary','Your plan'),element('p',goal.plan||'No plan yet. Tap Edit to add your next steps.','plan'));card.append(details);
    const remove=element('button','Delete goal','delete');remove.onclick=()=>{if(confirm(`Delete “${goal.name}” and its plan?`))persist({...state,goals:state.goals.filter(g=>g.id!==goal.id)});};card.append(remove);list.append(card);
  }
  if(!visible.length&&!overdue.length)list.append(element('p','A clear goal starts with a small next step. Add yours above.','empty'));
  $('#reminder-time').value=state.reminder;
  $('#reminder-status').textContent=state.reminder?`Preferred time: ${state.reminder}. Notifications are not active.`:'No reminder time saved.';
}
for(const tab of ['habits','goals'])$(`#${tab}-tab`).onclick=()=>{for(const name of ['habits','goals'])$(`#${name}-tab`).setAttribute('aria-pressed',String(name===tab));$('#habit-section').hidden=tab!=='habits';$('#goal-section').hidden=tab!=='goals';render();};
$('#goal-filters').onclick=e=>{const button=e.target.closest('[data-period]');if(!button)return;period=button.dataset.period;for(const b of $('#goal-filters').children)b.setAttribute('aria-pressed',String(b===button));render();};
$('#new-goal').onclick=()=>openEditor();$('#goal-cancel').onclick=()=>$('#goal-dialog').close();
$('#goal-form').onsubmit=e=>{e.preventDefault();const name=$('#goal-name').value.trim();if(!name)return;const goal={id:editing||crypto.randomUUID(),name,period:$('#goal-type').value,date:$('#goal-date').value,plan:$('#goal-plan').value.trim(),done:editing?!!state.goals.find(g=>g.id===editing)?.done:false};const next={...state,goals:editing?state.goals.map(g=>g.id===editing?goal:g):[...state.goals,goal]};if(persist(next)){$('#goal-dialog').close();period=goal.period;for(const b of $('#goal-filters').children)b.setAttribute('aria-pressed',String(b.dataset.period===period));render();}};
$('#reminder-form').onsubmit=e=>{e.preventDefault();persist({...state,reminder:$('#reminder-time').value});};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});render();
