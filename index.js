
// DOPADO v30 inline app script
const APP_VERSION = 47;
const STORAGE_KEY='dopaon_state_v6';
const BACKUP_KEY='dopaon_state_v6_backup';
const LEGACY_KEYS=['dopaon_state_v5','dopaon_state_v4','dopaon_state_v3','dopaon_state_v2','dopaon_state_v1'];
const LEVEL_STEP=10;

// ===== ONE-TIME DATA RESET FOR TUTORIAL MIGRATION =====
// この値を変えた時だけ、同じ端末で再度1回だけ初期化される。
// v6: 最終チュートリアル導線調整。既存テストデータをもう一度だけ確実に初期化する。
const DATA_RESET_VERSION = 'tutorial-v10';
const DATA_RESET_DONE_KEY = 'dopado_data_reset_done_version';
const DATA_RESET_CANARY_KEY = 'dopado_clean_start_version';

function oneTimeDataResetForTutorial() {
  try {
    const doneVersion = localStorage.getItem(DATA_RESET_DONE_KEY);
    const cleanVersion = localStorage.getItem(DATA_RESET_CANARY_KEY);

    // すでにこのバージョンで「削除済み」と「クリーン起動済み」の両方が残っているなら、絶対に何もしない。
    if (doneVersion === DATA_RESET_VERSION && cleanVersion === DATA_RESET_VERSION) return false;

    const exactKeys = [
      STORAGE_KEY,
      BACKUP_KEY,
      ...LEGACY_KEYS,
      'dopado_tutorial_completed',
      'dopado_home_prompt_seen',
      DATA_RESET_CANARY_KEY
    ];

    function isDopadoStorageKey(key) {
      const lower = String(key || '').toLowerCase();
      return exactKeys.includes(key) || lower.includes('dopaon') || lower.includes('dopado');
    }

    Object.keys(localStorage).forEach(key => {
      // 実行済みフラグ自体は、最後に今回のバージョンで上書きする。
      if (key === DATA_RESET_DONE_KEY) return;
      if (isDopadoStorageKey(key)) localStorage.removeItem(key);
    });

    Object.keys(sessionStorage).forEach(key => {
      if (isDopadoStorageKey(key)) sessionStorage.removeItem(key);
    });

    // 削除が終わった後に、今回のリセットは済んだ印を残す。
    localStorage.setItem(DATA_RESET_DONE_KEY, DATA_RESET_VERSION);
    localStorage.setItem(DATA_RESET_CANARY_KEY, DATA_RESET_VERSION);
    return true;
  } catch (e) {
    // localStorageが使えない環境でもアプリを止めない。
    console.warn('oneTimeDataResetForTutorial failed', e);
    return false;
  }
}

const TIERS={
  white:{key:'white',jp:'白',color:'#e8e8f5',xp:2,days:3},
  blue:{key:'blue',jp:'青',color:'#3b9eff',xp:3,days:7},
  green:{key:'green',jp:'緑',color:'#39ff88',xp:6,days:14},
  purple:{key:'purple',jp:'紫',color:'#b96bff',xp:12,days:21},
  red:{key:'red',jp:'赤',color:'#ff3b5c',xp:30,days:30},
  gold:{key:'gold',jp:'金',color:'#ffd24a',xp:60,days:45}
};
const TIER_ORDER=['white','blue','green','purple','red','gold'];
const TITLES=[{id:'t01',text:'今はただの',tier:'white'},{id:'t02',text:'これでも',tier:'white'},{id:'t03',text:'ただの',tier:'white'},{id:'t04',text:'やたらと',tier:'white'},{id:'t05',text:'なんとなく',tier:'white'},{id:'t06',text:'迷える',tier:'white'},{id:'t07',text:'しがない',tier:'white'},{id:'t08',text:'野良の',tier:'blue'},{id:'t09',text:'紛れ込んだ',tier:'blue'},{id:'t10',text:'ひっそりした',tier:'blue'},{id:'t11',text:'気まぐれな',tier:'blue'},{id:'t12',text:'ふらりと来た',tier:'blue'},{id:'t13',text:'思いつきの',tier:'blue'},{id:'t14',text:'曲がった',tier:'blue'},{id:'t15',text:'手の込んだ',tier:'green'},{id:'t16',text:'一途な',tier:'green'},{id:'t17',text:'根拠のない',tier:'green'},{id:'t18',text:'風変わりな',tier:'green'},{id:'t19',text:'うっすらとした',tier:'green'},{id:'t20',text:'不器用な',tier:'green'},{id:'t21',text:'調教済みの',tier:'purple'},{id:'t22',text:'純然たる',tier:'purple'},{id:'t23',text:'果てしなく',tier:'purple'},{id:'t24',text:'底知れない',tier:'purple'},{id:'t25',text:'本物の',tier:'purple'},{id:'t26',text:'抗えない',tier:'red'},{id:'t27',text:'逃げ場のない',tier:'red'},{id:'t28',text:'選ばれた',tier:'red'},{id:'t29',text:'唯一無二の',tier:'gold'},{id:'t30',text:'伝説の',tier:'gold'},{id:'t_tut01',text:'挑戦する',tier:'red'}];
const ILLUST_TIERS=['blue','green','purple','red','gold'];
const WEEKDAYS=['日','月','火','水','木','金','土'];

const PR=['えらい！','最高！！','天才！！','すごい！！','神！！！','無敵！！','できる！！','やばい！！','完璧！！','キュン！','いいぞ！','前進！！','ナイス！','強い！！','優勝！！','勝ち！！','尊い！！','えっら！','爆進！！','覚醒！！','成長！！','進んだ！','偉業！！','革命！！','拍手！！','いける！','良すぎ！','えぐい！','光ってる！','優秀！！','大正解！','つよつよ！','神速！！','よすぎ！','激アツ！','前のめり！','できてる！','積んでる！','勝者！！','天才か！','センス！','伸びてる！','すばら！','本物！！','継続！！','奇跡！！','気合い！','えらすぎ！','助かる！','完璧か！','誇れ！！','伝説！！','神ムーブ！','大勝利！','才気！！','着火！！','集中！！','丁寧！！','偉すぎる！','尊敬！！','動いた！','進化！！','熱い！！','いい手！','勝機！！','突破！！','神入力！','冴えてる！','流れ来た！','やるね！','美しい！','一歩！！','豪運！！','希望！！','未来！！','燃えてる！','手が早い！','よくやった！','キレてる！','王道！！','優勝です！','もう強い！','今日も勝ち！','積み上げ！','その調子！','まぶしい！','すごすぎ！','大丈夫！','才能！！','行動力！','えら王！','勝ち筋！','抜群！！','いい波！','圧倒！！','冴えた！'].map((t,i)=>({t,c:['#00ffcc','#39ff14','#ffd700','#ff3366','#66ccff','#ff8c00','#00ff99'][i%7]}));
const ADD_PR=['よし！！','起動！！','いいね！！','登録！！','仕込んだ！','やる気！！','開始！！','任務発生！','勝負！！','今日やる！','未来予約！','勝ち筋！','着手！！','置いた！','決まった！','先制！！','動線ヨシ！','えら予約！','積んだ！','一手！！','準備完了！','逃げ道封鎖！','ナイス整理！','今日の弾！'].map((t,i)=>({t,c:['#00ffcc','#39ff14','#ffd700','#66ccff','#ff8c00','#00ff99','#ffd700','#00ffcc','#ff3366'][i%9]}));
const DONE_PR=['完了！！','確定！！','神！！！','撃破！！','制覇！！','勝利！！','任務完了！','えらすぎ！','大成功！','片付いた！','強すぎる！','やり切った！','閉店ガラガラ！','勝ち確！！','脳が喜ぶ！','未来が拍手！','自分えらい！','神処理！','一丁上がり！','突破！！','ナイス完了！','これは偉業！','今日の勝ち！','完了の民！'].map((t,i)=>({t,c:['#ffd700','#ff3366','#ffd700','#39ff14','#00ffcc','#ff8c00','#66ccff','#ffd700','#00ff99'][i%9]}));
const DOPAON_AFTER=[
['3分後','このタスクが終わっていて、ちょっと自分を好きになっていた。'],
['5分後','このタスクが片付いていて、頭の中が少し静かになっていた。'],
['10分後','このタスクを越えた事実が、静かに自信へ変わっていた。'],
['15分後','このタスクから逃げなかった自分を、少し信用できていた。'],
['30分後','このタスクをやっておいてよかったと、本気で思っていた。'],
['1時間後','このタスクの小さい勝ちが、ちゃんと自信になっていた。'],
['2時間後','このタスクを片付けた自分のおかげで、少し強くなっていた。'],
['夜','このタスクが終わっていて、今日の自分も悪くなかったと思えていた。'],
['明日の朝','このタスクを昨日の自分がやってくれていて、かなり助かっていた。'],
['未来','このタスクの小さい完了が、地味に流れを変えていた。'],
['5分後','このタスクが終わったことで、自分を責める理由が一つ減っていた。'],
['10分後','このタスクの完了が、次の自分の背中を押していた。'],
['30分後','このタスクを終えたから、次の自分がラクをしていた。'],
['夜','このタスクをちゃんとやった自分を、寝る前に少し誇れていた。'],
['明日','このタスクを昨日の自分が片付けてくれていて、今日の自分が助かっていた。']
].map(x=>({time:x[0],text:x[1]}));
const DOPAON_QUOTES=['やる気を待つより、手を動かした方が早い。','一歩は小さくていい。止まらない方が強い。','完璧じゃなくていい。完了が強い。','未来の自分は、今の小さい一手に救われる。','自信は先に来ない。終わらせた後についてくる。','小さい完了をなめるな。あれが人生を押す。','気分が乗らない日にも、進めた一歩は本物だ。'].map(t=>({time:'今',text:t}));
const INPUT_PROMPTS=["ここのワンタップで君の未来は明るい。", "1個だけ入れて。それだけで今日は勝ち。", "思いついた今が、一番やりやすい。", "小さく書けば、未来は動く。", "その一行で、今日の自分はかなり強い。", "完璧じゃなくていい。まず置こう。", "とりあえず1個。そこから流れが変わる。", "書いた瞬間に、もう前進してる。", "今の一手はあとで効く。かなり効く。", "迷うより先に、ここへ置こう。", "君が動くと、未来の自分が助かる。", "やる気より先に、入力しちゃおう。"];
const ILLUST_ASSETS={"blue": "data:image/webp;base64,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", "green": "data:image/webp;base64,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", "purple": "data:image/webp;base64,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", "red": "data:image/webp;base64,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", "gold": "data:image/webp;base64,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"};
const ILLUST_LABELS={"blue": "VER 1", "green": "VER 2", "purple": "VER 3", "red": "VER 4", "gold": "VER 5"};

let state={version:APP_VERSION,profile:{name:'',titleId:null},xp:0,freeDays:0,ownedTitles:[],ownedIllusts:[],tasks:[],habits:[],habitLogs:{},chargeTickets:[],chargeHolds:[],tags:[],repeats:[],ui:{completedOpen:false,mode:'tasks'},onboarded:false};
let saveTimer=null;
let hardResetting=false;
let editingId=null;
let editingKind=null;
let editingHabitSlot=null;
let menuWeekdays=[];
let taskChargingId=null;
let habitChargingId=null;
let chargeState='OFF';
let currentChargePhase='off';
let chargeBusy=false;
let chargeInteractionLocked=false;
let rewardUnlockPending=false;
let chargeCanInterrupt=false;
let currentChargeTicket=null;
let taskMenuImportant=false;
let taskSearchQuery='';
let menuSelectedTags=new Set();
let menuRepeatDays=new Set();
let openEditTagTaskId=null;
let calMonth='',calSelDay='';
/* ===== v14 tags / repeats core ===== */
const TAG_COLORS=['#66ccff','#00e5bc','#ffd24a','#ff8bd8','#b98bff','#ff8c6b','#8affc1','#ff6f8c'];
function tagById(id){return (state.tags||[]).find(t=>t.id===id)||null}
function normalizeRepeat(r){return{id:(r&&r.id)||newId(),name:String((r&&r.name)||'').trim()||'無題リピート',freq:['daily','weekly','monthly'].includes(r&&r.freq)?r.freq:'daily',days:Array.isArray(r&&r.days)?r.days.map(Number).filter(n=>Number.isInteger(n)):[],dueTime:/^\d{2}:\d{2}$/.test((r&&r.dueTime)||'')?r.dueTime:'',tags:Array.isArray(r&&r.tags)?r.tags.filter(x=>typeof x==='string'):[],active:!(r&&r.active===false),createdAt:(r&&r.createdAt)||Date.now(),lastGenDay:(r&&r.lastGenDay)||''}}
function repeatById(id){return (state.repeats||[]).find(r=>r.id===id)||null}
function repeatDueOn(rp,day){const d=new Date(day+'T00:00:00');if(Number.isNaN(d.getTime()))return false;if(rp.freq==='daily')return true;if(rp.freq==='weekly')return rp.days.includes(d.getDay());if(rp.freq==='monthly')return rp.days.includes(d.getDate());return false}
function repeatLabel(rp){if(rp.freq==='daily')return '毎日';if(rp.freq==='weekly')return '毎週'+rp.days.slice().sort().map(i=>WEEKDAYS[i]).join('');return '毎月'+(rp.days[0]||1)+'日'}
function ensureRepeatTasks(){
  if(!Array.isArray(state.repeats)||!state.repeats.length)return;
  const day=appDayStr();let added=0;
  state.repeats.forEach(rp=>{
    if(!rp.active||rp.lastGenDay===day||!repeatDueOn(rp,day))return;
    rp.lastGenDay=day;
    const t=createTask(rp.name,{dueDate:day,dueTime:rp.dueTime||'',tags:(rp.tags||[]).slice(),repeatId:rp.id});
    syncTaskDateFlags(t);state.tasks.unshift(t);added++;
  });
  if(added)saveState();
}
let chargeRaf=null;
let chargeTimers=[];
let chargeResolve=null;
let chargePendingOutcome=null;
let goBonusResolve=null;
let bonusResolve=null;

function clamp(n,min,max){return Math.max(min,Math.min(max,n))}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function charLen(t){return Array.from(String(t||'')).length}
function rawValue(){return document.getElementById('mi').value}
function vl(){return rawValue().trim()}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function newId(){return window.crypto&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+'_'+String(Math.random()).slice(2)}
function shuffle(a){return a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1])}
function dateStr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function todayStr(){return dateStr(new Date())}
function addDaysStr(base,delta){const d=new Date(base+'T00:00:00');d.setDate(d.getDate()+delta);return dateStr(d)}
function yesterdayStr(){return addDaysStr(todayStr(),-1)}
function appDayStr(d=new Date()){const x=new Date(d);x.setHours(x.getHours()-5);return dateStr(x)}
function prevAppDayStr(){return addDaysStr(appDayStr(),-1)}
function isTaskToday(t){return !!(t&&t.dueDate===appDayStr())}
function isTaskSkima(t){return !!(t&&t.organizeHoldKind==='skima')}
function isTaskOnHold(t,day=appDayStr()){return !!(t&&(isTaskSkima(t)||(t.organizeHoldUntil&&day<t.organizeHoldUntil)))}
function isTaskBonusGuaranteed(t){return !!(t&&t.importantDate===appDayStr()&&isTaskToday(t))}
function isTaskImportant(t){return !!(t&&(t.importantFlag||isTaskBonusGuaranteed(t)))}
function syncTaskDateFlags(t){
  if(!t)return;
  const day=appDayStr();
  // v13.12.2: 重要は「今日＋重要」の複合状態。
  // 重要上限表示を入れた時に、importantDate だけ先に立って dueDate/todayDate が後追いになる経路ができたため、
  // render/expire 側で見た目が落ちることがあった。ここで必ず正規化してから判定する。
  if(t.importantDate===day){
    t.importantFlag=true;
    t.dueDate=day;
    t.todayDate=day;
    if(!t.swipeCycle||t.swipeCycle<2)t.swipeCycle=2;
    return;
  }
  if(t.importantDate&&t.importantDate!==day)t.importantDate='';
  if(t.todayDate===day&&!t.dueDate)t.dueDate=day;
  if(t.dueDate===day){t.todayDate=day}
  else{t.todayDate='';if(t.swipeCycle&&t.swipeCycle<2)t.swipeCycle=0}
}
function expireDailyFlags(target=state){
  const day=appDayStr();
  if(!target||!Array.isArray(target.tasks))return;
  target.tasks.forEach(t=>{
    syncTaskDateFlags(t);
    if(t.importantDate&&t.importantDate!==day)t.importantDate='';
    if(t.importantDate&&!isTaskToday(t))t.importantDate='';
  });
}
function syncImportantUsage(){
  const day=appDayStr();
  if(!state.ui)state.ui={completedOpen:false,mode:'tasks',importantDay:'',importantUsedIds:[]};
  if(state.ui.importantDay!==day){state.ui.importantDay=day;state.ui.importantUsedIds=[]}
  if(!Array.isArray(state.ui.importantUsedIds))state.ui.importantUsedIds=[];
  const ids=new Set(state.ui.importantUsedIds.filter(id=>state.tasks.some(t=>{syncTaskDateFlags(t);return t.id===id&&isTaskBonusGuaranteed(t)})));
  state.tasks.forEach(t=>{syncTaskDateFlags(t);if(isTaskBonusGuaranteed(t))ids.add(t.id)});
  state.ui.importantUsedIds=[...ids].slice(0,2);
}
function importantCount(){expireDailyFlags(state);syncImportantUsage();return state.ui.importantUsedIds.length}
function canClaimImportant(t){syncImportantUsage();return !!(t&&t.importantDate===appDayStr())||importantCount()<2}
function importantNextCount(t){syncImportantUsage();return Math.min(2,importantCount()+((t&&t.importantDate===appDayStr())?0:1))}
function importantUsageText(t){return isTaskBonusGuaranteed(t)?('BONUS確定 '+importantCount()+'/2'):'重要にした（BONUS枠外）'}
function importantFullText(){return 'BONUS確定枠 2/2。重要タグは付与済み'}
function claimImportant(t){
  if(!t)return false;
  syncImportantUsage();
  const day=appDayStr();
  t.importantFlag=true;
  t.dueDate=day;
  t.todayDate=day;
  if(t.importantDate===day)return true;
  if(importantCount()<2){
    t.importantDate=day;
    if(!state.ui.importantUsedIds.includes(t.id))state.ui.importantUsedIds.push(t.id);
    state.ui.importantUsedIds=[...new Set(state.ui.importantUsedIds)].slice(0,2);
  }
  return true;
}

function levelFromXp(xp){return Math.floor((Number(xp)||0)/LEVEL_STEP)}
function titleById(id){return TITLES.find(t=>t.id===id)||null}

function toggleTopMenu(e){
  if(e)e.stopPropagation();
  const m=document.getElementById('topMenu');
  if(m)m.classList.toggle('open');
}
function closeTopMenu(){const m=document.getElementById('topMenu');if(m)m.classList.remove('open')}
function chooseTopMenu(mode){
  closeTopMenu();
  if(mode==='profile'){openProfile();return;}
  if(mode==='manager'){openTaskManager();return;}
  setMainMode(mode);
}
document.addEventListener('click',e=>{if(!e.target.closest('#brandMenuBtn')&&!e.target.closest('#topMenu'))closeTopMenu()});
function currentMode(){const m=state.ui&&state.ui.mode;return m==='habits'||m==='game'||m==='cal'?m:'tasks'}

function defaultTaskConfig(){return{name:'',dueDate:'',dueTime:'',tags:[],organizeHoldUntil:'',organizeHoldKind:'',taskType:'normal',habitKind:'do',repeatFreq:'none',repeatMonthDay:1}}
function defaultHabitName(){return '無題習慣'}
function defaultHabit(){return normalizeHabit({id:newId(),name:defaultHabitName(),habitKind:'avoid',createdAt:Date.now(),active:true})}
function normalizeTask(t){
  const done=t&&t.state==='done';
  return {
    id:(t&&t.id)||newId(),
    name:String((t&&t.name)||'').trim()||'無題タスク',
    state:['idle','charging','done'].includes(t&&t.state)?t.state:'idle',
    rewardDone:Boolean(t&&t.rewardDone)||(done&&!(t&&Object.prototype.hasOwnProperty.call(t,'rewardDone'))),
    scheduledAwarded:Boolean(t&&t.scheduledAwarded),
    createdAt:(t&&t.createdAt)||Date.now(),
    doneAt:(t&&t.doneAt)||null,
    dueDate:(t&&t.dueDate)||'',
    organizeHoldUntil:/^\d{4}-\d{2}-\d{2}$/.test((t&&t.organizeHoldUntil)||'')?t.organizeHoldUntil:'',
    organizeHoldKind:(t&&t.organizeHoldKind)==='skima'?'skima':'',
    todayDate:(t&&t.todayDate)||'',
    importantDate:(t&&t.importantDate)||'',
    importantFlag:!!(t&&(t.importantFlag||t.important||t.importantDate)),
    dueTime:/^\d{2}:\d{2}$/.test((t&&t.dueTime)||'')?t.dueTime:'',
    tags:Array.isArray(t&&t.tags)?[...new Set(t.tags.filter(x=>typeof x==='string'&&x))]:[],
    repeatId:(t&&t.repeatId)||null,
    swipeCycle:Number(t&&t.swipeCycle)||0,
    taskType:'normal',
    tutorial: !!(t && t.tutorial),
    extras:normalizeTaskExtras(t&&t.extras)
  };
}
function normalizeTaskExtras(extras){
  const out={subtasks:[],memo:'',conditions:[]};
  if(!extras||typeof extras!=='object')return out;
  out.memo=String(extras.memo||'');
  if(Array.isArray(extras.subtasks))out.subtasks=extras.subtasks.filter(Boolean).map(x=>({id:(x&&x.id)||newId(),text:String((x&&x.text)||'').trim(),done:!!(x&&x.done)})).filter(x=>x.text);
  if(Array.isArray(extras.conditions))out.conditions=extras.conditions.filter(Boolean).map(x=>({id:(x&&x.id)||newId(),text:String((x&&x.text)||'').trim(),done:!!(x&&x.done)})).filter(x=>x.text);
  return out;
}
function taskToHabit(t){return normalizeHabit({id:(t&&t.id)||newId(),name:(t&&t.name)||defaultHabitName(),habitKind:(t&&t.habitKind)||((t&&t.habit&&t.habit.mode)||'do'),createdAt:(t&&t.createdAt)||Date.now(),active:true})}
function normalizeHabit(h){
  return {
    id:(h&&h.id)||newId(),
    name:String((h&&h.name)||'').trim()||defaultHabitName(),
    habitKind:(h&&h.habitKind)==='avoid'?'avoid':'do',
    createdAt:(h&&h.createdAt)||Date.now(),
    active:h&&Object.prototype.hasOwnProperty.call(h,'active')?Boolean(h.active):true,
    slot:Number.isInteger(h&&h.slot)?h.slot:null,
    tutorial: !!(h && h.tutorial),
    checks:Array.isArray(h&&h.checks)?h.checks.filter(Boolean).map(x=>String(x).trim()).filter(Boolean):[]
  };
}
function normalizeLogs(logs){
  const out={};
  if(!logs||typeof logs!=='object')return out;
  Object.keys(logs).forEach(hid=>{
    if(!logs[hid]||typeof logs[hid]!=='object')return;
    out[hid]={};
    Object.keys(logs[hid]).forEach(day=>{
      const v=logs[hid][day];
      if(v&&typeof v==='object')out[hid][day]={status:v.status==='failed'?'failed':'done',checkedAt:v.checkedAt||Date.now(),rewardDone:!!v.rewardDone};
      else if(v)out[hid][day]={status:'done',checkedAt:Date.now()};
    });
  });
  return out;
}
function normalizeState(s){
  const out={version:APP_VERSION,profile:{name:'',titleId:null},xp:0,freeDays:0,ownedTitles:[],ownedIllusts:[],tasks:[],habits:[],habitLogs:{},chargeTickets:[],chargeHolds:[],ui:{completedOpen:false,mode:'tasks',importantDay:'',importantUsedIds:[]}};
  if(s&&typeof s==='object')Object.assign(out,s);
  out.profile=Object.assign({name:'',titleId:null},(s&&s.profile)||{});out.ui=Object.assign({completedOpen:false,mode:'tasks',importantDay:'',importantUsedIds:[]},out.ui||{});
  out.xp=Number(out.xp)||0;out.freeDays=Number(out.freeDays)||0;
  out.ownedTitles=Array.isArray(out.ownedTitles)?[...new Set(out.ownedTitles)]:[];
  out.ownedIllusts=Array.isArray(out.ownedIllusts)?[...new Set(out.ownedIllusts)]:[];
  const rawTasks=Array.isArray(out.tasks)?out.tasks:[];
  const normalTasks=[];
  const movedHabits=[];
  rawTasks.forEach(t=>{
    const isHabit=(t&&t.taskType)==='habit'||(t&&t.type)==='habit'||Boolean(t&&t.habit);
    if(isHabit)movedHabits.push(taskToHabit(t));
    else normalTasks.push(normalizeTask(t));
  });
  const existingHabits=Array.isArray(out.habits)?out.habits.map(normalizeHabit):[];
  const byId=new Map();
  existingHabits.concat(movedHabits).forEach(h=>{if(!byId.has(h.id))byId.set(h.id,h)});
  out.tasks=normalTasks;
  expireDailyFlags(out);
  out.habits=[...byId.values()];
  out.habitLogs=normalizeLogs(out.habitLogs);
  out.tags=Array.isArray(out.tags)?out.tags.filter(Boolean).map(tg=>({id:(tg&&tg.id)||newId(),name:String((tg&&tg.name)||'').trim().slice(0,12),color:/^#[0-9a-fA-F]{6}$/.test((tg&&tg.color)||'')?tg.color:'#66ccff'})).filter(tg=>tg.name):[];
  out.repeats=Array.isArray(out.repeats)?out.repeats.filter(Boolean).map(normalizeRepeat):[];
  out.chargeTickets=Array.isArray(out.chargeTickets)?out.chargeTickets.filter(Boolean).map(x=>({id:(x&&x.id)||newId(),type:(x&&x.type)||'task',sourceId:(x&&x.sourceId)||'',name:(x&&x.name)||'',force:(x&&x.force)||null,outcome:(x&&x.outcome)||((x&&x.force)||null),tutorial:!!(x&&x.tutorial),createdAt:(x&&x.createdAt)||Date.now()})):[];
  out.chargeHolds=Array.isArray(out.chargeHolds)?out.chargeHolds.filter(Boolean).map(x=>({id:(x&&x.id)||newId(),type:(x&&x.type)||'task',sourceId:(x&&x.sourceId)||'',name:(x&&x.name)||'',force:(x&&x.force)||null,outcome:(x&&x.outcome)||((x&&x.force)||'white'),rainbow:!!(x&&x.rainbow),tutorial:!!(x&&x.tutorial),createdAt:(x&&x.createdAt)||Date.now()})):[];
  out.ui=Object.assign({completedOpen:false,mode:'tasks',importantDay:'',importantUsedIds:[]},out.ui||{},(s&&s.ui)||{});
  if(!['tasks','habits','game','cal'].includes(out.ui.mode))out.ui.mode='tasks';
  if(!Array.isArray(out.ui.importantUsedIds))out.ui.importantUsedIds=[];
  out.version=APP_VERSION;
  return out;
}
function cleanupLegacyDefaultHabit(){
  const legacy='パチスロをしない';
  const removable=new Set();
  state.habits=state.habits.filter(h=>{
    if(!h||h.name!==legacy)return true;
    const logs=state.habitLogs&&state.habitLogs[h.id];
    const hasLogs=logs&&Object.keys(logs).length>0;
    if(!hasLogs){removable.add(h.id);return false}
    return true;
  });
  removable.forEach(id=>{if(state.habitLogs)delete state.habitLogs[id]});
}
function safeParse(raw){try{return raw?JSON.parse(raw):null}catch(e){return null}}
function loadState(){
  for(const k of [STORAGE_KEY,...LEGACY_KEYS,BACKUP_KEY]){
    const parsed=safeParse(localStorage.getItem(k));
    if(parsed){
      state=normalizeState(parsed);
      cleanupLegacyDefaultHabit();
      saveNow();
      return;
    }
  }
  state=normalizeState(null);
  cleanupLegacyDefaultHabit();
}
function saveNow(){
  if(hardResetting)return;
  try{
    const old=localStorage.getItem(STORAGE_KEY);
    if(old)localStorage.setItem(BACKUP_KEY,old);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(normalizeState(state)));
  }catch(e){showToast('保存に失敗。空き容量を確認して')}
}
function saveState(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{saveTimer=null;saveNow()},90)}
window.addEventListener('pagehide',saveNow);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveNow()});
function showToast(msg){/* 操作ログは出さない */}

function rollTier(){const r=Math.random();if(r<0.47)return null;if(r<0.80)return 'white';return rollBonusTier()}
function rollBonusTier(){const b=Math.random();if(b<0.10)return 'white';if(b<0.29)return 'blue';if(b<0.61)return 'green';if(b<0.84)return 'purple';if(b<0.96)return 'red';return 'gold'}
function grantReward(tier){
  const T=TIERS[tier];const canIllust=tier!=='white'&&!state.ownedIllusts.includes(tier);const pool=['title','days'];if(canIllust)pool.push('illust');const type=rnd(pool);
  if(type==='illust'){state.ownedIllusts.push(tier);return{kind:'illust',tier}}
  if(type==='days'){state.freeDays+=T.days;return{kind:'days',tier,days:T.days}}
  const avail=TITLES.filter(t=>t.tier===tier&&!state.ownedTitles.includes(t.id));
  if(avail.length){const got=rnd(avail);state.ownedTitles.push(got.id);if(!state.profile.titleId)state.profile.titleId=got.id;return{kind:'title',tier,title:got}}
  state.xp+=T.xp;return{kind:'levelup',tier,xp:T.xp}
}
function runReward(){const tier=rollTier();if(!tier)return;const result=grantReward(tier);saveState();renderHeader();showReward(result)}
function runLevelBonus(){const result=grantReward(rollBonusTier());saveState();renderHeader();showReward(result,'整理レベルアップ BONUS')}
function tierIconSVG(tier){const c=TIERS[tier].color;return '<svg viewBox="0 0 100 100" style="color:'+c+'"><polygon points="50,6 90,28 90,72 50,94 10,72 10,28" fill="none" stroke="'+c+'" stroke-width="3"/><polygon points="50,20 78,36 78,64 50,80 22,64 22,36" fill="'+c+'" opacity="0.14"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="Reggae One,sans-serif" font-size="30" font-weight="900" fill="'+c+'">'+TIERS[tier].jp+'</text></svg>'}
function showReward(res,labelOverride){tutHook('reward_shown',res);
  const ov=document.getElementById('rewardOverlay'),pop=ov.querySelector('.popup'),icon=document.getElementById('rwIcon'),tierLabel=document.getElementById('rwTierLabel'),typeEl=document.getElementById('rwType'),mainEl=document.getElementById('rwMain'),subEl=document.getElementById('rwSub');
  if(pop){pop.className='popup tier-'+res.tier}
  const T=TIERS[res.tier];tierLabel.textContent=T.jp+' TIER';tierLabel.style.color=T.color;icon.innerHTML=tierIconSVG(res.tier);mainEl.style.color='';mainEl.innerHTML='';subEl.textContent='';
  if(res.kind==='title'){typeEl.textContent=labelOverride||'称号 GET';mainEl.innerHTML='「<span style="color:'+T.color+'">'+escapeHtml(res.title.text)+'</span>」';subEl.textContent='肩書きに追加された'}
  else if(res.kind==='days'){typeEl.textContent=labelOverride||'無料期間 GET';mainEl.textContent='+'+res.days+'日';mainEl.style.color=T.color;subEl.textContent='現在無料期間 +'+state.freeDays+'日 追加！'}
  else if(res.kind==='illust'){typeEl.textContent=labelOverride||'イラスト GET';icon.innerHTML=illustImageHTML(res.tier,ILLUST_LABELS[res.tier]||res.tier);mainEl.textContent=(ILLUST_LABELS[res.tier]||T.jp)+' 解放';mainEl.style.color=T.color;subEl.textContent='歴代ヘアスタイルをプロフィールに追加'}
  else if(res.kind==='levelup'){typeEl.textContent=labelOverride||'レベルアップ';mainEl.textContent='+'+res.xp+' PT';mainEl.style.color=T.color;subEl.textContent='Lv.'+levelFromXp(state.xp)}
  ov.classList.add('show');icon.classList.remove('animate');void icon.offsetWidth;icon.classList.add('animate');
  if(navigator.vibrate){if(res.tier==='gold'||res.tier==='red')navigator.vibrate([60,40,60,40,140]);else navigator.vibrate(50)}
}
function closeReward(){
  const ov=document.getElementById('rewardOverlay');
  if(ov)ov.classList.remove('show');
  if(rewardUnlockPending){
    rewardUnlockPending=false;
    finishChargeInteraction();
  }
  requestAnimationFrame(()=>tutHook('reward_closed'));
}

function renderHeader(){
  const nm=state.profile.name,t=titleById(state.profile.titleId),nameEl=document.getElementById('hdName'),titleEl=document.getElementById('hdTitle');
  if(titleEl){
    if(t){titleEl.textContent=t.text;titleEl.style.color=TIERS[t.tier].color;}
    else{titleEl.textContent='肩書き';titleEl.style.color='#4a6080';}
  }
  if(nameEl)nameEl.textContent=nm||'名前未設定';
  document.getElementById('hdLv').textContent=levelFromXp(state.xp);
  document.getElementById('hdFree').textContent='+'+state.freeDays+'日';
  const hf=document.getElementById('hdLevelFill');if(hf)hf.style.width=Math.round((state.xp%LEVEL_STEP)/LEVEL_STEP*100)+'%';
}
function renderNamePreview(){const el=document.getElementById('namePreview'),nm=state.profile.name,t=titleById(state.profile.titleId);if(!nm){el.innerHTML='<span class="pv-empty">名前を入力すると<br>ここに表示される</span>';return}el.innerHTML=(t?'<span class="pv-ttl" style="color:'+TIERS[t.tier].color+'">'+escapeHtml(t.text)+'</span> ':'')+'<span class="pv-nm">'+escapeHtml(nm)+'</span>'}
function renderProfileStats(){const lv=levelFromXp(state.xp),inLv=state.xp%LEVEL_STEP,pct=Math.round(inLv/LEVEL_STEP*100);document.getElementById('pfLv').textContent=lv;document.getElementById('pfFree').textContent='+'+state.freeDays+'日';document.getElementById('pfFreeNote').textContent='現在無料期間 +'+state.freeDays+'日 追加！';document.getElementById('pfLevelFill').style.width=pct+'%';document.getElementById('pfLevelNote').textContent='NEXT +'+(LEVEL_STEP-inLv)+' PT / TOTAL '+state.xp+' PT'}
function renderTitleGrid(){const grid=document.getElementById('titleGrid'),cnt=document.getElementById('titleCount');grid.innerHTML='';cnt.textContent='('+state.ownedTitles.length+'/'+TITLES.length+')';const none=document.createElement('div');none.className='title-none'+(state.profile.titleId?'':' sel');none.textContent='なし';none.onclick=()=>{state.profile.titleId=null;saveState();renderTitleGrid();renderNamePreview();renderHeader()};grid.appendChild(none);TITLES.slice().sort((a,b)=>TIER_ORDER.indexOf(a.tier)-TIER_ORDER.indexOf(b.tier)).forEach(t=>{const owned=state.ownedTitles.includes(t.id),sel=state.profile.titleId===t.id,chip=document.createElement('div');chip.className='title-chip'+(owned?' owned':' locked')+(sel?' sel':'');chip.textContent=owned?t.text:'？？？';if(owned){chip.style.color=sel?TIERS[t.tier].color:'#c8d8f0';if(sel)chip.style.borderColor=TIERS[t.tier].color;chip.onclick=()=>{state.profile.titleId=sel?null:t.id;saveState();renderTitleGrid();renderNamePreview();renderHeader()}}grid.appendChild(chip)})}
function illustPlaceholderSVG(tier){const c=TIERS[tier].color;return '<svg viewBox="0 0 100 100"><defs><radialGradient id="g'+tier+'" cx="50%" cy="42%" r="62%"><stop offset="0%" stop-color="'+c+'" stop-opacity="0.55"/><stop offset="100%" stop-color="'+c+'" stop-opacity="0.05"/></radialGradient></defs><rect width="100" height="100" fill="#06060e"/><rect width="100" height="100" fill="url(#g'+tier+')"/><polygon points="50,22 72,38 72,64 50,80 28,64 28,38" fill="none" stroke="'+c+'" stroke-width="2.5" opacity="0.9"/><circle cx="50" cy="51" r="9" fill="'+c+'" opacity="0.85"/></svg>'}
function illustImageHTML(tier,alt){const src=ILLUST_ASSETS[tier];if(!src)return illustPlaceholderSVG(tier);return '<img src="'+src+'" alt="'+escapeHtml(alt||ILLUST_LABELS[tier]||tier)+'">'}
function renderIllustGrid(){const grid=document.getElementById('illustGrid');grid.innerHTML='';ILLUST_TIERS.forEach(tier=>{const owned=state.ownedIllusts.includes(tier),wrap=document.createElement('div'),cell=document.createElement('div'),cap=document.createElement('div');cell.className='illust-cell'+(owned?'':' locked');cell.innerHTML=owned?illustImageHTML(tier,ILLUST_LABELS[tier]||tier):'<span class="lockmark">🔒</span>';cap.className='illust-cap';cap.textContent=ILLUST_LABELS[tier]||TIERS[tier].jp;cap.style.color=owned?TIERS[tier].color:'#4a6080';wrap.appendChild(cell);wrap.appendChild(cap);grid.appendChild(wrap)})}
function onNameInput(){state.profile.name=document.getElementById('nameInput').value;renderNamePreview();renderHeader();saveState();if(state.profile.name)tutHook('name_changed')}
function openProfile(){tutHook('profile_open');document.getElementById('mi').blur();document.getElementById('nameInput').value=state.profile.name||'';renderProfileStats();renderNamePreview();renderTitleGrid();renderIllustGrid();document.getElementById('profileOverlay').classList.add('show');syncViewport()}
function closeProfile(){document.getElementById('profileOverlay').classList.remove('show');tutHook('profile_close')}

function makeDopaonMessage(taskName){const isAfter=Math.random()<0.8,item=isAfter?rnd(DOPAON_AFTER):rnd(DOPAON_QUOTES);const nm=(state&&state.profile&&state.profile.name?state.profile.name:'自分');const timeLabel=isAfter?(item.time+'の'+nm):('今の'+nm);return{time:timeLabel,text:item.text}}
let currentDopaonEl=null,currentDopaonAnim=null,currentDopaonTaskId=null,currentDopaonMsg=null,currentDopaonTimer=null,recentAddedTaskId=null,undoToastEl=null,undoTimer=null;
let openExtraTaskId=null,openExtraTab='conditions',openSubtaskSwipeId=null,subtaskInputTaskId=null,openTaskSettingsId=null,settingsPanel='';
function taskExtras(t){if(!t.extras)t.extras=normalizeTaskExtras(null);else t.extras=normalizeTaskExtras(t.extras);return t.extras}
function taskHasExtras(t){const ex=taskExtras(t);return ex.subtasks.length>0||ex.conditions.length>0||String(ex.memo||'').trim().length>0}
function preferredExtraTab(t){const ex=taskExtras(t);return ex.conditions.length?'conditions':(String(ex.memo||'').trim()?'memo':'conditions')}
function closeTaskExtras(doRender=false){if(openExtraTaskId||openSubtaskSwipeId||subtaskInputTaskId){openExtraTaskId=null;openSubtaskSwipeId=null;subtaskInputTaskId=null;openEditTagTaskId=null;if(doRender)render();tutHook('extras_close');return true}return false}
function toggleTaskExtras(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;clearTaskChargePreview(null,false);openSubtaskSwipeId=null;subtaskInputTaskId=null;if(openExtraTaskId===id){openExtraTaskId=null;saveState();render();tutHook('extras_close');return}openExtraTaskId=id;openExtraTab=preferredExtraTab(t);saveState();render();tutHook('extras_open',id)}
function setTaskExtraTab(id,tab){if(openExtraTaskId!==id)return;if(tab==='edit'){openTaskSettings(id);return}openExtraTab=(tab==='memo')?'memo':'conditions';openSubtaskSwipeId=null;subtaskInputTaskId=null;openEditTagTaskId=null;render();if(tut&&tut.active)setTimeout(tutRender,60);if(tab==='memo')tutHook('memo_tab')}
function startSubtaskInput(id){
  const t=state.tasks.find(x=>x.id===id);if(!t)return;
  openExtraTaskId=id;openExtraTab='subtasks';openSubtaskSwipeId=null;subtaskInputTaskId=id;render();
  if(tut&&tut.active)setTimeout(tutRender,60);
  setTimeout(()=>{const input=document.querySelector('[data-subtask-input="'+id+'"]');if(input)input.focus({preventScroll:true})},30);
}
function commitSubtaskInput(id,value){
  const t=state.tasks.find(x=>x.id===id);if(!t)return;
  const text=String(value||'').trim();
  if(text){taskExtras(t).subtasks.unshift({id:newId(),text,done:false});saveState()}
  subtaskInputTaskId=null;openExtraTaskId=id;openExtraTab='subtasks';render();tutHook('subtask_saved');
}
function cancelSubtaskInput(id){if(subtaskInputTaskId===id){subtaskInputTaskId=null;render()}}
function addSubtask(id){startSubtaskInput(id)}
function toggleSubtaskDone(taskId,subId){const t=state.tasks.find(x=>x.id===taskId);if(!t)return;const st=taskExtras(t).subtasks.find(x=>x.id===subId);if(!st)return;st.done=!st.done;openSubtaskSwipeId=null;saveState();render()}
function deleteSubtask(taskId,subId){const t=state.tasks.find(x=>x.id===taskId);if(!t)return;const ex=taskExtras(t);const idx=ex.subtasks.findIndex(x=>x.id===subId);if(idx<0)return;ex.subtasks.splice(idx,1);openSubtaskSwipeId=null;saveState();render()}
function updateTaskMemo(id,value){const t=state.tasks.find(x=>x.id===id);if(!t)return;taskExtras(t).memo=value;saveState()}

function clearInlineDopaon(doRender=true){if(currentDopaonTimer){clearTimeout(currentDopaonTimer);currentDopaonTimer=null}currentDopaonTaskId=null;currentDopaonMsg=null;if(doRender)render()}
function clearTaskChargePreview(exceptId=null,doRender=true){let changed=false;state.tasks.forEach(t=>{if(t.state==='charging'&&(!exceptId||t.id!==exceptId)){t.state='idle';if(taskChargingId===t.id)taskChargingId=null;changed=true}});if(currentDopaonTaskId&&(!exceptId||currentDopaonTaskId!==exceptId)){currentDopaonTaskId=null;currentDopaonMsg=null;changed=true}if(changed){saveState();if(doRender)render()}return changed}
function overlayShown(id){const el=document.getElementById(id);return !!(el&&el.classList.contains('show'))}
function appLockedForCompletion(){return !!(chargeInteractionLocked||overlayShown('rewardOverlay')||overlayShown('goBonusGate')||overlayShown('bonusFrameOverlay'))}
function clearFloatingDopaon(){if(currentDopaonAnim){try{currentDopaonAnim.cancel()}catch(e){}}currentDopaonAnim=null;if(currentDopaonEl&&currentDopaonEl.parentNode)currentDopaonEl.remove();currentDopaonEl=null}
function closeInlineDopaon(id){if(id&&currentDopaonTaskId!==id)return;clearTaskChargePreview(null,true)}
function showDopaonMessage(taskName,taskId){
  clearFloatingDopaon();
  const msg=makeDopaonMessage(taskName);
  if(taskId){
    if(currentDopaonTimer){clearTimeout(currentDopaonTimer);currentDopaonTimer=null}
    currentDopaonTaskId=taskId;currentDopaonMsg=msg;recentAddedTaskId=taskId;
    render();
    setTimeout(()=>{if(recentAddedTaskId===taskId){recentAddedTaskId=null}},1400);
    return;
  }
  const el=document.createElement('div');currentDopaonEl=el;el.className='dream';
  el.innerHTML='<span class="dream-time">'+escapeHtml(msg.time)+'</span><span class="dream-quote">「'+escapeHtml(msg.text)+'」</span>';
  document.getElementById('sf8').appendChild(el);
  const anim=el.animate([{opacity:0,transform:'translateY(6px) scale(.98)'},{opacity:1,transform:'translateY(0) scale(1)',offset:.07},{opacity:1,offset:.92},{opacity:0,transform:'translateY(-8px) scale(.98)'}],{duration:14000,fill:'forwards',easing:'cubic-bezier(.18,.8,.22,1)'});
  currentDopaonAnim=anim;anim.onfinish=()=>{if(currentDopaonEl===el)currentDopaonEl=null;el.remove()}
}

let isComposing=false,lastCountedLen=0,compBaseLen=0,lastDirectPraiseAt=0,lastPraiseOpAt=0,lastCompData='',livePraise=0,busyLanes=new Set(),activePraise=new Set(),baseViewportHeight=0;
const NS='http://www.w3.org/2000/svg',FF="'Reggae One', system-ui, sans-serif",PRAISE_LIFE=2800,MAX_PRAISE=4,P_MARGIN=10;
function viewportHeight(){return window.visualViewport?window.visualViewport.height:window.innerHeight}
function viewportTop(){return window.visualViewport?window.visualViewport.offsetTop:0}
function initBaseViewport(force){const h=Math.max(window.innerHeight,viewportHeight());if(force||!baseViewportHeight){baseViewportHeight=h;return}const inputFocused=document.activeElement===document.getElementById('mi');if(!inputFocused&&h>baseViewportHeight)baseViewportHeight=h}
function syncViewport(){initBaseViewport(false);const vvTop=viewportTop(),vvH=viewportHeight(),ae=document.activeElement,inputFocused=ae===document.getElementById('mi'),settingsScreen=document.getElementById('taskSettingsScreen'),settingsFocused=!!(settingsScreen&&settingsScreen.classList.contains('open')&&ae&&ae.closest&&ae.closest('#taskSettingsScreen')&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName)),rawLift=baseViewportHeight-vvH,lift=inputFocused?Math.max(0,Math.round(rawLift)):0,settingsLift=settingsFocused?Math.max(0,Math.round(rawLift)):0;document.documentElement.style.setProperty('--app-top',Math.round(vvTop)+'px');document.documentElement.style.setProperty('--app-h',Math.round(baseViewportHeight)+'px');document.documentElement.style.setProperty('--kb',lift+'px');document.documentElement.style.setProperty('--settings-kb',settingsLift+'px');settingsScreen?.classList.toggle('settings-keyboard-open',settingsLift>80||settingsFocused);lockScroll()}
function lockScroll(){if(window.scrollX!==0||window.scrollY!==0)window.scrollTo(0,0)}
function isSideMark(ch){return /[！!？?‼⁉⁈♡♥❤★☆♪♫♬〜ー…‥・。、,.，．]/.test(ch)}
function grps(txt){const cs=Array.from(txt),gs=[];let i=0;while(i<cs.length){if(isSideMark(cs[i])){let j=i;while(j<cs.length&&isSideMark(cs[j]))j++;gs.push({side:true,t:cs.slice(i,j).join('')});i=j}else{gs.push({side:false,t:cs[i]});i++}}return gs}
function textSize(mode){if(mode==='done')return 26+Math.floor(Math.random()*7);if(mode==='add')return 22+Math.floor(Math.random()*7);return 17+Math.floor(Math.random()*8)}
function getTextBox(groups,fs){const pad=Math.ceil(fs*.55),lh=Math.ceil(fs*1.34),maxMark=groups.reduce((m,g)=>g.side?Math.max(m,charLen(g.t)):m,1);return{w:Math.ceil(Math.max(fs,maxMark*fs*.62)+pad*2),h:Math.ceil(groups.length*lh+pad),pad,lh}}
function txPair(svg,x,y,fs,txt,col){const outer=Math.max(4,fs*.24),inner=Math.max(2,fs*.11);[["none","white",outer],[col,"#111",inner]].forEach(([fill,stroke,sw])=>{const t=document.createElementNS(NS,'text');t.setAttribute('x',x);t.setAttribute('y',y);t.setAttribute('text-anchor','middle');t.setAttribute('dominant-baseline','central');t.setAttribute('font-family',FF);t.setAttribute('font-size',fs);t.setAttribute('font-weight','900');t.setAttribute('fill',fill);t.setAttribute('stroke',stroke);t.setAttribute('stroke-width',sw);t.setAttribute('stroke-linejoin','round');if(fill!=='none')t.setAttribute('paint-order','stroke');t.textContent=txt;svg.appendChild(t)})}
function drawPraiseText(svg,item,groups,box,fs){let cy=box.pad/2+box.lh/2;groups.forEach(g=>{const len=Math.max(1,charLen(g.t)),fitFs=g.side?Math.min(fs,Math.max(10,(box.w-box.pad*.65)/(len*.62))):fs;txPair(svg,box.w/2,cy,fitFs,g.t,item.c);cy+=box.lh})}
function getPraiseOrigin(){const pc=document.getElementById('pc');if(!pc)return{x:180,y:360};return{x:pc.clientWidth/2,y:pc.clientHeight+22}}
function praisePointRow(W,margin,intervals){
  const total=intervals.reduce((a,b)=>a+b,0),span=W*(1-margin*2),xs=[W*margin];let acc=0;
  intervals.forEach(v=>{acc+=v;xs.push(W*margin+span*acc/total)});
  return xs;
}
function buildPraiseLanes(){
  const pc=document.getElementById('pc');if(!pc)return[];const W=pc.clientWidth,H=pc.clientHeight;
  // 下段: ・....・...・..・.・..・...・....・
  // 上段: ・.....・....・...・..・...・....・.....・（下段と1対1対応）
  const bottomXs=praisePointRow(W,.10,[4,3,2,1,2,3,4]);
  const upperXs=praisePointRow(W,.06,[5,4,3,2,3,4,5]);
  const oy=H+24;
  const ty=clamp(H*.24,86,Math.max(96,H-170));
  return bottomXs.map((ox,i)=>{const tx=upperXs[i],dx=tx-ox,dy=ty-oy;return{index:i,ox,oy,tx,ty,angle:Math.atan2(dy,dx)*180/Math.PI,len:Math.hypot(dx,dy)}});
}
function pointOnPraiseLane(lane,t){return{x:lane.ox+(lane.tx-lane.ox)*t,y:lane.oy+(lane.ty-lane.oy)*t}}
function fitsInPraiseArea(x,y,w,h){const pc=document.getElementById('pc');return x-w/2>P_MARGIN&&x+w/2<pc.clientWidth-P_MARGIN&&y-h/2>P_MARGIN&&y+h/2<pc.clientHeight-P_MARGIN}
function pickPraisePosition(w,h){
  const lanes=buildPraiseLanes();if(!lanes.length)return null;
  const free=lanes.filter(l=>!busyLanes.has(l.index));if(!free.length)return null;
  const pool=shuffle(free);
  for(const lane of pool){
    const tBase=.48+Math.random()*.23;
    const tries=[tBase,tBase-.08,tBase+.08,.56,.66,.46];
    for(const tRaw of tries){
      const t=clamp(tRaw,.38,.78),p=pointOnPraiseLane(lane,t);
      if(fitsInPraiseArea(p.x,p.y,w,h))return{lane,x:p.x,y:p.y,angle:lane.angle};
    }
  }
  return null;
}
function spawnPraise(mode='input',forcedItem=null){if(livePraise>=MAX_PRAISE)return false;syncViewport();const pc=document.getElementById('pc');if(!pc)return false;const item=forcedItem||rnd(mode==='done'?DONE_PR:mode==='add'?ADD_PR:PR),groups=grps(item.t),fs=textSize(mode),box=getTextBox(groups,fs),pos=pickPraisePosition(box.w,box.h);if(!pos||!pos.lane)return false;const rot=clamp(pos.angle+90,-30,30);busyLanes.add(pos.lane.index);livePraise++;const svg=document.createElementNS(NS,'svg');svg.setAttribute('width',box.w);svg.setAttribute('height',box.h);svg.setAttribute('viewBox','0 0 '+box.w+' '+box.h);svg.style.cssText='position:absolute;left:'+(pos.x-box.w/2).toFixed(1)+'px;top:'+(pos.y-box.h/2).toFixed(1)+'px;transform:rotate('+rot.toFixed(1)+'deg) scale(.96);opacity:0;pointer-events:none;filter:drop-shadow(0 2px 5px rgba(0,0,0,.45));';drawPraiseText(svg,item,groups,box,fs);pc.appendChild(svg);activePraise.add(svg);const scale=mode==='input'?1:1.06;const anim=svg.animate([{opacity:0,transform:'rotate('+rot.toFixed(1)+'deg) translateY(10px) scale(.85)'},{opacity:1,transform:'rotate('+rot.toFixed(1)+'deg) translateY(0) scale('+scale+')',offset:.10},{opacity:1,transform:'rotate('+rot.toFixed(1)+'deg) translateY(-4px) scale(1)',offset:.65},{opacity:.7,transform:'rotate('+rot.toFixed(1)+'deg) translateY(-10px) scale(.98)',offset:.88},{opacity:0,transform:'rotate('+rot.toFixed(1)+'deg) translateY(-22px) scale(.93)'}],{duration:PRAISE_LIFE,easing:'cubic-bezier(.18,.8,.22,1)',fill:'forwards'});anim.onfinish=()=>releasePraise(svg,pos.lane.index);anim.oncancel=()=>releasePraise(svg,pos.lane.index);return true}
function releasePraise(svg,laneIndex){if(!activePraise.has(svg))return;activePraise.delete(svg);busyLanes.delete(laneIndex);livePraise=Math.max(0,livePraise-1);if(svg.parentNode)svg.parentNode.removeChild(svg)}
function enqueuePraise(amount){if(amount<=0)return;for(let i=0;i<amount;i++){if(!spawnPraise('input'))break}}
function clearPraiseQueue(){}
function resetPraiseInput(){lastCountedLen=charLen(rawValue());compBaseLen=lastCountedLen;lastCompData='';clearPraiseQueue()}
function praiseOne(){
  const now=performance.now();
  if(now-lastPraiseOpAt<28)return;
  lastPraiseOpAt=now;
  lastDirectPraiseAt=now;
  enqueuePraise(1);
}
function onBeforeInput(e){
  syncViewport();
  if(!e)return;
  const type=e.inputType||'';
  if(type.indexOf('delete')===0)return;
  if(type.indexOf('insert')===0)praiseOne();
}
function onCompStart(){syncViewport();isComposing=true;compBaseLen=charLen(rawValue());lastCountedLen=compBaseLen;lastCompData=''}
function onCompUpdate(e){
  syncViewport();
  const comp=e&&typeof e.data==='string'?e.data:'';
  if(comp&&comp!==lastCompData){praiseOne();lastCompData=comp}
  updateInputButtons(rawValue().trim()||comp)
}
function onCompEnd(e){syncViewport();isComposing=false;lastCompData='';setTimeout(()=>{lastCountedLen=charLen(rawValue());updateInputButtons(vl());renderInputPrompt()},0)}
function onIn(e){
  syncViewport();
  const raw=rawValue();
  updateInputButtons(raw.trim());renderInputPrompt();
  const qd=quickDraftTaskId&&state.tasks.find(x=>x&&x.id===quickDraftTaskId&&x.state!=='done');
  if(qd&&raw.trim()){qd.name=raw.trim();qd.isAutoUntitled=false;qd.updatedAt=Date.now();saveState()}
  if(isComposing||(e&&e.isComposing)){lastCountedLen=charLen(raw);return}
  const type=e&&e.inputType?e.inputType:'';
  if(type.indexOf('delete')===0){lastCountedLen=charLen(raw);if(!raw)resetPraiseInput();return}
  if(type.indexOf('insert')===0)praiseOne();
  lastCountedLen=charLen(raw);
  if(!raw)resetPraiseInput();
}
function onInputFocus(){document.body.classList.add('keyboard-open');document.getElementById('sf8')?.classList.add('keyboard-open');closeTaskExtras(false);clearTaskChargePreview(null,true);renderInputPrompt();renderQuickAddUI();setTimeout(()=>{initBaseViewport(false);syncViewport();resetPraiseInput()},40);setTimeout(syncViewport,120);setTimeout(syncViewport,260);setTimeout(syncViewport,520)}
let quickBlurTimer=null;
function onInputBlur(){renderInputPrompt(true);scheduleQuickBlurSettle(180)}
function scheduleQuickBlurSettle(delay){
  if(quickBlurTimer)clearTimeout(quickBlurTimer);
  quickBlurTimer=setTimeout(()=>{
    quickBlurTimer=null;
    const mi=document.getElementById('mi'),ae=document.activeElement;
    if(ae===mi)return;
    /* クイックUI操作直後はまだ畳まない（iOSはボタンがactiveElementにならないため時刻で判定） */
    if(ae&&ae.closest&&(ae.closest('#quickAddBar')||ae.closest('#quickPickerPanel'))){scheduleQuickBlurSettle(700);return}
    if(Date.now()-quickUiPressAt<900){scheduleQuickBlurSettle(700);return}
    document.body.classList.remove('keyboard-open');
    document.getElementById('sf8')?.classList.remove('keyboard-open');
    if(!quickPickerMode)quickClosePicker(); /* ピッカー表示中はquick-holdで維持し、外側タップで閉じる */
    initBaseViewport(false);syncViewport();
  },delay);
}
function onKey(e){if(e.key==='Enter'&&!isComposing){e.preventDefault();doDopa()}}
function updateInputButtons(v){
  const db=document.getElementById('db'),ib=document.getElementById('ib');
  if(db)db.style.opacity=v?'1':'.4';
  if(ib)ib.classList.toggle('ready',Boolean(v));
}
let inputPromptTimer=null,currentInputPrompt='';
function pickInputPrompt(){
  const fallback='とりあえず1個。そこから流れが変わる。';
  const list=Array.isArray(INPUT_PROMPTS)?INPUT_PROMPTS.filter(Boolean):[];
  if(!list.length){currentInputPrompt=fallback;return fallback}
  let next=list[Math.floor(Math.random()*list.length)];
  if(list.length>1&&next===currentInputPrompt){
    const alt=list.filter(x=>x!==currentInputPrompt);
    next=alt[Math.floor(Math.random()*alt.length)]||next;
  }
  currentInputPrompt=next;
  return next;
}
function setInputPlaceholder(force=false){
  const input=document.getElementById('mi');
  if(!input)return;
  if(force||!input.getAttribute('placeholder')) input.setAttribute('placeholder',pickInputPrompt());
}
function renderInputPrompt(force=false){setInputPlaceholder(force)}
function bumpInputPrompt(){setInputPlaceholder(true)}
function scheduleInputPromptRotation(){if(inputPromptTimer){clearInterval(inputPromptTimer);inputPromptTimer=null}}

let appConfirmHandler=null;
function openAppConfirm(opts){
  const ov=document.getElementById('appConfirmOverlay');
  if(!ov){ if(opts&&typeof opts.onOk==='function')opts.onOk(); return; }
  const title=document.getElementById('appConfirmTitle');
  const msg=document.getElementById('appConfirmMessage');
  const kicker=document.getElementById('appConfirmKicker');
  const ok=document.getElementById('appConfirmOk');
  const cancel=document.getElementById('appConfirmCancel');
  if(kicker)kicker.textContent=(opts&&opts.kicker)||'DOPADO CONFIRM';
  if(title)title.textContent=(opts&&opts.title)||'確認';
  if(msg)msg.textContent=(opts&&opts.message)||'';
  if(ok){
    ok.textContent=(opts&&opts.okText)||'OK';
    ok.classList.toggle('danger',!!(opts&&opts.danger));
  }
  if(cancel)cancel.textContent=(opts&&opts.cancelText)||'キャンセル';
  appConfirmHandler=opts&&typeof opts.onOk==='function'?opts.onOk:null;
  ov.classList.add('show');
}
function closeAppConfirm(confirmed){
  const ov=document.getElementById('appConfirmOverlay');
  const fn=appConfirmHandler;
  appConfirmHandler=null;
  if(ov)ov.classList.remove('show');
  if(confirmed&&fn){ try{fn()}catch(e){console.error(e)} }
}

function exportBackup(){
  saveNow();
  const data=JSON.stringify(normalizeState(state),null,2);
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='dopaon-backup-'+todayStr()+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function importBackup(){
  const input=document.createElement('input');input.type='file';input.accept='application/json';
  input.onchange=()=>{const f=input.files&&input.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const parsed=JSON.parse(String(r.result||''));state=normalizeState(parsed);saveNow();renderHeader();render();closeProfile();showDopaonMessage('バックアップ復元');}catch(e){alert('復元できなかった。JSONファイルを確認して。')}};r.readAsText(f)};
  input.click();
}
function resetAllData(){
  openAppConfirm({
    title:'すべてのデータを削除する？',
    message:'タスク・習慣・報酬・プロフィールが全部リセットされます。',
    okText:'削除する',
    danger:true,
    onOk:resetAllDataConfirmed
  });
}
async function resetAllDataConfirmed(){
  hardResetting=true;
  if(saveTimer){clearTimeout(saveTimer);saveTimer=null}
  const prefixes=['dopaon_','dopado_','DOPAON_','DOPADO_'];
  try{
    Object.keys(localStorage).forEach(key=>{if(prefixes.some(p=>key.startsWith(p)))localStorage.removeItem(key)});
    Object.keys(sessionStorage).forEach(key=>{if(prefixes.some(p=>key.startsWith(p)))sessionStorage.removeItem(key)});
  }catch(e){}
  try{
    if('caches' in window){
      const names=await caches.keys();
      await Promise.all(names.map(name=>caches.delete(name)));
    }
  }catch(e){}
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
  }catch(e){}
  location.replace(location.pathname+'?v=reset-'+Date.now());
}
function showUndoNotice(text,onUndo){
  if(undoTimer){clearTimeout(undoTimer);undoTimer=null}
  if(undoToastEl&&undoToastEl.parentNode)undoToastEl.remove();
  const el=document.createElement('div');el.className='undo-toast';el.innerHTML='<span>'+escapeHtml(text)+'</span><button type="button">元に戻す</button>';
  el.querySelector('button').onclick=()=>{if(undoTimer)clearTimeout(undoTimer);undoTimer=null;if(el.parentNode)el.remove();undoToastEl=null;onUndo&&onUndo()};
  document.getElementById('sf8').appendChild(el);undoToastEl=el;
  undoTimer=setTimeout(()=>{if(el.parentNode)el.remove();if(undoToastEl===el)undoToastEl=null;undoTimer=null},5200);
}
function showUndo(text,onUndo){
  try{showUndoNotice(text,onUndo)}catch(e){console.warn('showUndo failed',e)}
}
function syncTaskMenuToggleUI(){
  const type=document.getElementById('taskTypeInput'),due=document.getElementById('taskDueInput'),box=document.getElementById('taskQuickToggles'),todayChip=document.getElementById('taskTodayChip'),impChip=document.getElementById('taskImportantChip');
  if(!type||!due||!box)return;
  const isHabit=type.value==='habit',today=due.value===appDayStr();
  box.style.display=isHabit?'none':'flex';
  if(isHabit){taskMenuImportant=false}else if(!today){taskMenuImportant=false}
  todayChip.classList.toggle('on',today);impChip.classList.toggle('on',!!taskMenuImportant&&today);
}
function toggleMenuToday(){const due=document.getElementById('taskDueInput');if(!due||due.disabled)return;if(due.value===appDayStr()){due.value='';taskMenuImportant=false}else due.value=appDayStr();syncTaskMenuToggleUI()}
function toggleMenuImportant(){const due=document.getElementById('taskDueInput');if(!due||due.disabled)return;if(!taskMenuImportant){if(due.value!==appDayStr())due.value=appDayStr()}taskMenuImportant=!taskMenuImportant;syncTaskMenuToggleUI()}
function readTaskForm(){return{name:document.getElementById('taskNameInput').value.trim(),dueDate:document.getElementById('taskDueInput').value,dueTime:(document.getElementById('taskTimeInput')?document.getElementById('taskTimeInput').value:'')||'',tags:[...menuSelectedTags],repeatFreq:(document.getElementById('taskRepeatFreq')?document.getElementById('taskRepeatFreq').value:'none'),repeatMonthDay:(document.getElementById('repeatMonthDay')?document.getElementById('repeatMonthDay').value:1),taskType:document.getElementById('taskTypeInput').value,habitKind:document.getElementById('habitKindInput').value,importantRequested:!!taskMenuImportant,habitChecks:(document.getElementById('habitChecksInput')?document.getElementById('habitChecksInput').value:'')}}
function createTask(name,cfg={}){return normalizeTask(Object.assign(defaultTaskConfig(),cfg,{id:newId(),name,state:'idle',rewardDone:false,scheduledAwarded:false,createdAt:Date.now(),doneAt:null,taskType:'normal'}))}
function usedHabitSlots(){return new Set(state.habits.map(h=>Number.isInteger(h.slot)?h.slot:null).filter(v=>v!==null&&v>=0&&v<9))}
function firstEmptyHabitSlot(){const used=usedHabitSlots();for(let i=0;i<9;i++)if(!used.has(i))return i;return null}
function normalizeHabitSlots(){const used=new Set();state.habits.forEach(h=>{if(Number.isInteger(h.slot)&&h.slot>=0&&h.slot<9&&!used.has(h.slot)){used.add(h.slot);return}let s=null;for(let i=0;i<9;i++){if(!used.has(i)){s=i;break}}h.slot=s===null?99+used.size:s;used.add(h.slot)})}
function habitSlotList(){normalizeHabitSlots();const slots=Array(9).fill(null);state.habits.forEach(h=>{if(Number.isInteger(h.slot)&&h.slot>=0&&h.slot<9&&!slots[h.slot])slots[h.slot]=h});return slots}
function createHabit(name,cfg={}){let slot=Number.isInteger(cfg.slot)?cfg.slot:firstEmptyHabitSlot();if(slot===null)slot=99+state.habits.length;return normalizeHabit({id:newId(),name,habitKind:cfg.habitKind||'do',slot,createdAt:Date.now(),active:true,checks:String(cfg.habitChecks||'').split(/\n+/).map(x=>x.trim()).filter(Boolean)})}
function openTaskMenu(id=null,kind=null,slot=null){
  closeTaskExtras(false);
  clearTaskChargePreview(null,false);
  document.getElementById('mi').blur();editingId=id;editingKind=kind||(id?'task':null);editingHabitSlot=(kind==='habit'&&!id&&Number.isInteger(slot))?slot:null;
  let cfg=Object.assign(defaultTaskConfig(),{name:vl()});
  if(id&&editingKind==='habit'){const h=state.habits.find(x=>x.id===id);if(h)cfg=Object.assign(defaultTaskConfig(),{name:h.name,taskType:'habit',habitKind:h.habitKind,slot:h.slot,habitChecks:(h.checks||[]).join('\n')})}
  else if(id){const t=state.tasks.find(x=>x.id===id);if(t)cfg=Object.assign(defaultTaskConfig(),t,{taskType:'normal'})}
  else if(kind==='habit'||currentMode()==='habits'){cfg.taskType='habit';cfg.slot=Number.isInteger(slot)?slot:firstEmptyHabitSlot()}
  document.getElementById('taskPopupTitle').textContent=id?(editingKind==='habit'?'HABIT EDIT':'TASK EDIT'):(cfg.taskType==='habit'?'HABIT MENU':'TASK MENU');
  document.getElementById('taskSaveBtn').textContent=id?'保存する':(cfg.taskType==='habit'?'習慣を追加':'追加する');
  document.getElementById('taskDangerRow').style.display=id?'flex':'none';
  document.getElementById('taskNameInput').value=cfg.name||'';
  document.getElementById('taskDueInput').value=cfg.dueDate||'';
  const typeInput=document.getElementById('taskTypeInput');
  typeInput.innerHTML=cfg.taskType==='habit'?'<option value="habit">習慣タスク</option>':'<option value="normal">通常タスク</option>';
  typeInput.value=cfg.taskType||'normal';
  taskMenuImportant=!!(id&&editingKind!=='habit'&&isTaskImportant(cfg));
  document.getElementById('habitKindInput').value=cfg.habitKind||'do';
  const hci=document.getElementById('habitChecksInput');if(hci)hci.value=cfg.habitChecks||'';
  const repeatEl=document.getElementById('repeatTypeInput');repeatEl.value='daily';
  const ti=document.getElementById('taskTimeInput');if(ti)ti.value=cfg.dueTime||'';
  menuSelectedTags=new Set(Array.isArray(cfg.tags)?cfg.tags:[]);
  menuRepeatDays=new Set();
  let rpFreq='none';
  if(id&&editingKind!=='habit'){
    const tk=state.tasks.find(x=>x.id===id);
    const rp=tk&&tk.repeatId?repeatById(tk.repeatId):null;
    if(rp){rpFreq=rp.freq;if(rp.freq==='weekly')rp.days.forEach(d=>menuRepeatDays.add(d));
      const md=document.getElementById('repeatMonthDay');if(md&&rp.freq==='monthly')md.value=rp.days[0]||1}
  }
  const rf=document.getElementById('taskRepeatFreq');if(rf)rf.value=rpFreq;
  renderTagPick();renderRepeatWeekGrid();syncRepeatBoxes();
  syncTaskMenuFields();syncTaskMenuToggleUI();
  // チュートリアル t_cavd: 「やらないこと」を自動選択
  if (tut && tut.active) { const _cs = tutCurrentStep(); if (_cs && _cs.id === 't_cavd') { const ki = document.getElementById('habitKindInput'); if (ki) ki.value = 'avoid'; } }
  document.getElementById('taskOverlay').classList.add('show');
  if(tut&&tut.active)setTimeout(tutRender,60);
}
function closeTaskMenu(){document.getElementById('taskOverlay').classList.remove('show');editingId=null;editingKind=null;editingHabitSlot=null;taskMenuImportant=false;if(tut&&tut.active)setTimeout(tutRender,60)}
function rerenderAfterMenuClose(){render();requestAnimationFrame(()=>render())}
function syncTaskMenuFields(){
  const isHabit=document.getElementById('taskTypeInput').value==='habit';
  const due=document.getElementById('taskDueInput');
  document.getElementById('habitFields').style.display=isHabit?'block':'none';
  document.getElementById('intervalBox').style.display='none';
  document.getElementById('weekdayBox').style.display='none';
  document.getElementById('repeatTypeInput').value='daily';
  due.disabled=isHabit;
  if(isHabit)due.value='';
  const trs=document.getElementById('timeRepeatSection');if(trs)trs.style.display=isHabit?'none':'block';
  const tgs=document.getElementById('tagSection');if(tgs)tgs.style.display=isHabit?'none':'block';
  if(typeof syncTaskMenuToggleUI==='function')syncTaskMenuToggleUI();
  const title=document.getElementById('taskPopupTitle');
  if(!editingId)title.textContent=isHabit?'HABIT MENU':'TASK MENU';
  document.getElementById('taskSaveBtn').textContent=editingId?'保存する':(isHabit?'習慣を追加':'追加する');
}
function renderWeekdayGrid(){const grid=document.getElementById('weekdayGrid');if(!grid)return;grid.innerHTML='';WEEKDAYS.forEach((w,i)=>{const b=document.createElement('button');b.type='button';b.className='weekday-chip';b.textContent=w;grid.appendChild(b)})}
function renderRepeatWeekGrid(){const grid=document.getElementById('repeatWeekGrid');if(!grid)return;grid.innerHTML='';WEEKDAYS.forEach((w,i)=>{const b=document.createElement('button');b.type='button';b.className='weekday-chip'+(menuRepeatDays.has(i)?' on':'');b.textContent=w;b.onclick=()=>{if(menuRepeatDays.has(i))menuRepeatDays.delete(i);else menuRepeatDays.add(i);renderRepeatWeekGrid()};grid.appendChild(b)})}
function syncRepeatBoxes(){const f=document.getElementById('taskRepeatFreq');if(!f)return;const v=f.value;const wb=document.getElementById('repeatWeekBox'),mb=document.getElementById('repeatMonthBox');if(wb)wb.style.display=v==='weekly'?'block':'none';if(mb)mb.style.display=v==='monthly'?'block':'none'}
function renderTagPick(){const box=document.getElementById('tagPickList');if(!box)return;box.innerHTML='';
  if(!(state.tags||[]).length){const e=document.createElement('div');e.style.cssText='font-size:11px;color:#4a6080;padding:2px 0 4px';e.textContent='タグはまだない。下から作成できる';box.appendChild(e)}
  (state.tags||[]).forEach(tg=>{const b=document.createElement('button');b.type='button';const on=menuSelectedTags.has(tg.id);b.className='tagpick'+(on?' on':'');b.textContent=tg.name;if(on){b.style.color=tg.color;b.style.borderColor=tg.color}b.onclick=()=>{if(menuSelectedTags.has(tg.id))menuSelectedTags.delete(tg.id);else menuSelectedTags.add(tg.id);renderTagPick()};box.appendChild(b)})}
function createTagFromInput(){const inp=document.getElementById('newTagInput');if(!inp)return;const name=inp.value.trim().slice(0,12);if(!name)return;
  const dup=(state.tags||[]).find(t=>t.name===name);
  if(dup){menuSelectedTags.add(dup.id);inp.value='';renderTagPick();return}
  const tg={id:newId(),name,color:TAG_COLORS[state.tags.length%TAG_COLORS.length]};
  state.tags.push(tg);menuSelectedTags.add(tg.id);inp.value='';saveState();renderTagPick()}
function applyRepeatFromForm(t,cfg){
  const day=appDayStr();
  if(cfg.repeatFreq==='none'){
    if(t.repeatId){state.repeats=state.repeats.filter(r=>r.id!==t.repeatId);t.repeatId=null}
    return;
  }
  const days=cfg.repeatFreq==='weekly'?[...menuRepeatDays]:cfg.repeatFreq==='monthly'?[clamp(Number(cfg.repeatMonthDay)||1,1,31)]:[];
  let rp=t.repeatId?repeatById(t.repeatId):null;
  if(!rp){rp=normalizeRepeat({name:t.name});state.repeats.push(rp);t.repeatId=rp.id}
  rp.name=t.name;rp.freq=cfg.repeatFreq;rp.days=days;rp.dueTime=cfg.dueTime||'';rp.tags=(cfg.tags||[]).slice();rp.active=true;
  rp.lastGenDay=repeatDueOn(rp,day)?day:'';
}
function deleteEditingTask(){if(!editingId)return;if(editingKind==='habit')deleteHabit(editingId,true);else deleteTask(editingId,true)}
function tutGuardCreateFromMenu(cfg){
  if(!(tut&&tut.active)||editingId)return true;
  const st=tutCurrentStep();
  const sid=st&&st.id;
  if(sid==='t_cdo'){
    if(tut.habitDoId){showToast('チュートリアル中は1つずつ進めよう');return false;}
    if(cfg.taskType!=='habit'||cfg.habitKind!=='do'){
      showToast('今は「やること」の習慣を作ってね');
      return false;
    }
    return true;
  }
  if(sid==='t_cavd'){
    if(tut.habitAvoidId){showToast('チュートリアル中は1つずつ進めよう');return false;}
    if(cfg.taskType!=='habit'||cfg.habitKind!=='avoid'){
      showToast('今は「やらないこと」の習慣を作ってね');
      return false;
    }
    return true;
  }
  showToast('今はチュートリアルの光っている場所を操作してね');
  return false;
}
function saveTaskMenu(){
  const cfg=readTaskForm();
  if(!cfg.name){showToast('名前を入れて');showUndo('名前を入れて',null);return}
  if(cfg.taskType!=='habit'&&cfg.repeatFreq==='weekly'&&menuRepeatDays.size===0){showUndo('リピートの曜日を1つ以上選んで',null);return}
  if(!tutGuardCreateFromMenu(cfg))return;
  if(editingId&&editingKind==='habit'){
    const h=state.habits.find(x=>x.id===editingId);if(h){h.name=cfg.name;h.habitKind=cfg.habitKind;h.checks=String(cfg.habitChecks||'').split(/\n+/).map(x=>x.trim()).filter(Boolean);saveState();render();showToast('習慣を保存した')}
    closeTaskMenu();return;
  }
  if(editingId&&editingKind!=='habit'){
    const t=state.tasks.find(x=>x.id===editingId);if(!t){closeTaskMenu();return}
    const oldDue=t.dueDate;
    t.name=cfg.name;t.dueDate=cfg.importantRequested?appDayStr():cfg.dueDate;t.taskType='normal';
    t.dueTime=cfg.dueTime||'';t.tags=(cfg.tags||[]).slice();
    applyRepeatFromForm(t,cfg);
    syncTaskDateFlags(t);
    if(cfg.importantRequested){claimImportant(t)}else{t.importantDate='';t.importantFlag=false}
    maybeAwardSchedulePoint(t,oldDue,t.dueDate);
    showToast('タスク設定を保存した');
    saveState();closeTaskMenu();rerenderAfterMenuClose();return;
  }
  if(cfg.taskType==='habit'){
    cfg.slot=Number.isInteger(editingHabitSlot)?editingHabitSlot:firstEmptyHabitSlot();
    if(cfg.slot===null){showToast('空き習慣スロットがない');return}
    const _newHabit=createHabit(cfg.name,cfg);state.habits.push(_newHabit);
    showToast('習慣を追加した');
    spawnPraise('add');
    tutHook('habit_added',_newHabit);
  }else{
    if(cfg.importantRequested)cfg.dueDate=appDayStr();const t=createTask(cfg.name,cfg);syncTaskDateFlags(t);if(cfg.importantRequested)claimImportant(t);applyRepeatFromForm(t,cfg);state.tasks.unshift(t);maybeAwardSchedulePoint(t,'',t.dueDate);spawnPraise('add');showToast('タスクを追加した');
  }
  document.getElementById('mi').value='';resetPraiseInput();updateInputButtons('');bumpInputPrompt();saveState();closeTaskMenu();rerenderAfterMenuClose();
}
function maybeAwardSchedulePoint(task,oldDue,newDue){
  if(!newDue||task.scheduledAwarded)return;
  task.scheduledAwarded=true;
  state.xp+=1;
  renderHeader();
}
function setTaskToday(id){const t=state.tasks.find(x=>x.id===id);if(!t||t.state==='done')return;clearTaskChargePreview(null,false);t.organizeHoldKind='';t.organizeHoldUntil='';const old=t.dueDate;const day=appDayStr();t.todayDate=day;t.dueDate=day;if(!t.swipeCycle)t.swipeCycle=1;maybeAwardSchedulePoint(t,old,t.dueDate);saveState();render()}
function unsetTaskToday(id){const t=state.tasks.find(x=>x.id===id);if(!t||t.state==='done')return;clearTaskChargePreview(null,false);t.todayDate='';t.importantDate='';t.importantFlag=false;t.swipeCycle=0;if(t.dueDate===appDayStr())t.dueDate='';saveState();render()}
function setTaskImportant(id){const t=state.tasks.find(x=>x.id===id);if(!t||t.state==='done')return;clearTaskChargePreview(null,false);if(isTaskImportant(t))return;const old=t.dueDate;if(!isTaskToday(t)){t.dueDate=appDayStr();t.todayDate=appDayStr();maybeAwardSchedulePoint(t,old,t.dueDate)}claimImportant(t);t.swipeCycle=2;showUndo(importantUsageText(t),null);saveState();render()}
function unsetTaskImportant(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;clearTaskChargePreview(null,false);t.importantDate='';t.importantFlag=false;t.swipeCycle=3;saveState();render()}
function cycleTaskPriority(id){const t=state.tasks.find(x=>x.id===id);if(!t||t.state==='done')return;const day=appDayStr();if(!isTaskToday(t)){setTaskToday(id);showUndo('今日タスクにした',null);return}
  if(!isTaskImportant(t)&&t.swipeCycle!==3){setTaskImportant(id);return}
  if(isTaskImportant(t)){unsetTaskImportant(id);showUndo('重要を外した',null);return}
  unsetTaskToday(id);showUndo('今日タグを外した',null);
}

function normalizeTaskCollection(){
  if(!Array.isArray(state.tasks))state.tasks=[];
  const seen=new Set();
  state.tasks=state.tasks.filter(Boolean).map(t=>normalizeTask(t)).filter(t=>{
    if(seen.has(t.id))return false;
    seen.add(t.id);
    syncTaskDateFlags(t);
    return true;
  });
}
function flushTaskStateAndRender(){
  normalizeTaskCollection();
  saveState();
  render();
}

let quickAddDraft={dueDate:'',tags:[],organizeHoldUntil:'',organizeHoldKind:'',today:false,important:false};
let quickPickerMode='';
let quickDraftTaskId='';
let quickDateInteractionUntil=0;
function markQuickDateInteraction(ms=3000){
  const safeMs=typeof ms==='number'&&Number.isFinite(ms)?ms:3000;
  quickDateInteractionUntil=Math.max(quickDateInteractionUntil,Date.now()+safeMs);
  quickDiag?.('DATE GUARD until +'+safeMs+'ms')
}

let quickCalendarView={mode:'',year:0,month:0};
let quickHoldCalendarOpen=false;
function quickLocalYmd(d){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function quickCalendarInit(mode,selected=''){
  if(quickCalendarView.mode===mode&&quickCalendarView.year&&Number.isInteger(quickCalendarView.month))return;
  let d=selected?new Date(selected+'T12:00:00'):new Date();
  if(Number.isNaN(d.getTime()))d=new Date();
  quickCalendarView={mode,year:d.getFullYear(),month:d.getMonth()};
}
function quickCalendarShift(mode,delta){
  quickCalendarInit(mode,mode==='due'?quickAddDraft.dueDate:quickAddDraft.organizeHoldUntil);
  const d=new Date(quickCalendarView.year,quickCalendarView.month+delta,1,12);
  quickCalendarView={mode,year:d.getFullYear(),month:d.getMonth()};
  renderQuickPicker();
}
function renderQuickCalendar(host,mode,selected,onSelect){
  quickCalendarInit(mode,selected);
  const y=quickCalendarView.year,m=quickCalendarView.month;
  const box=document.createElement('div');box.className='quick-calendar';
  const head=document.createElement('div');head.className='quick-calendar-head';
  const prev=document.createElement('button');prev.type='button';prev.textContent='‹';bindQuickTap(prev,()=>quickCalendarShift(mode,-1),{ignoreMove:true});
  const label=document.createElement('div');label.className='quick-calendar-month';label.textContent=y+'年 '+(m+1)+'月';
  const next=document.createElement('button');next.type='button';next.textContent='›';bindQuickTap(next,()=>quickCalendarShift(mode,1),{ignoreMove:true});
  head.append(prev,label,next);box.appendChild(head);
  const weekdays=document.createElement('div');weekdays.className='quick-calendar-weekdays';
  ['日','月','火','水','木','金','土'].forEach(x=>{const e=document.createElement('span');e.textContent=x;weekdays.appendChild(e)});box.appendChild(weekdays);
  const grid=document.createElement('div');grid.className='quick-calendar-grid';
  const first=new Date(y,m,1,12).getDay(),days=new Date(y,m+1,0,12).getDate(),today=quickLocalYmd(new Date());
  for(let i=0;i<first;i++){const e=document.createElement('button');e.type='button';e.className='quick-calendar-day empty';e.tabIndex=-1;grid.appendChild(e)}
  for(let day=1;day<=days;day++){
    const d=new Date(y,m,day,12),value=quickLocalYmd(d),b=document.createElement('button');
    b.type='button';b.className='quick-calendar-day'+(value===today?' today':'')+(value===selected?' on':'');b.textContent=String(day);b.dataset.date=value;
    bindQuickTap(b,()=>onSelect(value),{ignoreMove:true});grid.appendChild(b);
  }
  box.appendChild(grid);host.appendChild(box);
}

function finishQuickDateSelection(kind='date'){
  quickDiag?.('DATE SELECT finish '+kind);
  quickDateInteractionUntil=0;
  quickClosePicker('date selected',true);
  const mi=document.getElementById('mi');
  try{document.activeElement?.blur?.()}catch(e){}
  try{if(mi&&document.activeElement===mi)mi.blur()}catch(e){}
  document.body.classList.remove('keyboard-open');
  document.getElementById('sf8')?.classList.remove('keyboard-open');
  document.getElementById('quickAddBar')?.classList.remove('quick-hold');
  initBaseViewport(false);
  syncViewport();
}
function activeQuickDraft(){
  let t=quickDraftTaskId&&state.tasks.find(x=>x&&x.id===quickDraftTaskId&&x.state!=='done');
  if(!t){
    t=(state.tasks||[]).filter(x=>x&&x.state!=='done'&&(x.isQuickDraft||x.isAutoUntitled)).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0))[0]||null;
    quickDraftTaskId=t?t.id:'';
  }
  return t||null;
}
function clearQuickDraftRef(id=''){if(!id||quickDraftTaskId===id)quickDraftTaskId=''}
function quickAddTaskConfig(){
  const cfg={dueDate:quickAddDraft.dueDate||'',tags:[...(quickAddDraft.tags||[])],organizeHoldUntil:quickAddDraft.organizeHoldUntil||'',organizeHoldKind:quickAddDraft.organizeHoldKind||''};
  if(quickAddDraft.today||quickAddDraft.important)cfg.dueDate=appDayStr();
  if(quickAddDraft.important){cfg.importantFlag=true;cfg.importantDate=appDayStr();cfg.todayDate=appDayStr()}
  else if(quickAddDraft.today)cfg.todayDate=appDayStr();
  return cfg;
}
function resetQuickAddDraft(){quickAddDraft={dueDate:'',tags:[],organizeHoldUntil:'',organizeHoldKind:'',today:false,important:false};quickClosePicker('reset',true);renderQuickAddUI()}
function renderQuickAddUI(){
  const due=document.getElementById('quickDueBtn'),hold=document.getElementById('quickHoldBtn'),today=document.getElementById('quickTodayBtn'),imp=document.getElementById('quickImportantBtn'),tag=document.getElementById('quickTagBtn');
  if(due){due.classList.toggle('on',!!quickAddDraft.dueDate);due.textContent=quickAddDraft.dueDate?(quickAddDraft.dueDate===appDayStr()?'今日':formatDateLabel(quickAddDraft.dueDate)):'期日'}
  if(hold){const active=isTaskOnHold(quickAddDraft);hold.classList.toggle('on',active);hold.textContent=active?(isTaskSkima(quickAddDraft)?'スキマ':('保留 '+formatDateLabel(quickAddDraft.organizeHoldUntil))):'保留'}
  today?.classList.toggle('on',!!quickAddDraft.today||quickAddDraft.dueDate===appDayStr());
  imp?.classList.toggle('on',!!quickAddDraft.important);
  tag?.classList.toggle('on',!!(quickAddDraft.tags||[]).length);
  renderQuickPicker();
}
function quickTogglePicker(mode){
  const next=quickPickerMode===mode?'':mode;
  if(next!==quickPickerMode){quickCalendarView.mode='';if(next!=='hold')quickHoldCalendarOpen=false}
  quickPickerMode=next;
  renderQuickPicker();
  document.getElementById('mi')?.focus({preventScroll:true});
}
function quickClosePicker(reason='unspecified',force=false){
  const passiveReason=reason==='outside click'||reason==='blur'||reason==='unspecified';
  if(!force&&(quickPickerMode==='due'||quickPickerMode==='hold')&&passiveReason){
    quickDiag?.('CLOSE blocked: '+reason+' passive picker');
    return false
  }
  if(!force&&(quickPickerMode==='due'||quickPickerMode==='hold')&&Date.now()<quickDateInteractionUntil){
    quickDiag?.('CLOSE blocked: '+reason+' date interaction');
    return false
  }
  quickDiag?.('CLOSE allowed: '+reason);
  quickPickerMode='';const p=document.getElementById('quickPickerPanel');if(p){p.classList.remove('open');p.setAttribute('aria-hidden','true');p.innerHTML=''}document.getElementById('quickAddBar')?.classList.remove('quick-hold');return true
}
function quickPickerBtn(text,on,fn,value=''){const b=document.createElement('button');b.type='button';b.className='quick-picker-choice'+(on?' on':'');b.textContent=text;if(value)b.dataset.quickValue=value;bindQuickTap(b,fn);return b}
function renderQuickPicker(){
  quickDiag?.('RP00 enter localMode='+String(quickPickerMode));
  try{
    const p=document.getElementById('quickPickerPanel');
    quickDiag?.('RP01 panel='+(p?'found':'missing'));
    if(!p)return;
    p.innerHTML='';p.classList.remove('hold-picker','calendar-picker');
    quickDiag?.('RP02 cleared');
    p.classList.toggle('open',!!quickPickerMode);
    quickDiag?.('RP03 class open='+p.classList.contains('open'));
    p.setAttribute('aria-hidden',quickPickerMode?'false':'true');
    quickDiag?.('RP04 aria set');
    const bar=document.getElementById('quickAddBar');
    quickDiag?.('RP05 bar='+(bar?'found':'missing'));
    bar?.classList.toggle('quick-hold',!!quickPickerMode);
    quickDiag?.('RP06 hold toggled');
    if(!quickPickerMode){quickDiag?.('RP07 no mode return');return}
    const title=document.createElement('div');
    quickDiag?.('RP08 title created');
    title.className='quick-picker-title';
    title.textContent=quickPickerMode==='due'?'期日を選択':quickPickerMode==='hold'?'保留する期間':'タグを選択';
    p.appendChild(title);
    quickDiag?.('RP09 title appended mode='+quickPickerMode);
    if(quickPickerMode==='due'){
      p.classList.add('calendar-picker');
      renderQuickCalendar(p,'due',quickAddDraft.dueDate||'',value=>{
        quickSetDue(value);
        finishQuickDateSelection('due');
      });
      if(quickAddDraft.dueDate){
        const clear=document.createElement('button');clear.type='button';clear.className='quick-picker-clear';clear.textContent='期日を解除';
        bindQuickTap(clear,()=>{quickSetDue('');renderQuickPicker()},{ignoreMove:true});p.appendChild(clear);
      }
      quickDiag?.('RP_DUE custom calendar DONE');
    }else if(quickPickerMode==='hold'){
      p.classList.add('hold-picker');
      const selected=quickAddDraft.organizeHoldUntil||'',tomorrow=addDaysStr(appDayStr(),1),week=addDaysStr(appDayStr(),7);
      const customSelected=!!selected&&selected!==tomorrow&&selected!==week;
      const row=document.createElement('div');row.className='quick-picker-row'+(quickPickerMode==='hold'?' skima-row':'');
      row.appendChild(quickPickerBtn('明日',selected===tomorrow,()=>{quickSetHold(tomorrow);finishQuickDateSelection('hold')},tomorrow));
      row.appendChild(quickPickerBtn('1週間後',selected===week,()=>{quickSetHold(week);finishQuickDateSelection('hold')},week));
      row.appendChild(quickPickerBtn('スキマ',quickAddDraft.organizeHoldKind==='skima',()=>{quickSetSkima();finishQuickDateSelection('hold')},'skima'));
      const cal=quickPickerBtn('▦',customSelected||quickHoldCalendarOpen,()=>{quickHoldCalendarOpen=!quickHoldCalendarOpen;quickCalendarView.mode='';renderQuickPicker()});
      cal.classList.add('calendar-choice','quick-calendar-open-btn');cal.setAttribute('aria-label','日付を選択');row.appendChild(cal);p.appendChild(row);
      if(quickHoldCalendarOpen){
        p.classList.add('calendar-picker');
        renderQuickCalendar(p,'hold',selected,value=>{quickSetHold(value);finishQuickDateSelection('hold')});
      }
      if(selected||quickAddDraft.organizeHoldKind==='skima'){const clear=document.createElement('button');clear.type='button';clear.className='quick-hold-clear';clear.textContent='保留を解除';bindQuickTap(clear,()=>{quickSetHold('');quickHoldCalendarOpen=false;renderQuickPicker()},{ignoreMove:true});p.appendChild(clear)}
    }else{
      quickDiag?.('RP30 tags branch');
      const row=document.createElement('div');row.className='quick-picker-row';
      (state.tags||[]).forEach(tg=>{const b=document.createElement('button');b.type='button';b.className='quick-tag-chip'+(quickAddDraft.tags.includes(tg.id)?' on':'');b.textContent=tg.name;b.dataset.tagId=tg.id;bindQuickTap(b,()=>quickToggleTag(tg.id));row.appendChild(b)});
      quickDiag?.('RP31 tags built count='+String((state.tags||[]).length));
      if(!(state.tags||[]).length){const e=document.createElement('span');e.style.cssText='color:#65738d;font-size:12px;padding:5px';e.textContent='タグはまだありません';row.appendChild(e)}
      p.appendChild(row);
      quickDiag?.('RP32 tags row appended DONE');
    }
  }catch(err){
    quickDiag?.('RP_ERROR '+String(err&&err.name||'Error')+': '+String(err&&err.message||err));
    if(err&&err.stack)quickDiag?.('RP_STACK '+String(err.stack).slice(0,240));
    throw err;
  }
}
function syncQuickPickerSelection(){
  const p=document.getElementById('quickPickerPanel');if(!p||!quickPickerMode)return;
  if(quickPickerMode==='due'){
    const selected=quickAddDraft.dueDate||'';
    p.querySelectorAll('.quick-calendar-day[data-date]').forEach(b=>b.classList.toggle('on',b.dataset.date===selected));
  }else if(quickPickerMode==='hold'){
    const selected=quickAddDraft.organizeHoldUntil||'',tomorrow=addDaysStr(appDayStr(),1),week=addDaysStr(appDayStr(),7);
    p.querySelectorAll('[data-quick-value]').forEach(b=>b.classList.toggle('on',b.dataset.quickValue===selected));
    p.querySelectorAll('.quick-calendar-day[data-date]').forEach(b=>b.classList.toggle('on',b.dataset.date===selected));
    const cal=p.querySelector('.calendar-choice');if(cal)cal.classList.toggle('on',quickHoldCalendarOpen||!!selected&&selected!==tomorrow&&selected!==week);
  }else if(quickPickerMode==='tags'){
    const selected=new Set(quickAddDraft.tags||[]);p.querySelectorAll('[data-tag-id]').forEach(b=>b.classList.toggle('on',selected.has(b.dataset.tagId)));
  }
}
function syncQuickAddButtons(){
  const due=document.getElementById('quickDueBtn'),hold=document.getElementById('quickHoldBtn'),today=document.getElementById('quickTodayBtn'),imp=document.getElementById('quickImportantBtn'),tag=document.getElementById('quickTagBtn');
  if(due){due.classList.toggle('on',!!quickAddDraft.dueDate);due.textContent=quickAddDraft.dueDate?(quickAddDraft.dueDate===appDayStr()?'今日':formatDateLabel(quickAddDraft.dueDate)):'期日'}
  if(hold){const active=isTaskOnHold(quickAddDraft);hold.classList.toggle('on',active);hold.textContent=active?(isTaskSkima(quickAddDraft)?'スキマ':('保留 '+formatDateLabel(quickAddDraft.organizeHoldUntil))):'保留'}
  today?.classList.toggle('on',!!quickAddDraft.today||quickAddDraft.dueDate===appDayStr());imp?.classList.toggle('on',!!quickAddDraft.important);tag?.classList.toggle('on',!!(quickAddDraft.tags||[]).length);
}
function quickSetDue(v){quickAddDraft.dueDate=v||'';quickAddDraft.today=v===appDayStr();if(v){quickAddDraft.organizeHoldUntil=''}if(v!==appDayStr())quickAddDraft.important=false;syncQuickAddButtons();syncQuickPickerSelection()}
function quickSetHold(v){quickAddDraft.organizeHoldKind='';quickAddDraft.organizeHoldUntil=v||'';if(v){quickAddDraft.dueDate='';quickAddDraft.today=false;quickAddDraft.important=false}syncQuickAddButtons();syncQuickPickerSelection()}
function quickSetSkima(){quickAddDraft.organizeHoldUntil='';quickAddDraft.organizeHoldKind='skima';quickAddDraft.dueDate='';quickAddDraft.today=false;quickAddDraft.important=false;syncQuickAddButtons();syncQuickPickerSelection()}
function quickToggleToday(){quickAddDraft.today=!quickAddDraft.today;if(quickAddDraft.today){quickAddDraft.dueDate=appDayStr();quickAddDraft.organizeHoldUntil=''}else{if(quickAddDraft.dueDate===appDayStr())quickAddDraft.dueDate='';quickAddDraft.important=false}renderQuickAddUI()}
function quickToggleImportant(){quickAddDraft.important=!quickAddDraft.important;if(quickAddDraft.important){quickAddDraft.today=true;quickAddDraft.dueDate=appDayStr();quickAddDraft.organizeHoldUntil=''}renderQuickAddUI()}
function quickToggleTag(id){const set=new Set(quickAddDraft.tags||[]);set.has(id)?set.delete(id):set.add(id);quickAddDraft.tags=[...set];syncQuickAddButtons();syncQuickPickerSelection();document.getElementById('mi')?.focus({preventScroll:true})}

/* ===== v49.1 FIX: クイックUIのタップ経路をtouch/click両対応にする =====
   ・touchend(preventDefault)で処理→合成clickを抑止しつつmiのフォーカス喪失も防ぐ
   ・click単独環境(PC/一部ビューアー)はclick側で処理。時刻デデュープで二重発火防止
   ・スクロール中の誤発火は移動量ガードで除外 */
let quickUiPressAt=0,lastQuickTapAt=0;
function markQuickUiPress(){quickUiPressAt=Date.now()}
function bindQuickTap(el,fn,options={}){
  const ignoreMove=options.ignoreMove===true;
  let tx=0,ty=0,moved=false;
  el.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;tx=t.clientX;ty=t.clientY;moved=false;markQuickUiPress()},{passive:true});
  el.addEventListener('touchmove',e=>{if(ignoreMove)return;const t=e.touches&&e.touches[0];if(!t)return;if(Math.abs(t.clientX-tx)>10||Math.abs(t.clientY-ty)>10)moved=true},{passive:true});
  el.addEventListener('touchend',e=>{if(!ignoreMove&&moved)return;e.preventDefault();e.stopPropagation();lastQuickTapAt=Date.now();markQuickUiPress();fn()},{passive:false});
  el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();if(Date.now()-lastQuickTapAt<700)return;lastQuickTapAt=Date.now();fn()});
}
function initQuickAddBarEvents(){
  [['quickDueBtn',()=>quickTogglePicker('due')],
   ['quickTagBtn',()=>quickTogglePicker('tags')],
   ['quickMemoBtn',()=>quickOpenSettings('memo')],
   ['quickCondBtn',()=>quickOpenSettings('conditions')],
   ['quickTodayBtn',()=>quickToggleToday()],
   ['quickImportantBtn',()=>quickToggleImportant()],
   ['quickHoldBtn',()=>quickTogglePicker('hold')]
  ].forEach(([id,fn])=>{const el=document.getElementById(id);if(el)bindQuickTap(el,fn,{ignoreMove:true})});
  ['quickAddBar','quickPickerPanel'].forEach(id=>{const el=document.getElementById(id);if(!el)return;el.addEventListener('touchstart',markQuickUiPress,{passive:true});el.addEventListener('pointerdown',markQuickUiPress,{passive:true})});
}
/* input[type=date]非対応環境向けの手入力パース: 2026-07-20 / 2026/7/20 / 7/20 を受ける */
function parseLooseDateInput(raw){
  const s=String(raw||'').trim().replace(/[\s\u3000.]/g,'').replace(/[年月]/g,'/').replace(/日/g,'');
  if(!s)return '';
  let y,mo,d,m=s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
  if(m){y=+m[1];mo=+m[2];d=+m[3]}
  else{m=s.match(/^(\d{1,2})[\/\-](\d{1,2})$/);if(!m)return '';const now=new Date();y=now.getFullYear();mo=+m[1];d=+m[2];const cand=new Date(y,mo-1,d),today=new Date(now.getFullYear(),now.getMonth(),now.getDate());if(cand<today)y+=1}
  const dt=new Date(y,mo-1,d);
  if(dt.getFullYear()!==y||dt.getMonth()!==mo-1||dt.getDate()!==d)return '';
  return dateStr(dt);
}

function quickOpenSettings(panel){
  const entered=vl();
  let item=activeQuickDraft();
  if(item){
    if(entered){item.name=entered;item.isAutoUntitled=false;item.isQuickDraft=true;item.updatedAt=Date.now()}
    Object.assign(item,quickAddTaskConfig());syncTaskDateFlags(item);saveState();render();
  }else{
    const result=doQuickAdd({silent:true,fallbackName:'無題',autoUntitled:true,quickDraft:true});
    if(!result||result.kind!=='task')return;
    item=result.item;quickDraftTaskId=item.id;
  }
  const input=document.getElementById('mi');if(input)input.value='';updateInputButtons('');
  quickClosePicker('settings',true);document.body.classList.remove('keyboard-open');document.getElementById('sf8')?.classList.remove('keyboard-open');try{input?.blur()}catch(e){}openTaskSettings(item.id,panel);showToast(panel==='memo'?'メモを追加':'条件を追加')
}

function doQuickAdd(opts={}){
  closeTaskExtras(false);
  const input=document.getElementById('mi');
  const enteredName=vl();
  const v=enteredName||String(opts.fallbackName||'').trim();
  if(!v)return null;
  if(tut&&tut.active){
    const st=tutCurrentStep();
    const sid=st&&st.id;
    if(sid!=='t_add'){showToast('今はチュートリアルの光っている場所を操作してね');return null}
    if(tut.taskId){showToast('チュートリアル中は1つずつ進めよう');return null}
    if(currentMode()!=='tasks'){showToast('まずは日常タスクを1つ入れてね');return null}
  }
  let created=null,kind='task';
  if(currentMode()==='habits'){
    const slot=firstEmptyHabitSlot();
    if(slot===null){showToast('空き習慣スロットがない');return null}
    created=createHabit(v,{habitKind:'do',slot});
    state.habits.push(created);
    kind='habit';
    if(!opts.silent)showToast('習慣を追加した');
  }else{
    created=createTask(v,Object.assign({createdAt:Date.now()},quickAddTaskConfig()));
    if(opts.autoUntitled&&!enteredName)created.isAutoUntitled=true;if(opts.quickDraft){created.isQuickDraft=true;quickDraftTaskId=created.id}
    syncTaskDateFlags(created);
    recentAddedTaskId=created.id;
    state.tasks=[created,...(Array.isArray(state.tasks)?state.tasks:[])];
    taskSearchQuery='';
    if(!state.ui)state.ui={};
    state.ui.mode='tasks';
    if(!opts.silent)showToast('タスクを追加した');
  }
  if(input)input.value='';
  resetQuickAddDraft();
  resetPraiseInput();
  updateInputButtons('');
  bumpInputPrompt();
  flushTaskStateAndRender();
  setTimeout(()=>{if(recentAddedTaskId===created.id){recentAddedTaskId=null;render()}},1300);
  spawnPraise('add');
  if(kind==='habit')tutHook('habit_added',created);else tutHook('task_added',created);
  return{kind,item:created,name:v};
}
function doDopa(){const v=vl();if(!v)return;const draft=activeQuickDraft();if(draft){draft.name=v;draft.isAutoUntitled=false;draft.isQuickDraft=false;Object.assign(draft,quickAddTaskConfig());syncTaskDateFlags(draft);clearQuickDraftRef(draft.id);const input=document.getElementById('mi');if(input)input.value='';resetQuickAddDraft();resetPraiseInput();updateInputButtons('');bumpInputPrompt();flushTaskStateAndRender();showToast('タスクを追加した');spawnPraise('add');return}doQuickAdd({silent:false})}
function moveTaskToTrash(id,source='manual'){
  const idx=state.tasks.findIndex(x=>x.id===id);if(idx<0)return null;
  const t=state.tasks[idx],repeat=t.repeatId?(state.repeats||[]).find(r=>r.id===t.repeatId):null;
  const entry={id:newId(),deletedAt:Date.now(),source,task:JSON.parse(JSON.stringify(t)),repeat:repeat?JSON.parse(JSON.stringify(repeat)):null,originalIndex:idx};
  ensureAiOrganizerState().trash.unshift(entry);state.tasks.splice(idx,1);
  if(repeat)state.repeats=(state.repeats||[]).filter(r=>r.id!==repeat.id);
  return entry;
}
function restoreTrashEntry(id){
  const a=ensureAiOrganizerState(),idx=a.trash.findIndex(x=>x.id===id);if(idx<0)return false;const x=a.trash[idx];
  if(!state.tasks.some(t=>t.id===x.task.id))state.tasks.splice(Math.min(Number(x.originalIndex)||0,state.tasks.length),0,normalizeTask(JSON.parse(JSON.stringify(x.task))));
  if(x.repeat&&!state.repeats.some(r=>r.id===x.repeat.id))state.repeats.push(JSON.parse(JSON.stringify(x.repeat)));
  a.trash.splice(idx,1);return true;
}
function deleteTask(id,fromMenu=false){clearQuickDraftRef(id);if(openExtraTaskId===id)closeTaskExtras(false);const entry=moveTaskToTrash(id,'manual');if(!entry)return;if(currentDopaonTaskId===id||taskChargingId===id)clearTaskChargePreview(null,false);saveState();render();if(fromMenu)closeTaskMenu();showUndo('タスクをゴミ箱へ移動した',()=>{restoreTrashEntry(entry.id);saveState();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager()})}
function deleteHabit(id,fromMenu=false){const idx=state.habits.findIndex(x=>x.id===id);if(idx<0)return;const removed=state.habits[idx];const logs=state.habitLogs[id];state.habits.splice(idx,1);delete state.habitLogs[id];saveState();render();if(fromMenu)closeTaskMenu();showUndo('習慣を削除した',()=>{state.habits.push(removed);if(logs)state.habitLogs[id]=logs;saveState();render()})}
function undoTask(id){closeTaskExtras(false);const t=state.tasks.find(x=>x.id===id);if(!t)return;t.state='idle';t.doneAt=null;taskChargingId=null;saveState();render();spawnPraise('add',{t:'戻した！',c:'#00ffcc'});showToast('完了を取り消した。再完了しても再抽選なし')}
function tap(id){if(appLockedForCompletion())return;closeTaskExtras(false);const t=state.tasks.find(x=>x.id===id);if(!t)return;if(t.state==='idle'){clearTaskChargePreview(id,false);t.state='charging';taskChargingId=id;currentDopaonTaskId=id;currentDopaonMsg=makeDopaonMessage(t.name);saveState();render();tutHook('task_charging',id)}else if(t.state==='charging'){clearInlineDopaon(false);t.state='done';t.doneAt=Date.now();const shouldReward=!t.rewardDone;const forceBonus=isTaskBonusGuaranteed(t);t.rewardDone=true;taskChargingId=null;if(shouldReward)addGameStamina(5,'TASK CLEAR');if(shouldReward){if(tutShouldForceWhiteTicket()){issueChargeTicket({id:'tut_white',name:'TUTORIAL'},{force:'white',type:'task',tutorial:true})}else{issueChargeTicket(t,{force:forceBonus?'bonus':null,type:forceBonus?'important':'task'})}}saveState();render();tutHook('task_done',id);setTimeout(()=>spawnPraise('done'),60);if(shouldReward){setTimeout(()=>startNextChargeTicket(true),160)}}}
function formatDateLabel(s){if(!s)return '';const d=new Date(s+'T00:00:00');if(Number.isNaN(d.getTime()))return s;return (d.getMonth()+1)+'/'+d.getDate()+'('+WEEKDAYS[d.getDay()]+')'}
function taskMeta(t){const tags=[];const today=appDayStr(),isToday=isTaskToday(t);if(isToday)tags.push({cls:'today',txt:'今日'});if(t.dueDate){const overdue=t.state!=='done'&&t.dueDate<today;if(overdue){tags.push({cls:'due warn',txt:'期限超過'+(t.dueTime?' '+t.dueTime:'')})}else if(isToday){if(t.dueTime)tags.push({cls:'due time',txt:t.dueTime})}else{tags.push({cls:'due',txt:formatDateLabel(t.dueDate)+(t.dueTime?' '+t.dueTime:'')})}}if(t.repeatId){const rp=repeatById(t.repeatId);tags.push({cls:'repeat',txt:'↻ '+(rp?repeatLabel(rp):'リピート')})}return tags}
function sortTasks(list){return list.slice().sort((a,b)=>{const ba=isTaskImportant(a)?0:isTaskToday(a)?1:!a.dueDate?2:3,bb=isTaskImportant(b)?0:isTaskToday(b)?1:!b.dueDate?2:3;if(ba!==bb)return ba-bb;if(ba===3&&a.dueDate!==b.dueDate)return a.dueDate.localeCompare(b.dueDate);if(a.dueDate&&a.dueDate===b.dueDate&&(a.dueTime||b.dueTime))return String(a.dueTime||'99:99').localeCompare(String(b.dueTime||'99:99'));return (b.createdAt||0)-(a.createdAt||0)})}
function prepareStateForRender(){
  expireDailyFlags(state);
  normalizeTaskCollection();
  ensureGameState();
  ensureRepeatTasks();
}
let skimaSelectedIds=new Set();
let previousActiveVisibleCount=null;
let skimaOpenQueued=false;
function skimaTasks(){return state.tasks.filter(t=>isTaskSkima(t)&&t.state!=='done')}
function activeVisibleTaskCount(){return state.tasks.filter(t=>t.state!=='done'&&!isTaskOnHold(t)).length}
function openSkimaPicker(reason='manual'){
  if(tut&&tut.active)return;
  const tasks=skimaTasks();if(!tasks.length)return;
  const ov=document.getElementById('skimaOverlay'),list=document.getElementById('skimaList');if(!ov||!list)return;
  skimaSelectedIds=new Set();list.innerHTML='';
  tasks.forEach(t=>{const b=document.createElement('button');b.type='button';b.className='skima-item';b.innerHTML='<span class="skima-check">✓</span><span class="skima-name">'+escapeHtml(t.name)+'</span>';b.onclick=()=>{if(skimaSelectedIds.has(t.id))skimaSelectedIds.delete(t.id);else skimaSelectedIds.add(t.id);b.classList.toggle('selected',skimaSelectedIds.has(t.id));syncSkimaAccept()};list.appendChild(b)});
  const title=document.getElementById('skimaTitle');if(title)title.textContent=reason==='morning'?'朝のスキマ、何か拾う？':'スキマ、何か拾う？';
  syncSkimaAccept();ov.classList.add('show');
}
function syncSkimaAccept(){const b=document.getElementById('skimaAcceptBtn');if(b)b.disabled=skimaSelectedIds.size===0}
function closeSkimaPicker(){document.getElementById('skimaOverlay')?.classList.remove('show');skimaSelectedIds.clear();syncSkimaAccept()}
function acceptSkimaTasks(){if(!skimaSelectedIds.size)return;const day=appDayStr();state.tasks.forEach(t=>{if(!skimaSelectedIds.has(t.id))return;t.organizeHoldKind='';t.organizeHoldUntil='';t.dueDate=day;t.todayDate=day;t.swipeCycle=Math.max(1,Number(t.swipeCycle)||0)});closeSkimaPicker();saveState();render()}
function scheduleSkimaPicker(reason){if(skimaOpenQueued||document.getElementById('skimaOverlay')?.classList.contains('show'))return;skimaOpenQueued=true;setTimeout(()=>{skimaOpenQueued=false;openSkimaPicker(reason)},180)}
function checkMorningSkima(){const day=appDayStr();if(!state.ui)state.ui={};if(state.ui.skimaMorningDay===day)return;state.ui.skimaMorningDay=day;saveState();if(skimaTasks().length)scheduleSkimaPicker('morning')}
function checkTaskEmptyTransition(){const count=activeVisibleTaskCount();if(previousActiveVisibleCount!==null&&previousActiveVisibleCount>0&&count===0&&skimaTasks().length)scheduleSkimaPicker('empty');previousActiveVisibleCount=count}
document.addEventListener('click',e=>{const ov=document.getElementById('skimaOverlay');if(ov&&e.target===ov)closeSkimaPicker()});
function render(){
  prepareStateForRender();
  if(currentMode()!=='tasks'){openExtraTaskId=null;openSubtaskSwipeId=null;openEditTagTaskId=null}
  const a=document.getElementById('ta');
  if(!a)return;
  a.innerHTML='';
  const sf8=document.getElementById('sf8');
  if(sf8)sf8.dataset.mode=currentMode();
  if(currentMode()==='game')renderGame(a);
  else if(currentMode()==='habits')renderHabits(a);
  else if(currentMode()==='cal')renderCalendar(a);
  else renderTasks(a);
  renderBottomBar();
  checkTaskEmptyTransition();
}
function renderTasks(a){
  taskSearchQuery='';
  if(!state.tasks.length){
    const EM=INPUT_PROMPTS.concat(['ここにタスクを入力したらもう成功者だ。','最初の1個が人生を変える。いや、マジで。','タスクは置くだけでいい。後は脳がなんとかする。','このアプリを開いた時点で8割は終わってる。','やることを書き出した人が、未来を選べる人になる。','行動力のある人って、ただ書き出しただけだったりする。','今日の自分、ここに来ただけでもうえらい。','1個だけ入れて。それだけで今日は勝ち。','脳みそは覚えるより動く方が得意。外に出してやれ。','完璧じゃなくていい。とりあえず書いとくのが最強。']);
    a.innerHTML='<div class="empty"><div class="empty-icon">⚡</div><div class="empty-text">'+EM[Math.floor(Math.random()*EM.length)]+'</div><div class="empty-sub">下の欄に打ち込んで ✓ で追加</div></div>';return}
  renderTaskList(a);
}
function taskMatchesQuery(t,q){
  if(!q)return true;
  const s=q.trim().toLowerCase();if(!s)return true;
  if(String(t.name||'').toLowerCase().includes(s))return true;
  const ex=t.extras||{};
  if(String(ex.memo||'').toLowerCase().includes(s))return true;
  if(Array.isArray(ex.subtasks)&&ex.subtasks.some(st=>String(st.text||'').toLowerCase().includes(s)))return true;
  if(Array.isArray(t.tags)&&t.tags.some(id=>{const tg=tagById(id);return tg&&tg.name.toLowerCase().includes(s)}))return true;
  return false;
}
function renderTaskList(a){
  a.innerHTML='';
  normalizeTaskCollection();
  const q=String(taskSearchQuery||'').trim();
  const visible=state.tasks.filter(t=>!isTaskOnHold(t)&&taskMatchesQuery(t,q));
  const act=sortTasks(visible.filter(t=>t.state!=='done'));
  const done=visible.filter(t=>t.state==='done').sort((a,b)=>(b.doneAt||0)-(a.doneAt||0));
  if(q&&!act.length&&!done.length){a.innerHTML='<div class="empty" style="padding-top:30px"><div class="empty-text">「'+escapeHtml(q)+'」に一致なし</div></div>';return}
  if(!act.length&&!done.length){a.innerHTML='<div class="empty"><div class="empty-icon">⚡</div><div class="empty-text">タスクはまだない</div><div class="empty-sub">下の欄に打ち込んで ✓ で追加</div></div>';return}
  act.forEach((t,i)=>{const c=mkC(t);if((i===0&&!q)||recentAddedTaskId===t.id)c.classList.add('tnew');a.appendChild(c)});
  if(done.length){
    const s=document.createElement('div');
    s.className='completed';
    s.innerHTML='<div class="completed-head"><span class="completed-title">COMPLETED '+done.length+'</span><button class="completed-btn" onclick="toggleCompleted()">'+(state.ui.completedOpen?'隠す':'表示')+'</button><button class="completed-btn" onclick="clearCompleted()">整理</button></div>';
    a.appendChild(s);
    if(state.ui.completedOpen||q)done.forEach(t=>a.appendChild(mkC(t)));
  }
}
function tagEl(cls,txt){const tag=document.createElement('span');tag.className='tag '+cls;tag.textContent=txt;return tag}
function priorityPreview(task,big){
  const today=isTaskToday(task),imp=isTaskImportant(task);
  if(!today){
    return big?{cls:(canClaimImportant(task)?'max':'full'),txt:canClaimImportant(task)?'今日＋重要':'今日＋重要'}:{cls:'tier1',txt:'今日にする'};
  }
  if(today&&!imp){
    return big?{cls:'remove',txt:'今日を外す'}:{cls:(canClaimImportant(task)?'max':'full'),txt:canClaimImportant(task)?'重要にする':'重要にする'};
  }
  return big?{cls:'remove',txt:'今日も外す'}:{cls:'remove',txt:'重要を外す'};
}
function applyPrioritySwipe(task,big){
  if(!task||task.state==='done')return;
  closeTaskExtras(false);
  clearTaskChargePreview(null,false);
  const day=appDayStr();
  const today=isTaskToday(task),imp=isTaskImportant(task);
  if(!today){
    const old=task.dueDate;task.dueDate=day;task.todayDate=day;task.swipeCycle=1;maybeAwardSchedulePoint(task,old,task.dueDate);
    if(big){claimImportant(task);task.swipeCycle=2;showUndo(importantUsageText(task),null)}
    else showUndo('今日タスクにした',null);
    saveState();render();tutHook('priority_swiped',task);return;
  }
  if(today&&!imp){
    if(big){task.todayDate='';task.importantDate='';task.swipeCycle=0;if(task.dueDate===day)task.dueDate='';showUndo('今日タグを外した',null)}
    else{claimImportant(task);task.swipeCycle=2;showUndo(importantUsageText(task),null)}
    saveState();render();tutHook('priority_swiped',task);return;
  }
  if(big){task.todayDate='';task.importantDate='';task.importantFlag=false;task.swipeCycle=0;if(task.dueDate===day)task.dueDate='';showUndo('今日も重要も外した',null)}
  else{task.importantDate='';task.importantFlag=false;task.swipeCycle=3;showUndo('重要を外した',null)}
  saveState();render();
}
function mkC(task){
  const iC=task.state==='charging',iD=task.state==='done';
  const todayActive=isTaskToday(task),important=isTaskImportant(task);
  const el=document.createElement('div');
  el.className='task'+(iC?' charging':'')+(iD?' done':'')+(todayActive?' today-task':'')+(important?' important-task':'')+(task.dueDate&&task.state!=='done'&&task.dueDate<appDayStr()&&!todayActive?' overdue':'')+(recentAddedTaskId===task.id?' just-added':'');
  el.dataset.id=task.id;
  const bg=document.createElement('div');bg.className='task-swipe-bg';bg.textContent='';el.appendChild(bg);
  const panel=document.createElement('div');panel.className='task-tools-panel';
  const del=document.createElement('button');del.className='task-delete-zone';del.innerHTML='<span class="x">×</span><span>削除</span>';del.onclick=e=>{e.stopPropagation();clearInlineDopaon(false);deleteTask(task.id)};panel.appendChild(del);
  el.appendChild(panel);
  const card=document.createElement('div');card.className='task-card'+(openExtraTaskId===task.id?' expanded':'');
  const main=document.createElement('div');main.className='task-main';
  const top=document.createElement('div');top.className='task-top-row';
  const nm=document.createElement('div');nm.className='task-name';nm.textContent=task.name;top.appendChild(nm);
  const w=document.createElement('div');w.className='task-action';
  if(!iD){
    const b=document.createElement('button');
    b.className='task-btn'+(iC?' cbtn':'')+(!iC&&todayActive?' dpa-ready':'')+(!iC&&important?' dpa-important':'');
    b.onclick=e=>{e.stopPropagation();tap(task.id)};attachTaskLongPress(b,task);
    b.setAttribute('aria-label',iC?'完了確定':'夢物語を開く');
    b.innerHTML=iC?'<span style="font-family:\'Orbitron\',monospace;font-size:7px;font-weight:700;">確定</span>':'<span class="dpa-label">dpa</span>';
    w.appendChild(b);if(iC){const h=document.createElement('span');h.className='push';h.textContent='PUSH';w.appendChild(h)}
  }else{const ic=document.createElement('span');ic.className='done-mark';ic.textContent='✓';w.appendChild(ic)}
  const mb=document.createElement('button');mb.type='button';
  const exForToggle=taskExtras(task);
  const subTotal=exForToggle.subtasks.length;
  const subDone=exForToggle.subtasks.filter(st=>st.done).length;
  const hasMemo=String(exForToggle.memo||'').trim().length>0;
  const hasConditions=exForToggle.conditions.length>0;
  const bits=[];
  if(hasConditions)bits.push('<span class="extra-ico flag">⚑</span>');
  if(hasMemo)bits.push('<span class="extra-ico memo">✎</span>');
  if(subTotal)bits.push('<span class="count">'+subDone+'/'+subTotal+'</span>');
  mb.className='task-menu-toggle'+(taskHasExtras(task)?' has-extra':'')+(openExtraTaskId===task.id?' open':'');
  mb.innerHTML=bits.join('')+'<span class="menu-glyph" aria-hidden="true"><i></i><i></i><i></i></span>';
  mb.setAttribute('aria-label','条件・メモ・設定');mb.onclick=e=>{e.stopPropagation();toggleTaskExtras(task.id)};top.appendChild(mb);
  main.appendChild(top);
  const meta=document.createElement('div');meta.className='task-meta';
  taskMeta(task).forEach(m=>meta.appendChild(tagEl(m.cls,m.txt)));
  if(important)meta.appendChild(tagEl('important','重要'));
  (task.tags||[]).forEach(tid=>{const tg=tagById(tid);if(!tg)return;const s=tagEl('user',tg.name);s.style.color=tg.color;s.style.borderColor=tg.color+'66';meta.appendChild(s)});
  main.appendChild(meta);
  if(openExtraTaskId===task.id){main.appendChild(renderTaskExtra(task));}
  else if(!iD&&currentDopaonTaskId===task.id&&currentDopaonMsg){
    const dp=document.createElement('div');dp.className='task-dopaon';
    dp.innerHTML='<span class="dream-time">'+escapeHtml(currentDopaonMsg.time)+'</span><span class="dream-quote">'+escapeHtml(currentDopaonMsg.text)+'</span><button type="button" class="dopa-close" aria-label="夢物語を閉じる">×</button>';
    const close=dp.querySelector('.dopa-close');if(close)close.onclick=e=>{e.stopPropagation();closeInlineDopaon(task.id)};
    main.appendChild(dp);
  }
  card.appendChild(w);card.appendChild(main);
  if(openExtraTaskId===task.id&&exForToggle.subtasks.length){
    const direct=document.createElement('div');direct.className='subtask-direct-list';
    direct.setAttribute('aria-label','サブタスク');
    exForToggle.subtasks.forEach(st=>direct.appendChild(renderSubtaskRow(task.id,st)));
    card.appendChild(direct);
  }
  el.appendChild(card);
  attachTaskSettingsLongPress(card,task);
  attachTaskSwipe(el,task);return el;
}

function renderTaskExtra(task){
  const ex=taskExtras(task),box=document.createElement('div');box.className='task-extra';box.onclick=e=>e.stopPropagation();
  const tabs=document.createElement('div');tabs.className='task-extra-tabs';
  [['conditions','条件'],['memo','メモ'],['edit','編集']].forEach(([key,label])=>{const b=document.createElement('button');b.type='button';const has=(key==='conditions'?ex.conditions.length>0:key==='memo'?String(ex.memo||'').trim().length>0:false);b.className='task-extra-tab'+(key==='edit'?' edit-special':'')+(openExtraTab===key?' on':'')+(has?' has-content':'');b.textContent=label;b.onclick=e=>{e.stopPropagation();setTaskExtraTab(task.id,key)};tabs.appendChild(b)});
  box.appendChild(tabs);
  if(openExtraTab==='memo'){
    const ta=document.createElement('textarea');ta.className='task-memo';ta.placeholder='メモを書く...';ta.value=ex.memo||'';ta.oninput=e=>{updateTaskMemo(task.id,e.target.value);if(e.target.value)tutHook('memo_input')};ta.onclick=e=>e.stopPropagation();ta.ontouchstart=e=>e.stopPropagation();
    box.appendChild(ta);const note=document.createElement('div');note.className='task-memo-note';note.textContent='AUTO SAVE';box.appendChild(note);return box;
  }
  const list=document.createElement('div');list.className='condition-list';
  if(!ex.conditions.length){const emp=document.createElement('div');emp.className='condition-empty';emp.textContent='完了条件は設定画面から追加';list.appendChild(emp)}
  ex.conditions.forEach(c=>list.appendChild(renderConditionRow(task.id,c)));
  box.appendChild(list);return box;
}

function renderConditionRow(taskId,c){
  const row=document.createElement('div');row.className='condition-row'+(c.done?' done':'');row.setAttribute('role','button');row.tabIndex=0;
  row.innerHTML='<span class="condition-check">'+(c.done?'✓':'')+'</span><span class="condition-text">'+escapeHtml(c.text)+'</span>';
  const del=document.createElement('button');del.type='button';del.className='condition-delete';del.setAttribute('aria-label','条件を削除');del.textContent='×';bindQuickTap(del,()=>deleteCondition(taskId,c.id));row.appendChild(del);
  row.onclick=e=>{e.stopPropagation();toggleConditionDone(taskId,c.id)};row.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleConditionDone(taskId,c.id)}};return row;
}
function deleteCondition(taskId,cid){const t=state.tasks.find(x=>x.id===taskId);if(!t)return;const ex=taskExtras(t);const before=ex.conditions.length;ex.conditions=ex.conditions.filter(x=>x.id!==cid);if(ex.conditions.length===before)return;saveState();render();if(openTaskSettingsId===taskId)renderTaskSettings()}
function toggleConditionDone(taskId,cid){const t=state.tasks.find(x=>x.id===taskId);if(!t)return;const c=taskExtras(t).conditions.find(x=>x.id===cid);if(!c)return;c.done=!c.done;const all=taskExtras(t).conditions.length&&taskExtras(t).conditions.every(x=>x.done);saveState();render();if(all&&t.state!=='done'){if(t.state==='idle'){tap(taskId);setTimeout(()=>tap(taskId),80)}else if(t.state==='charging')tap(taskId)}}

function repeatFreqForTask(t){const rp=t&&t.repeatId?repeatById(t.repeatId):null;return rp?rp.freq:'none'}
function setTaskEditName(id,v){const t=state.tasks.find(x=>x.id===id);if(!t)return;t.name=String(v||'').trim()||t.name;const rp=t.repeatId?repeatById(t.repeatId):null;if(rp)rp.name=t.name;saveState();render()}
function setTaskEditDate(id,v){const t=state.tasks.find(x=>x.id===id);if(!t)return;const old=t.dueDate;t.dueDate=v||'';syncTaskDateFlags(t);maybeAwardSchedulePoint(t,old,t.dueDate);saveState();render()}
function setTaskEditTime(id,v){const t=state.tasks.find(x=>x.id===id);if(!t)return;t.dueTime=/^\d{2}:\d{2}$/.test(v||'')?v:'';const rp=t.repeatId?repeatById(t.repeatId):null;if(rp)rp.dueTime=t.dueTime;saveState();render()}
function setTaskEditRepeat(id,freq){const t=state.tasks.find(x=>x.id===id);if(!t)return;freq=['none','daily','weekly','monthly'].includes(freq)?freq:'none';if(freq==='none'){if(t.repeatId)state.repeats=state.repeats.filter(r=>r.id!==t.repeatId);t.repeatId=null;saveState();render();return}let rp=t.repeatId?repeatById(t.repeatId):null;if(!rp){rp=normalizeRepeat({name:t.name});state.repeats.push(rp);t.repeatId=rp.id}rp.name=t.name;rp.freq=freq;const d=new Date((t.dueDate||appDayStr())+'T00:00:00');rp.days=freq==='weekly'?[d.getDay()]:freq==='monthly'?[d.getDate()]:[];rp.dueTime=t.dueTime||'';rp.tags=(t.tags||[]).slice();rp.active=true;rp.lastGenDay=repeatDueOn(rp,appDayStr())?appDayStr():'';saveState();render()}
function toggleEditSystemTag(id,type){const t=state.tasks.find(x=>x.id===id);if(!t)return;clearTaskChargePreview(null,false);const day=appDayStr();if(type==='today'){
  if(isTaskToday(t)){t.todayDate='';t.importantDate='';t.importantFlag=false;t.swipeCycle=0;if(t.dueDate===day)t.dueDate='';showUndo('今日タグを外した',null)}
  else{const old=t.dueDate;t.dueDate=day;t.todayDate=day;if(!t.swipeCycle)t.swipeCycle=1;maybeAwardSchedulePoint(t,old,t.dueDate);showUndo('今日タグを付けた',null)}
}else if(type==='important'){
  if(isTaskImportant(t)){t.importantDate='';t.importantFlag=false;t.swipeCycle=3;showUndo('重要を外した',null)}
  else{const old=t.dueDate;if(!isTaskToday(t)){t.dueDate=day;t.todayDate=day;maybeAwardSchedulePoint(t,old,t.dueDate)}claimImportant(t);t.swipeCycle=2;showUndo(importantUsageText(t),null)}
}
syncTaskDateFlags(t);saveState();render()}
function toggleEditUserTag(id,tagId){const t=state.tasks.find(x=>x.id===id);if(!t)return;const arr=Array.isArray(t.tags)?t.tags:[];if(arr.includes(tagId))t.tags=arr.filter(x=>x!==tagId);else t.tags=[...arr,tagId];const rp=t.repeatId?repeatById(t.repeatId):null;if(rp)rp.tags=(t.tags||[]).slice();saveState();render()}
function createEditTag(id,value){const t=state.tasks.find(x=>x.id===id);if(!t)return;const name=String(value||'').trim().slice(0,12);if(!name){openEditTagTaskId=id;render();return}let tg=(state.tags||[]).find(x=>x.name===name);if(!tg){tg={id:newId(),name,color:TAG_COLORS[(state.tags||[]).length%TAG_COLORS.length]};if(!Array.isArray(state.tags))state.tags=[];state.tags.push(tg)}if(!Array.isArray(t.tags))t.tags=[];if(!t.tags.includes(tg.id))t.tags.push(tg.id);const rp=t.repeatId?repeatById(t.repeatId):null;if(rp)rp.tags=(t.tags||[]).slice();openEditTagTaskId=id;saveState();render()}

function openTaskSettings(id,panel=''){const t=state.tasks.find(x=>x.id===id);if(!t)return;openTaskSettingsId=id;settingsPanel=panel==='memo'?'':panel;const sc=document.getElementById('taskSettingsScreen');if(sc){sc.classList.add('open');sc.setAttribute('aria-hidden','false')}renderTaskSettings();setTimeout(()=>{const target=panel==='memo'?document.querySelector('#taskSettingsScreen .settings-memo'):document.querySelector('#taskSettingsScreen .settings-new-input');if(target){try{target.focus({preventScroll:true})}catch(e){target.focus()}keepSettingsFieldVisible(target)}},90)}
function closeTaskSettings(){openTaskSettingsId=null;settingsPanel='';const hp=document.getElementById('settingsHoldPanel');if(hp){hp.classList.remove('open');hp.setAttribute('aria-hidden','true')}const sc=document.getElementById('taskSettingsScreen');if(sc){sc.classList.remove('open');sc.setAttribute('aria-hidden','true')}render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager()}
function settingsTask(){return state.tasks.find(x=>x.id===openTaskSettingsId)||null}
function settingsToggleToday(){const t=settingsTask();if(!t)return;const activating=!isTaskToday(t);if(activating){t.organizeHoldUntil='';t.organizeHoldKind=''}toggleEditSystemTag(t.id,'today');saveState();renderTaskSettings()}
function settingsToggleImportant(){const t=settingsTask();if(!t)return;const activating=!isTaskImportant(t);if(activating){t.organizeHoldUntil='';t.organizeHoldKind=''}toggleEditSystemTag(t.id,'important');saveState();renderTaskSettings()}
function settingsToggleHoldPanel(){const p=document.getElementById('settingsHoldPanel');if(!p)return;const open=!p.classList.contains('open');p.classList.toggle('open',open);p.setAttribute('aria-hidden',open?'false':'true');if(open)renderSettingsHoldPanel()}
function settingsSetHold(v){const t=settingsTask();if(!t)return;t.organizeHoldKind='';t.organizeHoldUntil=v||'';if(v){t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false;syncTaskDateFlags(t)}saveState();renderTaskSettings();renderSettingsHoldPanel();render()}
function settingsSetSkima(){const t=settingsTask();if(!t)return;t.organizeHoldUntil='';t.organizeHoldKind='skima';t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false;syncTaskDateFlags(t);saveState();renderTaskSettings();renderSettingsHoldPanel();render()}
function renderSettingsHoldPanel(){const t=settingsTask(),p=document.getElementById('settingsHoldPanel');if(!t||!p)return;const selected=t.organizeHoldUntil||'',isSkima=isTaskSkima(t),tomorrow=addDaysStr(appDayStr(),1),week=addDaysStr(appDayStr(),7),customSelected=!isSkima&&!!selected&&selected!==tomorrow&&selected!==week;p.innerHTML='<div class="settings-hold-title">通常画面から外す期間</div>';const row=document.createElement('div');row.className='settings-hold-row';const mk=(txt,on,fn,cls='')=>{const b=document.createElement('button');b.type='button';b.className=(on?'on ':'')+cls;b.textContent=txt;bindQuickTap(b,fn,{ignoreMove:true});return b};row.appendChild(mk('明日',!isSkima&&selected===tomorrow,()=>settingsSetHold(tomorrow)));row.appendChild(mk('1週間後',!isSkima&&selected===week,()=>settingsSetHold(week)));row.appendChild(mk('スキマ',isSkima,()=>settingsSetSkima()));const dateWrap=document.createElement('div');dateWrap.className='settings-hold-date'+(customSelected?' open':'');const input=document.createElement('input');input.type='date';input.value=selected;input.onchange=e=>{if(e.target.value)settingsSetHold(e.target.value)};dateWrap.appendChild(input);row.appendChild(mk('▦',customSelected,()=>{dateWrap.classList.toggle('open');if(dateWrap.classList.contains('open'))setTimeout(()=>{try{input.focus()}catch(e){}},0)},'calendar'));p.appendChild(row);p.appendChild(dateWrap);if(selected||isSkima){const clear=document.createElement('button');clear.type='button';clear.className='settings-hold-clear';clear.textContent='保留を解除';bindQuickTap(clear,()=>settingsSetHold(''),{ignoreMove:true});p.appendChild(clear)}}

function settingsDeleteTask(){const t=settingsTask();if(!t)return;openAppConfirm({title:'タスクを削除',message:'このタスクを削除しますか？',okText:'削除',danger:true,onOk:()=>{deleteTask(t.id);closeTaskSettings()}})}
function settingsSetName(v){const t=settingsTask();if(!t)return;t.name=String(v||'').trim()||t.name;saveState()}
function settingsSetDate(v){const t=settingsTask();if(!t)return;const old=t.dueDate;t.dueDate=v||'';if(v){t.organizeHoldUntil='';t.organizeHoldKind=''}syncTaskDateFlags(t);maybeAwardSchedulePoint(t,old,t.dueDate);saveState();renderTaskSettings();render()}
function settingsSetMemo(v){const t=settingsTask();if(!t)return;taskExtras(t).memo=v;saveState()}
function settingsShowPanel(name){settingsPanel=settingsPanel===name?'':name;renderTaskSettings();setTimeout(()=>{const el=document.querySelector('#taskSettingsScreen .settings-new-input');if(el){try{el.focus({preventScroll:true})}catch(e){el.focus()}keepSettingsFieldVisible(el)}},30)}
function settingsAddCondition(v){const t=settingsTask(),text=String(v||'').trim();if(!t||!text)return;taskExtras(t).conditions.push({id:newId(),text,done:false});saveState();renderTaskSettings()}
function settingsDeleteCondition(cid){const t=settingsTask();if(!t)return;const ex=taskExtras(t);ex.conditions=ex.conditions.filter(x=>x.id!==cid);saveState();renderTaskSettings();render()}
function settingsAddSubtask(v){const t=settingsTask(),text=String(v||'').trim();if(!t||!text)return;taskExtras(t).subtasks.push({id:newId(),text,done:false});saveState();renderTaskSettings()}
function settingsAddTag(v){const t=settingsTask(),name=String(v||'').trim().slice(0,12);if(!t||!name)return;let tg=(state.tags||[]).find(x=>x.name===name);if(!tg){tg={id:newId(),name,color:TAG_COLORS[(state.tags||[]).length%TAG_COLORS.length]};state.tags.push(tg)}if(!Array.isArray(t.tags))t.tags=[];if(!t.tags.includes(tg.id))t.tags.push(tg.id);saveState();renderTaskSettings()}
function renderTaskSettings(){const t=settingsTask(),body=document.getElementById('taskSettingsBody');if(!t||!body)return;document.getElementById('settingsPlace').textContent='INBOX';const tb=document.getElementById('settingsTodayBtn'),ib=document.getElementById('settingsImportantBtn'),hb=document.getElementById('settingsHoldBtn');tb.classList.toggle('on',isTaskToday(t));ib.classList.toggle('on',isTaskImportant(t));if(hb){const active=isTaskOnHold(t)||isTaskSkima(t);hb.classList.toggle('on',active);hb.textContent=isTaskSkima(t)?'保留 スキマ':(active?('保留 '+formatDateLabel(t.organizeHoldUntil)):'保留')}const ex=taskExtras(t);body.innerHTML='';
  const base=document.createElement('div');base.className='settings-base';base.innerHTML='<label class="settings-date"><span>日時</span><input type="date" value="'+escapeHtml(t.dueDate||'')+'"></label><input class="settings-title" value="'+escapeHtml(t.name||'')+'" placeholder="タスク名"><textarea class="settings-memo" placeholder="メモ">'+escapeHtml(ex.memo||'')+'</textarea>';body.appendChild(base);
  const date=base.querySelector('input[type=date]'),title=base.querySelector('.settings-title'),memo=base.querySelector('.settings-memo');date.onchange=e=>settingsSetDate(e.target.value);title.onchange=e=>settingsSetName(e.target.value);memo.oninput=e=>settingsSetMemo(e.target.value);

  // Existing data stays visible. Empty sections appear only while their toolbar button is active.
  if(ex.conditions.length||settingsPanel==='conditions')body.appendChild(settingsSection('条件',ex.conditions,'condition',settingsAddCondition,settingsPanel==='conditions'));
  if((t.tags||[]).length||settingsPanel==='tags')body.appendChild(settingsTagsSection(t,settingsPanel==='tags'));
  if(ex.subtasks.length||settingsPanel==='subtasks')body.appendChild(settingsSection('サブタスク',ex.subtasks,'subtask',settingsAddSubtask,settingsPanel==='subtasks'));
  if(document.getElementById('settingsHoldPanel')?.classList.contains('open'))renderSettingsHoldPanel();
}
function settingsInput(ph,fn){const wrap=document.createElement('div');wrap.className='settings-input-row';const input=document.createElement('input');input.className='settings-new-input';input.placeholder=ph;input.enterKeyHint='done';const b=document.createElement('button');b.type='button';b.textContent='追加';const go=()=>{fn(input.value);input.value=''};b.onclick=go;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};wrap.append(input,b);return wrap}
function settingsSection(title,items,type,addFn,editing=false){const sec=document.createElement('section');sec.className='settings-section'+(editing?' editing':'');const h=document.createElement('h3');h.textContent=title;sec.appendChild(h);const list=document.createElement('div');list.className='settings-mini-list';items.forEach(x=>{const row=document.createElement('div');row.className='settings-mini-row'+(x.done?' done':'');const text=document.createElement('span');text.textContent=x.text;row.appendChild(text);if(type==='condition'){const del=document.createElement('button');del.type='button';del.className='settings-mini-delete';del.setAttribute('aria-label','条件を削除');del.textContent='×';bindQuickTap(del,()=>settingsDeleteCondition(x.id));row.appendChild(del)}list.appendChild(row)});if(items.length)sec.appendChild(list);if(editing)sec.appendChild(settingsInput(type==='condition'?'完了したと言える条件':'サブタスク名',addFn));return sec}
function settingsTagsSection(t,editing=false){const sec=document.createElement('section');sec.className='settings-section'+(editing?' editing':'');sec.innerHTML='<h3>タグ</h3>';const chips=document.createElement('div');chips.className='settings-tag-cloud';const selected=new Set(t.tags||[]);const source=editing?(state.tags||[]):(state.tags||[]).filter(tg=>selected.has(tg.id));source.forEach(tg=>{const b=document.createElement('button');b.type='button';b.className='settings-tag-chip'+(selected.has(tg.id)?' on':'');b.textContent=tg.name;if(editing)b.onclick=()=>{toggleEditUserTag(t.id,tg.id);renderTaskSettings()};chips.appendChild(b)});if(source.length)sec.appendChild(chips);if(editing)sec.appendChild(settingsInput('新しいタグ',settingsAddTag));return sec}

function safeScrollEditInput(el){
  if(!el)return;
  const extra=el.closest('.task-extra');
  const scroller=extra||document.getElementById('ta');
  try{el.focus({preventScroll:true})}catch(e){}
  if(scroller){
    setTimeout(()=>{
      try{
        const er=el.getBoundingClientRect();
        const sr=scroller.getBoundingClientRect();
        const below=er.bottom-sr.bottom+88;
        const above=sr.top-er.top+18;
        if(below>0)scroller.scrollTop+=below;
        else if(above>0)scroller.scrollTop-=above;
      }catch(e){}
    },80);
    return;
  }
  try{el.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});}catch(_){try{el.scrollIntoView(false)}catch(e){}}
}
function renderTaskEditPanel(task){
  const p=document.createElement('div');p.className='task-edit-panel';
  const nm=document.createElement('input');nm.className='task-edit-name';nm.value=task.name||'';nm.placeholder='タスク名';nm.onchange=e=>setTaskEditName(task.id,e.target.value);nm.onclick=e=>e.stopPropagation();nm.ontouchstart=e=>e.stopPropagation();p.appendChild(nm);
  const clock=document.createElement('details');clock.className='task-edit-fold';
  const rp=task.repeatId?repeatById(task.repeatId):null;
  clock.innerHTML='<summary><span class="ico">◷</span><span>'+(task.dueDate?formatDateLabel(task.dueDate):'日付なし')+(task.dueTime?' '+task.dueTime:'')+(rp?' / ↻ '+repeatLabel(rp):'')+'</span></summary><div class="task-edit-fold-body"><div class="task-edit-row2"><input class="form-input" id="editDue_'+task.id+'" type="date" value="'+escapeHtml(task.dueDate||'')+'"><input class="form-input" id="editTime_'+task.id+'" type="time" value="'+escapeHtml(task.dueTime||'')+'"></div><select class="form-select" id="editRepeat_'+task.id+'"><option value="none">リピートなし</option><option value="daily">毎日</option><option value="weekly">毎週</option><option value="monthly">毎月</option></select></div>';
  p.appendChild(clock);
  setTimeout(()=>{const d=document.getElementById('editDue_'+task.id),tm=document.getElementById('editTime_'+task.id),rf=document.getElementById('editRepeat_'+task.id);if(d)d.onchange=e=>setTaskEditDate(task.id,e.target.value);if(tm)tm.onchange=e=>setTaskEditTime(task.id,e.target.value);if(rf){rf.value=repeatFreqForTask(task);rf.onchange=e=>setTaskEditRepeat(task.id,e.target.value)}},0);
  const tagBox=document.createElement('div');tagBox.className='edit-tag-box';
  const line=document.createElement('div');line.className='edit-tag-line';
  const inp=document.createElement('input');inp.className='edit-tag-input';inp.setAttribute('data-edit-tag-input',task.id);inp.placeholder=(task.tags||[]).map(id=>{const tg=tagById(id);return tg?tg.name:''}).filter(Boolean).join(', ')||'タグ';
  function openTagList(){if(openEditTagTaskId!==task.id){openEditTagTaskId=task.id;render();setTimeout(()=>{const x=document.querySelector('[data-edit-tag-input="'+task.id+'"]');if(x){x.focus({preventScroll:true});setTimeout(()=>safeScrollEditInput(x),60)}},30)}else{setTimeout(()=>safeScrollEditInput(inp),30)}}
  inp.onclick=e=>{e.stopPropagation();openTagList()};inp.onfocus=openTagList;inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();createEditTag(task.id,inp.value)}};line.appendChild(inp);
  const add=document.createElement('button');add.type='button';add.className='edit-tag-add';add.textContent='＋';add.onclick=e=>{e.stopPropagation();createEditTag(task.id,inp.value)};line.appendChild(add);tagBox.appendChild(line);
  if(openEditTagTaskId===task.id){
    const list=document.createElement('div');list.className='edit-tag-list';
    const today=document.createElement('button');today.type='button';today.className='edit-tag-chip system today'+(isTaskToday(task)?' on':'');today.textContent='今日';today.onclick=e=>{e.stopPropagation();toggleEditSystemTag(task.id,'today')};list.appendChild(today);
    const imp=document.createElement('button');imp.type='button';imp.className='edit-tag-chip system important'+(isTaskImportant(task)?' on':'');imp.textContent='重要';imp.onclick=e=>{e.stopPropagation();toggleEditSystemTag(task.id,'important')};list.appendChild(imp);
    const sep=document.createElement('div');sep.className='edit-tag-sep';list.appendChild(sep);
    if(!(state.tags||[]).length){const emp=document.createElement('div');emp.className='edit-tag-empty';emp.textContent='ユーザータグはまだない';list.appendChild(emp)}
    (state.tags||[]).forEach(tg=>{const b=document.createElement('button');b.type='button';const on=(task.tags||[]).includes(tg.id);b.className='edit-tag-chip'+(on?' on':'');b.textContent=tg.name;b.style.color=tg.color;b.style.borderColor=tg.color+'77';b.onclick=e=>{e.stopPropagation();toggleEditUserTag(task.id,tg.id)};list.appendChild(b)});
    tagBox.appendChild(list);
  }
  p.appendChild(tagBox);
  const adv=document.createElement('details');adv.className='task-edit-fold';adv.innerHTML='<summary><span class="ico">⋯</span><span>詳細</span></summary><div class="task-edit-fold-body"><div class="form-help">種別は通常タスク固定。習慣化や細かい整理は管理モード側で扱う想定。</div></div>';p.appendChild(adv);
  return p;
}

function renderSubtaskRow(taskId,st){
  const wrap=document.createElement('div');wrap.className='subtask-wrap'+(st.done?' done':'')+(openSubtaskSwipeId===st.id?' swiped':'');
  const del=document.createElement('button');del.type='button';del.className='subtask-delete';del.textContent='削除';del.onclick=e=>{e.stopPropagation();deleteSubtask(taskId,st.id)};wrap.appendChild(del);
  const row=document.createElement('div');row.className='subtask-row';
  const check=document.createElement('span');check.className='subtask-check';check.textContent=st.done?'✓':'';row.appendChild(check);
  const txt=document.createElement('span');txt.className='subtask-text';txt.textContent=st.text;row.appendChild(txt);
  check.onclick=e=>{e.stopPropagation();toggleSubtaskDone(taskId,st.id)};
  let sx=0,sy=0,dx=0,tracking=false,drag=false;
  row.addEventListener('touchstart',e=>{e.stopPropagation();const t=e.touches&&e.touches[0];if(!t)return;sx=t.clientX;sy=t.clientY;dx=0;tracking=true;drag=false;row.classList.remove('swipe-done','swipe-undo')},{passive:true});
  row.addEventListener('touchmove',e=>{e.stopPropagation();if(!tracking||!e.touches||!e.touches[0])return;const t=e.touches[0];dx=t.clientX-sx;const dy=t.clientY-sy;if(!drag){if(Math.abs(dx)<8)return;if(Math.abs(dx)<Math.abs(dy)*1.15){tracking=false;return}drag=true}e.preventDefault();
    if(dx<0){openSubtaskSwipeId=null;row.classList.remove('swipe-done','swipe-undo');row.style.transform='translateX('+Math.max(-62,dx).toFixed(1)+'px)'}
    else if(dx>0){row.style.transform='translateX('+Math.min(46,dx).toFixed(1)+'px)';row.classList.toggle('swipe-done',!st.done&&dx>34);row.classList.toggle('swipe-undo',st.done&&dx>34)}
  },{passive:false});
  row.addEventListener('touchend',e=>{e.stopPropagation();if(!tracking)return;tracking=false;row.style.transform='';row.classList.remove('swipe-done','swipe-undo');if(drag&&dx<-42){openSubtaskSwipeId=st.id;render();return}if(drag&&dx>42){openSubtaskSwipeId=null;toggleSubtaskDone(taskId,st.id);return}if(drag){openSubtaskSwipeId=null;render()}},{passive:true});
  row.addEventListener('touchcancel',()=>{tracking=false;row.style.transform='';row.classList.remove('swipe-done','swipe-undo')},{passive:true});
  wrap.appendChild(row);return wrap;
}

function attachTaskSettingsLongPress(card,task){
  if(!card||!task)return;
  let timer=0,sx=0,sy=0,tracking=false,fired=false;
  const cancel=()=>{if(timer){clearTimeout(timer);timer=0}tracking=false};
  card.addEventListener('touchstart',e=>{
    if(e.touches.length!==1||e.target.closest('button,input,textarea,select,.task-extra,.subtask-direct-list'))return;
    const t=e.touches[0];sx=t.clientX;sy=t.clientY;tracking=true;fired=false;
    timer=setTimeout(()=>{
      if(!tracking)return;
      fired=true;tracking=false;timer=0;
      try{navigator.vibrate&&navigator.vibrate(18)}catch(_e){}
      closeTaskExtras(false);clearInlineDopaon(false);openTaskSettings(task.id);
    },1000);
  },{passive:true});
  card.addEventListener('touchmove',e=>{
    if(!tracking||!e.touches[0])return;
    const t=e.touches[0];
    if(Math.abs(t.clientX-sx)>10||Math.abs(t.clientY-sy)>10)cancel();
  },{passive:true});
  card.addEventListener('touchend',e=>{if(fired){e.preventDefault();fired=false}cancel()},{passive:false});
  card.addEventListener('touchcancel',cancel,{passive:true});
}
function attachTaskSwipe(el,task){
  const card=el.querySelector('.task-card'),bg=el.querySelector('.task-swipe-bg');
  const isHabit=!!(task&&task._isHabit);
  let sx=0,sy=0,dx=0,dy=0,drag=false,tracking=false,gestureDir='',wasOpen=false;
  const RIGHT_SMALL=42,RIGHT_BIG=86,LEFT_OPEN=-94,OPEN_W=132;
  function closeOthers(){document.querySelectorAll('.task.open-tools').forEach(x=>{if(x!==el)x.classList.remove('open-tools')})}
  function resetVisual(){el.classList.remove('swiping','swipe-right-preview','swipe-left-preview','tier1','tier2','remove','max','full');if(card)card.style.transform='';if(bg)bg.textContent=''}
  el.addEventListener('touchstart',e=>{
    if(e.target.closest('.task-extra'))return;
    if(e.target.closest('button'))return;
    if(openExtraTaskId){closeTaskExtras(true);tracking=false;return}
    const t=e.touches&&e.touches[0];if(!t)return;
    sx=t.clientX;sy=t.clientY;dx=dy=0;drag=false;tracking=true;gestureDir='';
    wasOpen=el.classList.contains('open-tools');
    if(!wasOpen)closeOthers();
  },{passive:true});
  el.addEventListener('touchmove',e=>{
    if(!tracking||!e.touches||!e.touches[0])return;
    const t=e.touches[0];dx=t.clientX-sx;dy=t.clientY-sy;
    if(!drag){
      if(Math.abs(dx)<10)return;
      if(Math.abs(dx)<Math.abs(dy)*1.25){tracking=false;return}
      drag=true;
      gestureDir=wasOpen?'close':(dx>0?'right':'left');
      el.classList.add('swiping');
    }
    e.preventDefault();
    if(wasOpen){
      el.classList.remove('swipe-right-preview','swipe-left-preview','tier1','tier2','remove','max','full');
      if(bg)bg.textContent='';
      const x=-OPEN_W+Math.max(0,Math.min(OPEN_W,dx));
      if(card)card.style.transform='translateX('+x.toFixed(1)+'px)';
      return;
    }
    if(gestureDir==='right'&&dx>0&&!isHabit&&task.state!=='done'){
      const x=Math.min(dx,126),big=x>=RIGHT_BIG,armed=x>=RIGHT_SMALL,p=priorityPreview(task,big);
      el.classList.remove('swipe-left-preview','tier1','tier2','remove','max','full');
      el.classList.add('swipe-right-preview',armed?p.cls:'tier1');
      if(bg)bg.textContent=armed?p.txt:'もう少し';
      if(card)card.style.transform='translateX('+x.toFixed(1)+'px)';
    }else if(gestureDir==='left'&&dx<0){
      const x=Math.max(dx,-OPEN_W);
      el.classList.remove('swipe-right-preview','tier1','tier2','remove','max','full');
      el.classList.add('swipe-left-preview');
      if(bg)bg.textContent='削除';
      if(card)card.style.transform='translateX('+x.toFixed(1)+'px)';
    }
  },{passive:false});
  el.addEventListener('touchend',e=>{
    if(!tracking)return;
    tracking=false;
    if(!drag)return;
    const finalDx=dx,dir=gestureDir,big=finalDx>=RIGHT_BIG;
    resetVisual();
    if(wasOpen){
      if(finalDx>38)el.classList.remove('open-tools');
      else el.classList.add('open-tools');
      wasOpen=false;
      return;
    }
    if(dir==='right'&&finalDx>=RIGHT_SMALL&&!isHabit&&task.state!=='done'){
      applyPrioritySwipe(task,big);return;
    }
    if(dir==='left'&&finalDx<=LEFT_OPEN){
      closeTaskExtras(false);clearInlineDopaon(false);el.classList.add('open-tools');return;
    }
    if(dir==='left')el.classList.remove('open-tools');
  },{passive:true});
  el.addEventListener('touchcancel',()=>{tracking=false;wasOpen=false;resetVisual()},{passive:true});
}
function toggleCompleted(){state.ui.completedOpen=!state.ui.completedOpen;saveState();render()}
function clearCompleted(){const removed=state.tasks.filter(t=>t.state==='done');const n=removed.length;if(!n)return;state.tasks=state.tasks.filter(t=>t.state!=='done');saveState();render();showUndo('完了済み '+n+'件を整理した',()=>{state.tasks=state.tasks.concat(removed);saveState();render()})}


let flippedHabitId=null;
function habitTargetDate(h){return appDayStr()}
function habitTargetLabel(h){return '今日'}
function habitLog(h){return state.habitLogs[h.id]&&state.habitLogs[h.id][habitTargetDate(h)]}
function isHabitDone(h){const l=habitLog(h);return !!(l&&l.status==='done')}
function isHabitFailed(h){const l=habitLog(h);return !!(l&&l.status==='failed')}
function ensureHabitLogBox(id){if(!state.habitLogs[id])state.habitLogs[id]={};return state.habitLogs[id]}
function setHabitDone(id){const h=state.habits.find(x=>x.id===id);if(!h)return;const box=ensureHabitLogBox(id),day=habitTargetDate(h);const shouldReward=!(box[day]&&box[day].rewardDone);box[day]={status:'done',checkedAt:Date.now(),rewardDone:true};habitChargingId=null;if(shouldReward)addGameStamina(5,'HABIT CLEAR');const suppress=tutShouldSuppressHabitReward(id);tutHook('habit_done',id);if(shouldReward&&!suppress)issueChargeTicket({id:h.id,name:h.name},{force:'bonus',type:'habit'});saveState();render();spawnPraise('done');if(shouldReward&&!suppress){setTimeout(()=>startNextChargeTicket(true),160)}}
function setHabitFailed(id){const h=state.habits.find(x=>x.id===id);if(!h||h.habitKind!=='avoid')return;const box=ensureHabitLogBox(id),day=habitTargetDate(h);box[day]={status:'failed',checkedAt:Date.now(),rewardDone:false};habitChargingId=null;saveState();render();spawnPraise('add',{t:'記録した',c:'#ff6f8c'});tutHook('habit_failed',id)}
function undoHabit(id){const h=state.habits.find(x=>x.id===id);if(!h)return;if(state.habitLogs[id])delete state.habitLogs[id][habitTargetDate(h)];habitChargingId=null;saveState();render();showToast('習慣記録を戻した');tutHook('habit_undo',id)}
function tapHabit(id){if(appLockedForCompletion())return;clearTaskChargePreview(null,false);setHabitDone(id)}
function habitStreak(h){let count=0,day=habitTargetDate(h);for(let i=0;i<90;i++){const box=state.habitLogs[h.id];if(box&&box[day]&&box[day].status==='done'){count++;day=addDaysStr(day,-1)}else break}return count}
function habitStats(){const total=state.habits.length,done=state.habits.filter(isHabitDone).length,failed=state.habits.filter(isHabitFailed).length;return{total,done,failed,pending:Math.max(0,total-done-failed)}}
function habitMeta(h){const done=isHabitDone(h),failed=isHabitFailed(h);return[{cls:'habit',txt:(h.habitKind==='avoid'?'やらない':'やる')+'・毎日'},{cls:done?'reward':failed?'warn':'due',txt:habitTargetLabel(h)+' '+(done?'達成済':failed?'失敗':'未達成')}];}
function renderHabits(a){
  const head=document.createElement('div');head.className='habit-grid-head';head.innerHTML='<div><b>HABITS</b><span>長押しでBONUS / ダブルタップで裏面</span></div><span>'+habitStats().done+'/'+Math.max(1,state.habits.length)+'</span>';a.appendChild(head);
  const grid=document.createElement('div');grid.className='habit-grid';a.appendChild(grid);
  const list=habitSlotList();
  for(let i=0;i<9;i++){grid.appendChild(list[i]?mkHabitTile(list[i]):mkEmptyHabitTile(i))}
}
function mkEmptyHabitTile(i){
  const el=document.createElement('div');el.className='habit-tile empty';
  el.innerHTML='<div class="habit-tile-inner"><div class="habit-face"><div class="plus">＋</div><div>習慣を設定</div></div></div>';
  el.onclick=e=>{e.stopPropagation();flippedHabitId=null;openTaskMenu(null,'habit',i)};return el;
}
function mkHabitTile(h){
  const done=isHabitDone(h),failed=isHabitFailed(h),flipped=flippedHabitId===h.id,isAvoid=h.habitKind==='avoid';
  const el=document.createElement('div');el.className='habit-tile kind-'+(isAvoid?'avoid':'do')+(done?' done':'')+(failed?' failed':'')+(flipped?' flipped':'');el.dataset.id=h.id;
  const stateLabel=done?'ACHIEVED':failed?'FAILED':(isAvoid?'長押しで達成':'長押しで達成');
  const backBtns='<button class="mini-btn back">戻る</button><button class="mini-btn">⚙ 設定</button>'
    +(isAvoid&&!done&&!failed?'<button class="mini-btn fail">失敗を記録</button>':'')
    +((done||failed)?'<button class="mini-btn undo">↩ 記録取消</button>':'')
    +'<button class="mini-btn danger">× 削除</button>';
  el.innerHTML='<div class="habit-tile-inner"><div class="habit-face habit-front"><div class="habit-name">'+escapeHtml(h.name)+'</div>'+habitCheckListHtml(h)+'<div class="habit-streak">'+habitStreak(h)+'<small>DAY STREAK</small></div><div class="habit-state">'+stateLabel+'</div></div><div class="habit-face habit-back">'+backBtns+'</div></div>';
  const back=el.querySelector('.habit-back .back');if(back)back.onclick=e=>{e.stopPropagation();flippedHabitId=null;render();tutHook('habit_flip',h.id)};
  const edit=el.querySelector('.habit-back .mini-btn:not(.undo):not(.danger):not(.back):not(.fail)');if(edit)edit.onclick=e=>{e.stopPropagation();openTaskMenu(h.id,'habit')};
  const undo=el.querySelector('.habit-back .undo');if(undo)undo.onclick=e=>{e.stopPropagation();undoHabit(h.id)};
  const del=el.querySelector('.habit-back .danger');if(del)del.onclick=e=>{e.stopPropagation();deleteHabit(h.id)};
  const failBtn=el.querySelector('.habit-back .fail');
  let timer=null,pressed=false,moved=false,sx=0,sy=0;
  function clearPress(){if(timer){clearInterval(timer);timer=null}pressed=false;el.classList.remove('pressing','fail-pressing');el.style.removeProperty('--press');el.style.removeProperty('--failpress');if(failBtn)failBtn.style.removeProperty('--failpress')}
  function startSuccessPress(x,y){if(done||failed||flipped||appLockedForCompletion())return;if(tut&&tut.active&&h.id===tut.habitAvoidId){const _cs=tutCurrentStep();if(!_cs||_cs.id!=='t_lpavd'){showToast(_cs&&_cs.id==='t_fail'?'裏面の「失敗を記録」を長押し':'まだここは達成しないでね');return}}sx=x;sy=y;moved=false;pressed=true;el.classList.add('pressing');el.style.setProperty('--press','0%');let start=Date.now();timer=setInterval(()=>{const pct=Math.min(100,(Date.now()-start)/650*100);el.style.setProperty('--press',pct+'%');if(pct>=100){clearPress();setHabitDone(h.id)}},50)}
  function startFailPress(x,y){if(!isAvoid||done||failed||appLockedForCompletion())return;if(tut&&tut.active&&h.id===tut.habitAvoidId){const _cs=tutCurrentStep();if(!_cs||_cs.id!=='t_fail'){showToast('ここではまだ失敗を記録しないでね');return}}sx=x;sy=y;moved=false;pressed=true;el.classList.add('fail-pressing');el.style.setProperty('--failpress','0%');if(failBtn)failBtn.style.setProperty('--failpress','0%');let start=Date.now();timer=setInterval(()=>{const pct=Math.min(100,(Date.now()-start)/720*100);el.style.setProperty('--failpress',pct+'%');if(failBtn)failBtn.style.setProperty('--failpress',pct+'%');if(pct>=100){clearPress();setHabitFailed(h.id)}},50)}
  if(failBtn){
    failBtn.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t)return;e.stopPropagation();startFailPress(t.clientX,t.clientY)},{passive:true});
    failBtn.addEventListener('touchend',e=>{e.stopPropagation();clearPress()},{passive:true});
    failBtn.addEventListener('touchcancel',clearPress,{passive:true});
    failBtn.addEventListener('mousedown',e=>{e.stopPropagation();startFailPress(e.clientX,e.clientY)});
    ['mouseup','mouseleave'].forEach(ev=>failBtn.addEventListener(ev,clearPress));
    failBtn.onclick=e=>{e.stopPropagation()};
  }
  el.addEventListener('touchstart',e=>{const t=e.touches&&e.touches[0];if(!t||e.target.closest('button'))return;startSuccessPress(t.clientX,t.clientY)},{passive:true});
  el.addEventListener('touchmove',e=>{const t=e.touches&&e.touches[0];if(!t)return;if(Math.abs(t.clientX-sx)>12||Math.abs(t.clientY-sy)>12){moved=true;clearPress()}},{passive:true});
  el.addEventListener('touchend',e=>{clearPress()},{passive:true});
  el.addEventListener('touchcancel',clearPress,{passive:true});
  el.addEventListener('mousedown',e=>{if(e.target.closest('button'))return;startSuccessPress(e.clientX,e.clientY)});
  ['mouseup','mouseleave'].forEach(ev=>el.addEventListener(ev,clearPress));
  el.addEventListener('contextmenu',e=>e.preventDefault());
  let clickTimer=null;
  el.addEventListener('click',e=>{if(e.target.closest('button'))return;e.stopPropagation();if(clickTimer){clearTimeout(clickTimer);clickTimer=null;
    if(tut&&tut.active&&tutIsTempHabit(h.id)){
      const _cs=tutCurrentStep();
      const allowAvoidFlip=(h.id===tut.habitAvoidId&&_cs&&_cs.id==='t_dtap');
      if(!allowAvoidFlip){
        flippedHabitId=null;
        render();
        showToast(h.id===tut.habitDoId?'ここでは裏面に行かず、表面を長押ししてね':'今は点滅している案内どおり操作してね');
        return;
      }
    }
    flippedHabitId=flippedHabitId===h.id?null:h.id;render();tutHook('habit_flip',h.id);return}clickTimer=setTimeout(()=>{clickTimer=null;if(flippedHabitId&&flippedHabitId!==h.id){flippedHabitId=null;render()}},230)});
  return el;
}



function habitCheckListHtml(h){
  const arr=Array.isArray(h&&h.checks)?h.checks:[];
  if(!arr.length)return '';
  return '<div class="habit-check-list">'+arr.slice(0,3).map(x=>'<div>□ '+escapeHtml(x)+'</div>').join('')+(arr.length>3?'<div>…</div>':'')+'</div>';
}
function defaultGameState(){return{stamina:0,staminaDay:appDayStr(),gCount:0,coins:0,pullbackLeft:0,lastLog:'スタミナを使ってG数を進めろ。\nタスク完了でスタミナ+5。',titles:{detector:0,greed:0,saver:0},lastEnemy:null,hintLevel:0,hintStepG:-1,timePhase:'day',timeStepG:-1,infinite:false}}
function ensureGameState(){
  if(!state.game||typeof state.game!=='object')state.game=defaultGameState();
  const g=state.game,day=appDayStr();
  if(g.staminaDay!==day){g.stamina=0;g.staminaDay=day;g.lastLog='日付変更。残スタミナはリセットされた。\n今日のタスクで再チャージしろ。'}
  g.stamina=Math.max(0,Number(g.stamina)||0);g.gCount=Math.max(0,Number(g.gCount)||0);g.coins=Math.max(0,Number(g.coins)||0);g.pullbackLeft=Math.max(0,Number(g.pullbackLeft)||0);
  if(!g.titles||typeof g.titles!=='object')g.titles={detector:0,greed:0,saver:0};
  ['detector','greed','saver'].forEach(k=>g.titles[k]=clamp(Number(g.titles[k])||0,0,10));
  g.hintLevel=clamp(Number(g.hintLevel)||0,0,4);
  g.hintStepG=Number.isFinite(Number(g.hintStepG))?Number(g.hintStepG):-1;
  g.timeStepG=Number.isFinite(Number(g.timeStepG))?Number(g.timeStepG):-1;
  if(!['day','evening','night'].includes(g.timePhase))g.timePhase='day';
  g.infinite=!!g.infinite;
  return g;
}
function addGameStamina(n,label='CLEAR'){const g=ensureGameState();g.stamina+=Number(n)||0;g.lastLog=(label||'CLEAR')+'\nスタミナ +'+(Number(n)||0)+' 獲得。';}
function gameTitleInfo(){const g=ensureGameState();return{
  detector:{name:'探知者',desc:'敵遭遇率UP',lv:g.titles.detector||0,cost:50*((g.titles.detector||0)+1)},
  greed:{name:'強欲',desc:'勝利コインUP',lv:g.titles.greed||0,cost:50*((g.titles.greed||0)+1)},
  saver:{name:'省エネ',desc:'スタミナ温存率UP',lv:g.titles.saver||0,cost:50*((g.titles.saver||0)+1)}
}}
function gameHintName(level){return ['通常','高確','チャンス','前兆','激アツ'][clamp(Number(level)||0,0,4)]}
function gameHintKey(level){return ['white','green','blue','purple','red'][clamp(Number(level)||0,0,4)]}
function gameStepHintAdvance(g){
  const step=Math.floor(g.gCount/5);
  if(g.hintStepG===step)return;
  g.hintStepG=step;
  if(g.hintLevel>=4){g.hintLevel=0;return;} // 赤スルー後は通常へ
  const r=Math.random();
  if(g.hintLevel===0){
    if(r<0.025)g.hintLevel=4;      // いきなり赤（希少）
    else if(r<0.075)g.hintLevel=3; // いきなり紫
    else if(r<0.18)g.hintLevel=2;  // いきなり青
    else if(r<0.42)g.hintLevel=1;  // 緑
    else g.hintLevel=0;
  }else if(g.hintLevel===1){
    if(r<0.26)g.hintLevel=2; else if(r<0.32)g.hintLevel=3; else if(r<0.34)g.hintLevel=4;
  }else if(g.hintLevel===2){
    if(r<0.22)g.hintLevel=3; else if(r<0.27)g.hintLevel=4;
  }else if(g.hintLevel===3){
    if(r<0.18)g.hintLevel=4;
  }
}
function gameTimeAdvance(g){
  const step=Math.floor(g.gCount/20);
  if(g.timeStepG===step)return;
  g.timeStepG=step;
  const z=gameZone();
  const r=Math.random();
  if(z.level>=3)g.timePhase=r<0.62?'night':'evening';
  else if(z.level>=1)g.timePhase=r<0.52?'evening':(r<0.74?'night':'day');
  else g.timePhase=r<0.72?'day':(r<0.9?'evening':'night');
}
function gameZone(){
  const g=ensureGameState();
  if(g.pullbackLeft>0)return{key:'gold',name:'引き戻し',rate:1/10,level:4};
  if(g.gCount>=220)return{key:'gold',name:'天井前',rate:1/5,level:4};
  const lv=clamp(Number(g.hintLevel)||0,0,4);
  const rates=[1/115,1/75,1/48,1/26,.38];
  return{key:gameHintKey(lv),name:gameHintName(lv),rate:rates[lv],level:lv};
}
function gameSaveChance(){const lv=ensureGameState().titles.saver||0;return (1/15)+lv*((1/5-1/15)/10)}
function gameEncounterRate(){const g=ensureGameState(),z=gameZone();return Math.min(.85,z.rate+(g.titles.detector||0)*0.001)}
function gameRewardMult(){return 1+(ensureGameState().titles.greed||0)*0.001}
function gameEnemyLevel(){const pl=levelFromXp(state.xp);return Math.max(1,pl+Math.floor(Math.random()*5)-2)}
function gameWinRate(enemyLv){const pl=levelFromXp(state.xp);return clamp(50+(pl-enemyLv)*3,15,90)}
let cgBattle=null;
let cgBattleLocked=false;
function cgLockButton(ms=720){const b=document.getElementById('cgMainBtn');cgBattleLocked=true;if(b)b.classList.add('locked');setTimeout(()=>{cgBattleLocked=false;const bb=document.getElementById('cgMainBtn');if(bb)bb.classList.remove('locked')},ms)}
function cgRand(a,b){return a+Math.random()*(b-a)}
function cgPick(arr){return arr[Math.floor(Math.random()*arr.length)]}
function cgButton(){
  if(cgBattleLocked)return;
  if(cgBattle&&cgBattle.phase==='battle')return cgBattleClick();
  if(cgBattle&&cgBattle.phase==='result')return cgEndBattle();
  return gameStep();
}
function cgUpdateButton(text,cost,battle){
  const btn=document.getElementById('cgMainBtn'),main=document.getElementById('cgBtnMain'),sub=document.getElementById('cgBtnCost');
  if(!btn||!main||!sub)return;
  main.textContent=text;sub.textContent=cost||'';btn.classList.toggle('battle',!!battle);
}
function cgExpectFlash(){
  const battle=document.getElementById('cgBattle');if(!battle)return;
  if(Math.random()>0.28)return;
  const colors=['green','green','green','blue','blue','purple','red','gold'];
  const c=cgPick(colors);
  battle.classList.add('hint-'+c);
  setTimeout(()=>{battle.classList.remove('hint-green','hint-blue','hint-purple','hint-red','hint-gold')},640);
}
function cgAnimateRound(type){
  const p=document.getElementById('cgPlayerFighter'),e=document.getElementById('cgEnemyFighter');
  const ph=document.getElementById('cgPlayerHit'),eh=document.getElementById('cgEnemyHit');
  if(!p||!e)return;
  p.classList.remove('lunge','recoil');e.classList.remove('lunge','recoil');
  if(type==='player'){
    cgExpectFlash();p.classList.add('lunge');
    setTimeout(()=>{eh&&eh.classList.add('show');e.classList.add('recoil')},220);
    setTimeout(()=>{eh&&eh.classList.remove('show');p.classList.remove('lunge');e.classList.remove('recoil')},560);
  }else if(type==='enemy'){
    e.classList.add('lunge');
    setTimeout(()=>{ph&&ph.classList.add('show');p.classList.add('recoil')},220);
    setTimeout(()=>{ph&&ph.classList.remove('show');e.classList.remove('lunge');p.classList.remove('recoil')},560);
  }else{
    p.classList.add('recoil');e.classList.add('recoil');
    setTimeout(()=>{p.classList.remove('recoil');e.classList.remove('recoil')},520);
  }
}
function cgComboFor(win){
  const r=Math.random();
  if(win){
    if(r<.55)return ['player','player'];
    if(r<.85)return Math.random()<.5?['player','enemy']:['enemy','player'];
    return ['miss','player'];
  }
  if(r<.45)return ['enemy','enemy'];
  if(r<.8)return Math.random()<.5?['player','enemy']:['enemy','player'];
  return ['player','miss'];
}
function cgStartBattle(info){
  const battle=document.getElementById('cgBattle'),stage=document.getElementById('cgStage');
  if(!battle||!stage)return;
  cgBattle={phase:'entry',step:0,info:info,combo:cgComboFor(info.win)};
  stage.classList.add('cg-battle-entry');
  cgUpdateButton('接敵中…','LOCK',true);
  cgLockButton(820);
  setTimeout(()=>{
    if(!cgBattle||cgBattle.phase!=='entry')return;
    cgBattle.phase='battle';
    stage.classList.remove('cg-battle-entry');
    stage.classList.add('cg-battle-on');battle.classList.add('active');battle.classList.remove('clash');
    document.getElementById('cgPlayerFighter')?.classList.remove('winner','loser');
    document.getElementById('cgEnemyFighter')?.classList.remove('winner','loser');
    const result=document.getElementById('cgResult');result&&result.classList.remove('show','win','lose');
    cgUpdateButton('こうげき','1/4',true);
  },760);
}
function cgBattleClick(){
  if(!cgBattle||cgBattle.phase!=='battle')return;
  cgBattle.step++;
  if(cgBattle.step===1){cgAnimateRound(cgBattle.combo[0]);cgUpdateButton('こうげき','2/4',true);cgLockButton(780);return;}
  if(cgBattle.step===2){cgAnimateRound(cgBattle.combo[1]);cgUpdateButton('押し切れ','3/4',true);cgLockButton(780);return;}
  if(cgBattle.step===3){document.getElementById('cgBattle')?.classList.add('clash');cgUpdateButton('結果発表','4/4',true);cgLockButton(920);return;}
  return cgShowResult();
}
function cgShowResult(){
  if(!cgBattle)return;
  const win=!!cgBattle.info.win,g=ensureGameState(),info=cgBattle.info;
  cgBattle.phase='result';
  const p=document.getElementById('cgPlayerFighter'),e=document.getElementById('cgEnemyFighter'),res=document.getElementById('cgResult'),word=document.getElementById('cgResultWord');
  document.getElementById('cgBattle')?.classList.remove('clash');
  if(win){
    const coins=Math.max(1,Math.round(info.enemyLv*10*gameRewardMult()));
    g.coins+=coins;g.gCount=0;g.pullbackLeft=0;g.hintLevel=0;g.hintStepG=-1;g.lastEnemy={lv:info.enemyLv,winRate:info.rate,win:true};
    g.lastLog='WIN！！\n敵Lv.'+info.enemyLv+' 撃破。\nコイン +'+coins+' 獲得。\nG数リセット。';
    p&&p.classList.add('winner');e&&e.classList.add('loser');
  }else{
    g.pullbackLeft=15;g.hintLevel=0;g.hintStepG=-1;g.lastEnemy={lv:info.enemyLv,winRate:info.rate,win:false};
    g.lastLog='LOSE…\n敵Lv.'+info.enemyLv+' に敗北。\n15G引き戻し区間へ。G数は継続。';
    e&&e.classList.add('winner');p&&p.classList.add('loser');
  }
  saveState();
  if(word)word.textContent=win?'WIN':'LOSE';
  if(res){res.classList.add('show',win?'win':'lose');}
  cgUpdateButton('つづける','',true);
}
function cgEndBattle(){cgBattle=null;saveState();render();}
function gameStep(){
  const g=ensureGameState();
  if(!g.infinite&&g.stamina<=0){g.lastLog='スタミナ切れ。\nタスクを完了してチャージしろ。';saveState();cgUpdateGameDom(g);return}
  const saved=!g.infinite && Math.random()<gameSaveChance();
  if(!g.infinite&&!saved)g.stamina-=1;
  g.gCount+=1;
  if(g.pullbackLeft>0)g.pullbackLeft-=1;
  gameStepHintAdvance(g);
  gameTimeAdvance(g);
  const z=gameZone();
  const forced=g.gCount>=240;
  const hit=forced||Math.random()<gameEncounterRate();
  let log=(g.infinite?'∞ TEST STAMINA\n':(saved?'省エネ発動！スタミナ消費なし。\n':''))+'▶ '+g.gCount+'G 進行\n'+z.name;
  let battleInfo=null;
  if(hit){
    const enemyLv=forced?Math.max(1,levelFromXp(state.xp)+3):gameEnemyLevel();
    const rate=forced?50:gameWinRate(enemyLv);
    const win=Math.random()*100<rate;
    battleInfo={enemyLv,rate,win,forced,name:'シャドウ'};
    log+='\n\n⚔ 接敵！ 敵Lv.'+enemyLv;
  }else if(z.level>=4){
    g.hintLevel=0;g.hintStepG=-1;
    log+='\n赤示唆スルー。通常へ。';
  }
  g.lastLog=log;saveState();
  const stage=document.getElementById('cgStage'),slime=document.querySelector('.claude-game .cg-slime'),shadow=document.querySelector('.claude-game .cg-shadow'),tag=document.querySelector('.claude-game .cg-name-tag');
  stage&&stage.classList.add('moving');slime&&slime.classList.add('hopping');shadow&&shadow.classList.add('hopping');tag&&tag.classList.add('hopping');
  cgUpdateGameDom(g,{animate:true});
  setTimeout(()=>{stage&&stage.classList.remove('moving');slime&&slime.classList.remove('hopping');shadow&&shadow.classList.remove('hopping');tag&&tag.classList.remove('hopping');if(battleInfo)cgStartBattle(battleInfo)},560);
}
function upgradeGameTitle(key){
  const g=ensureGameState(),info=gameTitleInfo()[key];
  if(!info)return;
  if(info.lv>=10){g.lastLog=info.name+' は上限Lv.10。';saveState();render();return}
  if(g.coins<info.cost){g.lastLog='コイン不足。\n必要 '+info.cost+' / 所持 '+g.coins;saveState();render();return}
  g.coins-=info.cost;g.titles[key]=info.lv+1;g.lastLog=info.name+' Lv.'+(info.lv+1)+' 強化完了。';saveState();render();
}
function toggleInfiniteStamina(){const g=ensureGameState();g.infinite=!g.infinite;g.lastLog=g.infinite?'テスト用：無限スタミナ ON':'テスト用：無限スタミナ OFF';saveState();render();}
function resetGameData(){
  openAppConfirm({
    title:'ゲームデータだけリセットする？',
    message:'タスクやプロフィールは残して、ゲームの進行だけ初期化します。',
    okText:'リセット',
    danger:true,
    onOk:resetGameDataConfirmed
  });
}
function resetGameDataConfirmed(){
  cgBattle=null;state.game=defaultGameState();saveState();render();
}

function cgBiomeForG(gCount){
  const order=['forest_open','city_far','forest_deep','mtn_near','savanna','desert','snow'];
  return order[Math.floor((Number(gCount)||0)/25)%order.length];
}
function cgBiomeLabel(key){return({forest_open:'森を抜けて',city_far:'遠くの街',forest_deep:'深い森',mtn_near:'山麓',savanna:'サバンナ',desert:'砂漠',snow:'雪山'})[key]||'探索路'}
function cgBiomeTintClass(key){return key==='city_far'?'city':key==='desert'?'desert':key==='snow'?'snow':'forest'}
function cgSceneHtml(key){
  const ink='';
  const tree=(left,h,w=12)=>'<div class="item" style="left:'+left+'%;bottom:24%;width:'+w+'px;height:'+h+'%;background:var(--cg-ink);border-radius:10px 10px 0 0"></div>';
  const grass=(left)=>'<div class="cg-grass" style="left:'+left+'%;"></div>';
  const mountain=(left,w,h,op=.65)=>'<div class="item" style="left:'+left+'%;bottom:24%;width:'+w+'%;height:'+h+'%;background:var(--cg-ink);clip-path:polygon(50% 0,100% 100%,0 100%);opacity:'+op+'"></div>';
  const dune=(left,w,h)=>'<div class="item" style="left:'+left+'%;bottom:24%;width:'+w+'%;height:'+h+'%;background:var(--cg-ink);border-radius:50% 50% 0 0/100% 100% 0 0;opacity:.68"></div>';
  const cactus=(left,h)=>'<div class="item" style="left:'+left+'%;bottom:24%;width:34px;height:'+h+'%;"><div style="position:absolute;left:12px;bottom:0;width:10px;height:100%;background:var(--cg-ink);border-radius:5px 5px 0 0"></div><div style="position:absolute;left:0;bottom:46%;width:18px;height:8px;background:var(--cg-ink);border-radius:4px"></div><div style="position:absolute;right:0;bottom:62%;width:18px;height:8px;background:var(--cg-ink);border-radius:4px"></div></div>';
  const city='<div class="item" style="left:6%;bottom:24%;width:72%;height:40%;background:linear-gradient(90deg,var(--cg-ink) 0 9%,transparent 9% 13%,var(--cg-ink) 13% 24%,transparent 24% 28%,var(--cg-ink) 28% 38%,transparent 38% 44%,var(--cg-ink) 44% 60%,transparent 60% 65%,var(--cg-ink) 65% 79%,transparent 79% 84%,var(--cg-ink) 84%);clip-path:polygon(0 45%,9% 45%,9% 15%,24% 15%,24% 38%,38% 38%,38% 0,60% 0,60% 30%,79% 30%,79% 8%,100% 8%,100% 100%,0 100%)"></div>';
  const snowPeak='<div class="item" style="left:8%;bottom:24%;width:56%;height:48%;background:var(--cg-ink);clip-path:polygon(50% 0,100% 100%,0 100%);opacity:.72"></div><div class="item" style="left:30%;bottom:56%;width:12%;height:9%;background:rgba(238,246,255,.82);clip-path:polygon(50% 0,100% 100%,0 100%)"></div>';
  let far='',near='';
  if(key==='forest_open'){far=mountain(-5,46,45,.64)+mountain(58,38,34,.52);near=tree(10,44,14)+tree(20,32,8)+tree(80,30,10)+grass(58)+grass(86)}
  else if(key==='city_far'){far=city;near=grass(12)+grass(76)+mountain(-8,34,22,.45)}
  else if(key==='forest_deep'){far=tree(5,70,22)+tree(22,58,12)+tree(76,66,18);near=tree(14,52,26)+tree(86,45,20)+grass(50)+grass(70)}
  else if(key==='mtn_near'){far=mountain(-18,82,68,.78)+mountain(42,70,54,.66);near=grass(18)+grass(70)+'<div class="item" style="left:56%;bottom:24%;width:42px;height:20px;background:var(--cg-ink);border-radius:50% 50% 8% 8%"></div>'}
  else if(key==='savanna'){far=dune(-8,70,18)+mountain(58,40,28,.5);near='<div class="item" style="left:14%;bottom:24%;width:92px;height:72px"><div style="position:absolute;left:42px;bottom:0;width:7px;height:60px;background:var(--cg-ink)"></div><div style="position:absolute;left:0;top:0;width:92px;height:22px;background:var(--cg-ink);border-radius:50%"></div></div>'+grass(68)}
  else if(key==='desert'){far=dune(-10,82,20)+dune(42,76,24);near=cactus(16,22)+cactus(78,18)+'<div class="item" style="left:55%;bottom:24%;width:46px;height:18px;background:var(--cg-ink);border-radius:50% 50% 8% 8%"></div>'}
  else {far=snowPeak+mountain(48,55,42,.55);near='<div class="item" style="left:18%;bottom:24%;width:44px;height:70px"><div style="position:absolute;left:20px;bottom:0;width:5px;height:70px;background:var(--cg-ink)"></div><div style="position:absolute;left:0;bottom:38px;width:32px;height:4px;background:var(--cg-ink);transform:rotate(-24deg)"></div><div style="position:absolute;right:0;bottom:50px;width:32px;height:4px;background:var(--cg-ink);transform:rotate(20deg)"></div></div>'+grass(76)}
  return '<div class="cg-scene far" id="cgSceneFar">'+far+'</div><div class="cg-scene near" id="cgSceneNear">'+near+'</div>'+(key==='snow'?'<div class="cg-snow on" id="cgSnow">'+Array.from({length:18},(_,i)=>'<i style="left:'+(i*7%100)+'%;width:'+(2+i%3)+'px;height:'+(2+i%3)+'px;animation-delay:-'+(i%8)+'s"></i>').join('')+'</div>':'<div class="cg-snow" id="cgSnow"></div>');
}
function cgCellHtml(n){return '<div class="cg-cell '+(n%10===0?'milestone':'')+'"><div class="pad"></div><em>'+n+'</em></div>'}
function cgBuildCellsHtml(gCount){let first=Math.max(0,(Number(gCount)||0)-4),html='';for(let i=0;i<10;i++)html+=cgCellHtml(first+i);return html}
function cgCurrentCellOffset(gCount){return 'calc(50% - '+(4*86+43)+'px)'}
function cgUpdateGameDom(g,opts={}){
  const root=document.querySelector('.claude-game');if(!root)return;
  const z=gameZone(),biome=cgBiomeForG(g.gCount),stage=document.getElementById('cgStage');
  const gb=document.getElementById('cgG');if(gb)gb.textContent=g.gCount;
  const lf=document.getElementById('cgLeft');if(lf)lf.textContent=Math.max(0,240-g.gCount);
  const bl=document.getElementById('cgBiomeLabel');if(bl)bl.textContent=cgBiomeLabel(biome);
  const badge=document.getElementById('cgZoneBadge');if(badge)badge.textContent=z.name;
  if(stage){stage.classList.remove('day','evening','night');stage.classList.add(g.timePhase||'day')}
  document.querySelectorAll('.cg-sky').forEach(x=>x.classList.toggle('on',x.classList.contains(g.timePhase||'day')));
  const tint=document.getElementById('cgBiomeTint');if(tint){tint.className='cg-biome-tint '+cgBiomeTintClass(biome)}
  const sc=document.getElementById('cgSceneMount');if(sc&&sc.dataset.biome!==biome){sc.dataset.biome=biome;sc.innerHTML=cgSceneHtml(biome)}
  const cells=document.getElementById('cgCells');
  if(cells){
    if(opts.animate){
      cells.style.transform='translateX(calc(50% - '+(5*86+43)+'px))';
      setTimeout(()=>{cells.style.transition='none';cells.innerHTML=cgBuildCellsHtml(g.gCount);cells.style.transform=cgCurrentCellOffset(g.gCount);requestAnimationFrame(()=>{cells.style.transition=''})},510);
    }else{cells.innerHTML=cgBuildCellsHtml(g.gCount);cells.style.transform=cgCurrentCellOffset(g.gCount)}
  }
  const stamina=document.getElementById('cgStaminaHud');if(stamina){let dots='';if(g.infinite){dots='<span class="rest">∞</span>'}else{const shown=Math.min(g.stamina,5);for(let i=0;i<5;i++)dots+='<span class="dot '+(i>=shown?'used':'')+'"></span>';dots+='<span class="rest">'+(g.stamina>5?('+'+(g.stamina-5)):(g.stamina===0?'0':''))+'</span>'}stamina.className='cg-stamina-hud '+(g.infinite?'inf ':'')+(g.stamina===0&&!g.infinite?'empty':'');stamina.innerHTML='<span class="lbl">STAMINA</span>'+dots}
  const log=document.getElementById('cgLog');if(log)log.textContent=g.lastLog||'探索開始。';
  const btn=document.getElementById('cgMainBtn'),bm=document.getElementById('cgBtnMain'),bc=document.getElementById('cgBtnCost');if(btn&&bm&&bc&&(!cgBattle||cgBattle.phase==='idle')){btn.disabled=(g.stamina<=0&&!g.infinite);bm.textContent=(g.stamina<=0&&!g.infinite)?'タスクを終わらせてスタミナGET':'1G 進む';bc.textContent=g.infinite?'∞ TEST':(g.stamina<=0?'':'STAMINA −1')}
}
function renderGame(a){
  const g=ensureGameState();
  g.infinite=true;
  if(typeof g.clearedG!=='number')g.clearedG=-1;
  if(!Array.isArray(g.items))g.items=[];
  const pl=levelFromXp(state.xp);
  const nm=(state.profile.name||'DOPADO').trim()||'DOPADO';
  const t=titleById(state.profile.titleId);
  const ctx={
    playerName:nm,
    playerTitle:t?t.text:'探知者',
    titleColor:t?TIERS[t.tier].color:'#34d399',
    level:pl,
    gCount:g.gCount||0,
    clearedG:typeof g.clearedG==='number'?g.clearedG:-1,
    coins:g.coins||0,
    items:g.items||[],
    infinite:true
  };
  try{localStorage.setItem('DOPADO_GAME_CONTEXT',JSON.stringify(ctx));}catch(e){}
  const wrap=document.createElement('div');
  wrap.className='game-wrap v27-native-game-wrap';
  wrap.innerHTML='<iframe id="dopadoV27GameFrame" class="dopado-v27-game-frame" src="./game.html?v=46" title="DOPADO GAME"></iframe>';
  a.appendChild(wrap);
}


function attachTaskLongPress(btn,task){
  if(!btn||!task||task.state==='done')return;
  let timer=null,done=false;
  function clear(){if(timer){clearTimeout(timer);timer=null}}
  function start(e){if(task.state!=='charging')return;done=false;clear();timer=setTimeout(()=>{done=true;tap(task.id)},650)}
  btn.addEventListener('touchstart',start,{passive:true});btn.addEventListener('touchend',clear,{passive:true});btn.addEventListener('touchcancel',clear,{passive:true});
  btn.addEventListener('mousedown',start);btn.addEventListener('mouseup',clear);btn.addEventListener('mouseleave',clear);
}

function todayTaskStats(){const todayTasks=state.tasks.filter(t=>isTaskToday(t)),done=todayTasks.filter(t=>t.state==='done').length;return{total:todayTasks.length,done,pending:Math.max(0,todayTasks.length-done),important:importantCount(),items:todayTasks}}
function dotHtml(done,total){const max=5,filled=total?Math.round(done/total*max):0;let s='';for(let i=0;i<max;i++)s+='<span class="'+(i<filled?'dot-on':'dot-off')+'"></span>';return s}
/* ===== v14 calendar ===== */
function tasksOnDay(ds){return state.tasks.filter(t=>t.dueDate===ds)}
function openTaskMenuWithDue(day){openTaskMenu(null,'task');const due=document.getElementById('taskDueInput');if(due)due.value=day;syncTaskMenuToggleUI()}
function renderCalendar(a){
  const todayS=appDayStr();
  if(!calMonth)calMonth=todayS.slice(0,7);
  if(!calSelDay)calSelDay=todayS;
  const wrap=document.createElement('div');wrap.className='cal-wrap';
  const parts=calMonth.split('-'),yy=Number(parts[0]),mm=Number(parts[1]);
  const head=document.createElement('div');head.className='cal-head';
  const prev=document.createElement('button');prev.type='button';prev.className='cal-nav';prev.textContent='‹';
  const next=document.createElement('button');next.type='button';next.className='cal-nav';next.textContent='›';
  const title=document.createElement('div');title.className='cal-title';title.textContent=yy+'.'+String(mm).padStart(2,'0');
  prev.onclick=()=>{const d=new Date(yy,mm-2,1);calMonth=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');render()};
  next.onclick=()=>{const d=new Date(yy,mm,1);calMonth=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');render()};
  head.appendChild(prev);head.appendChild(title);head.appendChild(next);wrap.appendChild(head);
  const grid=document.createElement('div');grid.className='cal-grid';
  WEEKDAYS.forEach(w=>{const d=document.createElement('div');d.className='cal-dow';d.textContent=w;grid.appendChild(d)});
  const startDow=new Date(yy,mm-1,1).getDay(),daysIn=new Date(yy,mm,0).getDate();
  for(let i=0;i<startDow;i++){const c=document.createElement('div');c.className='cal-day out';grid.appendChild(c)}
  for(let d=1;d<=daysIn;d++){
    const ds=calMonth+'-'+String(d).padStart(2,'0');
    const cell=document.createElement('div');
    cell.className='cal-day'+(ds===todayS?' today':'')+(ds===calSelDay?' sel':'');
    cell.textContent=d;
    const dots=document.createElement('div');dots.className='cal-dots';
    const ts=tasksOnDay(ds);let shown=0;
    ts.slice(0,4).forEach(t=>{const i2=document.createElement('i');if(t.state==='done')i2.className='done';else if(ds<todayS)i2.className='warn';dots.appendChild(i2);shown++});
    if(shown<4&&(state.repeats||[]).some(rp=>rp.active&&repeatDueOn(rp,ds)&&!ts.some(t=>t.repeatId===rp.id))){const i3=document.createElement('i');i3.className='rep';dots.appendChild(i3)}
    cell.appendChild(dots);
    cell.onclick=()=>{calSelDay=ds;render()};
    grid.appendChild(cell);
  }
  wrap.appendChild(grid);
  /* 選択日パネル */
  const panel=document.createElement('div');panel.className='cal-panel';
  const ph=document.createElement('div');ph.className='cal-panel-head';
  const pd=document.createElement('div');pd.className='cal-panel-date';pd.textContent=formatDateLabel(calSelDay)+(calSelDay===todayS?'（今日）':'');
  const addBtn=document.createElement('button');addBtn.type='button';addBtn.className='cal-add';addBtn.textContent='＋ この日にタスク';
  addBtn.onclick=()=>openTaskMenuWithDue(calSelDay);
  ph.appendChild(pd);ph.appendChild(addBtn);panel.appendChild(ph);
  const dayTasks=tasksOnDay(calSelDay).slice().sort((x,y)=>String(x.dueTime||'99:99').localeCompare(String(y.dueTime||'99:99')));
  const ghostReps=(state.repeats||[]).filter(rp=>rp.active&&repeatDueOn(rp,calSelDay)&&!dayTasks.some(t=>t.repeatId===rp.id));
  if(!dayTasks.length&&!ghostReps.length){const e=document.createElement('div');e.className='cal-empty';e.textContent='この日の予定はない';panel.appendChild(e)}
  dayTasks.forEach(t=>{
    const row=document.createElement('div');row.className='cal-item'+(t.state==='done'?' done':'');
    if(t.dueTime){const tm=document.createElement('span');tm.className='time';tm.textContent=t.dueTime;row.appendChild(tm)}
    const nm=document.createElement('span');nm.className='nm';nm.textContent=t.name;row.appendChild(nm);
    (t.tags||[]).slice(0,3).forEach(tid=>{const tg=tagById(tid);if(!tg)return;const s=tagEl('user',tg.name);s.style.color=tg.color;s.style.borderColor=tg.color+'66';row.appendChild(s)});
    row.onclick=()=>openTaskMenu(t.id,'task');
    panel.appendChild(row);
  });
  ghostReps.forEach(rp=>{
    const row=document.createElement('div');row.className='cal-item rep';
    if(rp.dueTime){const tm=document.createElement('span');tm.className='time';tm.textContent=rp.dueTime;row.appendChild(tm)}
    const nm=document.createElement('span');nm.className='nm';nm.textContent='↻ '+rp.name;row.appendChild(nm);
    panel.appendChild(row);
  });
  wrap.appendChild(panel);
  a.appendChild(wrap);
}
function renderBottomBar(){
  document.querySelectorAll('.dopado-tab').forEach(b=>b.classList.toggle('on',b.dataset.tab===currentMode()));
  const title=document.querySelector('.habit-title'),status=document.querySelector('.habit-status'),row=document.getElementById('habitRow');
  if(!title||!status||!row)return;
  row.setAttribute('aria-label',currentMode()==='tasks'?'習慣画面':'日常タスク画面');
  if(currentMode()==='game'){
    renderChargeMini();renderInputPrompt();return;
  }
  if(currentMode()==='cal'){
    title.innerHTML='CALENDAR <span class="mode-sample">俯瞰</span>';
    status.innerHTML='<span class="mode-gate-copy"><span class="num">'+escapeHtml(formatDateLabel(calSelDay||appDayStr()))+'</span></span><span class="gate-arrows" aria-hidden="true"><i>›</i><i>›</i><i>›</i></span>';
    renderChargeMini();renderInputPrompt();return;
  }
  if(currentMode()==='habits'){
    const st=todayTaskStats();
    title.innerHTML='TASK GATE <span class="mode-sample">今日タスク</span>';
    status.innerHTML='<span class="mode-gate-copy"><span class="num">TODAY '+st.done+'/'+st.total+'</span><span class="important">IMPORTANT '+(st.important||0)+'/2</span></span><span class="gate-arrows" aria-hidden="true"><i>›</i><i>›</i><i>›</i></span>';
  }else{
    const st=habitStats();
    if(st.total<=0){
      title.innerHTML='HABIT GATE <span class="mode-sample">SET</span>';
      status.innerHTML='<span class="mode-gate-copy"><span class="pending">習慣をセット</span></span><span class="gate-arrows" aria-hidden="true"><i>›</i><i>›</i><i>›</i></span>';
    }else{
      title.innerHTML='HABIT GATE <span class="mode-sample">BONUS</span>';
      status.innerHTML='<span class="mode-gate-copy"><span class="done">DONE '+st.done+'</span><span class="pending">LEFT '+st.pending+'</span></span><span class="gate-arrows" aria-hidden="true"><i>›</i><i>›</i><i>›</i></span>';
    }
  }
  renderChargeMini();
  renderInputPrompt();
}
function setMainMode(mode){if(chargeBusy)return;if(!['tasks','habits','game','cal'].includes(mode))mode='tasks';closeTaskExtras(false);clearTaskChargePreview(null,false);state.ui.mode=mode;taskChargingId=null;habitChargingId=null;flippedHabitId=null;if(mode==='game'){setChargeInteractionLocked(false);stopChargeParticles();resetChargeFrame()}saveState();render();if(currentMode()==='habits')tutHook('mode_habits');if(currentMode()!=='game'&&state.chargeTickets&&state.chargeTickets.length)setTimeout(()=>startNextChargeTicket(true),220)}
function toggleMainMode(){setMainMode(currentMode()==='tasks'?'habits':'tasks')}



/* ===== v49.21: TASK MANAGER v1 ===== */
let taskManagerFilter='attention';
let taskManagerSearchQuery='';
let taskManagerSelectionMode=false;
let taskManagerSelectedIds=new Set();
let taskManagerVisibleIds=[];
const TASK_MANAGER_VIEW_KEY='dopado_task_manager_view_v1';
let taskManagerView={density:'standard',sort:'auto',show:{active:true,hold:true,skima:true,breakdown:true,done:true}};
function loadTaskManagerView(){try{const x=JSON.parse(localStorage.getItem(TASK_MANAGER_VIEW_KEY)||'null');if(x&&typeof x==='object'){taskManagerView.density=['standard','compact','simple'].includes(x.density)?x.density:'standard';taskManagerView.sort=['auto','due','newest','oldest','updated','name'].includes(x.sort)?x.sort:'auto';taskManagerView.show=Object.assign({},taskManagerView.show,x.show||{})}}catch(e){}}
function saveTaskManagerView(){try{localStorage.setItem(TASK_MANAGER_VIEW_KEY,JSON.stringify(taskManagerView))}catch(e){}}
loadTaskManagerView();

const TASK_MANAGER_FILTER_KEY='dopado_task_manager_advanced_filter_v1';
const TASK_MANAGER_SAVED_FILTERS_KEY='dopado_task_manager_saved_filters_v1';
let taskManagerAdvancedFilter=null;
let taskManagerFilterDraft=null;
let taskManagerActiveSavedViewId='';
let taskManagerSavedFilters=[];
function managerNewCondition(){return{field:'status',op:'is',value:'active',negate:false}}
function managerNewFilter(){return{groups:[{join:'and',link:'and',negate:false,conditions:[managerNewCondition()]}]}}
function loadTaskManagerAdvancedFilters(){
  try{const a=JSON.parse(localStorage.getItem(TASK_MANAGER_FILTER_KEY)||'null');if(a&&Array.isArray(a.groups))taskManagerAdvancedFilter=a}catch(e){}
  try{const x=JSON.parse(localStorage.getItem(TASK_MANAGER_SAVED_FILTERS_KEY)||'[]');if(Array.isArray(x))taskManagerSavedFilters=x.filter(v=>v&&v.id&&v.name&&v.filter)}catch(e){}
}
function saveTaskManagerAdvancedFilters(){try{localStorage.setItem(TASK_MANAGER_FILTER_KEY,JSON.stringify(taskManagerAdvancedFilter));localStorage.setItem(TASK_MANAGER_SAVED_FILTERS_KEY,JSON.stringify(taskManagerSavedFilters))}catch(e){}}
loadTaskManagerAdvancedFilters();
function managerCloneFilter(f){return JSON.parse(JSON.stringify(f||managerNewFilter()))}
function managerHasAdvancedFilter(){return !!(taskManagerAdvancedFilter&&taskManagerAdvancedFilter.groups&&taskManagerAdvancedFilter.groups.some(g=>g.conditions&&g.conditions.length))}
function managerTaskAgeDays(ts){if(!ts)return 99999;return Math.max(0,Math.floor((Date.now()-Number(ts))/86400000))}
function managerTaskHasMemo(t){const ex=t&&t.extras||{};return !!String(ex.memo||t.memo||t.note||t.description||'').trim()}
function managerTaskMatchesCondition(t,c){
  let result=true,v=c.value,day=appDayStr();
  if(c.field==='status'){
    if(v==='today')result=isTaskToday(t);else if(v==='active')result=t.state!=='done'&&!isTaskOnHold(t)&&!isTaskToday(t);else if(v==='hold')result=t.state!=='done'&&isTaskOnHold(t)&&!isTaskSkima(t);else if(v==='skima')result=t.state!=='done'&&isTaskSkima(t);else if(v==='done')result=t.state==='done';else if(v==='breakdown')result=t.state!=='done'&&managerNeedsBreakdown(t);else if(v==='overdue')result=managerIsOverdue(t);else result=true;
  }else if(c.field==='tag'){result=(t.tags||[]).includes(v)}
  else if(c.field==='important'){result=isTaskImportant(t)===(v==='yes')}
  else if(c.field==='due'){if(v==='yes')result=!!t.dueDate;else if(v==='no')result=!t.dueDate;else if(v==='overdue')result=managerIsOverdue(t);else if(v==='future')result=!!t.dueDate&&t.dueDate>day}
  else if(c.field==='breakdown'){result=managerNeedsBreakdown(t)===(v==='yes')}
  else if(c.field==='memo'){result=managerTaskHasMemo(t)===(v==='yes')}
  else if(c.field==='text'){const hay=taskManagerSearchText(t),q=normalizeManagerSearchText(v).trim();result=!q||hay.includes(q)}
  else if(c.field==='createdAge'){const n=Math.max(0,Number(v)||0),a=managerTaskAgeDays(t.createdAt);result=c.op==='lte'?a<=n:a>=n}
  else if(c.field==='updatedAge'){const n=Math.max(0,Number(v)||0),a=managerTaskAgeDays(t.updatedAt||t.createdAt);result=c.op==='lte'?a<=n:a>=n}
  return c.negate?!result:result;
}
function applyTaskManagerAdvancedFilter(list){if(!managerHasAdvancedFilter())return list;return list.filter(t=>{const groups=taskManagerAdvancedFilter.groups||[];let acc=true;groups.forEach((g,i)=>{const cs=g.conditions||[];let hit=!cs.length?true:(g.join==='or'?cs.some(c=>managerTaskMatchesCondition(t,c)):cs.every(c=>managerTaskMatchesCondition(t,c)));if(g.negate)hit=!hit;if(i===0)acc=hit;else acc=(g.link==='or')?(acc||hit):(acc&&hit)});return acc})}
function openTaskManagerFilterMenu(){taskManagerFilterDraft=managerCloneFilter(taskManagerAdvancedFilter||managerNewFilter());const o=document.getElementById('taskManagerFilterOverlay');if(!o)return;o.classList.add('open');o.setAttribute('aria-hidden','false');renderTaskManagerFilterMenu()}
function closeTaskManagerFilterMenu(){const o=document.getElementById('taskManagerFilterOverlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true')}}
function managerFilterBackdrop(e){if(e&&e.target&&e.target.id==='taskManagerFilterOverlay')closeTaskManagerFilterMenu()}
function managerFilterAddGroup(){taskManagerFilterDraft.groups.push({join:'and',link:'and',negate:false,conditions:[managerNewCondition()]});renderTaskManagerFilterMenu()}
function managerFilterAddCondition(gi){taskManagerFilterDraft.groups[gi].conditions.push(managerNewCondition());renderTaskManagerFilterMenu()}
function managerFilterRemoveCondition(gi,ci){const g=taskManagerFilterDraft.groups[gi];g.conditions.splice(ci,1);if(!g.conditions.length&&taskManagerFilterDraft.groups.length>1)taskManagerFilterDraft.groups.splice(gi,1);renderTaskManagerFilterMenu()}
function managerFilterSetGroupJoin(gi,v){taskManagerFilterDraft.groups[gi].join=v;renderTaskManagerFilterMenu()}
function managerFilterSetGroupLink(gi,v){taskManagerFilterDraft.groups[gi].link=v;renderTaskManagerFilterMenu()}
function managerFilterToggleGroupNot(gi){const g=taskManagerFilterDraft.groups[gi];g.negate=!g.negate;renderTaskManagerFilterMenu()}
function managerFilterUpdate(gi,ci,k,v){const c=taskManagerFilterDraft.groups[gi].conditions[ci];c[k]=v;if(k==='field'){c.op='is';c.value=managerFilterDefaultValue(v)}renderTaskManagerFilterMenu()}
function managerFilterDefaultValue(f){return f==='status'?'active':f==='tag'?((state.tags&&state.tags[0]&&state.tags[0].id)||''):['important','breakdown','memo'].includes(f)?'yes':f==='due'?'yes':f==='text'?'':'14'}
function managerFilterResetDraft(){taskManagerFilterDraft=managerNewFilter();renderTaskManagerFilterMenu()}
function managerFilterFieldLabel(f){return({status:'状態',tag:'タグ',important:'重要',due:'期限',breakdown:'要分解',memo:'メモ',text:'文字',createdAge:'作成から',updatedAge:'更新から'})[f]||f}
function managerFilterValueLabel(c){
  if(c.field==='tag'){const tg=tagById(c.value);return tg?tg.name:'未選択'}
  const map={active:'未保留',today:'今日',hold:'保留',skima:'スキマ',done:'完了',breakdown:'要分解',overdue:'期限切れ',yes:'あり',no:'なし',future:'未来',gte:'以上',lte:'以内'};
  if(c.field==='text')return '「'+(c.value||'')+'」を含む';if(['createdAge','updatedAge'].includes(c.field))return (c.value||0)+'日'+(c.op==='lte'?'以内':'以上');return map[c.value]||c.value;
}
function managerFilterExpressionText(f){if(!f||!f.groups||!f.groups.length)return'条件なし';return f.groups.map((g,i)=>{const body='('+g.conditions.map(c=>(c.negate?'NOT ':'')+managerFilterFieldLabel(c.field)+':'+managerFilterValueLabel(c)).join(g.join==='or'?' OR ':' AND ')+')';return(i?((g.link==='or'?' OR ':' AND ')):'')+(g.negate?'NOT ':'')+body}).join('')}
function managerFilterValueControl(c,gi,ci){
  let h='';
  const select=(opts)=>'<select onchange="managerFilterUpdate('+gi+','+ci+',\'value\',this.value)">'+opts.map(([v,l])=>'<option value="'+escapeHtml(v)+'"'+(String(c.value)===String(v)?' selected':'')+'>'+escapeHtml(l)+'</option>').join('')+'</select>';
  if(c.field==='status')h=select([['active','未保留'],['today','今日'],['hold','保留'],['skima','スキマ'],['done','完了'],['breakdown','要分解'],['overdue','期限切れ']]);
  else if(c.field==='tag')h=select((state.tags||[]).map(t=>[t.id,t.name]).concat((state.tags||[]).length?[]:[['','タグなし']]));
  else if(['important','breakdown','memo'].includes(c.field))h=select([['yes','あり'],['no','なし']]);
  else if(c.field==='due')h=select([['yes','期限あり'],['no','期限なし'],['overdue','期限切れ'],['future','未来の期限']]);
  else if(c.field==='text')h='<input class="wide" value="'+escapeHtml(c.value||'')+'" placeholder="タイトル・メモに含む文字" oninput="managerFilterUpdateSilent('+gi+','+ci+',\'value\',this.value)">';
  else h='<select onchange="managerFilterUpdateSilent('+gi+','+ci+',\'op\',this.value)"><option value="gte"'+(c.op!=='lte'?' selected':'')+'>以上</option><option value="lte"'+(c.op==='lte'?' selected':'')+'>以内</option></select><input type="number" min="0" value="'+escapeHtml(c.value||'14')+'" onchange="managerFilterUpdateSilent('+gi+','+ci+',\'value\',this.value)">';
  return h;
}
function managerFilterUpdateSilent(gi,ci,k,v){taskManagerFilterDraft.groups[gi].conditions[ci][k]=v;const e=document.getElementById('managerFilterExpression');if(e)e.textContent=managerFilterExpressionText(taskManagerFilterDraft)}
function renderTaskManagerFilterMenu(){
  const root=document.getElementById('managerFilterGroups'),expr=document.getElementById('managerFilterExpression'),saved=document.getElementById('managerFilterSavedList');if(!root)return;if(!taskManagerFilterDraft)taskManagerFilterDraft=managerNewFilter();root.innerHTML='';
  taskManagerFilterDraft.groups.forEach((g,gi)=>{
    if(!g.join)g.join='and';if(!g.link)g.link='and';if(typeof g.negate!=='boolean')g.negate=false;
    if(gi){const connector=document.createElement('div');connector.className='manager-filter-connector';connector.innerHTML='<span>前のグループと</span><div><button type="button" class="'+(g.link!=='or'?'on':'')+'" onclick="managerFilterSetGroupLink('+gi+',\'and\')">AND</button><button type="button" class="'+(g.link==='or'?'on':'')+'" onclick="managerFilterSetGroupLink('+gi+',\'or\')">OR</button></div>';root.appendChild(connector)}
    const box=document.createElement('section');box.className='manager-filter-group'+(g.negate?' group-not':'');
    box.innerHTML='<div class="manager-filter-group-head"><span class="manager-filter-group-title">グループ '+(gi+1)+'</span><button type="button" class="manager-filter-group-not'+(g.negate?' on':'')+'" onclick="managerFilterToggleGroupNot('+gi+')">'+(g.negate?'グループ除外中 NOT':'グループを除外 NOT')+'</button></div><div class="manager-filter-logic"><span>この中の条件を</span><button type="button" class="'+(g.join!=='or'?'on':'')+'" onclick="managerFilterSetGroupJoin('+gi+',\'and\')">すべて満たす AND</button><button type="button" class="'+(g.join==='or'?'on':'')+'" onclick="managerFilterSetGroupJoin('+gi+',\'or\')">どれか満たす OR</button></div>';
    g.conditions.forEach((c,ci)=>{const row=document.createElement('div');row.className='manager-filter-condition';row.innerHTML='<button type="button" class="negate'+(c.negate?' on':'')+'" onclick="managerFilterUpdate('+gi+','+ci+',\'negate\','+(!c.negate)+')">'+(c.negate?'この条件を除外中':'この条件を除外')+'<small>NOT</small></button><div class="manager-filter-fields"><select onchange="managerFilterUpdate('+gi+','+ci+',\'field\',this.value)">'+[['status','状態'],['tag','タグ'],['important','重要'],['due','期限'],['breakdown','要分解'],['memo','メモ'],['text','文字を含む'],['createdAge','作成から日数'],['updatedAge','更新から日数']].map(([v,l])=>'<option value="'+v+'"'+(c.field===v?' selected':'')+'>'+l+'</option>').join('')+'</select>'+managerFilterValueControl(c,gi,ci)+'<button type="button" class="manager-filter-remove" onclick="managerFilterRemoveCondition('+gi+','+ci+')">この条件を削除</button></div>';box.appendChild(row)});
    const add=document.createElement('button');add.type='button';add.className='manager-filter-add';add.textContent='＋ このグループに条件を追加';add.onclick=()=>managerFilterAddCondition(gi);box.appendChild(add);root.appendChild(box)});
  if(expr)expr.textContent=managerFilterExpressionText(taskManagerFilterDraft);
  if(saved){saved.innerHTML='';const list=taskManagerSavedFilters.slice().sort((a,b)=>(b.favorite?1:0)-(a.favorite?1:0)||(b.updatedAt||0)-(a.updatedAt||0));if(!list.length)saved.innerHTML='<div style="font-size:10px;color:rgba(170,185,210,.36);padding:4px">保存ビューはまだありません</div>';list.forEach(v=>{const r=document.createElement('div');r.className='manager-filter-saved-row';r.innerHTML='<button class="name" onclick="managerApplySavedView(\''+v.id+'\')">'+escapeHtml(v.name)+'</button><button class="fav'+(v.favorite?' on':'')+'" onclick="managerToggleSavedFavorite(\''+v.id+'\')">★</button><button onclick="managerRenameSavedView(\''+v.id+'\')">名前</button><button class="del" onclick="managerDeleteSavedView(\''+v.id+'\')">削除</button>';saved.appendChild(r)})}
}
function managerFilterApply(){taskManagerAdvancedFilter=managerCloneFilter(taskManagerFilterDraft);taskManagerActiveSavedViewId='';saveTaskManagerAdvancedFilters();closeTaskManagerFilterMenu();exitTaskManagerSelection(false);renderTaskManager()}
function managerFilterClearApplied(){taskManagerAdvancedFilter=null;taskManagerActiveSavedViewId='';saveTaskManagerAdvancedFilters();exitTaskManagerSelection(false);renderTaskManager()}
function managerFilterSaveView(){const name=prompt('保存ビューの名前','新しいビュー');if(!name||!name.trim())return;const v={id:newId(),name:name.trim().slice(0,24),favorite:false,filter:managerCloneFilter(taskManagerFilterDraft),updatedAt:Date.now()};taskManagerSavedFilters.push(v);saveTaskManagerAdvancedFilters();renderTaskManagerFilterMenu();renderTaskManagerSavedViews()}
function managerApplySavedView(id){const v=taskManagerSavedFilters.find(x=>x.id===id);if(!v)return;taskManagerAdvancedFilter=managerCloneFilter(v.filter);taskManagerFilterDraft=managerCloneFilter(v.filter);taskManagerActiveSavedViewId=id;saveTaskManagerAdvancedFilters();closeTaskManagerFilterMenu();exitTaskManagerSelection(false);renderTaskManager()}
function managerToggleSavedFavorite(id){const v=taskManagerSavedFilters.find(x=>x.id===id);if(!v)return;v.favorite=!v.favorite;v.updatedAt=Date.now();saveTaskManagerAdvancedFilters();renderTaskManagerFilterMenu();renderTaskManagerSavedViews()}
function managerRenameSavedView(id){const v=taskManagerSavedFilters.find(x=>x.id===id);if(!v)return;const n=prompt('ビュー名を変更',v.name);if(!n||!n.trim())return;v.name=n.trim().slice(0,24);v.updatedAt=Date.now();saveTaskManagerAdvancedFilters();renderTaskManagerFilterMenu();renderTaskManagerSavedViews()}
function managerDeleteSavedView(id){const v=taskManagerSavedFilters.find(x=>x.id===id);if(!v)return;if(!confirm('「'+v.name+'」を削除しますか？'))return;taskManagerSavedFilters=taskManagerSavedFilters.filter(x=>x.id!==id);if(taskManagerActiveSavedViewId===id)taskManagerActiveSavedViewId='';saveTaskManagerAdvancedFilters();renderTaskManagerFilterMenu();renderTaskManagerSavedViews()}
function renderTaskManagerSavedViews(){const box=document.getElementById('taskManagerSavedViews');if(!box)return;box.innerHTML='';const list=taskManagerSavedFilters.slice().sort((a,b)=>(b.favorite?1:0)-(a.favorite?1:0)||(b.updatedAt||0)-(a.updatedAt||0));box.style.display=list.length?'flex':'none';list.forEach(v=>{const b=document.createElement('button');b.type='button';b.className='manager-saved-view'+(v.favorite?' favorite':'')+(taskManagerActiveSavedViewId===v.id?' on':'');b.textContent=v.name;b.onclick=()=>managerApplySavedView(v.id);box.appendChild(b)})}

function normalizeManagerSearchText(v){return String(v==null?'':v).normalize('NFKC').toLocaleLowerCase('ja')}
function taskManagerSearchText(t){
  const ex=t&&t.extras&&typeof t.extras==='object'?t.extras:{};
  const memo=[ex.memo,t&&t.memo,t&&t.note,t&&t.description].filter(Boolean).join(' ');
  return normalizeManagerSearchText((t&&t.name||'')+' '+memo);
}
function applyTaskManagerSearch(list){
  const q=normalizeManagerSearchText(taskManagerSearchQuery).trim();
  if(!q)return list;
  const words=q.split(/\s+/).filter(Boolean);
  return list.filter(t=>{const hay=taskManagerSearchText(t);return words.every(w=>hay.includes(w))});
}
function syncTaskManagerSearchUI(){
  const box=document.getElementById('taskManagerSearchBox'),input=document.getElementById('taskManagerSearchInput');
  if(input&&input.value!==taskManagerSearchQuery)input.value=taskManagerSearchQuery;
  if(box)box.classList.toggle('has-query',!!taskManagerSearchQuery.trim());
}
function onTaskManagerSearch(e){taskManagerSearchQuery=e&&e.target?e.target.value:'';exitTaskManagerSelection(false);syncTaskManagerSearchUI();renderTaskManager()}
function clearTaskManagerSearch(){taskManagerSearchQuery='';exitTaskManagerSelection(false);syncTaskManagerSearchUI();renderTaskManager();setTimeout(()=>document.getElementById('taskManagerSearchInput')?.focus(),0)}
const TASK_MANAGER_FILTERS=[
  ['attention','対応'],['today','今日'],['active','未保留'],['hold','保留'],['skima','スキマ'],['breakdown','要分解'],['done','完了'],['trash','ゴミ箱'],['all','すべて']
];
function managerIsOverdue(t){return !!(t&&t.state!=='done'&&t.dueDate&&t.dueDate<appDayStr()&&!isTaskOnHold(t))}
function managerNeedsBreakdown(t){return !!(t&&(t.needsBreakdown===true||t.organizeState==='breakdown'||t.organizeHoldKind==='breakdown'))}
function managerFilterTasks(key){
  normalizeTaskCollection();
  const day=appDayStr(),all=(state.tasks||[]).slice();
  if(key==='attention')return all.filter(t=>managerIsOverdue(t)||managerNeedsBreakdown(t));
  if(key==='today')return all.filter(t=>isTaskToday(t));
  if(key==='active')return all.filter(t=>t.state!=='done'&&!isTaskOnHold(t)&&!isTaskToday(t));
  if(key==='hold')return all.filter(t=>t.state!=='done'&&!isTaskSkima(t)&&!!t.organizeHoldUntil&&day<t.organizeHoldUntil);
  if(key==='skima')return all.filter(t=>t.state!=='done'&&isTaskSkima(t));
  if(key==='breakdown')return all.filter(t=>t.state!=='done'&&managerNeedsBreakdown(t));
  if(key==='done')return all.filter(t=>t.state==='done');
  return all.filter(t=>{
    if(t.state==='done')return taskManagerView.show.done!==false;
    if(isTaskSkima(t))return taskManagerView.show.skima!==false;
    if(managerNeedsBreakdown(t)&&taskManagerView.show.breakdown===false)return false;
    if(isTaskOnHold(t))return taskManagerView.show.hold!==false;
    return taskManagerView.show.active!==false;
  });
}
function managerSortTasks(list,key){
  const mode=taskManagerView.sort||'auto';
  return list.slice().sort((a,b)=>{
    if(mode==='name')return String(a.name||'').localeCompare(String(b.name||''),'ja');
    if(mode==='newest')return (b.createdAt||0)-(a.createdAt||0);
    if(mode==='oldest')return (a.createdAt||0)-(b.createdAt||0);
    if(mode==='updated')return (b.updatedAt||b.createdAt||0)-(a.updatedAt||a.createdAt||0);
    if(mode==='due'){
      const ad=a.organizeHoldUntil||a.dueDate||'9999-12-31',bd=b.organizeHoldUntil||b.dueDate||'9999-12-31';
      if(ad!==bd)return String(ad).localeCompare(String(bd));
    }
    if(key==='done')return (b.doneAt||0)-(a.doneAt||0);
    if(key==='hold')return String(a.organizeHoldUntil||'9999').localeCompare(String(b.organizeHoldUntil||'9999'));
    if(managerIsOverdue(a)!==managerIsOverdue(b))return managerIsOverdue(a)?-1:1;
    if(isTaskImportant(a)!==isTaskImportant(b))return isTaskImportant(a)?-1:1;
    if((a.dueDate||'')!==(b.dueDate||''))return String(a.dueDate||'9999').localeCompare(String(b.dueDate||'9999'));
    return (b.createdAt||0)-(a.createdAt||0);
  });
}
function taskManagerCounts(){
  const keys=['attention','today','active','hold','skima','breakdown','done','all'],out={};
  keys.forEach(k=>out[k]=managerFilterTasks(k).length);out.trash=ensureAiOrganizerState().trash.length;return out;
}
function applyTaskManagerDensity(){
  const sc=document.getElementById('taskManagerScreen');if(!sc)return;
  sc.classList.remove('view-compact','view-simple');
  if(taskManagerView.density==='compact')sc.classList.add('view-compact');
  if(taskManagerView.density==='simple')sc.classList.add('view-simple');
  const btn=document.getElementById('taskManagerViewBtn');if(btn)btn.classList.toggle('on',taskManagerView.density!=='standard'||taskManagerView.sort!=='auto');
}
function openTaskManagerViewMenu(){const o=document.getElementById('taskManagerViewOverlay');if(!o)return;o.classList.add('open');o.setAttribute('aria-hidden','false');renderTaskManagerViewMenu()}
function closeTaskManagerViewMenu(){const o=document.getElementById('taskManagerViewOverlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true')}}
function managerViewBackdrop(e){if(e&&e.target&&e.target.id==='taskManagerViewOverlay')closeTaskManagerViewMenu()}
function setTaskManagerDensity(v){taskManagerView.density=v;saveTaskManagerView();applyTaskManagerDensity();renderTaskManagerViewMenu();renderTaskManager()}
function setTaskManagerSort(v){taskManagerView.sort=v;saveTaskManagerView();renderTaskManagerViewMenu();renderTaskManager()}
function toggleTaskManagerVisibility(k){taskManagerView.show[k]=taskManagerView.show[k]===false;saveTaskManagerView();renderTaskManagerViewMenu();if(taskManagerFilter==='all')renderTaskManager()}
function renderTaskManagerViewMenu(){
  const d=document.getElementById('managerDensityOptions'),so=document.getElementById('managerSortOptions'),vi=document.getElementById('managerVisibilityOptions');if(!d||!so||!vi)return;
  d.innerHTML='';[['standard','標準'],['compact','コンパクト'],['simple','超シンプル']].forEach(([v,l])=>{const b=document.createElement('button');b.type='button';b.className='manager-view-option'+(taskManagerView.density===v?' on':'');b.textContent=l;b.onclick=()=>setTaskManagerDensity(v);d.appendChild(b)});
  so.innerHTML='';[['auto','おすすめ'],['due','期日・復帰日'],['newest','新しい順'],['oldest','古い順'],['updated','更新順'],['name','名前順']].forEach(([v,l])=>{const b=document.createElement('button');b.type='button';b.className='manager-view-option'+(taskManagerView.sort===v?' on':'');b.textContent=l;b.onclick=()=>setTaskManagerSort(v);so.appendChild(b)});
  vi.innerHTML='';[['active','未保留'],['hold','保留'],['skima','スキマ'],['breakdown','要分解'],['done','完了']].forEach(([v,l])=>{const b=document.createElement('button');b.type='button';const on=taskManagerView.show[v]!==false;b.className='manager-view-check'+(on?' on':'');b.innerHTML='<span>'+l+'</span><i>✓</i>';b.onclick=()=>toggleTaskManagerVisibility(v);vi.appendChild(b)});
}
function openTaskManager(filter){
  if(filter)taskManagerFilter=filter;
  closeTopMenu();
  const sc=document.getElementById('taskManagerScreen');if(!sc)return;
  sc.classList.add('open');sc.setAttribute('aria-hidden','false');
  syncTaskManagerSearchUI();
  applyTaskManagerDensity();
  renderTaskManagerSavedViews();
  renderTaskManager();
}
function closeTaskManager(){
  exitTaskManagerSelection(false);
  closeTaskManagerViewMenu();
  closeTaskManagerFilterMenu();
  const sc=document.getElementById('taskManagerScreen');if(sc){sc.classList.remove('open');sc.setAttribute('aria-hidden','true')}
  render();
}
function setTaskManagerFilter(key){exitTaskManagerSelection(false);taskManagerFilter=key;renderTaskManager()}
function managerCurrentVisibleTasks(){return managerSortTasks(applyTaskManagerSearch(applyTaskManagerAdvancedFilter(managerFilterTasks(taskManagerFilter))),taskManagerFilter)}
function enterTaskManagerSelection(id){
  taskManagerSelectionMode=true;
  if(id)taskManagerSelectedIds.add(id);
  renderTaskManager();
}
function exitTaskManagerSelection(shouldRender=true){
  taskManagerSelectionMode=false;taskManagerSelectedIds.clear();taskManagerVisibleIds=[];
  syncTaskManagerSelectionUI();if(shouldRender&&document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager();
}
function managerToggleSelected(id){
  if(!taskManagerSelectionMode){enterTaskManagerSelection(id);return}
  if(taskManagerSelectedIds.has(id))taskManagerSelectedIds.delete(id);else taskManagerSelectedIds.add(id);
  if(!taskManagerSelectedIds.size){exitTaskManagerSelection();return}
  renderTaskManager();
}
function managerToggleSelectAll(){
  const ids=taskManagerVisibleIds.slice();const all=ids.length&&ids.every(id=>taskManagerSelectedIds.has(id));
  if(all)ids.forEach(id=>taskManagerSelectedIds.delete(id));else ids.forEach(id=>taskManagerSelectedIds.add(id));
  if(!taskManagerSelectedIds.size){exitTaskManagerSelection();return}renderTaskManager();
}
function syncTaskManagerSelectionUI(){
  const sc=document.getElementById('taskManagerScreen'),bar=document.getElementById('taskManagerBatchBar'),count=document.getElementById('taskManagerBatchCount'),allBtn=document.getElementById('taskManagerSelectAllBtn'),impBtn=document.getElementById('taskManagerBatchImportantBtn');
  if(sc)sc.classList.toggle('selection-mode',taskManagerSelectionMode);
  if(bar){bar.classList.toggle('open',taskManagerSelectionMode);bar.setAttribute('aria-hidden',taskManagerSelectionMode?'false':'true')}
  if(count)count.textContent=taskManagerSelectedIds.size+'件';
  const allVisible=taskManagerVisibleIds.length&&taskManagerVisibleIds.every(id=>taskManagerSelectedIds.has(id));if(allBtn)allBtn.textContent=allVisible?'全解除':'全選択';
  const selected=[...taskManagerSelectedIds].map(id=>state.tasks.find(t=>t.id===id)).filter(Boolean);const allImportant=selected.length&&selected.every(isTaskImportant);if(impBtn)impBtn.textContent=allImportant?'重要OFF':'重要ON';
}
function managerBindLongPress(card,id){
  let timer=null,sx=0,sy=0,moved=false;
  const cancel=()=>{if(timer){clearTimeout(timer);timer=null}};
  card.addEventListener('pointerdown',e=>{if(taskManagerSelectionMode||e.target.closest('button'))return;sx=e.clientX;sy=e.clientY;moved=false;timer=setTimeout(()=>{timer=null;if(!moved){try{navigator.vibrate&&navigator.vibrate(18)}catch(_e){}enterTaskManagerSelection(id)}},650)});
  card.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-sx)>10||Math.abs(e.clientY-sy)>10){moved=true;cancel()}});
  card.addEventListener('pointerup',cancel);card.addEventListener('pointercancel',cancel);card.addEventListener('pointerleave',cancel);
  card.addEventListener('contextmenu',e=>{e.preventDefault();if(!taskManagerSelectionMode)enterTaskManagerSelection(id)});
}
function managerSelectedTasks(){return [...taskManagerSelectedIds].map(id=>state.tasks.find(t=>t.id===id)).filter(Boolean)}
function managerAfterBatch(message){saveState();exitTaskManagerSelection(false);render();renderTaskManager();showToast(message)}
function managerBatchMoveToday(){const list=managerSelectedTasks();if(!list.length)return;const day=appDayStr();list.forEach(t=>{t.organizeHoldKind='';t.organizeHoldUntil='';const old=t.dueDate;t.dueDate=day;t.todayDate=day;t.importantDate='';syncTaskDateFlags(t);maybeAwardSchedulePoint(t,old,t.dueDate)});managerAfterBatch(list.length+'件を今日へ移動した')}
function managerBatchMoveTomorrow(){const list=managerSelectedTasks();if(!list.length)return;const tomorrow=addDaysStr(appDayStr(),1);list.forEach(t=>{t.organizeHoldKind='';t.organizeHoldUntil=tomorrow;t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false});managerAfterBatch(list.length+'件を明日まで保留した')}
function managerBatchMoveSkima(){const list=managerSelectedTasks();if(!list.length)return;list.forEach(t=>{t.organizeHoldUntil='';t.organizeHoldKind='skima';t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false});managerAfterBatch(list.length+'件をスキマへ移動した')}
function managerBatchToggleImportant(){const list=managerSelectedTasks().filter(t=>t.state!=='done');if(!list.length)return;const turnOn=!list.every(isTaskImportant);list.forEach(t=>{t.importantFlag=turnOn;t.importantDate=turnOn?appDayStr():''});managerAfterBatch(list.length+'件の重要を'+(turnOn?'ON':'OFF')+'にした')}
function managerBatchComplete(){
  const list=managerSelectedTasks().filter(t=>t.state!=='done');if(!list.length)return;
  let rewarded=0;list.forEach(t=>{t.state='done';t.doneAt=Date.now();const shouldReward=!t.rewardDone;t.rewardDone=true;if(shouldReward){rewarded++;addGameStamina(5,'TASK CLEAR');const forceBonus=isTaskBonusGuaranteed(t);issueChargeTicket(t,{force:forceBonus?'bonus':null,type:forceBonus?'important':'task'})}});
  saveState();exitTaskManagerSelection(false);render();renderTaskManager();showToast(list.length+'件を完了した');if(rewarded)setTimeout(()=>startNextChargeTicket(true),180);
}
function managerBatchDelete(){
  const list=managerSelectedTasks();if(!list.length)return;
  openAppConfirm({title:'タスクをまとめて削除',message:list.length+'件のタスクを削除しますか？',okText:'削除',danger:true,onOk:()=>{
    const entries=list.map(t=>moveTaskToTrash(t.id,'manual')).filter(Boolean);
    saveState();exitTaskManagerSelection(false);render();renderTaskManager();showUndo(entries.length+'件をゴミ箱へ移動した',()=>{entries.slice().reverse().forEach(x=>restoreTrashEntry(x.id));saveState();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager()});
  }});
}

function managerTaskLabel(t){
  if(t.state==='done')return '完了';
  if(isTaskSkima(t))return 'スキマ';
  if(t.organizeHoldUntil&&appDayStr()<t.organizeHoldUntil)return formatDateLabel(t.organizeHoldUntil)+'に復帰';
  if(managerIsOverdue(t))return formatDateLabel(t.dueDate)+' 期限超過';
  if(isTaskToday(t))return '今日';
  if(t.dueDate)return formatDateLabel(t.dueDate);
  return '未保留';
}
function managerChip(text,cls){const s=document.createElement('span');s.className='manager-chip'+(cls?' '+cls:'');s.textContent=text;return s}
function renderManagerCard(t){
  const card=document.createElement('article');card.className='manager-card'+(t.state==='done'?' is-done':'')+(taskManagerSelectedIds.has(t.id)?' selected':'');card.dataset.taskId=t.id;
  const selectBox=document.createElement('span');selectBox.className='manager-select-box';selectBox.textContent='✓';card.appendChild(selectBox);
  const main=document.createElement('div');main.className='manager-card-main';
  const left=document.createElement('div');
  const title=document.createElement('div');title.className='manager-card-title';title.textContent=t.name||'無題タスク';left.appendChild(title);
  const meta=document.createElement('div');meta.className='manager-card-meta';
  const label=managerTaskLabel(t);meta.appendChild(managerChip(label,isTaskSkima(t)?'skima':managerIsOverdue(t)?'overdue':isTaskToday(t)?'today':t.state==='done'?'done':''));
  if(isTaskImportant(t))meta.appendChild(managerChip('重要','important'));
  if(managerNeedsBreakdown(t))meta.appendChild(managerChip('要分解','overdue'));
  const ex=t.extras||{};if(ex.memo)meta.appendChild(managerChip('メモあり',''));
  left.appendChild(meta);main.appendChild(left);
  const open=document.createElement('button');open.type='button';open.className='manager-card-open';open.textContent='›';open.setAttribute('aria-label','設定を開く');open.onclick=e=>{e.stopPropagation();if(taskManagerSelectionMode)managerToggleSelected(t.id);else openTaskSettings(t.id)};main.appendChild(open);
  card.appendChild(main);card.onclick=e=>{if(e.target.closest('button'))return;if(taskManagerSelectionMode)managerToggleSelected(t.id);else openTaskSettings(t.id)};managerBindLongPress(card,t.id);
  const actions=document.createElement('div');actions.className='manager-card-actions';
  const addAction=(txt,cls,fn)=>{const b=document.createElement('button');b.type='button';b.className='manager-action'+(cls?' '+cls:'');b.textContent=txt;b.onclick=e=>{e.stopPropagation();fn()};actions.appendChild(b)};
  if(t.state==='done'){
    addAction('未完了へ','primary',()=>{undoTask(t.id);renderTaskManager()});
  }else{
    if(!isTaskToday(t))addAction('今日へ','primary',()=>managerMoveToday(t.id));
    addAction('明日','',()=>managerMoveTomorrow(t.id));
    if(!isTaskSkima(t))addAction('スキマ','skima',()=>managerMoveSkima(t.id));
    addAction('完了','',()=>managerComplete(t.id));
  }
  addAction('削除','danger',()=>managerDelete(t.id));
  card.appendChild(actions);return card;
}
function managerMoveToday(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;t.organizeHoldKind='';t.organizeHoldUntil='';const old=t.dueDate;t.dueDate=appDayStr();t.todayDate=appDayStr();t.importantDate='';syncTaskDateFlags(t);maybeAwardSchedulePoint(t,old,t.dueDate);saveState();render();renderTaskManager();showToast('今日へ移動した')}
function managerMoveTomorrow(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;t.organizeHoldKind='';t.organizeHoldUntil=addDaysStr(appDayStr(),1);t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false;saveState();render();renderTaskManager();showToast('明日まで保留した')}
function managerMoveSkima(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;t.organizeHoldUntil='';t.organizeHoldKind='skima';t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false;saveState();render();renderTaskManager();showToast('スキマへ移動した')}
function managerComplete(id){const t=state.tasks.find(x=>x.id===id);if(!t||t.state==='done')return;if(t.state==='idle')tap(id);const again=state.tasks.find(x=>x.id===id);if(again&&again.state==='charging')tap(id);renderTaskManager()}
function managerDelete(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;openAppConfirm({title:'タスクを削除',message:'「'+t.name+'」を削除しますか？',okText:'削除',danger:true,onOk:()=>{deleteTask(id);renderTaskManager()}})}
function managerEmptyCopy(key){
  if(key==='attention')return ['✓','対応が必要なタスクはありません','いま詰まっているものは見つかりません。'];
  if(key==='hold')return ['◷','保留中のタスクはありません','今は全部、見える場所にあります。'];
  if(key==='skima')return ['◇','スキマタスクはありません','急がないけど、いつかやりたいことを置けます。'];
  if(key==='breakdown')return ['↳','要分解タスクはありません','大きすぎて止まっているタスクはありません。'];
  if(key==='done')return ['✓','完了履歴はまだありません','終えたタスクがここに積み上がります。'];
  if(key==='trash')return ['⌫','ゴミ箱は空です','削除したタスクはここから復元できます。'];
  return ['·','このカテゴリにタスクはありません','別のカテゴリを確認してください。'];
}
function renderTaskManager(){
  const body=document.getElementById('taskManagerBody'),tabs=document.getElementById('taskManagerTabs');if(!body||!tabs)return;
  applyTaskManagerDensity();
  renderTaskManagerSavedViews();
  const filterBtn=document.getElementById('taskManagerFilterBtn');if(filterBtn)filterBtn.classList.toggle('on',managerHasAdvancedFilter());
  const counts=taskManagerCounts();tabs.innerHTML='';
  TASK_MANAGER_FILTERS.forEach(([key,label])=>{const b=document.createElement('button');b.type='button';b.className='task-manager-tab'+(taskManagerFilter===key?' on':'');b.textContent=label+' '+counts[key];b.onclick=()=>setTaskManagerFilter(key);tabs.appendChild(b)});
  body.innerHTML='';
  if(managerHasAdvancedFilter()){const fs=document.createElement('div');fs.className='manager-filter-summary';fs.innerHTML='<span>'+escapeHtml(managerFilterExpressionText(taskManagerAdvancedFilter))+'</span><button type="button" onclick="managerFilterClearApplied()">解除</button>';body.appendChild(fs)}
  const sum=document.createElement('div');sum.className='task-manager-summary';
  [['今日',counts.today],['保留',counts.hold+counts.skima],['完了',counts.done]].forEach(([label,n])=>{const box=document.createElement('div');box.className='task-manager-stat';box.innerHTML='<b>'+n+'</b><span>'+label+'</span>';sum.appendChild(box)});body.appendChild(sum);
  syncTaskManagerSearchUI();
  if(taskManagerFilter==='trash'){
    exitTaskManagerSelection(false);
    const trash=ensureAiOrganizerState().trash.slice();
    const q=normalizeManagerSearchText(taskManagerSearchQuery).trim();
    const list=q?trash.filter(x=>normalizeManagerSearchText((x.task&&x.task.name||'')+' '+(x.task&&x.task.extras&&x.task.extras.memo||'')).includes(q)):trash;
    taskManagerVisibleIds=[];syncTaskManagerSelectionUI();
    if(!list.length){const copy=q?['⌕','一致するタスクはありません','検索語を変えてください。']:managerEmptyCopy('trash');const e=document.createElement('div');e.className='manager-empty';e.innerHTML='<div class="manager-empty-icon">'+copy[0]+'</div><div class="manager-empty-title">'+copy[1]+'</div><div class="manager-empty-sub">'+copy[2]+'</div>';body.appendChild(e);return}
    const tb=document.createElement('div');tb.className='trash-toolbar';tb.innerHTML='<button type="button" onclick="confirmEmptyAiTrash()">ゴミ箱を空にする</button>';body.appendChild(tb);
    const lab=document.createElement('div');lab.className='task-manager-section-label';lab.textContent='ゴミ箱 '+list.length+'件'+(q?'（検索結果）':'');body.appendChild(lab);
    list.forEach(x=>body.appendChild(renderManagerTrashCard(x)));return;
  }
  const baseList=managerFilterTasks(taskManagerFilter);
  const list=managerSortTasks(applyTaskManagerSearch(applyTaskManagerAdvancedFilter(baseList)),taskManagerFilter);
  taskManagerVisibleIds=list.map(t=>t.id);
  if(taskManagerSelectionMode){const visibleSet=new Set(taskManagerVisibleIds);[...taskManagerSelectedIds].forEach(id=>{if(!visibleSet.has(id))taskManagerSelectedIds.delete(id)});if(!taskManagerSelectedIds.size)taskManagerSelectionMode=false}
  syncTaskManagerSelectionUI();
  if(!list.length){const searching=!!taskManagerSearchQuery.trim();const copy=searching?['⌕','一致するタスクはありません','検索語を変えるか、別のカテゴリを確認してください。']:managerEmptyCopy(taskManagerFilter);const [icon,title,sub]=copy;const e=document.createElement('div');e.className='manager-empty';e.innerHTML='<div class="manager-empty-icon">'+icon+'</div><div class="manager-empty-title">'+title+'</div><div class="manager-empty-sub">'+sub+'</div>';body.appendChild(e);return}
  if(taskManagerFilter==='hold'){
    if(taskManagerSearchQuery.trim()){const note=document.createElement('div');note.className='task-manager-search-result';note.textContent='保留 '+list.length+'件（検索結果）';body.appendChild(note)}
    const groups={};list.forEach(t=>{const k=t.organizeHoldUntil||'日時未設定';(groups[k]||(groups[k]=[])).push(t)});
    Object.keys(groups).sort().forEach(k=>{const g=document.createElement('section');g.className='task-manager-group';const h=document.createElement('div');h.className='task-manager-group-head';h.innerHTML='<span>'+escapeHtml(k==='日時未設定'?k:formatDateLabel(k))+'</span><b>'+groups[k].length+'</b>';g.appendChild(h);groups[k].forEach(t=>g.appendChild(renderManagerCard(t)));body.appendChild(g)});return;
  }
  const label=document.createElement('div');label.className='task-manager-section-label';label.textContent=(TASK_MANAGER_FILTERS.find(x=>x[0]===taskManagerFilter)||['','タスク'])[1]+' '+list.length+'件'+(taskManagerSearchQuery.trim()?'（検索結果）':'');body.appendChild(label);
  list.forEach(t=>body.appendChild(renderManagerCard(t)));
}



/* ===== v49.26 AI ORGANIZER ===== */
let aiOrganizerTab='export',aiPreviewOperations=[];
function ensureAiOrganizerState(){
  if(!state.aiOrganizer||typeof state.aiOrganizer!=='object')state.aiOrganizer={history:[],trash:[],lastExportIds:[]};
  if(!Array.isArray(state.aiOrganizer.history))state.aiOrganizer.history=[];
  if(!Array.isArray(state.aiOrganizer.trash))state.aiOrganizer.trash=[];
  if(!Array.isArray(state.aiOrganizer.lastExportIds))state.aiOrganizer.lastExportIds=[];
  return state.aiOrganizer;
}
function openAiOrganizer(tab='export'){ensureAiOrganizerState();const o=document.getElementById('aiOrganizerOverlay');if(!o)return;o.classList.add('open');o.setAttribute('aria-hidden','false');setAiOrganizerTab(tab)}
function closeAiOrganizer(){const o=document.getElementById('aiOrganizerOverlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true')}}
function aiOrganizerBackdrop(e){if(e&&e.target&&e.target.id==='aiOrganizerOverlay')closeAiOrganizer()}
function setAiOrganizerTab(tab){aiOrganizerTab=tab;document.querySelectorAll('[data-ai-tab]').forEach(x=>x.classList.toggle('on',x.dataset.aiTab===tab));document.querySelectorAll('[data-ai-panel]').forEach(x=>x.classList.toggle('on',x.dataset.aiPanel===tab));if(tab==='history')renderAiHistory()}
function aiTaskTagNames(t){return (t.tags||[]).map(id=>state.tags.find(x=>x.id===id)?.name||id)}
function aiTaskPayload(t){return{id:t.id,title:t.name,memo:(t.extras&&t.extras.memo)||'',status:t.state==='done'?'done':'unfinished',today:isTaskToday(t),important:isTaskImportant(t),dueDate:t.dueDate||null,dueTime:t.dueTime||null,hold:t.organizeHoldKind==='skima'?'skima':(t.organizeHoldUntil||null),needsBreakdown:managerNeedsBreakdown(t),tags:aiTaskTagNames(t),createdAt:t.createdAt||null,doneAt:t.doneAt||null}}
function aiExportTasks(scope){
  if(scope==='selected')return managerSelectedTasks();
  if(scope==='unfinished')return state.tasks.filter(t=>t.state!=='done');
  if(scope==='all')return state.tasks.slice();
  return managerCurrentVisibleTasks();
}
function aiOrganizerPrompt(tasks){
  const payload=tasks.map(aiTaskPayload);
  return `あなたはDOPADOのタスク整理アシスタントです。以下のタスクを分析し、必要な変更だけをJSONの差分命令として返してください。\n\n【絶対ルール】\n- 元の全タスク一覧を書き直さない。operationsだけ返す。\n- JSON以外の文章やMarkdownコードフェンスは付けない。\n- 変更不要なタスクは省略する。\n- 既存タスクの変更には必ず下記のtaskIdを使う。\n- 削除は可能だが、DOPADO側では復元可能なゴミ箱へ移動する。\n- 完全削除はできない。\n- 不確かな変更は無理に行わない。\n- 同じtaskIdに矛盾する命令を出さない。\n\n【返却形式】\n{"operations":[\n {"taskId":"既存ID","action":"set_today","reason":"理由"},\n {"taskId":"既存ID","action":"hold_tomorrow","reason":"理由"},\n {"taskId":"既存ID","action":"hold_until","value":"YYYY-MM-DD","reason":"理由"},\n {"taskId":"既存ID","action":"set_skima","reason":"理由"},\n {"taskId":"既存ID","action":"set_important","value":true,"reason":"理由"},\n {"taskId":"既存ID","action":"rename","value":"新タイトル","reason":"理由"},\n {"taskId":"既存ID","action":"set_memo","value":"メモ","reason":"理由"},\n {"taskId":"既存ID","action":"set_breakdown","value":true,"reason":"理由"},\n {"taskId":"既存ID","action":"complete","reason":"理由"},\n {"taskId":"既存ID","action":"reopen","reason":"理由"},\n {"taskId":"既存ID","action":"delete","reason":"理由"},\n {"action":"create","title":"新規タスク","memo":"任意","destination":"today|inbox|skima","reason":"理由"}\n]}\n\n【タスクデータ】\n${JSON.stringify(payload,null,2)}`;
}
let aiLastExportPrompt='';
async function copyTextSafe(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return true}}catch(e){}const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.left='-9999px';ta.style.top='0';document.body.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,ta.value.length);let ok=false;try{ok=document.execCommand('copy')}catch(_e){}ta.remove();return ok}
function prepareAiExportPrompt(){const tasks=aiExportTasks();if(!tasks.length)return{tasks:[],prompt:''};const prompt=aiOrganizerPrompt(tasks);aiLastExportPrompt=prompt;const tx=document.getElementById('aiExportText');if(tx)tx.value=prompt;return{tasks,prompt}}
async function copyAiOrganizerPrompt(){const st=document.getElementById('aiExportStatus'),p=prepareAiExportPrompt();if(!p.tasks.length){st.className='ai-org-status error';st.textContent='出力対象のタスクがありません。';return}const a=ensureAiOrganizerState();a.lastExportIds=p.tasks.map(t=>t.id);saveNow();const ok=await copyTextSafe(p.prompt);st.className='ai-org-status '+(ok?'ok':'error');st.textContent=ok?p.tasks.length+'件のAI用プロンプトをコピーしました。':'自動コピーできませんでした。下の「全文を表示」から選択してコピーできます。';if(!ok){document.getElementById('aiExportPreview')?.classList.add('open')}}
function toggleAiExportPreview(){const p=prepareAiExportPrompt(),box=document.getElementById('aiExportPreview'),st=document.getElementById('aiExportStatus');if(!p.tasks.length){st.className='ai-org-status error';st.textContent='出力対象のタスクがありません。';return}box.classList.toggle('open')}
function selectAiExportText(){const tx=document.getElementById('aiExportText');if(!tx)return;tx.focus();tx.select();tx.setSelectionRange(0,tx.value.length);const st=document.getElementById('aiExportStatus');st.className='ai-org-status ok';st.textContent='全文を選択しました。iPhoneのコピー操作を使えます。'}
async function copyAiExportTextFromPreview(){const tx=document.getElementById('aiExportText'),st=document.getElementById('aiExportStatus');if(!tx||!tx.value){const p=prepareAiExportPrompt();if(!p.tasks.length){st.className='ai-org-status error';st.textContent='出力対象のタスクがありません。';return}}tx.focus();tx.select();tx.setSelectionRange(0,tx.value.length);let ok=false;try{ok=document.execCommand('copy')}catch(e){}if(!ok){ok=await copyTextSafe(tx.value)}st.className='ai-org-status '+(ok?'ok':'error');st.textContent=ok?'プロンプトをコピーしました。':'自動コピーできません。全文選択後、iPhoneの「コピー」を押してください。';document.getElementById('aiExportPreview')?.classList.add('open')}
async function shareAiOrganizerPrompt(){const p=prepareAiExportPrompt(),st=document.getElementById('aiExportStatus');if(!p.tasks.length)return;if(navigator.share){try{await navigator.share({title:'DOPADO AI整理',text:p.prompt});st.className='ai-org-status ok';st.textContent='共有シートを開きました。';return}catch(e){if(e&&e.name==='AbortError')return}}const ok=await copyTextSafe(p.prompt);st.className='ai-org-status '+(ok?'ok':'error');st.textContent=ok?'共有非対応のためコピーしました。':'共有できませんでした。全文表示から手動でコピーしてください。'}
function clearAiImport(){document.getElementById('aiImportText').value='';document.getElementById('aiImportStatus').textContent='';document.getElementById('aiPreviewArea').innerHTML='';aiPreviewOperations=[]}
function aiParseJson(raw){let text=String(raw||'').trim();text=text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');return JSON.parse(text)}
const AI_ACTION_LABELS={set_today:'今日へ',hold_tomorrow:'明日まで保留',hold_until:'日時保留',set_skima:'スキマへ',set_important:'重要変更',rename:'タイトル変更',set_memo:'メモ変更',set_breakdown:'要分解変更',complete:'完了',reopen:'未完了へ',delete:'削除',create:'新規追加'};
function validateAiOperation(op,index){
  const out={raw:op,index,valid:true,error:'',selected:true,action:op&&op.action,taskId:op&&op.taskId};
  if(!op||typeof op!=='object'){out.valid=false;out.error='命令形式が不正';return out}
  const allowed=Object.keys(AI_ACTION_LABELS);if(!allowed.includes(op.action)){out.valid=false;out.error='未対応のaction';return out}
  if(op.action==='create'){if(!String(op.title||'').trim()){out.valid=false;out.error='新規タスク名が空'}return out}
  const t=state.tasks.find(x=>x.id===op.taskId);if(!t){out.valid=false;out.error='存在しないtaskId';return out}out.task=t;
  const exported=ensureAiOrganizerState().lastExportIds;if(exported.length&&!exported.includes(op.taskId)){out.valid=false;out.error='直近のAI出力対象外';return out}
  if(op.action==='hold_until'&&!/^\d{4}-\d{2}-\d{2}$/.test(String(op.value||''))){out.valid=false;out.error='日付形式が不正'}
  if(['rename','set_memo'].includes(op.action)&&typeof op.value!=='string'){out.valid=false;out.error='valueが文字列ではない'}
  return out;
}
function aiOperationDiff(v){const op=v.raw,t=v.task;if(!v.valid)return v.error;if(op.action==='create')return '新規: '+String(op.title||'');if(op.action==='set_today')return aiTaskStatusLabel(t)+' → 今日';if(op.action==='hold_tomorrow')return aiTaskStatusLabel(t)+' → 明日まで保留';if(op.action==='hold_until')return aiTaskStatusLabel(t)+' → '+op.value+'まで保留';if(op.action==='set_skima')return aiTaskStatusLabel(t)+' → スキマ';if(op.action==='set_important')return '重要 '+(isTaskImportant(t)?'ON':'OFF')+' → '+(op.value?'ON':'OFF');if(op.action==='rename')return '「'+t.name+'」→「'+op.value+'」';if(op.action==='set_memo')return 'メモを更新';if(op.action==='set_breakdown')return '要分解 '+(managerNeedsBreakdown(t)?'ON':'OFF')+' → '+(op.value?'ON':'OFF');if(op.action==='complete')return '未完了 → 完了';if(op.action==='reopen')return '完了 → 未完了';if(op.action==='delete')return '通常一覧 → ゴミ箱';return AI_ACTION_LABELS[op.action]||op.action}
function aiTaskStatusLabel(t){if(t.state==='done')return '完了';if(isTaskSkima(t))return 'スキマ';if(t.organizeHoldUntil)return '保留';if(isTaskToday(t))return '今日';return '未保留'}
function loadAiImportPreview(){
  const st=document.getElementById('aiImportStatus'),area=document.getElementById('aiPreviewArea');try{const parsed=aiParseJson(document.getElementById('aiImportText').value);if(!parsed||!Array.isArray(parsed.operations))throw new Error('operations配列がありません');const seen=new Map();aiPreviewOperations=parsed.operations.map(validateAiOperation);aiPreviewOperations.forEach(v=>{if(v.taskId){const k=v.taskId+':'+v.action;if(seen.has(k)){v.valid=false;v.error='同じ命令が重複'}seen.set(k,true)}});st.className='ai-org-status ok';st.textContent=aiPreviewOperations.length+'件を読み込みました。まだ変更は適用されていません。';renderAiPreview()}catch(e){aiPreviewOperations=[];area.innerHTML='';st.className='ai-org-status error';st.textContent='JSONを読み込めません: '+e.message}}
function renderAiPreview(){
  const area=document.getElementById('aiPreviewArea');if(!area)return;const valid=aiPreviewOperations.filter(x=>x.valid),deletes=valid.filter(x=>x.action==='delete').length,creates=valid.filter(x=>x.action==='create').length,invalid=aiPreviewOperations.length-valid.length;
  area.innerHTML='<div class="ai-preview-summary"><div class="ai-preview-stat"><b>'+valid.length+'</b><span>適用可能</span></div><div class="ai-preview-stat"><b>'+deletes+'</b><span>削除</span></div><div class="ai-preview-stat"><b>'+invalid+'</b><span>除外</span></div></div>';
  const list=document.createElement('div');list.className='ai-preview-list';aiPreviewOperations.forEach((v,i)=>{const op=v.raw,item=document.createElement('label');item.className='ai-preview-item'+(v.valid?'':' invalid');item.innerHTML='<input type="checkbox" '+(v.valid&&v.selected?'checked':'')+' '+(v.valid?'':'disabled')+' onchange="toggleAiPreviewOperation('+i+',this.checked)"><div><div class="ai-preview-title">'+escapeHtml(AI_ACTION_LABELS[op.action]||op.action||'不正な命令')+' · '+escapeHtml(v.task?v.task.name:(op.title||'新規タスク'))+'</div><div class="ai-preview-diff">'+escapeHtml(aiOperationDiff(v))+'</div>'+(op.reason?'<div class="ai-preview-reason">'+escapeHtml(op.reason)+'</div>':'')+'</div>';list.appendChild(item)});area.appendChild(list);
  const chosen=valid.filter(x=>x.selected).length,delRatio=state.tasks.length?deletes/state.tasks.length:0;const warn=(deletes>=50||delRatio>=.5)?'<div class="ai-org-status error">大量削除が含まれています。適用後もゴミ箱と履歴から復元できます。</div>':'';area.insertAdjacentHTML('beforeend',warn+'<div class="ai-org-actions"><button type="button" class="ai-org-btn secondary" onclick="toggleAllAiPreview(true)">全選択</button><button type="button" class="ai-org-btn secondary" onclick="toggleAllAiPreview(false)">全解除</button></div><button type="button" class="ai-org-btn" style="margin-top:8px" onclick="confirmApplyAiPreview()">選択した'+chosen+'件を適用</button>');
}
function toggleAiPreviewOperation(i,on){if(aiPreviewOperations[i]&&aiPreviewOperations[i].valid)aiPreviewOperations[i].selected=!!on;renderAiPreview()}
function toggleAllAiPreview(on){aiPreviewOperations.forEach(x=>{if(x.valid)x.selected=!!on});renderAiPreview()}
function aiSnapshot(){const a=ensureAiOrganizerState();return{tasks:JSON.parse(JSON.stringify(state.tasks)),repeats:JSON.parse(JSON.stringify(state.repeats||[])),trash:JSON.parse(JSON.stringify(a.trash||[]))}}
function confirmApplyAiPreview(){const ops=aiPreviewOperations.filter(x=>x.valid&&x.selected);if(!ops.length)return;const deletes=ops.filter(x=>x.action==='delete').length;openAppConfirm({title:'AI整理を適用する？',message:ops.length+'件を変更します。'+(deletes?' このうち'+deletes+'件はゴミ箱へ移動します。':'')+' 適用後もまとめて元に戻せます。',okText:'適用する',danger:deletes>0,onOk:()=>applyAiPreview(ops)})}
function applyAiPreview(ops){
  const before=aiSnapshot(),a=ensureAiOrganizerState(),summary={};let applied=0;
  ops.forEach(v=>{const op=v.raw;try{if(applyAiOperation(op)){summary[op.action]=(summary[op.action]||0)+1;applied++}}catch(e){console.warn('AI op failed',op,e)}});
  const history={id:newId(),createdAt:Date.now(),summary,before,afterTaskCount:state.tasks.length};a.history.unshift(history);a.history=a.history.slice(0,10);saveNow();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager();aiPreviewOperations=[];document.getElementById('aiPreviewArea').innerHTML='';document.getElementById('aiImportStatus').className='ai-org-status ok';document.getElementById('aiImportStatus').textContent=applied+'件のAI整理を適用しました。';showUndo(applied+'件のAI整理を適用した',()=>restoreAiHistory(history.id,true));
}
function applyAiOperation(op){
  if(op.action==='create'){const dest=op.destination||'inbox',cfg={extras:{memo:String(op.memo||''),subtasks:[],conditions:[]}};if(dest==='today'){cfg.dueDate=appDayStr();cfg.todayDate=appDayStr()}else if(dest==='skima'){cfg.organizeHoldKind='skima'}state.tasks.push(createTask(String(op.title).trim(),cfg));return true}
  const t=state.tasks.find(x=>x.id===op.taskId);if(!t)return false;
  if(op.action==='set_today'){t.organizeHoldKind='';t.organizeHoldUntil='';t.dueDate=appDayStr();t.todayDate=appDayStr();syncTaskDateFlags(t)}
  else if(op.action==='hold_tomorrow'){t.organizeHoldKind='';t.organizeHoldUntil=addDaysStr(appDayStr(),1);t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false}
  else if(op.action==='hold_until'){t.organizeHoldKind='';t.organizeHoldUntil=String(op.value);t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false}
  else if(op.action==='set_skima'){t.organizeHoldKind='skima';t.organizeHoldUntil='';t.dueDate='';t.todayDate='';t.importantDate='';t.importantFlag=false}
  else if(op.action==='set_important'){t.importantFlag=!!op.value;if(op.value){t.dueDate=appDayStr();t.todayDate=appDayStr()}else t.importantDate=''}
  else if(op.action==='rename'){t.name=String(op.value).trim()||t.name}
  else if(op.action==='set_memo'){t.extras=normalizeTaskExtras(Object.assign({},t.extras,{memo:String(op.value||'')}))}
  else if(op.action==='set_breakdown'){t.swipeCycle=op.value?2:0}
  else if(op.action==='complete'){t.state='done';t.doneAt=Date.now();t.rewardDone=true}
  else if(op.action==='reopen'){t.state='idle';t.doneAt=null}
  else if(op.action==='delete'){moveTaskToTrash(t.id,'ai')}
  else return false;return true;
}
function renderAiHistory(){const area=document.getElementById('aiHistoryArea'),a=ensureAiOrganizerState();if(!area)return;if(!a.history.length){area.innerHTML='<div class="ai-empty">AI整理履歴はまだありません。<br>適用前の状態はここから復元できます。</div>';return}area.innerHTML='<div class="ai-history-list">'+a.history.map(h=>{const total=Object.values(h.summary||{}).reduce((x,y)=>x+y,0),detail=Object.entries(h.summary||{}).map(([k,v])=>(AI_ACTION_LABELS[k]||k)+' '+v).join(' / ');return '<div class="ai-history-card"><div class="ai-history-top"><div><div class="ai-history-title">AI整理 '+total+'件</div><div class="ai-history-meta">'+escapeHtml(new Date(h.createdAt).toLocaleString('ja-JP'))+'<br>'+escapeHtml(detail)+'</div></div><button class="ai-mini-btn" onclick="confirmRestoreAiHistory(\''+h.id+'\')">この時点へ戻す</button></div></div>'}).join('')+'</div>'}
function confirmRestoreAiHistory(id){openAppConfirm({title:'AI整理前へ戻す？',message:'このAI整理を適用する直前の全タスク状態へ戻します。現在の変更は置き換わります。',okText:'元に戻す',danger:true,onOk:()=>restoreAiHistory(id,false)})}
function restoreAiHistory(id,quiet){const a=ensureAiOrganizerState(),h=a.history.find(x=>x.id===id);if(!h)return;state.tasks=JSON.parse(JSON.stringify(h.before.tasks||[])).map(normalizeTask);state.repeats=JSON.parse(JSON.stringify(h.before.repeats||[]));a.trash=JSON.parse(JSON.stringify(h.before.trash||[]));saveNow();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager();renderAiHistory();if(!quiet)document.getElementById('aiImportStatus').textContent='AI整理前の状態へ戻しました。'}
function renderManagerTrashCard(x){
  const card=document.createElement('article');card.className='trash-card';
  const source=x.source==='ai'?'AI整理':'手動削除';
  card.innerHTML='<div class="trash-card-top"><div><div class="trash-card-title">'+escapeHtml(x.task&&x.task.name||'無題タスク')+'</div><div class="trash-card-meta">'+escapeHtml(new Date(x.deletedAt).toLocaleString('ja-JP'))+' · '+source+'</div></div><div class="trash-card-actions"><button class="trash-action" onclick="restoreAiTrash(\''+x.id+'\')">復元</button><button class="trash-action danger" onclick="confirmPurgeAiTrash(\''+x.id+'\')">完全削除</button></div></div>';
  return card;
}
function restoreAiTrash(id){if(!restoreTrashEntry(id))return;saveNow();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager()}
function confirmPurgeAiTrash(id){openAppConfirm({title:'完全に削除する？',message:'このタスクは復元できなくなります。',okText:'完全削除',danger:true,onOk:()=>{const a=ensureAiOrganizerState();a.trash=a.trash.filter(x=>x.id!==id);saveNow();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager()}})}
function confirmEmptyAiTrash(){const n=ensureAiOrganizerState().trash.length;if(!n)return;openAppConfirm({title:'ゴミ箱を空にする？',message:n+'件を完全に削除します。元に戻せません。',okText:'すべて完全削除',danger:true,onOk:()=>{ensureAiOrganizerState().trash=[];saveNow();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager()}})}


let chargeParticleRaf=null,chargeParticles=[],chargeParticleMode='normal';
function particleCanvas(){return document.getElementById('chargeParticleLayer')}
function resizeChargeParticleCanvas(){const c=particleCanvas(),sf=document.getElementById('sf8');if(!c||!sf)return;const dpr=Math.max(1,window.devicePixelRatio||1),r=sf.getBoundingClientRect();c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);c.style.width=r.width+'px';c.style.height=r.height+'px';const ctx=c.getContext('2d');if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0)}
function chargeParticleTarget(){const sf=document.getElementById('sf8'),shell=document.getElementById('chargeMeter');if(!sf||!shell)return{x:340,y:98};const a=sf.getBoundingClientRect(),b=shell.getBoundingClientRect();return{x:b.left-a.left+b.width/2,y:b.top-a.top+b.height/2}}
function spawnChargeParticle(){const c=particleCanvas();if(!c)return null;const W=c.clientWidth,H=c.clientHeight,t=chargeParticleTarget();const side=Math.floor(Math.random()*4);let x,y;if(side===0){x=Math.random()*W;y=-20}else if(side===1){x=W+20;y=Math.random()*H}else if(side===2){x=Math.random()*W;y=H+20}else{x=-20;y=Math.random()*H}const dx=t.x-x,dy=t.y-y,dist=Math.max(1,Math.hypot(dx,dy)),speed=5.2+Math.random()*4.8;return{x,y,px:x,py:y,vx:dx/dist*speed,vy:dy/dist*speed,age:0,life:42+Math.random()*20,alpha:.30+Math.random()*.34}}
function drawChargeParticles(){const c=particleCanvas();if(!c){chargeParticleRaf=null;return}const ctx=c.getContext('2d');if(!ctx){chargeParticleRaf=null;return}const W=c.clientWidth,H=c.clientHeight,target=chargeParticleTarget();ctx.clearRect(0,0,W,H);while(chargeParticles.length<42)chargeParticles.push(spawnChargeParticle());ctx.lineCap='round';for(let i=chargeParticles.length-1;i>=0;i--){const p=chargeParticles[i];p.px=p.x;p.py=p.y;p.x+=p.vx;p.y+=p.vy;p.age++;const fade=1-p.age/p.life;if(fade<=0||Math.hypot(target.x-p.x,target.y-p.y)<10){chargeParticles.splice(i,1);continue}const red=chargeParticleMode==='bonus';const a=(p.alpha*fade).toFixed(3);ctx.beginPath();ctx.moveTo(p.px,p.py);ctx.lineTo(p.x,p.y);ctx.strokeStyle=red?`rgba(255,245,248,${a})`:`rgba(235,255,255,${a})`;ctx.lineWidth=1.0+fade*.9;ctx.stroke();ctx.beginPath();ctx.moveTo((p.px+target.x)/2,(p.py+target.y)/2);ctx.lineTo(p.x,p.y);ctx.strokeStyle=red?`rgba(255,40,78,${(a*.62).toFixed(3)})`:`rgba(0,229,188,${(a*.62).toFixed(3)})`;ctx.lineWidth=.7;ctx.stroke()}chargeParticleRaf=requestAnimationFrame(drawChargeParticles)}
function startChargeParticles(mode='normal'){resizeChargeParticleCanvas();chargeParticleMode=mode==='bonus'?'bonus':'normal';chargeParticles=[];const c=particleCanvas();if(c)c.classList.add('on');if(!chargeParticleRaf)chargeParticleRaf=requestAnimationFrame(drawChargeParticles)}
function stopChargeParticles(){const c=particleCanvas();if(c){c.classList.remove('on');const ctx=c.getContext('2d');if(ctx)ctx.clearRect(0,0,c.clientWidth,c.clientHeight)}if(chargeParticleRaf){cancelAnimationFrame(chargeParticleRaf);chargeParticleRaf=null}chargeParticles=[]}

function bonusRewardPayload(res){
  const T=TIERS[res.tier];
  if(res.kind==='title')return{kind:'称号 GET',text:'「'+res.title.text+'」',sub:'肩書きに追加された',tier:res.tier,color:T.color};
  if(res.kind==='days')return{kind:'無料期間 GET',text:'+'+res.days+'日',sub:'現在無料期間 +'+state.freeDays+'日 追加！',tier:res.tier,color:T.color};
  if(res.kind==='illust')return{kind:'イラスト GET',text:(ILLUST_LABELS[res.tier]||T.jp)+' 解放',sub:'歴代ヘアスタイルをプロフィールに追加',tier:res.tier,color:T.color};
  return{kind:'レベルアップ',text:'+'+res.xp+' PT',sub:'Lv.'+levelFromXp(state.xp),tier:res.tier,color:T.color};
}
function postBonusRewardReady(payload,tries=0){
  const fr=document.getElementById('bonusFrame');
  if(fr&&fr.contentWindow){try{fr.contentWindow.postMessage({type:'DOPAON_BONUS_REWARD_READY',payload},'*');return true}catch(e){}}
  if(tries<20)setTimeout(()=>postBonusRewardReady(payload,tries+1),100);
  return false;
}

/* ===== v7 CHARGE BRIDGE: charge demo UI removed, original gimmick preserved ===== */
function rollChargeOutcome(force){
  if(force==='bonus'||force==='white'||force==='blue')return force;
  const r=Math.random();
  if(r>=1/3)return 'miss';
  const h=Math.random();
  if(h<0.25)return 'bonus';
  if(h<0.75)return 'white';
  return 'blue';
}
function issueChargeTicket(task,opts={}){
  const outcome=rollChargeOutcome(opts.force||null);
  if(outcome==='miss')return false;
  if(!Array.isArray(state.chargeTickets))state.chargeTickets=[];
  const type=opts.type||'task';
  state.chargeTickets.push({id:newId(),type,sourceId:task.id,name:task.name,force:(opts.force||null),outcome,tutorial:!!opts.tutorial,rainbow:type==='habit'||type==='important'||!!opts.tutorial,createdAt:Date.now()});
  return true;
}
function chargeFrame(){return document.getElementById('chargeFrame')}
function chargeShell(){return document.getElementById('chargeMeter')}
function renderChargeHolds(){
  const box=document.getElementById('chargeHolds');if(!box)return;
  const holds=Array.isArray(state.chargeHolds)?state.chargeHolds:[];
  const visible=Math.min(holds.length,6);
  box.innerHTML=Array.from({length:6},(_,i)=>'<i class="charge-hold-dot'+(i<visible?' filled':'')+'"></i>').join('')+(holds.length>6?'<b class="charge-hold-more">+'+(holds.length-6)+'</b>':'');
}
function renderChargeMini(){
  const el=chargeShell();if(!el)return;
  el.classList.toggle('charge-busy',!!chargeBusy);
  el.classList.toggle('charge-off',!chargeBusy);
  const hasHolds=!!(state.chargeHolds&&state.chargeHolds.length);
  el.classList.toggle('has-holds',hasHolds);
  postToCharge({type:'DOPAON_CHARGE_HOLDS_STATE',hasHolds});
  renderChargeHolds();
}
function tapChargeMini(e){if(e){e.preventDefault();e.stopPropagation()}}
function holdCurrentCharge(){
  if(!chargeBusy||currentChargePhase!=='peka'||!currentChargeTicket)return false;
  if(!Array.isArray(state.chargeHolds))state.chargeHolds=[];
  state.chargeHolds.push(Object.assign({},currentChargeTicket,{rainbow:!!(currentChargeTicket.rainbow||currentChargeTicket.type==='habit'||currentChargeTicket.type==='important'||currentChargeTicket.tutorial)}));
  chargeBusy=false;chargeCanInterrupt=false;currentChargePhase='off';currentChargeTicket=null;
  setChargeInteractionLocked(false);stopChargeParticles();resetChargeFrame();saveState();renderChargeMini();
  return true;
}
function loadNextChargeHold(){
  if(chargeBusy||currentMode()==='game'||!state.chargeHolds||!state.chargeHolds.length)return false;
  const ticket=state.chargeHolds.shift();currentChargeTicket=ticket;chargeBusy=true;chargeCanInterrupt=false;currentChargePhase='loading';
  saveState();renderChargeMini();postToCharge({type:'DOPAON_CHARGE_LOAD_HOLD',ticketId:ticket.id,force:ticket.outcome||ticket.force||'white',rainbow:!!ticket.rainbow});return true;
}
function postToCharge(msg,tries=0){
  const fr=chargeFrame();
  if(fr&&fr.contentWindow){
    try{fr.contentWindow.postMessage(msg,'*');return true}catch(e){}
  }
  if(tries<20)setTimeout(()=>postToCharge(msg,tries+1),100);
  return false;
}
function resetChargeFrame(){postToCharge({type:'DOPAON_CHARGE_RESET'})}
function setChargeInteractionLocked(on){
  chargeInteractionLocked=!!on;
  const root=document.getElementById('sf8');
  if(root)root.classList.toggle('charge-interaction-lock',chargeInteractionLocked);
}
function startChargeInteractionLock(){
  if(chargeInteractionLocked)return;
  const input=document.getElementById('mi');
  if(input)input.blur();
  clearTaskChargePreview(null,false);
  setChargeInteractionLocked(true);
}
function finishChargeInteraction(){
  setChargeInteractionLocked(false);
  if(state.chargeTickets&&state.chargeTickets.length&&currentMode()!=='game')setTimeout(()=>startNextChargeTicket(true),260);
}
function deferChargeWhileGame(auto){
  if(currentMode()==='game'&&auto){
    chargeBusy=false;chargeCanInterrupt=false;currentChargeTicket=null;
    setChargeInteractionLocked(false);
    stopChargeParticles();
    resetChargeFrame();
    renderChargeMini();
    return true;
  }
  return false;
}
function startNextChargeTicket(auto=false){
  if(deferChargeWhileGame(auto))return false;
  if(chargeBusy)return false;
  if(!state.chargeTickets||!state.chargeTickets.length)return false;
  const ticket=state.chargeTickets.shift();
  currentChargeTicket=ticket;
  clearTaskChargePreview(null,false);
  const input=document.getElementById('mi');if(input)input.blur();
  saveState();
  chargeBusy=true;chargeCanInterrupt=true;
  const planned=ticket.outcome||ticket.force||null;
  setChargeInteractionLocked(false);
  currentChargePhase='loading';
  renderChargeMini();
  postToCharge({type:'DOPAON_CHARGE_START',ticketId:ticket.id,force:planned});
  return true;
}
async function handleChargeResult(kind){
  try{
    if(kind==='miss'){
      // たまに「惜しい！」をチャージ枠近くに出す
      if(Math.random()<0.3){
        const shell=document.getElementById('chargeMeter');
        if(shell){const m=document.createElement('div');m.className='miss-near';m.textContent=Math.random()<0.5?'惜しい！':'あと一歩！';shell.appendChild(m);requestAnimationFrame(()=>m.classList.add('pop'));setTimeout(()=>m.remove(),950);}
      }
      return;
    }
    if(kind==='white'||kind==='blue'){
      startChargeInteractionLock();
      let reward;
      if(kind==='white'&&tut&&tut.active&&tut.phase==='part2'){
        // チュートリアルPart2: 白報酬を+3日無料期間に固定
        state.freeDays+=3;reward={kind:'days',tier:'white',days:3};saveState();renderHeader();
      }else{
        reward=grantReward(kind);saveState();renderHeader();
      }
      rewardUnlockPending=true;showReward(reward,kind==='blue'?'Tia青':'Tia白');return;
    }
    if(kind==='bonus'){
      startChargeInteractionLock();
      await showGoBonusGate();
      const prepared=await playBonusFrame();
      // reward already shown in bonus.html
      return;
    }
  }finally{
    chargeBusy=false;chargeCanInterrupt=false;currentChargePhase='off';currentChargeTicket=null;
    stopChargeParticles();
    resetChargeFrame();
    renderChargeMini();
    saveState();
    if(!rewardUnlockPending)finishChargeInteraction();
  }
}
function showGoBonusGate(){
  return new Promise(resolve=>{goBonusResolve=resolve;const el=document.getElementById('goBonusGate');if(el)el.classList.add('show');if(navigator.vibrate)navigator.vibrate([80,40,160])})
}
function tapGoBonusGate(e){if(e){e.preventDefault();e.stopPropagation()}const el=document.getElementById('goBonusGate');if(el)el.classList.remove('show');const r=goBonusResolve;goBonusResolve=null;r&&r()}
let bonusPreparedReward=null;
function playBonusFrame(){
  return new Promise(resolve=>{
    bonusResolve=resolve;bonusPreparedReward=null;
    const ov=document.getElementById('bonusFrameOverlay'),fr=document.getElementById('bonusFrame');
    if(!ov||!fr){const r=grantReward(rollBonusTier());saveState();renderHeader();resolve(r);return}
    const tutBonus=!!(tut&&tut.active&&tut.bonusFired);
    if(tutBonus)_tutHideForBonus();
    ov.classList.add('show');
    const send=()=>{try{fr.contentWindow.postMessage({type:'DOPAON_BONUS_START',tutorial:tutBonus,forceTier:tutBonus?'red':undefined},'*')}catch(e){const r=grantReward(rollBonusTier());saveState();renderHeader();resolve(r)}};
    if(fr.contentWindow)send(); else fr.onload=send;
  })
}
function keepTaskPreviewOnTarget(target){if(!target||!taskChargingId||currentMode()!=='tasks')return false;const card=target.closest&&target.closest('.task');if(!card||card.dataset.id!==String(taskChargingId))return false;return !!(target.closest('.task-btn')||target.closest('.task-dopaon')||target.closest('.dopa-close'));}
document.addEventListener('click',e=>{const target=e.target;if(currentChargePhase==='peka'&&!(target.closest&&target.closest('#chargeMeter')))holdCurrentCharge();setTimeout(()=>{if(openExtraTaskId&&!(target.closest&&target.closest('.task-extra'))&&!(target.closest&&target.closest('.task-menu-toggle')))closeTaskExtras(true);if(taskChargingId&&!keepTaskPreviewOnTarget(target))clearTaskChargePreview(null,true);if(currentMode()==='habits'&&flippedHabitId&&!target.closest('.habit-tile')){flippedHabitId=null;render()}if(quickPickerMode&&!(target.closest&&(target.closest('#quickAddBar')||target.closest('#quickPickerPanel')||target.closest('#inputBar')))){const closed=quickClosePicker('outside click');if(closed){const _mi=document.getElementById('mi');if(document.activeElement!==_mi){document.body.classList.remove('keyboard-open');document.getElementById('sf8')?.classList.remove('keyboard-open');syncViewport()}}}},0);},true);
window.addEventListener('message',e=>{
  const d=e.data||{};
  // v17: GAME画面は既存チャージ機の当選/状態通知を受け取らない。
  // GAME内の接敵・勝敗はテキストログだけで完結させ、チャージ当選エフェクト/操作ロックに接続しない。
  if(currentMode()==='game' && (d.type==='DOPAON_CHARGE_STATE' || d.type==='DOPAON_CHARGE_RESULT')){
    chargeCanInterrupt=false;
    setChargeInteractionLocked(false);
    stopChargeParticles();
    return;
  }
  if(d.type==='DOPAON_CHARGE_STATE'){chargeCanInterrupt=false;currentChargePhase=d.phase||'off';if(d.phase==='spinning')startChargeInteractionLock();return}
  if(d.type==='DOPAON_CHARGE_REQUEST_HOLD'){loadNextChargeHold();return}
  if(d.type==='DOPAON_CHARGE_RESULT'){
    const kind=['miss','white','blue','bonus'].includes(d.kind)?d.kind:'miss';
    stopChargeParticles();
    handleChargeResult(kind);
    return;
  }
  if(d.type==='DOPAON_BONUS_PREPARE_REWARD'){
    const isTutFinalBonus=tut&&tut.active&&tut.bonusFired;
    const tier=isTutFinalBonus?'red':(TIER_ORDER.includes(d.tier)?d.tier:rollBonusTier());
    let reward;
    if(isTutFinalBonus){
      // チュートリアル最終BONUSは必ず赤肩書き「挑戦する」を実際の報酬として表示・付与する。
      const titleObj=TITLES.find(t=>t.id===TUT_TITLE_ID)||{id:TUT_TITLE_ID,text:'挑戦する',tier:'red'};
      if(!state.ownedTitles.includes(TUT_TITLE_ID))state.ownedTitles.push(TUT_TITLE_ID);
      state.profile.titleId=TUT_TITLE_ID;
      reward={kind:'title',tier:'red',title:titleObj};
    }else{
      reward=grantReward(tier);
    }
    bonusPreparedReward=reward;saveState();renderHeader();
    postBonusRewardReady(bonusRewardPayload(reward));
    return;
  }
  if(d.type==='DOPAON_BONUS_CLOSE'){
    const ov=document.getElementById('bonusFrameOverlay');if(ov)ov.classList.remove('show');
    const r=bonusResolve;bonusResolve=null;r&&r(bonusPreparedReward);
    bonusPreparedReward=null;
    // チュートリアル最終BONUSの完了判定（showRewardが呼ばれない場合の保険）
    if(tut.active&&tut.bonusFired){const _cs=tutCurrentStep();if(_cs&&_cs.id==='t_bon')setTimeout(tutFinalDone,300);}
    return;
  }
  if(d.type==='DOPAON_BONUS_RESULT'){
    const tier=TIER_ORDER.includes(d.tier)?d.tier:rollBonusTier();
    const reward=bonusPreparedReward||grantReward(tier);saveState();renderHeader();
    const ov=document.getElementById('bonusFrameOverlay');if(ov)ov.classList.remove('show');
    const r=bonusResolve;bonusResolve=null;r&&r(reward);bonusPreparedReward=null;
    if(tut.active&&tut.bonusFired){const _cs=tutCurrentStep();if(_cs&&_cs.id==='t_bon')setTimeout(tutFinalDone,300);}
  }
});

let activeSettingsField=null;
function adjustSettingsFieldPosition(target){
  if(!target||!target.isConnected||!target.closest('#taskSettingsScreen'))return;
  const body=document.getElementById('taskSettingsBody'),screen=document.getElementById('taskSettingsScreen');if(!body||!screen)return;
  syncViewport();
  const r=target.getBoundingClientRect(),br=body.getBoundingClientRect();
  const vv=window.visualViewport;const visibleTop=vv?vv.offsetTop:0;let visibleH=vv?vv.height:window.innerHeight;
  /* visualViewportが縮まない環境向けフォールバック: フィールドにフォーカスがあるのにリフト検出0なら、画面下半分をキーボード占有とみなす */
  const _lifted=(baseViewportHeight-visibleH)>80;
  const _ae=document.activeElement,_fieldFocused=!!(_ae&&_ae.closest&&_ae.closest('#taskSettingsScreen')&&/^(INPUT|TEXTAREA|SELECT)$/.test(_ae.tagName));
  if(_fieldFocused&&!_lifted)visibleH=Math.min(visibleH,Math.round(Math.max(320,(window.innerHeight||visibleH)*0.52)));
  const visibleBottom=visibleTop+visibleH;
  const topLimit=Math.max(br.top,visibleTop+76);const bottomLimit=Math.min(br.bottom,visibleBottom-88);
  if(r.bottom>bottomLimit)body.scrollTop+=Math.ceil(r.bottom-bottomLimit+18);
  else if(r.top<topLimit)body.scrollTop-=Math.ceil(topLimit-r.top+12);
}
function keepSettingsFieldVisible(target){
  if(!target||!target.closest||!target.closest('#taskSettingsScreen'))return;activeSettingsField=target;
  requestAnimationFrame(()=>requestAnimationFrame(()=>adjustSettingsFieldPosition(target)));
  [70,150,280,460,700].forEach(ms=>setTimeout(()=>adjustSettingsFieldPosition(target),ms));
}
document.addEventListener('focusin',e=>{if(e.target?.closest?.('#taskSettingsScreen'))keepSettingsFieldVisible(e.target)});
document.addEventListener('focusout',e=>{if(e.target?.closest?.('#taskSettingsScreen'))setTimeout(()=>{if(document.activeElement!==activeSettingsField)activeSettingsField=null;syncViewport()},180)});
function handleViewportChange(){syncViewport();resizeChargeParticleCanvas();if(activeSettingsField)adjustSettingsFieldPosition(activeSettingsField);setTimeout(()=>{syncViewport();if(activeSettingsField)adjustSettingsFieldPosition(activeSettingsField)},60);setTimeout(()=>{syncViewport();if(activeSettingsField)adjustSettingsFieldPosition(activeSettingsField)},180)}
if(window.visualViewport){visualViewport.addEventListener('resize',handleViewportChange);visualViewport.addEventListener('scroll',handleViewportChange)}
window.addEventListener('resize',()=>{initBaseViewport(false);syncViewport()});
window.addEventListener('orientationchange',()=>{setTimeout(()=>{initBaseViewport(true);syncViewport()},300);setTimeout(syncViewport,700)});
window.addEventListener('scroll',lockScroll,{passive:true});
document.addEventListener('touchmove',e=>{if(e.target.closest('#ta'))return;if(e.target.closest('.popup'))return;if(e.target.closest('#taskSettingsScreen'))return;if(e.target.closest('#taskManagerScreen'))return;if(e.target.closest('#quickPickerPanel'))return;if(e.target.closest('#quickAddBar'))return;e.preventDefault()},{passive:false});

/* ================================================================
   DOPADO TUTORIAL SYSTEM v2 — グローバルスコープ
   初回のみ。フックで既存機能を汚染しない。
   失敗では報酬を出さない。成功のみBONUS。
================================================================ */

const TUT_TITLE_ID = 't_tut01'; // "挑戦する" red tier

let tut = {
  active: false,
  phase: 'idle',           // 'home' | 'part1' | 'part2' | 'part3'
  step: 0,
  taskId: null,
  habitDoId: null,
  habitAvoidId: null,
  bonusFired: false,
  nameEntered: false,
  failRecorded: false,
};

/* ---------- ステップ定義 ---------- */
const TUT_HOME_STEPS = [
  { id: 'h_welcome', part: 'WELCOME', bg: true,
    msg: 'ようこそ、挑戦者。\nDOPADOを触ってくれてありがとう。',
    hint: '', btn: '次へ' },
  { id: 'h_home_ios', part: 'ホーム画面に追加', bg: true,
    msg: 'まずはホーム画面に追加して\nアプリとして使ってね。',
    hint: '① 共有ボタン □↑ をタップ\n② 「ホーム画面に追加」を選ぶ\n③ 追加したアイコンから開く\n\nAndroidなら自分で頑張って！',
    btn: 'ホーム画面に追加した / このまま進む' },
];

const TUT_PART1_STEPS = [
  { id: 't_add',  part: 'PART 1 · 日常タスク', msg: 'まずは今日やることを\n1個入れてみよう', hint: '↓ 入力して ✓ ボタン' },
  { id: 't_today',part: 'PART 1 · 日常タスク', msg: 'このカードを右にスワイプして\n「今日」タグを付けよう',   hint: 'カードの上で指を置いて、右へスッと動かす →' },
  { id: 't_imp',  part: 'PART 1 · 日常タスク', msg: 'もう一度、同じカードを右へ。\n今度は「重要」にできる', hint: '同じカードをもう一回、右へスワイプ →' },
  { id: 't_ext',  part: 'PART 1 · 日常タスク', msg: '細かいタスクやメモは\nここに入れられる', hint: '☰ ボタンを押してみよう' },
  { id: 't_sub',  part: 'PART 1 · 日常タスク', msg: 'サブタスクを1つ\n追加してみよう', hint: '＋ タスクを追加 → 入力してEnter' },
  { id: 't_mtab', part: 'PART 1 · 日常タスク', msg: '次はメモタブに\n切り替えよう', hint: '「メモ」タブをタップ' },
  { id: 't_memo', part: 'PART 1 · 日常タスク', msg: 'なんでもいいから\n少し入力してみよう', hint: 'メモ欄に入力' },
  { id: 't_cext', part: 'PART 1 · 日常タスク', msg: 'よし。メニューを閉じよう', hint: '☰ を再タップ または ✕' },
  { id: 't_prep', part: 'PART 1 · 日常タスク', msg: '完了前に、終わった後の\n自分を少し想像する', hint: '完了ボタンを押してみよう' },
  { id: 't_done', part: 'PART 1 · 日常タスク', msg: 'もう一度押すと完了。\nDOPADOが反応する', hint: 'もう一度 完了ボタン' },
];

const TUT_PART2_STEPS = [
  { id: 't_chrg', part: 'PART 2 · 報酬',   msg: '上の右側にあるチャージ機をタップ！\n抽選結果を見てみよう', hint: '画面右上の小さいチャージ機をタップ' },
  { id: 't_rwd',  part: 'PART 2 · 報酬',   msg: 'チュートリアル報酬ゲット！\nタップして閉じよう', hint: 'ポップアップをタップ', pos: 'top' },
  { id: 't_prof', part: 'PART 2 · 報酬',   msg: '獲得したものは\nプロフィールに残る', hint: '↑ 右上をタップ' },
  { id: 't_name', part: 'PART 2 · 報酬',   msg: '名前を変えて\n自分のDOPADOにしよう', hint: '名前欄に入力', pos: 'top' },
  { id: 't_pcls', part: 'PART 2 · 報酬',   msg: '完了！閉じよう', hint: '✕ を押して閉じる', pos: 'top' },
];

const TUT_PART3_STEPS = [
  { id: 't_hab',   part: 'PART 3 · 習慣 & BONUS', msg: '上の「日常↔習慣」バーをタップして\n習慣画面へ', hint: '点滅している横長バーをタップ' },
  { id: 't_cdo',   part: 'PART 3 · 習慣 & BONUS', msg: '空きスロットをタップして\n「やること」の習慣を作ろう', hint: '光っている＋スロット → 名前入力 → 習慣を追加', pos: 'top' },
  { id: 't_lpdo',  part: 'PART 3 · 習慣 & BONUS', msg: 'やることは長押しで達成\n溜めて、離して。', hint: '光っているタイルを長押し（練習）' },
  { id: 't_cavd',  part: 'PART 3 · 習慣 & BONUS', msg: '次は「やらないこと」も作ろう。\n空きスロットから作成できるよ', hint: '光っている＋スロット → チェック内容を「やらないこと」→ 習慣を追加', pos: 'top' },
  { id: 't_dtap',  part: 'PART 3 · 習慣 & BONUS', msg: '「やらないこと」は\nダブルタップで裏面へ', hint: '光っているタイルをダブルタップ' },
  { id: 't_fail',  part: 'PART 3 · 習慣 & BONUS', msg: '破った時はここを長押し\nで失敗を記録できる', hint: '光っている「失敗を記録」を長押し' },
  { id: 't_failmsg',part:'PART 3 · 習慣 & BONUS', msg: '失敗は赤で残る。\nでも、報酬は出ない。\nDOPADOが光るのは、次に成功した時。', hint: '', btn: '次へ' },
  { id: 't_lpavd', part: 'PART 3 · 習慣 & BONUS', msg: '次は守れた時の記録。\n表面を長押しして\n「守れた / 達成」を掴もう', hint: '光っているタイルを長押し' },
  { id: 't_bon',   part: 'PART 3 · 習慣 & BONUS', msg: '成功！！\n習慣の達成はBONUSにつながる', hint: '画面右上のチャージ機をタップしてBONUSへ' },
];

/* ---------- iOS判定 ---------- */
function isStandalone() {
  return (window.navigator.standalone === true) ||
         window.matchMedia('(display-mode: standalone)').matches ||
         window.matchMedia('(display-mode: fullscreen)').matches;
}
function isIOS() { return /iP(hone|od|ad)/.test(navigator.userAgent); }
function isSafari() { return isIOS() && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|OPiOS|EdgiOS/.test(navigator.userAgent); }

/* ---------- チュートリアル判定: チケットがチュートリアル用か ---------- */
function tutIsActive() { return !!tut.active; }
function tutIsTempHabit(id) { return id === tut.habitDoId || id === tut.habitAvoidId; }

function setTutorialUiActive(on, finalMode=false) {
  const app = document.getElementById('sf8');
  if (app) {
    app.classList.toggle('tutorial-active', !!on);
    app.classList.toggle('tutorial-final', !!finalMode);
  }
  document.body.classList.toggle('tutorial-active', !!on);
  const prompt = document.getElementById('miPrompt');
  if (prompt) {
    prompt.classList.toggle('hide', !!on);
    prompt.style.display = on ? 'none' : '';
    prompt.style.visibility = on ? 'hidden' : '';
    prompt.style.opacity = '';
  }
}

/* ---------- 起動 ---------- */
function tutStart() {
  const skipHome = isStandalone() || localStorage.getItem('dopado_home_prompt_seen') === '1';
  tut = { active: true, phase: skipHome ? 'part1' : 'home', step: 0,
          taskId: null, habitDoId: null, habitAvoidId: null,
          bonusFired: false, nameEntered: false, failRecorded: false,
          finalMessagePending: false };
  _tutFinalCalled = false;
  const ov = document.getElementById('tutOverlay');
  if (ov) ov.style.display = 'block';
  setTutorialUiActive(true);
  const sk = document.getElementById('tutSkip');
  if (sk) sk.style.display = 'block';
  const rb = document.getElementById('tutResetBtn');
  if (rb) rb.style.display = 'block';
  tutRender();
}

/* ---------- スキップ（確認付き） ---------- */
function tutSkip() {
  openAppConfirm({
    title:'チュートリアルをスキップする？',
    message:'重要アイテムを逃します😭\n本当にスキップしますか？',
    okText:'スキップ',
    danger:false,
    onOk:tutSkipConfirmed
  });
}
function tutSkipConfirmed() {
  tutCleanTemp();
  _tutFinalCalled = false;
  tut.finalMessagePending = false;
  tut.active = false;
  state.onboarded = true;
  localStorage.setItem('dopado_tutorial_completed', '1');
  saveState();
  // 演出・ロック・オーバーレイを全部強制解除
  try {
    chargeBusy = false; chargeCanInterrupt = false;
    rewardUnlockPending = false; currentChargeTicket = null;
    stopChargeParticles();
    resetChargeFrame();
    setChargeInteractionLocked(false);
    ['rewardOverlay','goBonusGate'].forEach(id => {
      const el = document.getElementById(id); if (el) el.classList.remove('show');
    });
    const bfo = document.getElementById('bonusFrameOverlay');
    if (bfo) { bfo.classList.remove('show'); bfo.style.display = ''; }
    if (bonusResolve) { const r = bonusResolve; bonusResolve = null; try{r(null)}catch(e){} }
    if (goBonusResolve) { const r = goBonusResolve; goBonusResolve = null; try{r()}catch(e){} }
    bonusPreparedReward = null;
    taskChargingId = null; habitChargingId = null;
    renderChargeMini();
  } catch(e){}
  _tutHideOverlay();
  render();
}


function tutManualReset() {
  openAppConfirm({
    title:'チュートリアルをリセットする？',
    message:'チュートリアルを最初からやり直します。\n作成中のタスク・習慣・報酬データは削除されます。\n本当にリセットしますか？',
    okText:'リセット',
    danger:true,
    onOk:tutManualResetConfirmed
  });
}
function tutManualResetConfirmed() {
  try {
    // 詰み状態からでも抜けられるよう、先にロックと演出をできるだけ解除する。
    chargeBusy = false; chargeCanInterrupt = false;
    rewardUnlockPending = false; currentChargeTicket = null;
    stopChargeParticles();
    resetChargeFrame();
    setChargeInteractionLocked(false);
    ['rewardOverlay','goBonusGate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.classList.remove('show'); el.style.display = ''; }
    });
    const bfo = document.getElementById('bonusFrameOverlay');
    if (bfo) { bfo.classList.remove('show'); bfo.style.display = ''; }
    if (bonusResolve) { const r = bonusResolve; bonusResolve = null; try { r(null); } catch(e) {} }
    if (goBonusResolve) { const r = goBonusResolve; goBonusResolve = null; try { r(); } catch(e) {} }
    bonusPreparedReward = null;
    taskChargingId = null; habitChargingId = null; flippedHabitId = null;
  } catch(e) {}

  try {
    const exactKeys = [
      STORAGE_KEY,
      BACKUP_KEY,
      ...LEGACY_KEYS,
      'dopado_tutorial_completed',
      'dopado_home_prompt_seen',
      DATA_RESET_CANARY_KEY
    ];
    function isDopadoStorageKeyForManualReset(key) {
      const lower = String(key || '').toLowerCase();
      return exactKeys.includes(key) || lower.includes('dopaon') || lower.includes('dopado');
    }
    Object.keys(localStorage).forEach(key => {
      if (key === DATA_RESET_DONE_KEY) return;
      if (isDopadoStorageKeyForManualReset(key)) localStorage.removeItem(key);
    });
    Object.keys(sessionStorage).forEach(key => {
      if (isDopadoStorageKeyForManualReset(key)) sessionStorage.removeItem(key);
    });
    // 手動リセット後に自動リセットが余計に再発火しないよう、現在の版でクリーン済みにしておく。
    localStorage.setItem(DATA_RESET_DONE_KEY, DATA_RESET_VERSION);
    localStorage.setItem(DATA_RESET_CANARY_KEY, DATA_RESET_VERSION);
  } catch(e) {}

  location.reload();
}

function _tutHideForBonus() {
  setTutorialUiActive(true);
  // BONUS演出中はチュートリアル文言を完全に隠す。
  // iframeの上に吹き出しが残ると、フリーズしたように見えるため。
  const ov = document.getElementById('tutOverlay');
  if (ov) ov.style.display = 'none';
  const bbl = document.getElementById('tutBubble');
  if (bbl) bbl.classList.remove('show');
  const counter = document.getElementById('tutCounter');
  if (counter) counter.textContent = '';
  const rb = document.getElementById('tutResetBtn');
  if (rb) rb.style.display = 'none';
  tutGlow(null);
  tutPulse(null);
}

function _tutHideOverlay() {
  const ov = document.getElementById('tutOverlay');
  if (ov) ov.style.display = 'none';
  setTutorialUiActive(false);
  const sk = document.getElementById('tutSkip');
  if (sk) sk.style.display = 'none';
  const bg = document.getElementById('tutBg');
  if (bg) bg.style.opacity = '0';
  const btn = document.getElementById('tutActionBtn');
  if (btn) btn.remove();
  const rb = document.getElementById('tutResetBtn');
  if (rb) rb.style.display = 'none';
  const bbl = document.getElementById('tutBubble');
  if (bbl) bbl.classList.remove('has-reset');
  tutGlow(null);
  tutPulse(null);
}

/* ---------- チュートリアル用チケット判定 ---------- */
function tutIsTutorialTicket(t) {
  return !!(t && (
    t.tutorial ||
    t.sourceId === 'tut_white' ||
    t.sourceId === 'tut_bonus' ||
    t.id === 'tut_white' ||
    t.id === 'tut_bonus'
  ));
}

/* ---------- 一時データ削除 ---------- */
function tutCleanTemp() {
  // IDベースの削除
  if (tut.taskId) state.tasks = state.tasks.filter(x => x.id !== tut.taskId);
  if (tut.habitDoId) { state.habits = state.habits.filter(x => x.id !== tut.habitDoId); delete state.habitLogs[tut.habitDoId]; }
  if (tut.habitAvoidId) { state.habits = state.habits.filter(x => x.id !== tut.habitAvoidId); delete state.habitLogs[tut.habitAvoidId]; }
  // tutorial:trueフラグベースの掃除（リロード後の残留対策）
  state.tasks = state.tasks.filter(x => !x.tutorial);
  state.habits.filter(x => x.tutorial).forEach(x => { delete state.habitLogs[x.id]; });
  state.habits = state.habits.filter(x => !x.tutorial);
  if (Array.isArray(state.chargeTickets)) {
    state.chargeTickets = state.chargeTickets.filter(t => !tutIsTutorialTicket(t));
  }
  saveState();
}
// 起動時のチュートリアル残留データ掃除（リロード復帰対策）
function cleanStaleTutorialData() {
  let dirty = false;
  if (state.tasks.some(x => x.tutorial)) { state.tasks = state.tasks.filter(x => !x.tutorial); dirty = true; }
  if (state.habits.some(x => x.tutorial)) {
    state.habits.filter(x => x.tutorial).forEach(x => { delete state.habitLogs[x.id]; });
    state.habits = state.habits.filter(x => !x.tutorial);
    dirty = true;
  }
  if (Array.isArray(state.chargeTickets) && state.chargeTickets.some(tutIsTutorialTicket)) {
    state.chargeTickets = state.chargeTickets.filter(t => !tutIsTutorialTicket(t)); dirty = true;
  }
  if (dirty) saveState();
}

/* ---------- 現在ステップ ---------- */
function tutCurrentStep() {
  if (tut.phase === 'home') return TUT_HOME_STEPS[tut.step] || null;
  if (tut.phase === 'part1') return TUT_PART1_STEPS[tut.step] || null;
  if (tut.phase === 'part2') return TUT_PART2_STEPS[tut.step] || null;
  if (tut.phase === 'part3') return TUT_PART3_STEPS[tut.step] || null;
  return null;
}

/* ---------- 進行 ---------- */
function tutAdvance() {
  if (!tut.active) return;
  tut.step++;
  if (tut.phase === 'home' && tut.step >= TUT_HOME_STEPS.length) { tut.phase = 'part1'; tut.step = 0; }
  else if (tut.phase === 'part1' && tut.step >= TUT_PART1_STEPS.length) { tut.phase = 'part2'; tut.step = 0; }
  else if (tut.phase === 'part2' && tut.step >= TUT_PART2_STEPS.length) { tut.phase = 'part3'; tut.step = 0; }
  else if (tut.phase === 'part3' && tut.step >= TUT_PART3_STEPS.length) { return; } // t_bonのreward_shownで最終へ
  tutRender();
}

/* ---------- 最終: 赤肩書き付与 ---------- */
let _tutFinalCalled = false;
function tutFinalDone() {
  if (_tutFinalCalled) return;
  _tutFinalCalled = true;
  // 肩書き「挑戦する」を付与
  const titleObj = TITLES.find(t => t.id === TUT_TITLE_ID);
  if (titleObj && !state.ownedTitles.includes(TUT_TITLE_ID)) state.ownedTitles.push(TUT_TITLE_ID);
  if (!state.profile.titleId) state.profile.titleId = TUT_TITLE_ID;
  tutCleanTemp();
  // tut.active はここではまだ落とさない（reward_closedフックが必要なため）
  tut.finalMessagePending = true;
  state.onboarded = true;
  localStorage.setItem('dopado_tutorial_completed', '1');
  saveState();
  renderHeader(); render();
  // 称号はBONUS演出内で既に付与・表示済み。reward popupは呼ばずに最終メッセージへ
  _tutShowFinalMessage();
}
function _tutShowFinalMessage() {
  tut.active = false;
  tut.finalMessagePending = false;
  _tutFinalCalled = false;
  const ov = document.getElementById('tutOverlay');
  if (ov) ov.style.display = 'block';
  setTutorialUiActive(true, true);
  const st = { id: 't_fin', part: 'COMPLETE',
    msg: `🔴 肩書き「挑戦する」を獲得しました！！

これは、最初の一歩を踏み出した証。
DOPADOには、よりレアなアイテムも眠っている。
次は自分のタスクでDOPAONしよう。`,
    hint: '', pos: 'top', bg: true, btn: 'チュートリアルを閉じて今すぐDOPAON！' };
  tutSetBubble(st);
  tutGlow(null);
  tutPulse(document.getElementById('tutActionBtn'));
  const bg = document.getElementById('tutBg');
  if (bg) bg.style.opacity = '0.9';
  const sk = document.getElementById('tutSkip');
  if (sk) sk.style.display = 'none';
}

/* ---------- 描画 ---------- */
function tutRender() {
  if (!tut.active) return;
  const st = tutCurrentStep();
  if (!st) return;
  if (tut.phase === 'home') {
    const bg = document.getElementById('tutBg');
    if (bg) bg.style.opacity = '0.92';
    tutSetBubble(st);
    tutGlow(null);
    return;
  }
  const hideBg = st.id === 't_chrg' || st.id === 't_bon' || st.id === 't_rwd';
  const bg = document.getElementById('tutBg');
  if (bg) bg.style.opacity = hideBg ? '0' : (st.bg ? '0.88' : '0.5');
  tutSetBubble(st);
  tutGlowForStep(st.id);
}

function showDopadoAdvice(page = 0) {
  const ov = document.getElementById('adviceOverlay');
  const body = document.getElementById('adviceBody');
  const actions = document.getElementById('adviceActions');
  const d0 = document.getElementById('adviceDot0');
  const d1 = document.getElementById('adviceDot1');
  if (!ov || !body || !actions) return;
  const p = page === 1 ? 1 : 0;
  if (d0) d0.classList.toggle('on', p === 0);
  if (d1) d1.classList.toggle('on', p === 1);
  if (p === 0) {
    body.innerHTML = `日常タスク画面では、頭の中にある少しでも<b>「やらなきゃ！」</b>とか<b>「やりたい」</b>と思っていることを、まず全部書き出そう！！

書き出したタスクから今日やる事を決めて、さらにその中から<b>2つだけ重要タグ</b>を付けると分かりやすいよ！！

タスクをもっと細かく出来る時は、サブタスクを使って分解しよう！<div class="advice-example">例：食材を買う
・じゃがいも
・にんじん
・豚肉
・カレールー</div>
他にも期限をつけたり、メモで整理して使おう！`;
    actions.innerHTML = `<button class="advice-btn primary" type="button" onclick="showDopadoAdvice(1)">次へ</button>`;
  } else {
    body.innerHTML = `習慣タスク画面では、<b>続けたいこと</b>と<b>辞めたいこと</b>を合わせて9個まで選べる！

習慣タスクは達成で<b>BONUS確定</b>。
無理なく続けられるものから選んで、少しずつDOPAONしていこう。`;
    actions.innerHTML = `<button class="advice-btn ghost" type="button" onclick="showDopadoAdvice(0)">戻る</button><button class="advice-btn primary" type="button" onclick="hideDopadoAdvice()">閉じる</button>`;
  }
  ov.classList.add('show');
}
function hideDopadoAdvice() {
  const ov = document.getElementById('adviceOverlay');
  if (ov) ov.classList.remove('show');
  showToast('チュートリアル完了！DOPAON開始！');
}

function tutSetBubble(st) {
  const bbl = document.getElementById('tutBubble');
  if (!bbl) return;
  document.getElementById('tutPart').textContent = st.part || '';
  document.getElementById('tutMsg').textContent = st.msg || '';
  document.getElementById('tutHint').textContent = st.hint || '';
  const resetBtn = document.getElementById('tutResetBtn');
  const showReset = st.id !== 't_fin';
  if (resetBtn) resetBtn.style.display = showReset ? 'block' : 'none';
  bbl.classList.toggle('has-reset', showReset);
  // カウンター
  const counter = document.getElementById('tutCounter');
  if (counter) {
    if (st.id === 't_fin') { counter.textContent = ''; }
    else {
      const phases = ['home','part1','part2','part3'];
      const lens = [TUT_HOME_STEPS.length, TUT_PART1_STEPS.length, TUT_PART2_STEPS.length, TUT_PART3_STEPS.length];
      const pIdx = phases.indexOf(tut.phase);
      const total = lens.reduce((a,b)=>a+b,0);
      let done = 0; for (let i=0;i<pIdx;i++) done += lens[i];
      done += tut.step;
      counter.textContent = (done + 1) + ' / ' + total;
    }
  }
  bbl.classList.toggle('top', st.pos === 'top');
  // ボタン処理
  let btn = document.getElementById('tutActionBtn');
  if (st.btn) {
    if (!btn) { btn = document.createElement('button'); btn.id = 'tutActionBtn'; btn.className = 'tut-btn'; bbl.appendChild(btn); }
    btn.textContent = st.btn;
    btn.onclick = () => {
      if (st.id === 't_fin') {
        _tutHideOverlay();
        showDopadoAdvice(0);
        return;
      }
      if (st.id === 'h_home_ios') localStorage.setItem('dopado_home_prompt_seen', '1');
      if (st.id === 't_failmsg' && tut.habitAvoidId) {
        // 失敗ログを静かに解除（成功長押しをできるようにする）
        if (state.habitLogs[tut.habitAvoidId]) {
          delete state.habitLogs[tut.habitAvoidId][habitTargetDate({id:tut.habitAvoidId,habitKind:'avoid'})];
        }
        flippedHabitId = null;
        saveState(); render();
      }
      btn.remove();
      tutAdvance();
    };
    bbl.classList.add('has-btn');
  } else {
    if (btn) btn.remove();
    bbl.classList.remove('has-btn');
  }
  bbl.classList.add('show');
}

function tutGlow(el) {
  document.querySelectorAll('.tut-glow').forEach(x => x.classList.remove('tut-glow'));
  document.querySelectorAll('.tut-swipe-right').forEach(x => x.classList.remove('tut-swipe-right'));
  if (el) el.classList.add('tut-glow');
}
function tutPulse(el) {
  document.querySelectorAll('.tut-pulse').forEach(x => x.classList.remove('tut-pulse'));
  if (el) el.classList.add('tut-pulse');
}
function tutIsTaskOverlayOpen(){const ov=document.getElementById('taskOverlay');return !!(ov&&ov.classList.contains('show'))}
function tutIsProfileOpen(){const ov=document.getElementById('profileOverlay');return !!(ov&&ov.classList.contains('show'))}
function tutFirstEmptyHabitTile(){return document.querySelector('.habit-tile.empty')}
function tutButtonByText(root,selector,text){
  const list=[...(root||document).querySelectorAll(selector)];
  return list.find(x=>String(x.textContent||'').includes(text))||null;
}
function tutGlowForStep(sid) {
  requestAnimationFrame(() => {
    let el = null, pulse = null;
    const taskEl = tut.taskId ? document.querySelector('[data-id="' + tut.taskId + '"]') : null;
    const doEl = tut.habitDoId ? document.querySelector('.habit-tile[data-id="' + tut.habitDoId + '"]') : null;
    const avEl = tut.habitAvoidId ? document.querySelector('.habit-tile[data-id="' + tut.habitAvoidId + '"]') : null;
    if (sid === 't_add') { el = document.getElementById('mi'); pulse = document.getElementById('db'); }
    else if (sid === 't_today' || sid === 't_imp') { el = taskEl; pulse = taskEl; if (taskEl) taskEl.classList.add('tut-swipe-right'); }
    else if (sid === 't_ext') { el = taskEl && taskEl.querySelector('.task-menu-toggle'); pulse = el; }
    else if (sid === 't_sub') { el = document.querySelector('.subtask-input') || document.querySelector('.subtask-add'); pulse = document.querySelector('.subtask-add'); }
    else if (sid === 't_mtab') { el = tutButtonByText(document,'button.task-extra-tab','メモ'); pulse = el; }
    else if (sid === 't_memo') el = document.querySelector('.task-memo');
    else if (sid === 't_cext') { el = taskEl && taskEl.querySelector('.task-menu-toggle'); pulse = el; }
    else if (sid === 't_prep' || sid === 't_done') { const b = taskEl && taskEl.querySelector('.task-btn'); el = b || taskEl; pulse = b; }
    else if (sid === 't_chrg' || sid === 't_bon') el = document.getElementById('chargeMeter');
    else if (sid === 't_prof') { el = document.querySelector('.identity'); pulse = el; }
    else if (sid === 't_name') el = document.getElementById('nameInput');
    else if (sid === 't_pcls') { el = document.querySelector('#profileOverlay .popup-close'); pulse = el; }
    else if (sid === 't_hab') { el = document.getElementById('statusBar'); pulse = document.getElementById('habitRow'); }
    else if (sid === 't_cdo' || sid === 't_cavd') {
      if (tutIsTaskOverlayOpen()) {
        el = sid === 't_cavd' ? document.getElementById('habitKindInput') : document.getElementById('taskNameInput');
        pulse = document.getElementById('taskSaveBtn');
      } else {
        el = tutFirstEmptyHabitTile();
        pulse = el;
      }
    }
    else if (sid === 't_lpdo') { el = doEl; pulse = doEl; }
    else if (sid === 't_dtap' || sid === 't_lpavd') { el = avEl; pulse = avEl; }
    else if (sid === 't_fail') { el = avEl && (avEl.querySelector('.mini-btn.fail') || avEl); pulse = el; }
    tutGlow(el);
    tutPulse(pulse);
  });
}

/* ---------- チュートリアル中の報酬制御 ----------
   Part2: 白固定チケットを専用発行（tap側で分岐）
   Part3: 練習(do習慣/失敗)では報酬を出さない。最後のavoid成功のみBONUS。
------------------------------------------------ */
// tapから呼ぶ: このタスク完了時にチュートリアル専用白チケットを使うか
function tutShouldForceWhiteTicket() {
  return tut.active && tut.phase === 'part1' && tutCurrentStep() && tutCurrentStep().id === 't_done';
}
// 習慣達成時、通常BONUSチケットを抑制すべきか
function tutShouldSuppressHabitReward(habitId) {
  // チュートリアル用習慣は常に通常BONUSを抑制
  // （t_lpavdの最終BONUSはtutHook内で専用チケット1枚のみ）
  if (!tut.active) return false;
  return tutIsTempHabit(habitId);
}

function tutClearChargeResidue() {
  // Part2報酬後にプロフィールへ移動した時、チャージ演出やチュートリアルチケットが残らないよう掃除する。
  try {
    if (Array.isArray(state.chargeTickets)) {
      state.chargeTickets = state.chargeTickets.filter(t => !tutIsTutorialTicket(t));
    }
    if (currentChargeTicket && tutIsTutorialTicket(currentChargeTicket)) currentChargeTicket = null;
    chargeBusy = false;
    chargeCanInterrupt = false;
    rewardUnlockPending = false;
    stopChargeParticles();
    resetChargeFrame();
    setChargeInteractionLocked(false);
    renderChargeMini();
    saveState();
  } catch(e) {}
}

/* ---------- フック ---------- */
function tutHook(evt, data) {
  if (!tut.active || tut.phase === 'home') return;
  const st = tutCurrentStep();
  if (!st) return;
  const sid = st.id;
  switch (evt) {
    case 'task_added':
      if (sid === 't_add') { tut.taskId = data.id; data.tutorial = true; tutAdvance(); }
      break;
    case 'priority_swiped':
      if (sid === 't_today' && data.id === tut.taskId && isTaskToday(data)) tutAdvance();
      else if (sid === 't_imp' && data.id === tut.taskId && isTaskImportant(data)) tutAdvance();
      break;
    case 'extras_open':
      if (sid === 't_ext' && data === tut.taskId) tutAdvance();
      break;
    case 'subtask_saved':
      if (sid === 't_sub') tutAdvance();
      break;
    case 'memo_tab':
      if (sid === 't_mtab') tutAdvance();
      break;
    case 'memo_input':
      if (sid === 't_memo') tutAdvance();
      break;
    case 'extras_close':
      if (sid === 't_cext') tutAdvance();
      break;
    case 'task_charging':
      if (sid === 't_prep' && data === tut.taskId) tutAdvance();
      break;
    case 'task_done':
      if (sid === 't_done' && data === tut.taskId) tutAdvance();
      break;
    case 'reward_shown':
      if (sid === 't_chrg') tutAdvance();
      else if (sid === 't_bon') { /* BONUS_CLOSE/RESULT経由でtutFinalDoneを呼ぶ */ }
      break;
    case 'reward_closed':
      if (sid === 't_rwd') tutAdvance();
      break;
    case 'profile_open':
      if (sid === 't_prof') { tutClearChargeResidue(); tutAdvance(); }
      break;
    case 'name_changed':
      if (sid === 't_name' && !tut.nameEntered) { tut.nameEntered = true; tutAdvance(); }
      break;
    case 'profile_close':
      if (sid === 't_pcls') { tutClearChargeResidue(); tutAdvance(); }
      break;
    case 'mode_habits':
      if (sid === 't_hab') tutAdvance();
      break;
    case 'habit_added':
      if (sid === 't_cdo' && data.habitKind === 'do') { tut.habitDoId = data.id; data.tutorial = true; tutAdvance(); }
      else if (sid === 't_cavd' && data.habitKind === 'avoid') { tut.habitAvoidId = data.id; data.tutorial = true; tutAdvance(); }
      break;
    case 'habit_done':
      if (sid === 't_lpdo' && data === tut.habitDoId) tutAdvance();
      else if (sid === 't_lpavd' && data === tut.habitAvoidId) {
        tutAdvance(); // → t_bon
        // 通常BONUSは抑制済み。チュートリアル専用チケット1枚だけ発火
        setTimeout(() => {
          if (tut.active && !tut.bonusFired) {
            const cur = tutCurrentStep();
            if (cur && cur.id === 't_bon') {
              tut.bonusFired = true;
              tutRender();
              setTimeout(() => {
                // tutorial専用BONUS。結果色と報酬色はBONUS側の結果に合わせる
                issueChargeTicket({ id: 'tut_bonus', name: 'TUTORIAL BONUS' }, { force: 'bonus', type: 'habit', tutorial: true });
                setTimeout(() => startNextChargeTicket(true), 120);
              }, 800);
            }
          }
        }, 400);
      }
      break;
    case 'habit_flip':
      if (sid === 't_dtap' && data === tut.habitAvoidId) tutAdvance();
      break;
    case 'habit_failed':
      if (sid === 't_fail' && data === tut.habitAvoidId) { tut.failRecorded = true; tutAdvance(); }
      break;
  }
}

/* ---------- 再実行（開発用） ---------- */
function tutReplay() {
  state.onboarded = false;
  localStorage.removeItem('dopado_tutorial_completed');
  localStorage.removeItem('dopado_home_prompt_seen');
  saveState();
  tutStart();
}

function checkOnboarding(){if(localStorage.getItem('dopado_tutorial_completed')!=='1'){tutStart();}}

if('serviceWorker' in navigator){
  navigator.serviceWorker.getRegistrations
    ? navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{})
    : navigator.serviceWorker.ready.then(r=>r.unregister()).catch(()=>{});
}

/* ===== DOPADO DIAGNOSTICS: hidden logger + menu page ===== */
(function installQuickUiDiagnostics(){
  const STORE_KEY='dopado_diagnostic_logs_v1';
  const ENABLE_KEY='dopado_diagnostic_enabled_v1';
  const MAX=600;
  let lines=[];
  let enabled=localStorage.getItem(ENABLE_KEY)!=='0';

  try{
    const saved=JSON.parse(localStorage.getItem(STORE_KEY)||'[]');
    if(Array.isArray(saved))lines=saved.slice(-MAX).map(String);
  }catch(e){lines=[]}

  function saveLogs(){
    try{localStorage.setItem(STORE_KEY,JSON.stringify(lines.slice(-MAX)))}catch(e){}
  }
  function page(){return document.getElementById('diagnosticsScreen')}
  function logList(){return document.getElementById('diagnosticsLogList')}
  function renderPage(){
    const list=logList();
    if(list){
      list.textContent=lines.length?lines.join('\n'):'ログはまだありません。';
      requestAnimationFrame(()=>{list.scrollTop=list.scrollHeight});
    }
    const toggle=document.getElementById('diagnosticsToggleBtn');
    if(toggle){
      toggle.textContent=enabled?'記録 ON':'記録 OFF';
      toggle.classList.toggle('on',enabled);
    }
    const count=document.getElementById('diagnosticsCount');
    if(count)count.textContent=lines.length+' / '+MAX;
  }
  function ensurePage(){
    let screen=page();
    if(screen)return screen;
    const style=document.createElement('style');
    style.id='diagnosticsPageStyle';
    style.textContent=`
      #diagnosticsScreen{position:fixed;inset:0;z-index:2147483000;display:none;flex-direction:column;background:#05060d;color:#e9f5ff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #diagnosticsScreen.open{display:flex}
      .diagnostics-head{padding:max(12px,env(safe-area-inset-top)) 12px 10px;display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;border-bottom:1px solid rgba(255,255,255,.09);background:#070812}
      .diagnostics-back{width:40px;height:40px;border:0;background:transparent;color:#c9d8ef;font-size:29px;line-height:1;border-radius:9px}
      .diagnostics-title{font-family:"Orbitron",monospace;font-size:13px;letter-spacing:1.2px;color:#43f5c2}.diagnostics-sub{display:block;margin-top:3px;font-size:10px;letter-spacing:.2px;color:#71819b;font-family:inherit}
      .diagnostics-count{font:10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;color:#71819b;white-space:nowrap}
      .diagnostics-controls{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.07);background:#080a13}
      .diagnostics-controls button{height:38px;border:1px solid rgba(255,255,255,.12);border-radius:9px;background:rgba(255,255,255,.035);color:#aebdd3;font-weight:900;font-size:12px}
      .diagnostics-controls button.on{color:#43f5c2;border-color:rgba(67,245,194,.42);background:rgba(67,245,194,.07)}
      #diagnosticsLogList{flex:1;overflow:auto;-webkit-overflow-scrolling:touch;margin:0;padding:14px 12px calc(22px + env(safe-area-inset-bottom));white-space:pre-wrap;word-break:break-word;font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace;color:#bfffea;background:radial-gradient(circle at 50% 0%,rgba(67,245,194,.045),transparent 42%),#05060d;user-select:text;-webkit-user-select:text}
      .diagnostics-toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483001;padding:9px 13px;border-radius:999px;background:rgba(12,16,27,.96);border:1px solid rgba(67,245,194,.35);color:#dffff7;font-size:12px;opacity:0;pointer-events:none;transition:opacity .16s}.diagnostics-toast.show{opacity:1}
    `;
    document.head.appendChild(style);
    screen=document.createElement('section');
    screen.id='diagnosticsScreen';
    screen.setAttribute('aria-label','診断');
    screen.innerHTML=`
      <div class="diagnostics-head">
        <button type="button" class="diagnostics-back" onclick="closeDiagnosticsPage()" aria-label="戻る">‹</button>
        <div class="diagnostics-title">DIAGNOSTICS<span class="diagnostics-sub">スマホ実機ログ</span></div>
        <div class="diagnostics-count" id="diagnosticsCount"></div>
      </div>
      <div class="diagnostics-controls">
        <button type="button" id="diagnosticsToggleBtn" onclick="toggleDiagnosticsRecording()">記録 ON</button>
        <button type="button" onclick="copyDiagnosticsLogs()">コピー</button>
        <button type="button" onclick="clearDiagnosticsLogs()">全消去</button>
      </div>
      <pre id="diagnosticsLogList"></pre>
      <div class="diagnostics-toast" id="diagnosticsToast"></div>`;
    document.body.appendChild(screen);
    renderPage();
    return screen;
  }
  function toast(msg){
    ensurePage();
    const el=document.getElementById('diagnosticsToast');
    if(!el)return;
    el.textContent=msg;el.classList.add('show');
    clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),1300);
  }

  window.quickDiag=function(msg){
    if(!enabled)return;
    try{
      const t=((performance.now()/1000).toFixed(2)).padStart(7,' ');
      lines.push(t+' '+String(msg));
      if(lines.length>MAX)lines=lines.slice(-MAX);
      saveLogs();
      if(page()?.classList.contains('open'))renderPage();
    }catch(e){}
  };
  window.openDiagnosticsPage=function(){ensurePage().classList.add('open');renderPage()};
  window.closeDiagnosticsPage=function(){page()?.classList.remove('open')};
  window.toggleDiagnosticsRecording=function(){
    enabled=!enabled;
    try{localStorage.setItem(ENABLE_KEY,enabled?'1':'0')}catch(e){}
    if(enabled)window.quickDiag('DIAGNOSTIC RECORDING ON');
    renderPage();
  };
  window.clearDiagnosticsLogs=function(){lines=[];saveLogs();renderPage();toast('ログを消去しました')};
  window.copyDiagnosticsLogs=async function(){
    const text=lines.join('\n');
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text)}
      else{
        const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
      }
      toast('ログをコピーしました');
    }catch(e){toast('コピーできませんでした')}
  };

  function describeTarget(t){
    if(!t)return 'unknown';
    let cls='';
    try{cls=typeof t.className==='string'?t.className:(t.getAttribute&&t.getAttribute('class'))||''}catch(e){}
    const type=t.tagName==='INPUT'&&t.type?'[type='+t.type+']':'';
    return (t.tagName?String(t.tagName).toLowerCase():'')+'#'+(t.id||'')+(cls?'.'+String(cls).trim().replace(/\s+/g,'.'):'')+type;
  }
  function focusState(label){
    const ae=document.activeElement;
    const vv=window.visualViewport;
    quickDiag(label+' active='+describeTarget(ae)+' bodyKB='+document.body.classList.contains('keyboard-open')+' sfKB='+!!document.getElementById('sf8')?.classList.contains('keyboard-open')+' vv='+(vv?Math.round(vv.height)+'@'+Math.round(vv.offsetTop):'none'));
  }
  window.__dopadoLastFocusRequest={at:0,target:'',stack:''};
  try{
    const nativeFocus=HTMLElement.prototype.focus;
    if(!nativeFocus.__dopadoFocusWrapped){
      const wrapped=function(){
        const isMi=this&&this.id==='mi';
        const isDate=this&&this.tagName==='INPUT'&&this.type==='date';
        if(isMi||isDate){
          let stack='';
          try{stack=(new Error()).stack||''}catch(e){}
          stack=String(stack).split('\n').slice(2,6).join(' <- ').replace(/\s+/g,' ');
          window.__dopadoLastFocusRequest={at:Date.now(),target:describeTarget(this),stack};
          quickDiag('FOCUS REQUEST '+describeTarget(this)+(stack?' stack='+stack:''));
        }
        return nativeFocus.apply(this,arguments);
      };
      wrapped.__dopadoFocusWrapped=true;
      HTMLElement.prototype.focus=wrapped;
    }
  }catch(e){quickDiag('FOCUS PATCH ERROR '+String(e&&e.message||e))}
  let activeWatchTimer=0;
  function watchActiveElement(label,duration=2600){
    clearInterval(activeWatchTimer);
    const started=Date.now();let last='';
    quickDiag('ACTIVE WATCH START '+label);
    activeWatchTimer=setInterval(()=>{
      const ae=document.activeElement;
      const vv=window.visualViewport;
      const current=describeTarget(ae)+'|bodyKB='+document.body.classList.contains('keyboard-open')+'|sfKB='+!!document.getElementById('sf8')?.classList.contains('keyboard-open')+'|vv='+(vv?Math.round(vv.height):'none');
      if(current!==last){quickDiag('ACTIVE WATCH '+label+' '+current);last=current}
      if(Date.now()-started>=duration){clearInterval(activeWatchTimer);activeWatchTimer=0;quickDiag('ACTIVE WATCH END '+label)}
    },100);
  }
  window.__dopadoWatchActiveElement=watchActiveElement;
  const diagObserver=new MutationObserver(records=>{
    records.forEach(r=>{
      if(r.type==='attributes'&&r.attributeName==='class'&&(r.target===document.body||r.target.id==='sf8')){
        quickDiag('CLASS CHANGE '+describeTarget(r.target)+' class="'+r.target.className+'"');
      }
      if(r.type==='childList'){
        r.addedNodes.forEach(n=>{
          if(n.nodeType!==1)return;
          const dates=[];
          if(n.matches&&n.matches('input[type=date]'))dates.push(n);
          if(n.querySelectorAll)dates.push(...n.querySelectorAll('input[type=date]'));
          dates.forEach(el=>quickDiag('DATE CREATE '+describeTarget(el)+' value='+String(el.value||'')));
        });
        r.removedNodes.forEach(n=>{
          if(n.nodeType!==1)return;
          const dates=[];
          if(n.matches&&n.matches('input[type=date]'))dates.push(n);
          if(n.querySelectorAll)dates.push(...n.querySelectorAll('input[type=date]'));
          dates.forEach(el=>quickDiag('DATE REMOVE '+describeTarget(el)+' value='+String(el.value||'')));
        });
      }
    });
  });
  try{diagObserver.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}catch(e){quickDiag('OBSERVER ERROR '+String(e&&e.message||e))}
  ['focusin','focusout','input','change'].forEach(type=>{
    document.addEventListener(type,e=>{
      const t=e.target;
      if(!(t&&t.tagName==='INPUT'&&t.type==='date'))return;
      quickDiag('DATE '+type.toUpperCase()+' '+describeTarget(t)+' value='+String(t.value||''));
      if(type==='change'||type==='input')watchActiveElement('date-'+type,3200);
    },true);
  });
  window.addEventListener('error',e=>quickDiag('ERROR '+(e.message||'unknown')+' @'+(e.lineno||'?')));
  window.addEventListener('unhandledrejection',e=>quickDiag('REJECTION '+String(e.reason&&e.reason.message||e.reason||'unknown')));
  ['pointerdown','touchstart','touchend','click'].forEach(type=>{
    document.addEventListener(type,e=>{
      const t=e.target&&e.target.closest&&e.target.closest('#quickDueBtn,#quickTagBtn,#quickMemoBtn,#quickCondBtn,#quickTodayBtn,#quickImportantBtn,#quickPickerPanel button,#quickPickerPanel input');
      if(t)quickDiag(type.toUpperCase()+' '+describeTarget(t)+' prevented='+e.defaultPrevented);
    },true);
  });
  document.addEventListener('focusin',e=>{
    const t=e.target;
    if(t&&t.closest&&t.closest('#mi,#quickAddBar,#quickPickerPanel,#taskSettingsScreen')){
      const req=window.__dopadoLastFocusRequest||{};
      const age=Date.now()-(req.at||0);
      const origin=age>=0&&age<250?'programmatic '+String(req.target||''):'NO JS FOCUS REQUEST';
      quickDiag('FOCUSIN '+describeTarget(t)+' origin='+origin+' age='+age+'ms');
      if(t.id==='mi'&&origin==='NO JS FOCUS REQUEST')quickDiag('AUTO REFOCUS DETECTED #mi');
      focusState('FOCUSIN STATE');
    }
  },true);
  document.addEventListener('focusout',e=>{
    const t=e.target;
    if(t&&t.closest&&t.closest('#mi,#quickAddBar,#quickPickerPanel,#taskSettingsScreen'))quickDiag('FOCUSOUT '+describeTarget(t));
  },true);

  function wrap(name,before,after){
    const orig=window[name];
    if(typeof orig!=='function'){quickDiag('WRAP MISS '+name);return}
    window[name]=function(){
      try{before&&before.apply(this,arguments)}catch(e){}
      const result=orig.apply(this,arguments);
      try{after&&after.apply(this,arguments)}catch(e){}
      return result;
    };
  }
  wrap('initQuickAddBarEvents',()=>quickDiag('INIT EVENTS begin'),()=>quickDiag('INIT EVENTS done'));
  wrap('onInputBlur',()=>quickDiag('INPUT BLUR handler'));
  wrap('scheduleQuickBlurSettle',d=>quickDiag('BLUR TIMER schedule '+d+'ms'));
  wrap('quickTogglePicker',mode=>quickDiag('TOGGLE '+mode),()=>{
    requestAnimationFrame(()=>{
      const p=document.getElementById('quickPickerPanel');
      if(!p){quickDiag('PANEL missing');return}
      const cs=getComputedStyle(p),r=p.getBoundingClientRect();
      quickDiag('PANEL mode='+String(window.quickPickerMode)+' open='+p.classList.contains('open')+' children='+p.children.length+' display='+cs.display+' vis='+cs.visibility+' op='+cs.opacity+' rect='+Math.round(r.width)+'x'+Math.round(r.height));
    });
  });
  wrap('renderQuickPicker',()=>quickDiag('RENDER PICKER mode='+String(window.quickPickerMode)),()=>quickDiag('RENDER PICKER done'));
  wrap('quickClosePicker',reason=>quickDiag('QUICK CLOSE request '+String(reason||'unspecified')));
  wrap('quickOpenSettings',panel=>quickDiag('QUICK SETTINGS '+panel));
  wrap('openTaskSettings',(id,panel)=>quickDiag('OPEN SETTINGS panel='+panel+' id='+id),()=>{
    requestAnimationFrame(()=>{
      const sc=document.getElementById('taskSettingsScreen');
      if(!sc){quickDiag('SETTINGS missing');return}
      const cs=getComputedStyle(sc),r=sc.getBoundingClientRect();
      quickDiag('SETTINGS open='+sc.classList.contains('open')+' display='+cs.display+' vis='+cs.visibility+' op='+cs.opacity+' z='+cs.zIndex+' rect='+Math.round(r.width)+'x'+Math.round(r.height));
    });
  });
  wrap('quickSetDue',v=>quickDiag('SET DUE '+v));
  wrap('quickSetHold',v=>quickDiag('SET HOLD '+v));
  wrap('quickToggleTag',id=>quickDiag('TOGGLE TAG '+id));
  wrap('finishQuickDateSelection',kind=>{quickDiag('FINISH DATE ENTER '+kind);focusState('FINISH DATE BEFORE')},kind=>{focusState('FINISH DATE AFTER');watchActiveElement('finish-'+String(kind||'date'),4200)});
  wrap('onInputFocus',()=>{quickDiag('ON INPUT FOCUS ENTER');focusState('ON INPUT FOCUS BEFORE')},()=>focusState('ON INPUT FOCUS AFTER'));
  quickDiag('DIAG INSTALLED focus-trace');
})();


/* ===== v49.11 layout-trace diagnostic ===== */
(function(){
  const diag=window.quickDiag||function(){};
  const ids=['quickAddBar','quickPickerPanel','inputBar','bottomDock','sf8'];
  let layoutTimer=0;
  let layoutObserver=null;

  function num(v){return Number.isFinite(v)?Math.round(v):0}
  function elemState(id){
    const el=document.getElementById(id);
    if(!el)return id+'=MISSING';
    const cs=getComputedStyle(el);
    const r=el.getBoundingClientRect();
    const inline=el.getAttribute('style')||'';
    return id+
      '{class="'+String(el.className||'')+'"'+
      ',inline="'+inline.replace(/\s+/g,' ').slice(0,180)+'"'+
      ',display='+cs.display+
      ',visibility='+cs.visibility+
      ',position='+cs.position+
      ',bottom='+cs.bottom+
      ',transform='+cs.transform+
      ',height='+cs.height+
      ',pointer='+cs.pointerEvents+
      ',z='+cs.zIndex+
      ',rect='+num(r.left)+','+num(r.top)+','+num(r.width)+'x'+num(r.height)+'}';
  }
  function rootVars(){
    const rs=getComputedStyle(document.documentElement);
    const vv=window.visualViewport;
    return 'ROOT{--kb='+rs.getPropertyValue('--kb').trim()+
      ',--app-h='+rs.getPropertyValue('--app-h').trim()+
      ',vv='+(vv?num(vv.height)+'@'+num(vv.offsetTop):'none')+
      ',bodyClass="'+document.body.className+'"}';
  }
  function snapshot(label){
    diag('LAYOUT SNAP '+label+' '+rootVars());
    ids.forEach(id=>diag('LAYOUT '+label+' '+elemState(id)));
  }
  function startLayoutWatch(label,duration=5200){
    clearInterval(layoutTimer);
    if(layoutObserver){try{layoutObserver.disconnect()}catch(e){} layoutObserver=null}
    const started=Date.now();
    const last=new Map();
    diag('LAYOUT WATCH START '+label);
    snapshot(label+'-start');
    layoutObserver=new MutationObserver(records=>{
      records.forEach(r=>{
        const t=r.target;
        if(!(t&&t.id&&ids.includes(t.id)))return;
        diag('LAYOUT MUTATION '+label+' '+t.id+' attr='+r.attributeName+' '+elemState(t.id));
      });
    });
    ids.forEach(id=>{
      const el=document.getElementById(id);
      if(el)layoutObserver.observe(el,{attributes:true,attributeFilter:['class','style']});
    });
    layoutTimer=setInterval(()=>{
      const states=[rootVars(),...ids.map(elemState)];
      states.forEach((state,i)=>{
        const key=i===0?'root':ids[i-1];
        if(last.get(key)!==state){diag('LAYOUT CHANGE '+label+' '+state);last.set(key,state)}
      });
      if(Date.now()-started>=duration){
        clearInterval(layoutTimer);layoutTimer=0;
        if(layoutObserver){layoutObserver.disconnect();layoutObserver=null}
        snapshot(label+'-end');
        diag('LAYOUT WATCH END '+label);
      }
    },100);
  }
  window.__dopadoStartLayoutWatch=startLayoutWatch;
  const originalFinish=window.finishQuickDateSelection;
  if(typeof originalFinish==='function'){
    window.finishQuickDateSelection=function(kind){
      const result=originalFinish.apply(this,arguments);
      setTimeout(()=>startLayoutWatch('finish-'+String(kind||'date'),5200),0);
      return result;
    };
  }else diag('LAYOUT WRAP MISS finishQuickDateSelection');
  diag('DIAG INSTALLED layout-trace');
})();

oneTimeDataResetForTutorial();
loadState();cleanStaleTutorialData();initBaseViewport(true);syncViewport();renderHeader();render();renderChargeMini();resetPraiseInput();renderInputPrompt(true);scheduleInputPromptRotation();initQuickAddBarEvents();
checkOnboarding();setTimeout(checkMorningSkima,500);



/* ===== v27.2 GAME bridge: iframe -> DOPADO state ===== */
window.addEventListener('message',function(ev){
  const msg=ev&&ev.data;
  if(!msg||typeof msg!=='object'||!String(msg.type||'').startsWith('DOPADO_GAME_'))return;
  const g=ensureGameState();
  g.infinite=true;
  if(!Array.isArray(g.items))g.items=[];
  if(msg.type==='DOPADO_GAME_PROGRESS'){
    g.gCount=Math.max(0,Number(msg.gCount)||0);
    g.clearedG=Number.isFinite(Number(msg.clearedG))?Number(msg.clearedG):-1;
    g.hintLevel=Math.max(0,Number(msg.hint)||0);
    g.timePhase=String(msg.zone||g.timePhase||'day');
    saveState();
    return;
  }
  if(msg.type==='DOPADO_GAME_REWARD'){
    const r=msg.reward||{};
    const coins=Math.max(0,Number(r.coins)||0);
    const xp=Math.max(0,Number(r.xp)||0);
    const item=String(r.item||'').trim();
    g.coins=Math.max(0,Number(g.coins)||0)+coins;
    state.xp=Math.max(0,Number(state.xp)||0)+xp;
    if(item)g.items.push({name:item,at:Date.now()});
    g.gCount=0;
    g.clearedG=-1;
    g.lastLog='WIN。COIN +'+coins+' / EXP +'+xp+(item?' / '+item:'');
    saveState();
    renderHeader();
    return;
  }
});


/* ===== v49.29 AI SKILL OVERRIDES ===== */
const AI_BUILTIN_SKILLS=[
 {id:'organize',name:'整理する',description:'実行しやすい状態へ整えます。今日・保留・スキマ・重要・要分解を必要に応じて見直します。',outputMode:'operations',builtin:true,promptTemplate:'タスクを実行しやすくすることを最優先に、全体を整理してください。今日に詰め込みすぎず、今やらないものは保留またはスキマへ移し、大きすぎるものは要分解にしてください。'},
 {id:'today',name:'今日決める',description:'今日やる量を現実的に絞り、着手順が分かる状態にします。',outputMode:'operations',builtin:true,promptTemplate:'今日実行するタスクを現実的な量に絞ってください。優先度・期限・負担を考慮し、今日やるものはset_today、今日でなくてよいものはhold_tomorrow・hold_until・set_skimaを使ってください。'},
 {id:'shrink',name:'小さくする',description:'止まっている大きなタスクを、次に動ける粒度へ落とします。',outputMode:'operations',builtin:true,promptTemplate:'大きすぎる・曖昧・着手しづらいタスクを見つけてください。元タスクにはset_breakdown=trueを付け、必要に応じてcreateで具体的な最初の一歩を追加してください。勝手な大量追加は避けてください。'},
 {id:'reduce',name:'減らす',description:'不要・重複・今抱えなくてよいタスクを減らします。削除は復元可能なゴミ箱へ移動します。',outputMode:'operations',builtin:true,promptTemplate:'タスク数を減らして実行しやすくしてください。明らかな不要・重複はdelete、今でないものはhold_until・hold_tomorrow・set_skimaを使ってください。不確かなものは削除しないでください。'},
 {id:'consult',name:'相談する',description:'変更は行わず、今どう動くとよいかを文章で相談します。',outputMode:'text',builtin:true,promptTemplate:'タスクは変更せず、ユーザーが次に動きやすくなる短い助言を日本語で返してください。優先順位を最大3つまで示し、責めずに具体的な最初の一歩を提案してください。'}
];
function ensureAiOrganizerState(){
  if(!state.aiOrganizer||typeof state.aiOrganizer!=='object')state.aiOrganizer={history:[],trash:[],lastExportIds:[],customSkills:[],selectedSkillId:'organize'};
  const a=state.aiOrganizer;
  if(!Array.isArray(a.history))a.history=[];if(!Array.isArray(a.trash))a.trash=[];if(!Array.isArray(a.lastExportIds))a.lastExportIds=[];if(!Array.isArray(a.customSkills))a.customSkills=[];if(!a.selectedSkillId)a.selectedSkillId='organize';return a;
}
function aiAllSkills(){const a=ensureAiOrganizerState();return AI_BUILTIN_SKILLS.concat(a.customSkills.filter(x=>x&&x.id&&x.name&&x.promptTemplate));}
function aiCurrentSkill(){const a=ensureAiOrganizerState(),sel=document.getElementById('aiSkillSelect');const id=(sel&&sel.value)||a.selectedSkillId||'organize';return aiAllSkills().find(x=>x.id===id)||AI_BUILTIN_SKILLS[0];}
function renderAiSkillControls(){
 const sel=document.getElementById('aiSkillSelect');if(!sel)return;const a=ensureAiOrganizerState(),skills=aiAllSkills(),old=sel.value||a.selectedSkillId||'organize';sel.innerHTML=skills.map(x=>'<option value="'+escapeHtml(x.id)+'">'+escapeHtml(x.name)+(x.builtin?'':' · CUSTOM')+'</option>').join('');sel.value=skills.some(x=>x.id===old)?old:'organize';a.selectedSkillId=sel.value;const d=document.getElementById('aiSkillDescription'),sk=aiCurrentSkill();if(d)d.textContent=sk.description||'';renderAiCustomSkillList();prepareAiExportPrompt();
}
function onAiSkillChanged(){const a=ensureAiOrganizerState(),sel=document.getElementById('aiSkillSelect');if(sel)a.selectedSkillId=sel.value;saveNow();const d=document.getElementById('aiSkillDescription'),sk=aiCurrentSkill();if(d)d.textContent=sk.description||'';prepareAiExportPrompt();}
function openAiOrganizer(tab='export'){ensureAiOrganizerState();const o=document.getElementById('aiOrganizerOverlay');if(!o)return;o.classList.add('open');o.setAttribute('aria-hidden','false');setAiOrganizerTab(tab);if(tab==='export')setTimeout(renderAiSkillControls,0)}
function setAiOrganizerTab(tab){aiOrganizerTab=tab;document.querySelectorAll('[data-ai-tab]').forEach(x=>x.classList.toggle('on',x.dataset.aiTab===tab));document.querySelectorAll('[data-ai-panel]').forEach(x=>x.classList.toggle('on',x.dataset.aiPanel===tab));if(tab==='history')renderAiHistory();if(tab==='export')setTimeout(renderAiSkillControls,0)}
function aiExportTasks(scope){scope=scope||document.getElementById('aiSkillScope')?.value||'visible';if(scope==='selected')return managerSelectedTasks();if(scope==='today')return state.tasks.filter(t=>t.state!=='done'&&isTaskToday(t));if(scope==='unfinished')return state.tasks.filter(t=>t.state!=='done');if(scope==='all')return state.tasks.slice();return managerCurrentVisibleTasks();}
function aiOperationsSchema(){return `【返却形式】
{"operations":[
 {"taskId":"既存ID","action":"set_today","reason":"理由"},
 {"taskId":"既存ID","action":"hold_tomorrow","reason":"理由"},
 {"taskId":"既存ID","action":"hold_until","value":"YYYY-MM-DD","reason":"理由"},
 {"taskId":"既存ID","action":"set_skima","reason":"理由"},
 {"taskId":"既存ID","action":"set_important","value":true,"reason":"理由"},
 {"taskId":"既存ID","action":"rename","value":"新タイトル","reason":"理由"},
 {"taskId":"既存ID","action":"set_memo","value":"メモ","reason":"理由"},
 {"taskId":"既存ID","action":"set_breakdown","value":true,"reason":"理由"},
 {"taskId":"既存ID","action":"complete","reason":"理由"},
 {"taskId":"既存ID","action":"reopen","reason":"理由"},
 {"taskId":"既存ID","action":"delete","reason":"理由"},
 {"action":"create","title":"新規タスク","memo":"任意","destination":"today|inbox|skima","reason":"理由"}
]}`;}
function aiOrganizerPrompt(tasks){
 const skill=aiCurrentSkill(),extra=(document.getElementById('aiSkillExtra')?.value||'').trim(),scopeLabel=document.getElementById('aiSkillScope')?.selectedOptions?.[0]?.textContent||'選択範囲',payload=tasks.map(aiTaskPayload);
 const common=`あなたはDOPADOの行動支援アシスタントです。目的は、ユーザーがタスクを実行しやすくなることです。

【今回の範囲】
${scopeLabel}

【今回の操作】
${skill.name}
${skill.promptTemplate}`+(extra?`

【追加指示】
${extra}`:'');
 if(skill.outputMode==='text')return common+`

【返答ルール】
- 日本語で短く、具体的に答える。
- タスクを変更するJSONは返さない。
- 最初の一歩を明確にする。

【タスクデータ】
${JSON.stringify(payload,null,2)}`;
 return common+`

【絶対ルール】
- 元の全タスク一覧を書き直さず、必要な変更だけoperationsで返す。
- JSON以外の文章やMarkdownコードフェンスは付けない。
- 変更不要なタスクは省略する。
- 既存タスクの変更には必ず下記のtaskIdを使う。
- 削除は可能だが、DOPADO側では復元可能なゴミ箱へ移動する。
- 完全削除はできない。
- 不確かな変更は無理に行わない。
- 同じtaskIdに矛盾する命令を出さない。

${aiOperationsSchema()}

【タスクデータ】
${JSON.stringify(payload,null,2)}`;
}
function prepareAiExportPrompt(){const scope=document.getElementById('aiSkillScope')?.value||'visible',tasks=aiExportTasks(scope);if(!tasks.length){const tx=document.getElementById('aiExportText');if(tx)tx.value='';return{tasks:[],prompt:''}}const prompt=aiOrganizerPrompt(tasks);aiLastExportPrompt=prompt;const tx=document.getElementById('aiExportText');if(tx)tx.value=prompt;return{tasks,prompt}}
function toggleAiSkillMaker(){document.getElementById('aiSkillMaker')?.classList.toggle('open');renderAiCustomSkillList()}
function aiSkillMakerPrompt(idea){return `あなたはDOPADO用AI操作の設計者です。ユーザーの要望から、再利用可能なAI操作を1つ作ってください。

【ユーザーの要望】
${idea}

【DOPADOの目的】
タスクを実行しやすくすること。操作は対象タスクに対して使われ、必要なら差分JSONでDOPADOへ戻されます。

【返却ルール】
- JSONだけ返す。Markdown禁止。
- 次の形式に厳密に従う。
{"name":"短い操作名","description":"ユーザー向けの短い説明","promptTemplate":"AIへ渡す具体的な指示文","outputMode":"operations"}
- outputModeは、タスク変更を返すならoperations、助言だけならtext。
- promptTemplateには対象範囲やタスクデータそのものを書かない。DOPADOが後から追加する。
- 危険な完全削除や、確認不能な一括変更を指示しない。`;}
async function copyAiSkillMakerPrompt(){const idea=(document.getElementById('aiSkillIdea')?.value||'').trim(),st=document.getElementById('aiSkillMakerStatus');if(!idea){st.className='ai-org-status error';st.textContent='作りたい操作を先に書いてください。';return}const ok=await copyTextSafe(aiSkillMakerPrompt(idea));st.className='ai-org-status '+(ok?'ok':'error');st.textContent=ok?'操作を作るプロンプトをコピーしました。外部AIへ貼ってください。':'コピーできませんでした。';}
function saveAiCustomSkill(){const st=document.getElementById('aiSkillMakerStatus');try{const raw=aiParseJson(document.getElementById('aiSkillJson')?.value||''),name=String(raw.name||'').trim(),description=String(raw.description||'').trim(),promptTemplate=String(raw.promptTemplate||'').trim(),outputMode=raw.outputMode==='text'?'text':'operations';if(!name||!promptTemplate)throw new Error('nameとpromptTemplateが必要です');const a=ensureAiOrganizerState(),skill={id:'custom_'+newId(),name:name.slice(0,30),description:description.slice(0,160),promptTemplate:promptTemplate.slice(0,3000),outputMode,builtin:false,createdAt:Date.now(),updatedAt:Date.now()};a.customSkills.push(skill);a.selectedSkillId=skill.id;saveNow();renderAiSkillControls();document.getElementById('aiSkillSelect').value=skill.id;onAiSkillChanged();st.className='ai-org-status ok';st.textContent='「'+skill.name+'」を保存しました。';document.getElementById('aiSkillJson').value='';}catch(e){st.className='ai-org-status error';st.textContent='保存できません: '+e.message}}
function renderAiCustomSkillList(){const box=document.getElementById('aiCustomSkillList');if(!box)return;const list=ensureAiOrganizerState().customSkills;if(!list.length){box.innerHTML='<div class="ai-empty">保存したカスタム操作はまだありません。</div>';return}box.innerHTML=list.map(x=>'<div class="ai-custom-skill-row"><div><b>'+escapeHtml(x.name)+'</b><small>'+escapeHtml(x.description||'カスタム操作')+'</small></div><button type="button" data-skill-delete="'+escapeHtml(x.id)+'">削除</button></div>').join('');box.querySelectorAll('[data-skill-delete]').forEach(b=>b.onclick=()=>deleteAiCustomSkill(b.dataset.skillDelete))}
function deleteAiCustomSkill(id){openAppConfirm({title:'カスタム操作を削除する？',message:'保存した操作だけを削除します。タスクには影響しません。',okText:'削除',danger:true,onOk:()=>{const a=ensureAiOrganizerState();a.customSkills=a.customSkills.filter(x=>x.id!==id);if(a.selectedSkillId===id)a.selectedSkillId='organize';saveNow();renderAiSkillControls()}})}
function clearAiSkillMaker(){['aiSkillIdea','aiSkillJson'].forEach(id=>{const el=document.getElementById(id);if(el)el.value=''});const st=document.getElementById('aiSkillMakerStatus');if(st){st.className='ai-org-status';st.textContent=''}}

/* ===== v49.30 AI ORGANIZER UX OVERRIDES ===== */
function updateAiRequestSummary(tasks){
 const box=document.getElementById('aiRequestSummary');if(!box)return;
 const scope=document.getElementById('aiSkillScope'),skill=aiCurrentSkill();
 const scopeLabel=scope?.selectedOptions?.[0]?.textContent||'選択範囲';
 const n=Array.isArray(tasks)?tasks.length:0;
 box.innerHTML='<b>'+escapeHtml(scopeLabel)+'</b>の'+n+'件に対して、<b>'+escapeHtml(skill.name)+'</b>を依頼します。';
}
const _v4930PrepareAiExportPrompt=prepareAiExportPrompt;
prepareAiExportPrompt=function(){
 const result=_v4930PrepareAiExportPrompt();updateAiRequestSummary(result.tasks);
 const resultBox=document.getElementById('aiCopyResult');if(resultBox)resultBox.classList.remove('open','error');
 return result;
};
function toggleAiExportPreview(forceOpen){
 const p=document.getElementById('aiExportPreview');if(!p)return;
 const willOpen=forceOpen===true?true:!p.classList.contains('open');
 p.classList.toggle('open',willOpen);
 if(willOpen){prepareAiExportPrompt();setTimeout(()=>p.scrollIntoView({behavior:'smooth',block:'nearest'}),40)}
}
async function copyAiOrganizerPrompt(){
 const st=document.getElementById('aiExportStatus'),result=document.getElementById('aiCopyResult'),text=document.getElementById('aiCopyResultText'),p=prepareAiExportPrompt();
 if(!p.tasks.length){if(st){st.className='ai-org-status error';st.textContent='対象タスクがありません。'}return}
 const a=ensureAiOrganizerState();a.lastExportIds=p.tasks.map(t=>t.id);saveNow();
 const ok=await copyTextSafe(p.prompt);
 if(st){st.className='ai-org-status';st.textContent=''}
 if(result&&text){result.classList.add('open');result.classList.toggle('error',!ok);text.textContent=ok?'✓ '+p.tasks.length+'件分のプロンプトをコピーしました。':'自動コピーできませんでした。全文を開いて手動でコピーしてください。'}
 if(!ok){toggleAiExportPreview(true)}else{document.getElementById('aiExportPreview')?.classList.remove('open')}
}

/* ===== v49.31 AI ORGANIZER TRUE VIEWPORT FIX ===== */
function syncAiOrganizerViewport(){
  const o=document.getElementById('aiOrganizerOverlay');
  if(!o)return;
  const vv=window.visualViewport;
  const h=Math.max(320,Math.round(vv?vv.height:window.innerHeight));
  const top=Math.max(0,Math.round(vv?vv.offsetTop:0));
  o.style.setProperty('--ai-vh',h+'px');
  o.style.setProperty('--ai-vtop',top+'px');
}
const _v4931OpenAiOrganizer=openAiOrganizer;
openAiOrganizer=function(tab='export'){
  const o=document.getElementById('aiOrganizerOverlay');
  if(o&&o.parentElement!==document.body)document.body.appendChild(o);
  syncAiOrganizerViewport();
  _v4931OpenAiOrganizer(tab);
  requestAnimationFrame(syncAiOrganizerViewport);
  setTimeout(syncAiOrganizerViewport,80);
};
const _v4931CloseAiOrganizer=closeAiOrganizer;
closeAiOrganizer=function(){_v4931CloseAiOrganizer();};
window.addEventListener('resize',syncAiOrganizerViewport,{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(syncAiOrganizerViewport,120),{passive:true});
if(window.visualViewport){
  visualViewport.addEventListener('resize',syncAiOrganizerViewport,{passive:true});
  visualViewport.addEventListener('scroll',syncAiOrganizerViewport,{passive:true});
}


/* ===== v49.32 AI ORGANIZER SAFETY SESSION FIX ===== */
function aiStableTaskHash(t){
  const data={
    id:t&&t.id||'',
    title:t&&t.name||'',
    memo:(t&&t.extras&&t.extras.memo)||'',
    state:t&&t.state||'',
    today:!!(t&&isTaskToday(t)),
    important:!!(t&&isTaskImportant(t)),
    dueDate:t&&t.dueDate||'',
    dueTime:t&&t.dueTime||'',
    holdKind:t&&t.organizeHoldKind||'',
    holdUntil:t&&t.organizeHoldUntil||'',
    breakdown:!!(t&&managerNeedsBreakdown(t)),
    tags:aiTaskTagNames(t||{}).slice().sort()
  };
  return JSON.stringify(data);
}
function aiExportSignature(tasks){
  const scope=document.getElementById('aiSkillScope')?.value||'visible';
  const skill=aiCurrentSkill();
  const extra=(document.getElementById('aiSkillExtra')?.value||'').trim();
  return JSON.stringify({scope,skillId:skill.id,extra,ids:(tasks||[]).map(t=>t.id),hashes:(tasks||[]).map(aiStableTaskHash)});
}
const _v4932EnsureAiOrganizerState=ensureAiOrganizerState;
ensureAiOrganizerState=function(){
  const a=_v4932EnsureAiOrganizerState();
  if(!Array.isArray(a.exportSessions))a.exportSessions=[];
  if(!a.lastExportSessionId)a.lastExportSessionId='';
  if(!a.draftExport||typeof a.draftExport!=='object')a.draftExport=null;
  if(!Array.isArray(a.restoreSnapshots))a.restoreSnapshots=[];
  return a;
};
function aiEnsureDraftExportSession(tasks){
  const a=ensureAiOrganizerState(),sig=aiExportSignature(tasks||[]),skill=aiCurrentSkill();
  if(!a.draftExport||a.draftExport.signature!==sig){
    const id='ai_'+newId();
    const taskHashes={};
    (tasks||[]).forEach(t=>{taskHashes[t.id]=aiStableTaskHash(t)});
    a.draftExport={
      id,
      signature:sig,
      createdAt:Date.now(),
      scope:document.getElementById('aiSkillScope')?.value||'visible',
      scopeLabel:document.getElementById('aiSkillScope')?.selectedOptions?.[0]?.textContent||'選択範囲',
      skillId:skill.id,
      skillName:skill.name,
      taskIds:(tasks||[]).map(t=>t.id),
      taskHashes
    };
  }
  return a.draftExport;
}
function aiCommitExportSession(tasks,prompt){
  const a=ensureAiOrganizerState(),session=aiEnsureDraftExportSession(tasks||[]);
  session.copiedAt=Date.now();
  session.promptLength=String(prompt||'').length;
  a.lastExportIds=session.taskIds.slice();
  a.lastExportSessionId=session.id;
  a.exportSessions=[session].concat((a.exportSessions||[]).filter(x=>x&&x.id!==session.id)).slice(0,12);
  return session;
}
function aiFindImportSession(sessionId){
  const a=ensureAiOrganizerState();
  if(!sessionId)return null;
  return (a.exportSessions||[]).find(x=>x&&x.id===sessionId)||null;
}
const _v4932AiOrganizerPromptBase=aiOrganizerPrompt;
aiOrganizerPrompt=function(tasks){
  const session=aiEnsureDraftExportSession(tasks||[]),skill=aiCurrentSkill(),extra=(document.getElementById('aiSkillExtra')?.value||'').trim(),scopeLabel=document.getElementById('aiSkillScope')?.selectedOptions?.[0]?.textContent||'選択範囲',payload=(tasks||[]).map(aiTaskPayload);
  const common=`あなたはDOPADOの行動支援アシスタントです。目的は、ユーザーがタスクを実行しやすくなることです。

【重要】
この依頼のsessionIdは ${session.id} です。返答JSONには必ず同じsessionIdを含めてください。

【今回の範囲】
${scopeLabel}

【今回の操作】
${skill.name}
${skill.promptTemplate}`+(extra?`

【追加指示】
${extra}`:'');
  if(skill.outputMode==='text')return common+`

【返答ルール】
- 日本語で短く、具体的に答える。
- タスクを変更するJSONは返さない。
- 最初の一歩を明確にする。

【タスクデータ】
${JSON.stringify(payload,null,2)}`;
  return common+`

【絶対ルール】
- 元の全タスク一覧を書き直さず、必要な変更だけoperationsで返す。
- JSON以外の文章やMarkdownコードフェンスは付けない。
- 変更不要なタスクは省略する。
- 既存タスクの変更には必ず下記のtaskIdを使う。
- 削除は可能だが、DOPADO側では復元可能なゴミ箱へ移動する。
- 完全削除はできない。
- 不確かな変更は無理に行わない。
- 同じtaskIdに矛盾する命令を出さない。
- sessionIdは必ず ${session.id} をそのまま返す。

【返却形式】
{"sessionId":"${session.id}","operations":[
 {"taskId":"既存ID","action":"set_today","reason":"理由"},
 {"taskId":"既存ID","action":"hold_tomorrow","reason":"理由"},
 {"taskId":"既存ID","action":"hold_until","value":"YYYY-MM-DD","reason":"理由"},
 {"taskId":"既存ID","action":"set_skima","reason":"理由"},
 {"taskId":"既存ID","action":"set_important","value":true,"reason":"理由"},
 {"taskId":"既存ID","action":"rename","value":"新タイトル","reason":"理由"},
 {"taskId":"既存ID","action":"set_memo","value":"メモ","reason":"理由"},
 {"taskId":"既存ID","action":"set_breakdown","value":true,"reason":"理由"},
 {"taskId":"既存ID","action":"complete","reason":"理由"},
 {"taskId":"既存ID","action":"reopen","reason":"理由"},
 {"taskId":"既存ID","action":"delete","reason":"理由"},
 {"action":"create","title":"新規タスク","memo":"任意","destination":"today|inbox|skima","reason":"理由"}
]}

【タスクデータ】
${JSON.stringify(payload,null,2)}`;
};
function prepareAiExportPrompt(){
  const scope=document.getElementById('aiSkillScope')?.value||'visible',tasks=aiExportTasks(scope);
  if(!tasks.length){const tx=document.getElementById('aiExportText');if(tx)tx.value='';updateAiRequestSummary([]);const resultBox=document.getElementById('aiCopyResult');if(resultBox)resultBox.classList.remove('open','error');return{tasks:[],prompt:'',session:null}}
  const session=aiEnsureDraftExportSession(tasks),prompt=aiOrganizerPrompt(tasks);aiLastExportPrompt=prompt;
  const tx=document.getElementById('aiExportText');if(tx)tx.value=prompt;
  updateAiRequestSummary(tasks);
  const resultBox=document.getElementById('aiCopyResult');if(resultBox)resultBox.classList.remove('open','error');
  return{tasks,prompt,session};
}
async function copyAiOrganizerPrompt(){
  const st=document.getElementById('aiExportStatus'),result=document.getElementById('aiCopyResult'),text=document.getElementById('aiCopyResultText'),p=prepareAiExportPrompt();
  if(!p.tasks.length){if(st){st.className='ai-org-status error';st.textContent='対象タスクがありません。'}return}
  const session=aiCommitExportSession(p.tasks,p.prompt);saveNow();
  const ok=await copyTextSafe(p.prompt);
  if(st){st.className='ai-org-status';st.textContent=''}
  if(result&&text){result.classList.add('open');result.classList.toggle('error',!ok);text.textContent=ok?'✓ '+p.tasks.length+'件分のプロンプトをコピーしました。sessionId: '+session.id:'自動コピーできませんでした。全文を開いて手動でコピーしてください。'}
  if(!ok){toggleAiExportPreview(true)}else{document.getElementById('aiExportPreview')?.classList.remove('open')}
}
function aiImportSessionId(parsed){return String((parsed&&parsed.sessionId)||(parsed&&parsed.aiSessionId)||(parsed&&parsed.session_id)||'').trim()}
const _v4932ValidateAiOperation=validateAiOperation;
function validateAiOperationWithSession(op,index,session,sessionIssue){
  const out=_v4932ValidateAiOperation(op,index);
  out.sessionId=session&&session.id||'';
  if(!out.valid)return out;
  if(op&&op.action!=='create'){
    if(session){
      if(!session.taskIds.includes(op.taskId)){out.valid=false;out.error='このsessionの出力対象外';return out}
      const currentHash=aiStableTaskHash(out.task);
      if(session.taskHashes&&session.taskHashes[op.taskId]&&session.taskHashes[op.taskId]!==currentHash){out.warning='AI出力後にタスクが変更されています';out.selected=false}
    }else if(sessionIssue){
      out.warning=sessionIssue;out.selected=false;
    }
  }else if(sessionIssue){
    out.warning=sessionIssue;out.selected=false;
  }
  return out;
}
function aiApplyConflictChecks(items){
  const byTask={};
  items.forEach(v=>{if(v.valid&&v.taskId){(byTask[v.taskId]=byTask[v.taskId]||[]).push(v)}});
  Object.values(byTask).forEach(list=>{
    const loc=list.filter(v=>['set_today','hold_tomorrow','hold_until','set_skima','delete'].includes(v.action));
    if(loc.length>1)loc.forEach(v=>{v.valid=false;v.error='同じタスクに移動/削除系の矛盾命令'});
    const done=list.filter(v=>['complete','reopen'].includes(v.action));
    if(done.length>1)done.forEach(v=>{v.valid=false;v.error='完了/未完了の矛盾命令'});
    ['rename','set_memo','set_important','set_breakdown'].forEach(action=>{const dup=list.filter(v=>v.action===action);if(dup.length>1)dup.forEach(v=>{v.valid=false;v.error='同じ変更命令が重複'})});
  });
}
function loadAiImportPreview(){
  const st=document.getElementById('aiImportStatus'),area=document.getElementById('aiPreviewArea');
  try{
    const parsed=aiParseJson(document.getElementById('aiImportText').value);
    if(!parsed||!Array.isArray(parsed.operations))throw new Error('operations配列がありません');
    const sid=aiImportSessionId(parsed),a=ensureAiOrganizerState(),session=aiFindImportSession(sid);
    let sessionIssue='';
    if(!sid)sessionIssue='sessionIdがありません。内容確認が必要です';
    else if(!session)sessionIssue='保存された出力sessionと一致しません';
    aiPreviewOperations=parsed.operations.map((op,i)=>validateAiOperationWithSession(op,i,session,sessionIssue));
    aiApplyConflictChecks(aiPreviewOperations);
    const valid=aiPreviewOperations.filter(x=>x.valid).length,warn=aiPreviewOperations.filter(x=>x.valid&&x.warning).length;
    st.className='ai-org-status '+(sessionIssue?'error':'ok');
    st.textContent=(sessionIssue?sessionIssue+'。':'')+aiPreviewOperations.length+'件を読み込みました。適用可能 '+valid+'件'+(warn?'、要確認 '+warn+'件':'')+'。まだ変更は適用されていません。';
    renderAiPreview();
  }catch(e){aiPreviewOperations=[];area.innerHTML='';st.className='ai-org-status error';st.textContent='JSONを読み込めません: '+e.message}
}
function renderAiPreview(){
  const area=document.getElementById('aiPreviewArea');if(!area)return;const valid=aiPreviewOperations.filter(x=>x.valid),deletes=valid.filter(x=>x.action==='delete').length,creates=valid.filter(x=>x.action==='create').length,invalid=aiPreviewOperations.length-valid.length,warn=valid.filter(x=>x.warning).length;
  area.innerHTML='<div class="ai-preview-summary"><div class="ai-preview-stat"><b>'+valid.length+'</b><span>適用可能</span></div><div class="ai-preview-stat"><b>'+deletes+'</b><span>削除</span></div><div class="ai-preview-stat"><b>'+warn+'</b><span>要確認</span></div><div class="ai-preview-stat"><b>'+invalid+'</b><span>除外</span></div></div>';
  const list=document.createElement('div');list.className='ai-preview-list';aiPreviewOperations.forEach((v,i)=>{const op=v.raw||{},item=document.createElement('label');item.className='ai-preview-item'+(v.valid?'':' invalid');const warnHtml=v.warning?'<div class="ai-preview-reason" style="color:#ffd24a">⚠ '+escapeHtml(v.warning)+'</div>':'';item.innerHTML='<input type="checkbox" '+(v.valid&&v.selected?'checked':'')+' '+(v.valid?'':'disabled')+' onchange="toggleAiPreviewOperation('+i+',this.checked)"><div><div class="ai-preview-title">'+escapeHtml(AI_ACTION_LABELS[op.action]||op.action||'不正な命令')+' · '+escapeHtml(v.task?v.task.name:(op.title||'新規タスク'))+'</div><div class="ai-preview-diff">'+escapeHtml(aiOperationDiff(v))+'</div>'+warnHtml+(op.reason?'<div class="ai-preview-reason">'+escapeHtml(op.reason)+'</div>':'')+'</div>';list.appendChild(item)});area.appendChild(list);
  const chosen=valid.filter(x=>x.selected).length,delRatio=state.tasks.length?deletes/state.tasks.length:0;const warnBlock=(deletes>=50||delRatio>=.5)?'<div class="ai-org-status error">大量削除が含まれています。適用後もゴミ箱と履歴から復元できます。</div>':'';area.insertAdjacentHTML('beforeend',warnBlock+'<div class="ai-org-actions"><button type="button" class="ai-org-btn secondary" onclick="toggleAllAiPreview(true)">全選択</button><button type="button" class="ai-org-btn secondary" onclick="toggleAllAiPreview(false)">全解除</button></div><button type="button" class="ai-org-btn" style="margin-top:8px" onclick="confirmApplyAiPreview()">選択した'+chosen+'件を適用</button>');
}
const _v4932ApplyAiPreview=applyAiPreview;
applyAiPreview=function(ops){
  const before=aiSnapshot(),a=ensureAiOrganizerState(),summary={};let applied=0;
  ops.forEach(v=>{const op=v.raw;try{if(applyAiOperation(op)){summary[op.action]=(summary[op.action]||0)+1;applied++}}catch(e){console.warn('AI op failed',op,e)}});
  const sessionId=(ops.find(v=>v.sessionId)||{}).sessionId||a.lastExportSessionId||'';
  const session=aiFindImportSession(sessionId);
  const history={id:newId(),createdAt:Date.now(),summary,before,afterTaskCount:state.tasks.length,sessionId,skillName:session&&session.skillName||aiCurrentSkill().name,scopeLabel:session&&session.scopeLabel||''};
  a.history.unshift(history);a.history=a.history.slice(0,10);saveNow();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager();aiPreviewOperations=[];document.getElementById('aiPreviewArea').innerHTML='';document.getElementById('aiImportStatus').className='ai-org-status ok';document.getElementById('aiImportStatus').textContent=applied+'件のAI整理を適用しました。';showUndo(applied+'件のAI整理を適用した',()=>restoreAiHistory(history.id,true));
};
function restoreAiSnapshotObject(snapshot){
  const a=ensureAiOrganizerState();
  state.tasks=JSON.parse(JSON.stringify(snapshot.tasks||[])).map(normalizeTask);
  state.repeats=JSON.parse(JSON.stringify(snapshot.repeats||[]));
  a.trash=JSON.parse(JSON.stringify(snapshot.trash||[]));
}
function confirmRestoreAiHistory(id){openAppConfirm({title:'AI整理前へ戻す？',message:'戻す前に現在状態も保存します。復元後に取り消すこともできます。',okText:'元に戻す',danger:true,onOk:()=>restoreAiHistory(id,false)})}
function restoreAiHistory(id,quiet){
  const a=ensureAiOrganizerState(),h=a.history.find(x=>x.id===id);if(!h)return;
  const restoreUndo={id:'restore_'+newId(),createdAt:Date.now(),before:aiSnapshot(),restoredHistoryId:id};
  a.restoreSnapshots.unshift(restoreUndo);a.restoreSnapshots=a.restoreSnapshots.slice(0,5);
  restoreAiSnapshotObject(h.before);saveNow();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager();renderAiHistory();if(!quiet){const st=document.getElementById('aiImportStatus');if(st)st.textContent='AI整理前の状態へ戻しました。'}showUndo('AI整理前へ戻した',()=>{restoreAiSnapshotObject(restoreUndo.before);saveNow();render();if(document.getElementById('taskManagerScreen')?.classList.contains('open'))renderTaskManager();renderAiHistory();});
}
function renderAiHistory(){
  const area=document.getElementById('aiHistoryArea'),a=ensureAiOrganizerState();if(!area)return;if(!a.history.length){area.innerHTML='<div class="ai-empty">AI整理履歴はまだありません。<br>適用前の状態はここから復元できます。</div>';return}area.innerHTML='<div class="ai-history-list">'+a.history.map(h=>{const total=Object.values(h.summary||{}).reduce((x,y)=>x+y,0),detail=Object.entries(h.summary||{}).map(([k,v])=>(AI_ACTION_LABELS[k]||k)+' '+v).join(' / ');return '<div class="ai-history-card"><div class="ai-history-top"><div><div class="ai-history-title">AI整理 '+total+'件</div><div class="ai-history-meta">'+escapeHtml(new Date(h.createdAt).toLocaleString('ja-JP'))+(h.skillName?'<br>'+escapeHtml(h.skillName+(h.scopeLabel?' · '+h.scopeLabel:'')):'')+(h.sessionId?'<br>session: '+escapeHtml(h.sessionId):'')+'<br>'+escapeHtml(detail)+'</div></div><button class="ai-mini-btn" onclick="confirmRestoreAiHistory(\''+h.id+'\')">この時点へ戻す</button></div></div>'}).join('')+'</div>';
}
function runAiOrganizerSelfTest(){
  const dummy={sessionId:'test',operations:[{action:'create',title:'テスト',destination:'inbox',reason:'追加テスト'},{taskId:'missing',action:'set_today',reason:'存在しないIDテスト'}]};
  try{return aiParseJson(JSON.stringify(dummy)).operations.length===2}catch(e){return false}
}


/* ===== v49.33 BRAIN DUMP CALM ORB INTRO ===== */
const BRAIN_DUMP_DRAFT_KEY='dopado_brain_dump_draft_v1';
let brainCalmLeaving=false;
function chooseTopMenu(mode){
  closeTopMenu();
  if(mode==='profile'){openProfile();return;}
  if(mode==='manager'){openTaskManager();return;}
  if(mode==='brain'){openBrainDumpCalm();return;}
  setMainMode(mode);
}
function openBrainDumpScreen(opts={}){
  const sc=document.getElementById('brainDumpScreen');
  if(!sc)return;
  sc.classList.add('open');sc.setAttribute('aria-hidden','false');
  const input=document.getElementById('brainDumpInput');
  if(input){input.value=localStorage.getItem(BRAIN_DUMP_DRAFT_KEY)||'';if(opts.focus)setTimeout(()=>{try{input.focus({preventScroll:true})}catch(e){input.focus()}},140)}
}
function closeBrainDumpScreen(){
  const sc=document.getElementById('brainDumpScreen');if(!sc)return;
  sc.classList.remove('open');sc.setAttribute('aria-hidden','true');
  const st=document.getElementById('brainDumpStatus');if(st)st.textContent='';
  try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur()}catch(e){}
}
function saveBrainDumpDraft(){
  const input=document.getElementById('brainDumpInput');if(!input)return;
  try{localStorage.setItem(BRAIN_DUMP_DRAFT_KEY,input.value||'')}catch(e){}
}
async function copyBrainDumpText(){
  const input=document.getElementById('brainDumpInput'),st=document.getElementById('brainDumpStatus');if(!input)return;
  const text=(input.value||'').trim();
  if(!text){if(st)st.textContent='まだ本文がありません。';return}
  const ok=await copyTextSafe(text);
  if(st)st.textContent=ok?'ブレインダンプ本文をコピーしました。':'コピーできませんでした。本文欄を長押ししてコピーしてください。';
}
function clearBrainDumpDraft(){
  openAppConfirm({title:'ブレインダンプを消す？',message:'入力中の本文だけを消します。タスクは消えません。',okText:'消す',danger:true,onOk:()=>{const input=document.getElementById('brainDumpInput');if(input)input.value='';try{localStorage.removeItem(BRAIN_DUMP_DRAFT_KEY)}catch(e){}const st=document.getElementById('brainDumpStatus');if(st)st.textContent='クリアしました。';}})
}
function brainViewportSize(){const vv=window.visualViewport;return{w:vv&&vv.width?vv.width:window.innerWidth,h:vv&&vv.height?vv.height:window.innerHeight}}
function openBrainDumpCalm(opts={}){
  if(document.getElementById('brainCalmOverlay'))return;
  if(!opts.fromScreen)closeBrainDumpScreen();
  brainCalmLeaving=false;
  const ov=document.createElement('div');
  ov.className='brain-calm-overlay';ov.id='brainCalmOverlay';
  ov.innerHTML='<div class="brain-calm-flash" id="brainCalmFlash" aria-hidden="true"></div><div class="brain-calm-orb-pos" id="brainCalmOrbPos" aria-hidden="true"><div class="brain-calm-orb bright" id="brainCalmOrb"></div></div><div class="brain-calm-guide"><div class="brain-calm-line brain-calm-line-1">光に、呼吸を合わせる。</div><div class="brain-calm-line brain-calm-line-2">落ち着いたら、どこでも触れてください。</div></div>';
  document.body.appendChild(ov);
  ov.addEventListener('pointerdown',leaveBrainCalm,{once:true});
  runBrainCalmChoreography();
}
function leaveBrainCalm(){
  const ov=document.getElementById('brainCalmOverlay');if(!ov||brainCalmLeaving)return;
  brainCalmLeaving=true;ov.classList.add('leaving');
  setTimeout(()=>{ov.remove();openBrainDumpScreen({focus:true})},1700);
}
function brainSettleOrb(){
  const ov=document.getElementById('brainCalmOverlay'),pos=document.getElementById('brainCalmOrbPos'),orb=document.getElementById('brainCalmOrb');if(!ov||!pos||!orb)return;
  if(pos.getAnimations)pos.getAnimations().forEach(a=>a.cancel());
  pos.style.transform='translate(0, 0)';orb.classList.add('settled');ov.classList.add('settled');
}
function brainDarkenToBlackout(){const orb=document.getElementById('brainCalmOrb');if(orb)orb.style.opacity='0'}
function brainBloomIntoMist(){
  const ov=document.getElementById('brainCalmOverlay'),pos=document.getElementById('brainCalmOrbPos'),orb=document.getElementById('brainCalmOrb');if(!ov||!pos||!orb)return;
  orb.style.transition='none';orb.classList.remove('bright');orb.classList.add('landed');orb.style.removeProperty('opacity');
  if(pos.getAnimations)pos.getAnimations().forEach(a=>a.cancel());pos.style.transform='translate(0, 0)';
  requestAnimationFrame(()=>{orb.style.removeProperty('transition');const intro=orb.animate([{opacity:0,scale:.82},{opacity:.88,scale:1,offset:.34},{opacity:.84,scale:1,offset:.5},{opacity:.38,scale:.82}],{duration:12000,easing:'ease-in-out',fill:'forwards'});intro.onfinish=()=>{orb.classList.add('settled');ov.classList.add('settled');requestAnimationFrame(()=>intro.cancel())};});
}
function brainBuildBounceFrames(topY){
  const FALL_T=.34,REST=.66,N=10,SCALE=.42;const nodes=[{dt:0,y:topY,squash:false},{dt:FALL_T,y:0,squash:true}];let h=Math.abs(topY);
  for(let i=0;i<N;i++){h*=REST;const t=FALL_T*Math.sqrt(h/Math.abs(topY));nodes.push({dt:t,y:-h,squash:false});nodes.push({dt:t,y:0,squash:true})}
  const total=nodes.reduce((a,n)=>a+n.dt,0);let cum=0;const frames=nodes.map((n,i)=>{cum+=n.dt;const frac=Math.min(cum/total,1),decay=1-(i/nodes.length),sq=n.squash?0.16*decay:0,scale=n.squash?`scale(${(SCALE*(1+sq)).toFixed(3)}, ${(SCALE*(1-sq)).toFixed(3)})`:`scale(${SCALE})`,next=nodes[i+1],easing=next?(next.y===0?'cubic-bezier(0.4, 0, 1, 0.6)':'cubic-bezier(0, 0.4, 0.6, 1)'):'linear';return{transform:`translate(0px, ${n.y.toFixed(1)}px) ${scale}`,offset:frac,easing}});return{frames,totalMs:total*1000};
}
async function runBrainCalmChoreography(){
  const ov=document.getElementById('brainCalmOverlay'),flash=document.getElementById('brainCalmFlash'),pos=document.getElementById('brainCalmOrbPos'),orb=document.getElementById('brainCalmOrb');if(!ov||!flash||!pos||!orb)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced||!pos.animate){flash.remove();orb.classList.remove('bright');orb.style.removeProperty('opacity');brainSettleOrb();return}
  const vp=brainViewportSize(),W=vp.w,H=vp.h,X=W*.19,topY=-H*.19,botY=H*.16,S='scale(0.42)',at=(x,y)=>`translate(${x}px, ${y}px) ${S}`;
  try{
    flash.animate([{opacity:1},{opacity:0}],{duration:1800,easing:'ease-out',fill:'forwards'});
    await pos.animate([{transform:'translate(0, 0) scale(6)'},{transform:at(0,topY)}],{duration:1800,easing:'cubic-bezier(0.22, 0.8, 0.3, 1)',fill:'forwards'}).finished;if(brainCalmLeaving)return;flash.remove();
    const lap=[[X,topY],[X,botY],[-X,botY],[-X,topY],[0,topY]],pts=[[0,topY],...lap,...lap];const seg=[];let total=0;for(let i=1;i<pts.length;i++){total+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);seg.push(total)}const loopFrames=[{transform:at(...pts[0]),offset:0}];for(let i=1;i<pts.length;i++)loopFrames.push({transform:at(...pts[i]),offset:seg[i-1]/total});
    await pos.animate(loopFrames,{duration:6400,easing:'ease-in-out',fill:'forwards'}).finished;if(brainCalmLeaving)return;
    await new Promise(r=>setTimeout(r,900));if(brainCalmLeaving)return;
    const bounce=brainBuildBounceFrames(topY);await pos.animate(bounce.frames,{duration:bounce.totalMs,easing:'linear',fill:'forwards'}).finished;if(brainCalmLeaving)return;
    await new Promise(r=>setTimeout(r,700));brainDarkenToBlackout();await new Promise(r=>setTimeout(r,2900));if(brainCalmLeaving)return;brainBloomIntoMist();
  }catch(e){brainSettleOrb()}
}


/* ===== v49.34 BRAIN DUMP -> AI -> TASK CREATE ===== */
let brainDumpLastAiPrompt='';
function brainDumpSimpleHash(text){
  text=String(text||'');let h=2166136261;
  for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}
  return (h>>>0).toString(16);
}
function brainDumpCommitAiSession(text,prompt,sessionId){
  const a=ensureAiOrganizerState();
  const session={
    id:sessionId,
    signature:JSON.stringify({type:'brainDump',hash:brainDumpSimpleHash(text)}),
    source:'brainDump',
    createdAt:Date.now(),
    copiedAt:Date.now(),
    promptLength:String(prompt||'').length,
    scope:'brain_dump',
    scopeLabel:'ブレインダンプ本文',
    skillId:'brain_dump_create',
    skillName:'ブレインダンプを整理',
    taskIds:[],
    taskHashes:{},
    brainTextHash:brainDumpSimpleHash(text)
  };
  a.lastExportIds=[];
  a.lastExportSessionId=session.id;
  a.exportSessions=[session].concat((a.exportSessions||[]).filter(x=>x&&x.id!==session.id)).slice(0,12);
  return session;
}
function brainDumpAiPrompt(text,sessionId){
  const today=appDayStr(),tomorrow=addDaysStr(today,1);
  return `あなたはDOPADOのブレインダンプ整理アシスタントです。目的は、ユーザーの頭の中にある未整理の文章を、実行しやすいタスクへ変換することです。

【重要】
この依頼のsessionIdは ${sessionId} です。返答JSONには必ず同じsessionIdを含めてください。

【今日】
${today}
【明日】
${tomorrow}

【やること】
- ブレインダンプ本文から、行動にできるタスクだけを抜き出す。
- 感情・メモ・背景情報だけの文は、無理にタスク化しない。
- 1タスクは短く、実行できる言葉にする。
- 大きすぎるものは needsBreakdown:true を付ける。必要なら「最初の一歩」も別タスクとして作る。
- 今日やるべきものだけ destination:"today" にする。今日に詰め込みすぎない。
- 暇ならやる・いつでもよいものは destination:"skima" にする。
- 明日以降でよいものは destination:"tomorrow" または destination:"hold_until" + value:"YYYY-MM-DD" にする。
- どこにも強く分類できないものは destination:"inbox" にする。
- 重複タスクを作らない。
- 最大30件までに抑える。

【絶対ルール】
- JSON以外の文章やMarkdownコードフェンスは付けない。
- 既存タスクの変更命令は出さない。taskIdは使わない。
- operations は create のみ。
- sessionIdは必ず ${sessionId} をそのまま返す。

【返却形式】
{"sessionId":"${sessionId}","operations":[
 {"action":"create","title":"新規タスク","memo":"任意の補足","destination":"today|inbox|skima|tomorrow|hold_until","value":"YYYY-MM-DD（hold_untilの時だけ）","important":false,"needsBreakdown":false,"reason":"なぜこのタスクにしたか"}
]}

【ブレインダンプ本文】
${text}`;
}
function setBrainDumpStatus(html,cls){
  const st=document.getElementById('brainDumpStatus');if(!st)return;
  st.className='brain-status '+(cls||'');
  st.innerHTML=html||'';
}
async function copyBrainDumpAiPrompt(){
  const input=document.getElementById('brainDumpInput');
  const text=String(input&&input.value||'').trim();
  const preview=document.getElementById('brainAiPreview');
  if(preview)preview.classList.remove('open');
  if(!text){setBrainDumpStatus('まだ本文がありません。まず頭の中を置いてください。','error');return;}
  const sessionId='brain_'+newId();
  const prompt=brainDumpAiPrompt(text,sessionId);
  brainDumpLastAiPrompt=prompt;
  const tx=document.getElementById('brainAiPromptText');if(tx)tx.value=prompt;
  const session=brainDumpCommitAiSession(text,prompt,sessionId);
  saveNow();
  const ok=await copyTextSafe(prompt);
  if(ok){
    setBrainDumpStatus('✓ AI整理プロンプトをコピーしました。外部AIへ貼って、返答JSONを取込へ貼ってください。 <button type="button" class="brain-inline-btn" onclick="openBrainDumpAiImport()">取込へ</button> <button type="button" class="brain-inline-btn" onclick="toggleBrainDumpAiPromptPreview(true)">全文</button>','');
  }else{
    setBrainDumpStatus('自動コピーできませんでした。全文を開いて手動でコピーしてください。 <button type="button" class="brain-inline-btn" onclick="toggleBrainDumpAiPromptPreview(true)">全文を表示</button>','error');
    toggleBrainDumpAiPromptPreview(true);
  }
}
function toggleBrainDumpAiPromptPreview(forceOpen){
  const box=document.getElementById('brainAiPreview'),tx=document.getElementById('brainAiPromptText');if(!box||!tx)return;
  if(!tx.value&&brainDumpLastAiPrompt)tx.value=brainDumpLastAiPrompt;
  const open=forceOpen===true?true:!box.classList.contains('open');
  box.classList.toggle('open',open);
  if(open)setTimeout(()=>box.scrollIntoView({behavior:'smooth',block:'nearest'}),40);
}
async function copyBrainDumpPromptFromPreview(){
  const tx=document.getElementById('brainAiPromptText');if(!tx)return;
  tx.focus();tx.select();tx.setSelectionRange(0,tx.value.length);
  let ok=false;try{ok=document.execCommand('copy')}catch(e){}
  if(!ok)ok=await copyTextSafe(tx.value);
  setBrainDumpStatus(ok?'プロンプトをコピーしました。':'自動コピーできません。全文選択後、iPhoneのコピー操作を使ってください。',ok?'':'error');
}
function selectBrainDumpPromptPreview(){
  const tx=document.getElementById('brainAiPromptText');if(!tx)return;
  tx.focus();tx.select();tx.setSelectionRange(0,tx.value.length);
  setBrainDumpStatus('全文を選択しました。iPhoneのコピー操作を使えます。','');
}
function openBrainDumpAiImport(){
  closeBrainDumpScreen();
  openAiOrganizer('import');
  const st=document.getElementById('aiImportStatus');if(st){st.className='ai-org-status';st.textContent='外部AIが返したJSONを貼って「差分を確認」を押してください。新規タスク追加としてプレビューされます。'}
  setTimeout(()=>{const t=document.getElementById('aiImportText');if(t){try{t.focus({preventScroll:true})}catch(e){t.focus()}}},180);
}
const _v4934ApplyAiOperation=applyAiOperation;
applyAiOperation=function(op){
  if(op&&op.action==='create'){
    const dest=String(op.destination||'inbox'),cfg={extras:{memo:String(op.memo||''),subtasks:[],conditions:[]}};
    const holdValue=String(op.value||op.holdUntil||op.holdDate||'');
    if(dest==='today'){
      cfg.dueDate=appDayStr();cfg.todayDate=appDayStr();
    }else if(dest==='skima'){
      cfg.organizeHoldKind='skima';
    }else if(dest==='tomorrow'){
      cfg.organizeHoldUntil=addDaysStr(appDayStr(),1);
    }else if(dest==='hold_until'&&/^\d{4}-\d{2}-\d{2}$/.test(holdValue)){
      cfg.organizeHoldUntil=holdValue;
    }
    if(op.important===true){cfg.importantFlag=true;cfg.importantDate=appDayStr();}
    if(op.needsBreakdown===true||op.breakdown===true){cfg.swipeCycle=2;}
    if(Array.isArray(op.subtasks))cfg.extras.subtasks=op.subtasks.map(x=>({id:newId(),text:String(x&&x.text||x||'').trim(),done:false})).filter(x=>x.text).slice(0,12);
    state.tasks.push(createTask(String(op.title||'').trim(),cfg));return true;
  }
  return _v4934ApplyAiOperation(op);
};

document.addEventListener('touchmove',e=>{if(e.target&&e.target.closest&&e.target.closest('#brainDumpScreen,.brain-calm-overlay'))e.stopPropagation()},{passive:false});

