import {indiaWelcome} from './dashboard-model.mjs';
const $=selector=>document.querySelector(selector);
let name='Prateek Kasture';
try{name=localStorage.getItem('day-by-day-name')||'Prateek Kasture';}catch{}
function renderDashboard(){
  const welcome=indiaWelcome();
  $('#greeting').textContent=welcome.greeting + (name?',':'');
  $('#welcome-name').textContent=name?`${name}.`:'Make today yours.';
  $('#home-date').textContent=welcome.date+' · IST';
  $('#daily-quote').textContent=welcome.quote;
  $('#edit-name').textContent=name?'Edit your name ↗':'Personalize your welcome ↗';
  try{
    const habits=JSON.parse(localStorage.getItem('day-by-day-v1')||'[]');
    const goals=JSON.parse(localStorage.getItem('day-by-day-goals-v1')||'{"goals":[]}').goals;
    const dateKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const today=dateKey(new Date());
    $('#home-habits').textContent=`${habits.filter(h=>h.days.includes(today)).length} / ${habits.length}`;
    const completed=goals.filter(g=>g.done).length;
    $('#home-goals').textContent=`${completed} / ${goals.length}`;
    $('#report-goals').textContent=completed;
    let total=0;
    for(let i=0;i<7;i++){const d=new Date();d.setDate(d.getDate()-i);total+=habits.filter(h=>h.days.includes(dateKey(d))).length;}
    $('#report-checkins').textContent=total;
  }catch{$('#error').textContent='Some saved data could not be read. Do not clear your app data.';}
}
function navigate(page){
  for(const name of ['home','habit','goal','report'])$(`#${name}-section`).hidden=name!==page;
  for(const button of document.querySelectorAll('[data-page]')){
    if(button.dataset.page===page)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
  }
  renderDashboard();window.scrollTo({top:0,behavior:'instant'});
}
for(const button of document.querySelectorAll('[data-page]'))button.onclick=()=>navigate(button.dataset.page);
for(const button of document.querySelectorAll('[data-open]'))button.onclick=()=>navigate(button.dataset.open);
$('#edit-name').onclick=()=>{$('#profile-name').value=name;$('#profile-dialog').showModal();};
$('#profile-cancel').onclick=()=>$('#profile-dialog').close();
$('#profile-form').onsubmit=event=>{
  event.preventDefault();const next=$('#profile-name').value.trim();if(!next)return;
  try{localStorage.setItem('day-by-day-name',next);name=next;$('#profile-dialog').close();$('#profile-status').textContent='';renderDashboard();}
  catch{$('#profile-status').textContent='Could not save your name. Please try again.';}
};
document.addEventListener('tracker-updated',renderDashboard);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderDashboard();});
window.addEventListener('pageshow',renderDashboard);
setInterval(renderDashboard,60000);
renderDashboard();
