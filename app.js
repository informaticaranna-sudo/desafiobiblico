const $ = id => document.getElementById(id);
let questions=[], round=[], current=0, mode='challenge', answered=false, installPrompt=null, challengeUsedIds=[];
let bibleData=null, biblePromise=null;
const statsKey='desafioBiblicoStatsV2';
const BIBLE_URL='https://mrk214.github.io/snapshots/pt___por___por/ARC_vid_212.json';
const readStats=()=>{try{return JSON.parse(localStorage.getItem(statsKey))||{score:0,seen:[]}}catch(e){return {score:0,seen:[]}}};
const saveStats=s=>localStorage.setItem(statsKey,JSON.stringify(s));
function updateStats(){const s=readStats();$('scoreCount').textContent=s.score;$('seenCount').textContent=s.seen.length}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function hidePanels(){['gamePanel','studyPanel','singlePanel'].forEach(id=>$(id).classList.add('hidden'))}
function nextChallengeRound(){
 const ready=questions.filter(q=>q.options?.length===3);
 if(!ready.length){alert('Ainda não há perguntas preparadas para o desafio.');return}
 let remaining=ready.filter(q=>!challengeUsedIds.includes(q.id));
 if(remaining.length<10){
  const previousRoundIds=round.map(q=>q.id);
  challengeUsedIds=[];
  remaining=ready.filter(q=>!previousRoundIds.includes(q.id));
  if(remaining.length<10)remaining=ready;
 }
 round=shuffle(remaining).slice(0,10);
 challengeUsedIds.push(...round.map(q=>q.id));
 current=0;answered=false;
 $('roundEndActions').classList.add('hidden');$('gameControls').classList.remove('hidden');$('nextBtn').classList.remove('hidden');$('nextBtn').disabled=true;
 hidePanels();$('gamePanel').classList.remove('hidden');
 const player=(localStorage.getItem('desafioBiblicoPlayer')||'').trim();
 $('modeLabel').textContent=(player?player.toLocaleUpperCase('pt-BR')+' • ':'')+'MISSÃO BÍBLICA • 10 PERGUNTAS';
 $('readyNote').textContent='Cada rodada do desafio apresenta 10 perguntas. As 1.001 perguntas estão disponíveis na área Estudar perguntas, sem alternativas inventadas ou sem conferência.';
 showQuestion();$('gamePanel').scrollIntoView({behavior:'smooth',block:'start'});
}
function begin(which){mode=which;if(which==='challenge'){challengeUsedIds=[];nextChallengeRound();return}round=shuffle(questions).slice(0,20);current=0;hidePanels();$('gamePanel').classList.remove('hidden');showQuestion()}
function refUrl(ref){if(!ref)return null;const s=ref.toLowerCase();const books=[['gên','genesis'],['gen','genesis'],['êx','exodo'],['ex','exodo'],['lev','levitico'],['núm','numeros'],['num','numeros'],['deut','deuteronomio'],['jos','josue'],['juí','juizes'],['juiz','juizes'],['rute','rute'],['i sam','1-samuel'],['ii sam','2-samuel'],['i reis','1-reis'],['ii reis','2-reis'],['i crôn','1-cronicas'],['ii crôn','2-cronicas'],['i cron','1-cronicas'],['ii cron','2-cronicas'],['esd','esdras'],['neem','neemias'],['est','ester'],['jó','jo'],['sal','salmos'],['prov','proverbios'],['ecl','eclesiastes'],['cânt','cantares'],['is','isaias'],['jer','jeremias'],['ez','ezequiel'],['dan','daniel'],['os','oseias'],['jon','jonas'],['miq','miqueias'],['naum','naum'],['hab','habacuque'],['sof','sofonias'],['ageu','ageu'],['zac','zacarias'],['mal','malaquias'],['mat','mateus'],['mar','marcos'],['luc','lucas'],['joão','joao'],['at','atos'],['rom','romanos'],['i cor','1-corintios'],['ii cor','2-corintios'],['gál','galatas'],['ef','efesios'],['fil','filipenses'],['col','colossenses'],['i tess','1-tessalonicenses'],['ii tess','2-tessalonicenses'],['i tim','1-timoteo'],['ii tim','2-timoteo'],['tit','tito'],['filem','filemom'],['heb','hebreus'],['tiag','tiago'],['i ped','1-pedro'],['ii ped','2-pedro'],['apoc','apocalipse']];
 let slug=null,key=s.replace(/[.,]/g,' ').replace(/\s+/g,' ').trim();for(const [a,b] of books){if(key.startsWith(a)){slug=b;key=key.slice(a.length).trim();break}}if(!slug)return null;const m=key.match(/(\d+)\s*[:.]\s*(\d+)/);return m?`https://www.bibliaonline.com.br/arc/${slug}/${m[1]}/${m[2]}`:'https://www.bibliaonline.com.br/arc'}
const BOOKS=[
 ['genesis',['gênesis','gen','gên']],['exodus',['êxodo','ex','êx']],['leviticus',['levítico','lev']],['numbers',['números','núm','num']],['deuteronomy',['deuteronômio','deut']],['joshua',['josué','jos']],['judges',['juízes','juí','jui']],['ruth',['rute']],['1samuel',['1 samuel','i samuel','1 sam','i sam']],['2samuel',['2 samuel','ii samuel','2 sam','ii sam']],['1kings',['1 reis','i reis']],['2kings',['2 reis','ii reis']],['1chronicles',['1 crônicas','i crônicas','1 crôn','i crôn','1 cron','i cron','i cron.']],['2chronicles',['2 crônicas','ii crônicas','2 crôn','ii crôn','2 cron','ii cron']],['ezra',['esdras','esd']],['nehemiah',['neemias','neem']],['esther',['ester','est']],['job',['jó','job']],['psalms',['salmos','sal']],['proverbs',['provérbios','prov']],['ecclesiastes',['eclesiastes','ecl']],['songofsolomon',['cantares','cânt']],['isaiah',['isaías','is']],['jeremiah',['jeremias','jer']],['lamentations',['lamentações','lam']],['ezekiel',['ezequiel','ez']],['daniel',['daniel','dan']],['hosea',['oseias','os']],['joel',['joel']],['amos',['amós','am']],['obadiah',['obadias','ob']],['jonah',['jonas','jon']],['micah',['miqueias','miq']],['nahum',['naum']],['habakkuk',['habacuque','hab']],['zephaniah',['sofonias','sof']],['haggai',['ageu','ag']],['zechariah',['zacarias','zac']],['malachi',['malaquias','mal']],['matthew',['mateus','mat']],['mark',['marcos','mar']],['luke',['lucas','luc']],['john',['joão','jo']],['acts',['atos','at']],['romans',['romanos','rom']],['1corinthians',['1 coríntios','i coríntios','1 cor','i cor']],['2corinthians',['2 coríntios','ii coríntios','2 cor','ii cor']],['galatians',['gálatas','gál']],['ephesians',['efésios','ef']],['philippians',['filipenses','fil']],['colossians',['colossenses','col']],['1thessalonians',['1 tessalonicenses','i tessalonicenses','1 tess','i tess']],['2thessalonians',['2 tessalonicenses','ii tessalonicenses','2 tess','ii tess']],['1timothy',['1 timóteo','i timóteo','1 tim','i tim']],['2timothy',['2 timóteo','ii timóteo','2 tim','ii tim']],['titus',['tito','tit']],['philemon',['filemom','filem']],['hebrews',['hebreus','heb']],['james',['tiago','tiag']],['1peter',['1 pedro','i pedro','1 ped','i ped']],['2peter',['2 pedro','ii pedro','2 ped','ii ped']],['1john',['1 joão','i joão','1 jo','i jo']],['2john',['2 joão','ii joão','2 jo','ii jo']],['3john',['3 joão','iii joão','3 jo','iii jo']],['jude',['judas','jud']],['revelation',['apocalipse','apoc']]
];
const norm=s=>String(s||'').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
function ensureBible(){if(bibleData)return Promise.resolve(bibleData);if(!biblePromise)biblePromise=fetch(BIBLE_URL).then(r=>{if(!r.ok)throw Error('Não foi possível acessar a Bíblia ARC.');return r.json()}).then(data=>{bibleData=Array.isArray(data)?data:(data.books||[]);return bibleData});return biblePromise}
function bookForName(name,data){const n=norm(name);return data.find(b=>norm(b.abbrev)===n||norm(b.book)===n||norm(b.name)===n)||data.find(b=>{const bn=norm(b.book||b.name);return bn===n})}
function parseRefs(ref){const out=[];const text=String(ref||'').replace(/\s+/g,' ').trim();const segments=text.split(/\s*;\s*/);let inherited=null;for(const seg0 of segments){let seg=seg0.replace(/,\s+/g,',');let matched=false;const aliases=BOOKS.flatMap(([key,names])=>names.map(a=>({key,a}))).sort((a,b)=>b.a.length-a.a.length);for(const item of aliases){const re=new RegExp('^'+item.a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\.?\\s*(.*)$','i');const m=seg.match(re);if(m){inherited=item.key;seg=m[1];matched=true;break}}if(!inherited)continue;const cm=seg.match(/(\d+)\s*[:.]\s*([\d,\-–]+)/);if(!cm)continue;const chapter=Number(cm[1]);const verseExpr=cm[2];const verses=[];verseExpr.split(',').forEach(part=>{const nums=part.trim().split(/[-–]/).map(Number);if(nums.length===2&&nums[0]>0&&nums[1]>=nums[0]&&nums[1]-nums[0]<80){for(let n=nums[0];n<=nums[1];n++)verses.push(n)}else if(nums[0]>0)verses.push(nums[0])});out.push({book:inherited,chapter,verses})}return out}
function getBookData(data,key){const names=BOOKS.find(x=>x[0]===key)?.[1]||[];return data.find(b=>names.some(n=>norm(b.human||b.book||b.name)===norm(n)||norm(b.usfm)===norm(n)))||data.find(b=>norm(b.usfm)===norm(key))}
async function loadVerseText(ref,container,link){container.textContent='Carregando texto bíblico…';const url=refUrl(ref);if(url){link.href=url;link.classList.remove('hidden')}else link.classList.add('hidden');try{const data=await ensureBible();const parsed=parseRefs(ref);const chunks=[];for(const p of parsed){const book=getBookData(data,p.book);const chapter=book?.chapters?.[p.chapter-1];if(!chapter)continue;const lines=p.verses.map(v=>{let t=null;if(Array.isArray(chapter))t=chapter[v-1];else if(Array.isArray(chapter.items)){const item=chapter.items.find(it=>it.type==='verse'&&(it.verse_numbers||[]).includes(v));if(item)t=(item.lines||[]).join(' ')}return t?`${v}. ${typeof t==='string'?t:(t.text||t.value||'')}`:''}).filter(Boolean);if(lines.length)chunks.push(`${book.human||book.book||book.name} ${p.chapter}\n${lines.join('\n')}`)}container.textContent=chunks.length?chunks.join('\n\n'):'Não foi possível localizar automaticamente o texto desta referência. Use o botão abaixo para abrir a passagem na Bíblia ARC.'}catch(e){container.textContent='Não foi possível carregar o texto bíblico agora. Verifique sua conexão ou abra a passagem diretamente na Bíblia ARC pelo botão abaixo.'}}
function setReference(ref,targetText,targetLink){const textNode=$(targetText),a=$(targetLink);if(textNode)textNode.textContent=ref||'Referência não identificada no PDF.';if(a){const url=refUrl(ref)||'https://www.bibliaonline.com.br/arc';a.href=url;a.target='_blank';a.rel='noopener';a.textContent='Abrir passagem na ARC ↗';a.classList.remove('hidden')}}
function showQuestion(){const q=round[current];answered=false;$('counter').textContent=`Pergunta ${current+1} de ${round.length}`;$('progressBar').style.width=`${current/round.length*100}%`;$('questionText').textContent=q.question;$('options').innerHTML='';$('answerBox').classList.add('hidden');$('feedback').textContent='';$('nextBtn').disabled=true;$('nextBtn').textContent=current===round.length-1?'Concluir missão':'Próxima pergunta →';shuffle(q.options).forEach((o,i)=>{const b=document.createElement('button');b.className='option';b.textContent=String.fromCharCode(65+i)+'. '+o.text;b.addEventListener('click',()=>choose(o,b));$('options').appendChild(b)})}
function choose(o,button){if(answered)return;answered=true;[...$('options').children].forEach(b=>b.disabled=true);button.classList.add(o.correct?'right':'wrong');if(!o.correct){const q=round[current];const correct=q.options.find(x=>x.correct);[...$('options').children].forEach(b=>{if(b.textContent.endsWith(correct.text))b.classList.add('right')})}$('answerBox').classList.remove('hidden');setReference(round[current].answer,'answerText','arcLink');$('feedback').textContent=o.correct?'Isso aí! Resposta correta! 🌟':'Quase! Vamos aprender juntos. A alternativa certa está destacada.';$('feedback').className='feedback '+(o.correct?'good':'bad');const s=readStats();if(o.correct)s.score++;if(!s.seen.includes(round[current].id))s.seen.push(round[current].id);saveStats(s);updateStats();$('nextBtn').disabled=false}
function finishRound(){
 $('questionText').textContent='Rodada concluída! 🎉';$('options').innerHTML='';$('answerBox').classList.add('hidden');
 $('feedback').textContent='Parabéns! Você concluiu as 10 perguntas desta rodada. Quer continuar aprendendo?';
 $('gameControls').classList.add('hidden');$('nextBtn').classList.add('hidden');$('nextBtn').disabled=true;$('progressBar').style.width='100%';
 $('roundEndActions').classList.remove('hidden');
}
function next(){if(!answered)return;if(current<round.length-1){current++;showQuestion()}else finishRound()}
function renderList(){const term=$('searchInput').value.toLocaleLowerCase('pt-BR').trim(),range=$('rangeSelect').value;const [min,max]=range==='all'?[1,1001]:range.split('-').map(Number);const filtered=questions.filter(q=>q.id>=min&&q.id<=max&&q.question.toLocaleLowerCase('pt-BR').includes(term));const shown=filtered;$('questionList').innerHTML='';shown.forEach(q=>{const b=document.createElement('button');b.className='item';const left=document.createElement('span');left.textContent=`#${q.id} — ${q.question}`;const right=document.createElement('b');right.textContent=q.reviewStatus==='rascunho_revisar'?'EM REVISÃO':'Estudar →';if(q.reviewStatus==='rascunho_revisar')right.style.color='#a05a12';b.append(left,right);b.addEventListener('click',()=>openSingle(q));$('questionList').appendChild(b)});$('listCount').textContent=`Exibindo ${shown.length} de ${filtered.length} resultado(s).`}
function openSingle(q){$('studyPanel').classList.add('hidden');$('singlePanel').classList.remove('hidden');$('singleTitle').textContent=`Pergunta ${q.id}${q.reviewStatus==='rascunho_revisar'?' • EM REVISÃO':''}`;$('singleQuestion').textContent=q.question;$('singleFeedback').textContent=q.reviewStatus==='rascunho_revisar'?'⚠️ Esta pergunta está marcada para conferência com o professor.':'';$('singleFeedback').className='feedback '+(q.reviewStatus==='rascunho_revisar'?'bad':'');const area=$('singleAnswer');area.classList.remove('hidden');area.style.display='block';setReference(q.answer,'singleAnswerText','singleArcLink');$('singleVerseText').textContent='O texto do versículo será carregado quando a fonte bíblica estiver disponível. Você também pode abrir a passagem pelo botão abaixo.';loadVerseText(q.answer,$('singleVerseText'),$('singleArcLink')).catch(()=>{});const s=readStats();if(!s.seen.includes(q.id))s.seen.push(q.id);saveStats(s);updateStats();$('singlePanel').scrollIntoView({behavior:'smooth',block:'start'})}
$('playerName').value=localStorage.getItem('desafioBiblicoPlayer')||'';
function enterApp(){
 const name=$('playerName').value.trim();
 if(!name){$('playerName').focus();$('playerName').placeholder='Digite seu nome ou apelido para entrar';return}
 localStorage.setItem('desafioBiblicoPlayer',name);
 $('welcomeScreen').classList.add('hidden');$('appScreen').classList.remove('hidden');
 hidePanels();$('home').classList.remove('hidden');$('howPanel').classList.remove('hidden');updateStats();window.scrollTo({top:0,behavior:'smooth'});
}
function exitToWelcome(){
 hidePanels();$('home').classList.remove('hidden');$('howPanel').classList.remove('hidden');
 $('appScreen').classList.add('hidden');$('welcomeScreen').classList.remove('hidden');
 $('playerName').value=localStorage.getItem('desafioBiblicoPlayer')||'';window.scrollTo({top:0,behavior:'smooth'});
}
async function resetAppProgress(){
 if(!confirm('Deseja reiniciar as perguntas? Seu total de acertos e o histórico de perguntas estudadas serão apagados deste aparelho.'))return;
 localStorage.removeItem(statsKey);localStorage.removeItem('desafioBiblicoPlayer');
 round=[];current=0;answered=false;mode='challenge';challengeUsedIds=[];
 try{if('caches'in window){const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('desafio-biblico')).map(k=>caches.delete(k)))}}catch(e){console.warn('Não foi possível limpar o cache do aplicativo:',e)}
 $('playerName').value='';updateStats();hidePanels();$('home').classList.remove('hidden');$('howPanel').classList.remove('hidden');
 alert('Tudo pronto! O progresso e o cache interno do aplicativo foram reiniciados. Entre novamente para começar do zero.');
 exitToWelcome();
}
$('enterBtn').addEventListener('click',enterApp);
$('playerName').addEventListener('keydown',e=>{if(e.key==='Enter')enterApp()});
$('startBtn').addEventListener('click',()=>begin('challenge'));
$('continueBtn').addEventListener('click',nextChallengeRound);
$('concludeBtn').addEventListener('click',()=>{hidePanels();$('home').classList.remove('hidden');$('howPanel').classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})});
$('studyBtn').addEventListener('click',()=>{hidePanels();$('studyPanel').classList.remove('hidden');renderList();$('studyPanel').scrollIntoView({behavior:'smooth'})});
$('nextBtn').addEventListener('click',next);
$('exitBtn').addEventListener('click',exitToWelcome);
$('appExitBtn').addEventListener('click',exitToWelcome);
$('resetBtn').addEventListener('click',resetAppProgress);
$('closeStudy').addEventListener('click',()=>$('studyPanel').classList.add('hidden'));
$('backList').addEventListener('click',()=>{$('singlePanel').classList.add('hidden');$('studyPanel').classList.remove('hidden')});
$('searchInput').addEventListener('input',renderList);$('rangeSelect').addEventListener('change',renderList);
fetch('./perguntas.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{questions=data;$('totalCount').textContent=data.length.toLocaleString('pt-BR');updateStats()}).catch(()=>$('questionText').textContent='Não foi possível carregar as perguntas.');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});$('installBtn').addEventListener('click',async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;return}alert('Para instalar, abra o menu do navegador e escolha "Instalar aplicativo" ou "Adicionar à tela inicial". Se essa opção não aparecer, acesse o site pelo Chrome e verifique se está usando HTTPS.');});if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.error));
