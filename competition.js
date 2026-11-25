/* Competição privada: salas por convite, apelido, até 10 jogadores. */
let competitionSession = null;
let competitionPoll = null;
let competitionState = null;
const COMP_TOKEN_KEY = code => 'desafioBiblicoCompetitionToken:' + code;
const compClient = () => {
  if (!window.supabase || !window.DESAFIO_SUPABASE_URL || !window.DESAFIO_SUPABASE_ANON_KEY || window.DESAFIO_SUPABASE_URL.startsWith('COLE_') || window.DESAFIO_SUPABASE_ANON_KEY.startsWith('COLE_')) return null;
  if (!window.__desafioSupabase) window.__desafioSupabase = window.supabase.createClient(window.DESAFIO_SUPABASE_URL, window.DESAFIO_SUPABASE_ANON_KEY);
  return window.__desafioSupabase;
};
const compToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)),b=>b.toString(16).padStart(2,'0')).join('');
const compNick = () => (localStorage.getItem('desafioBiblicoPlayer') || '').trim();
const compRpc = async (name,args) => { const c=compClient(); if(!c) throw new Error('A competição online ainda não foi configurada. Siga o arquivo CONFIGURAR-COMPETICAO.md incluído no pacote.'); const {data,error}=await c.rpc(name,args); if(error) throw error; return data; };
function compNotice(msg){$('compNotice').textContent=msg;$('compNotice').classList.remove('hidden')}
function compShow(){hidePanels();$('home').classList.add('hidden');$('howPanel').classList.add('hidden');$('competitionPanel').classList.remove('hidden');$('competitionPanel').scrollIntoView({behavior:'smooth',block:'start'});}
function compStopPolling(){if(competitionPoll){clearInterval(competitionPoll);competitionPoll=null}}
function compStoreSession(code,token,playerId){localStorage.setItem(COMP_TOKEN_KEY(code),token);competitionSession={code,token,playerId};}
async function compCreate(mode){
 try{
  const nickname=compNick(); if(!nickname) throw new Error('Entre no aplicativo com seu apelido antes de criar a competição.');
  const ready=questions.filter(q=>q.kids5!==true&&q.reviewStatus==='aprovada'&&q.options?.length===3&&q.options.filter(o=>o.correct).length===1);
  if(ready.length<10) throw new Error('Ainda não existem 10 perguntas aprovadas com três alternativas e um gabarito.');
  const picked=shuffle(ready).slice(0,10).map(q=>({id:q.id,question:q.question,answer:q.answer,options:q.options.map(o=>({text:o.text,correct:!!o.correct}))}));
  const token=compToken(); const result=await compRpc('create_competition',{p_nickname:nickname,p_mode:mode,p_questions:picked,p_token:token});
  compStoreSession(result.code,token,result.player_id); $('compLobby').classList.remove('hidden'); await compRefresh(); compStartPolling(); compShareLink(); compNotice(mode==='live'?'Sala criada! Convide seus amigos. Quando todos entrarem, toque em Iniciar batalha.':'Desafio criado! Compartilhe o convite. Cada amigo poderá responder no próprio horário.');
 }catch(e){compNotice(e.message||'Não foi possível criar a competição.');}
}
async function compJoin(){
 try{
  const nickname=compNick(); if(!nickname) throw new Error('Entre no aplicativo com seu apelido antes de participar.');
  const code=$('compJoinCode').value.trim().toUpperCase(); if(!/^[A-Z0-9]{6}$/.test(code)) throw new Error('Digite o código de 6 caracteres recebido do amigo.');
  const token=compToken(); const result=await compRpc('join_competition',{p_code:code,p_nickname:nickname,p_token:token});
  compStoreSession(result.code,token,result.player_id); $('compLobby').classList.remove('hidden'); await compRefresh(); compStartPolling(); compNotice('Você entrou na competição!');
 }catch(e){compNotice(e.message||'Não foi possível entrar na sala.');}
}
function compShareLink(){if(!competitionSession)return;const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('sala',competitionSession.code);$('compInviteUrl').value=url.toString();$('compInviteCode').textContent=competitionSession.code;}
async function compShare(){if(!competitionSession)return;const url=$('compInviteUrl').value;const text=`Vamos competir no Desafio Bíblico! Entre pelo link e use o código ${competitionSession.code}: ${url}`;try{if(navigator.share)await navigator.share({title:'Desafio Bíblico',text,url});else{await navigator.clipboard.writeText(text);compNotice('Convite copiado! Agora é só enviar no WhatsApp.')}}catch(e){if(e.name!=='AbortError')compNotice('Copie o link e o código para enviar aos amigos.')}}
function compRenderState(s){
 competitionState=s; $('compInviteCode').textContent=s.code; $('compRoomMode').textContent=s.mode==='live'?'Batalha ao vivo':'Cada um no seu horário';
 $('compRoomStatus').textContent=s.status==='waiting'?'Aguardando o início':s.status==='active'?'Competição em andamento':'Competição encerrada';
 $('compPlayers').innerHTML=''; (s.players||[]).forEach((p,i)=>{const el=document.createElement('div');el.className='item';const a=document.createElement('span');const done=compComplete(s),rank=1+(s.players||[]).filter(x=>x.score>p.score).length;a.textContent=`${done?(['🥇','🥈','🥉'][rank-1]||rank+'.'):(i+1)+'.'} ${p.nickname}${p.id===s.player_id?' (você)':''}`;const b=document.createElement('b');b.textContent=`${p.score} pts`;el.append(a,b);$('compPlayers').append(el)});
 const qid=s.questions?.[s.current_index]?.id; const done=(s.answers||[]).filter(a=>a.question_id===qid).length; $('compLiveProgress').textContent=s.mode==='live'&&s.status==='active'?`${done} de ${s.players.length} participantes responderam à pergunta ${s.current_index+1} de 10.`:'';
 $('compStartLive').classList.toggle('hidden',!(s.mode==='live'&&s.status==='waiting'&&s.creator_id===s.player_id));
 $('compAdvanceLive').classList.toggle('hidden',!(s.mode==='live'&&s.status==='active'&&s.creator_id===s.player_id));
 $('compPlayNow').classList.toggle('hidden',s.status!=='active');
 $('compFinished').classList.toggle('hidden',s.status!=='finished');
 compShowWinner(s);
}
async function compRefresh(){
 if(!competitionSession)return; try{const s=await compRpc('get_competition_state',{p_code:competitionSession.code,p_token:competitionSession.token});const oldIndex=competitionState?.current_index;compRenderState(s);
  if(s.status==='active'&&s.mode==='live'&&oldIndex!==undefined&&oldIndex!==s.current_index&&mode==='competition')compLoadQuestion();
  if(s.status==='finished'){$('compLiveProgress').textContent='Resultado final! Confira a classificação acima.';}
 }catch(e){compNotice(e.message||'Não foi possível atualizar a sala.');}
}
function compStartPolling(){compStopPolling();competitionPoll=setInterval(compRefresh,2500)}
async function compStartLive(){try{await compRpc('start_live_competition',{p_code:competitionSession.code,p_token:competitionSession.token});await compRefresh();compNotice('Batalha iniciada! Respondam à mesma pergunta.');}catch(e){compNotice(e.message)}}
async function compAdvanceLive(){try{await compRpc('advance_live_competition',{p_code:competitionSession.code,p_token:competitionSession.token});await compRefresh();if(competitionState?.status==='finished')compNotice('Batalha encerrada! Veja o placar final.');else compLoadQuestion();}catch(e){compNotice(e.message)}}
function compLoadQuestion(){
 if(!competitionState||competitionState.status!=='active')return;
 const s=competitionState; round=s.questions; mode='competition';
 if(s.mode==='live')current=s.current_index;
 else {const done=new Set((s.my_answers||[]).map(a=>a.question_id));current=s.questions.findIndex(q=>!done.has(q.id));if(current<0){$('gamePanel').classList.add('hidden');$('compFinished').classList.remove('hidden');return;}}
 hidePanels();$('gamePanel').classList.remove('hidden');$('modeLabel').textContent=s.mode==='live'?'BATALHA AO VIVO':'COMPETIÇÃO • NO SEU HORÁRIO';
 showQuestion();$('gamePanel').scrollIntoView({behavior:'smooth',block:'start'});
}
// Versão da tela de pergunta que também identifica a alternativa no banco compartilhado.
function showQuestion(){
 const q=round[current]; if(!q)return;answered=false;$('counter').textContent=`Pergunta ${current+1} de ${round.length}`;$('progressBar').style.width=`${current/round.length*100}%`;$('questionText').textContent=q.question;$('options').innerHTML='';$('answerBox').classList.add('hidden');$('feedback').textContent='';$('nextBtn').disabled=true;$('nextBtn').textContent='Próxima pergunta →';
 const saved=mode==='competition'&&competitionSession&&competitionState?.my_answers?.find(a=>a.question_id===q.id);
 if(saved){answered=true;$('nextBtn').disabled=false;$('answerBox').classList.remove('hidden');setReference(q.answer,'answerText','arcLink');$('feedback').textContent=saved.is_correct?'Resposta correta! +10 pontos.':'Resposta registrada. Continue!';$('feedback').className='feedback '+(saved.is_correct?'good':'bad');}
 shuffle(q.options).forEach(o=>{const b=document.createElement('button');b.className='option';b.textContent=String.fromCharCode(65+$('options').children.length)+'. '+o.text;b.addEventListener('click',()=>choose(o,b));$('options').appendChild(b)});
 $('gameControls').classList.remove('hidden');$('nextBtn').classList.toggle('hidden',mode==='competition'&&current===round.length-1&&competitionState?.mode!=='async');$('nextBtn').disabled=!saved;
 if(mode==='competition'&&competitionState?.mode==='live'){$('nextBtn').classList.add('hidden');$('readyNote').textContent=saved?'Resposta enviada. Aguarde o organizador avançar quando todos responderem.':'Todos estão respondendo à mesma pergunta. O placar atualiza automaticamente.';}
 else $('readyNote').textContent='Cada participante pode responder no próprio horário. Cada acerto vale 10 pontos.';
}
async function choose(o,button){
 if(answered)return;
 if(mode!=='competition'){
  answered=true;[...$('options').children].forEach(b=>b.disabled=true);button.classList.add(o.correct?'right':'wrong');if(!o.correct){const correct=round[current].options.find(x=>x.correct);[...$('options').children].forEach(b=>{if(b.textContent.endsWith(correct.text))b.classList.add('right')})}$('answerBox').classList.remove('hidden');setReference(round[current].answer,'answerText','arcLink');$('feedback').textContent=o.correct?'Isso aí! Resposta correta! 🌟':'Quase! A alternativa certa está destacada.';$('feedback').className='feedback '+(o.correct?'good':'bad');const st=readStats(),qid=round[current].id;if(!st.answeredIds.includes(qid))st.answeredIds.push(qid);if(o.correct&&!st.correctIds.includes(qid))st.correctIds.push(qid);saveStats(st);updateStats();$('nextBtn').disabled=false;if(current===round.length-1){$('nextBtn').textContent='Concluir desafio';$('nextBtn').classList.remove('hidden')}return;
 }
 try{
  const q=round[current],index=q.options.indexOf(o); if(index<0)throw new Error('Alternativa inválida.');
  const result=await compRpc('submit_competition_answer',{p_code:competitionSession.code,p_token:competitionSession.token,p_question_id:q.id,p_option_index:index});
  answered=true;[...$('options').children].forEach(b=>b.disabled=true);button.classList.add(result.correct?'right':'wrong');$('answerBox').classList.remove('hidden');setReference(q.answer,'answerText','arcLink');$('feedback').textContent=result.correct?'Resposta correta! +10 pontos.':'Resposta registrada. Continue para a próxima!';$('feedback').className='feedback '+(result.correct?'good':'bad');
  if(competitionState.mode==='async'){$('nextBtn').disabled=false;$('nextBtn').classList.remove('hidden');if(current===round.length-1)$('nextBtn').textContent='Ver classificação';}
  else {$('nextBtn').classList.add('hidden');$('readyNote').textContent='Resposta enviada. Aguarde os outros participantes; o organizador avançará quando todos responderem.';}
  await compRefresh();
 }catch(e){compNotice(e.message||'Não foi possível registrar sua resposta.');}
}
function next(){if(!answered)return;if(mode==='competition'){
 if(competitionState?.mode==='live')return;
 if(current<round.length-1){current++;showQuestion();}else{$('gamePanel').classList.add('hidden');compNotice('Você concluiu suas 10 perguntas! A classificação está atualizada na sala.');compShow();compRefresh();}return;
 }
 if(current<round.length-1){current++;showQuestion()}else finishRound();
}
function finishRound(){ $('questionText').textContent='Rodada concluída! 🎉';$('options').innerHTML='';$('answerBox').classList.add('hidden');$('feedback').textContent='Parabéns! Você concluiu as 10 perguntas desta rodada.';$('gameControls').classList.add('hidden');$('nextBtn').classList.add('hidden');$('progressBar').style.width='100%';$('roundEndActions').classList.remove('hidden'); }

$('compBtn').addEventListener('click',()=>{compShow();$('compLobby').classList.add('hidden');compNotice('Crie uma sala e convide até 9 amigos, ou entre com o código recebido.');});
$('compCreateAsync').addEventListener('click',()=>compCreate('async'));
$('compCreateLive').addEventListener('click',()=>compCreate('live'));
$('compJoinBtn').addEventListener('click',compJoin);
$('compShareBtn').addEventListener('click',compShare);
$('compStartLive').addEventListener('click',compStartLive);
$('compAdvanceLive').addEventListener('click',compAdvanceLive);
$('compPlayNow').addEventListener('click',()=>{compRefresh().then(compLoadQuestion)});
$('compBackHome').addEventListener('click',()=>{compStopPolling();hidePanels();$('competitionPanel').classList.add('hidden');$('home').classList.remove('hidden');$('howPanel').classList.remove('hidden')});
$('compInviteCode').textContent='------';
const invitedCode=new URLSearchParams(location.search).get('sala');if(invitedCode){$('compJoinCode').value=invitedCode.toUpperCase();}
// Retoma a sala neste aparelho quando o jogador já entrou anteriormente.
if(invitedCode){const savedToken=localStorage.getItem(COMP_TOKEN_KEY(invitedCode.toUpperCase()));if(savedToken){competitionSession={code:invitedCode.toUpperCase(),token:savedToken};$('compLobby').classList.remove('hidden');compShow();compRefresh().then(compStartPolling);}}

/* ===== Ranking guardado e medalha de campeão ===== */
const CHAMP_KEY='desafioBiblicoChampionsV1';
const champRead=()=>{try{return JSON.parse(localStorage.getItem(CHAMP_KEY))||[]}catch(e){return []}};
const champWrite=a=>{try{localStorage.setItem(CHAMP_KEY,JSON.stringify(a.slice(-100)))}catch(e){}};
const sameNick=(a,b)=>String(a||'').trim().toLocaleLowerCase('pt-BR')===String(b||'').trim().toLocaleLowerCase('pt-BR');
const CHAMP_NAME={live:'👑 Campeão da Batalha',async:'🏆 Campeão do Desafio'};
// A competição está encerrada quando a batalha foi finalizada ou, no desafio por turnos, quando todos terminaram.
function compComplete(s){const p=s.players||[];if(p.length<2)return false;return s.mode==='live'?s.status==='finished':p.every(x=>x.finished_at)}
function compResult(s){
 const players=[...(s.players||[])].sort((a,b)=>b.score-a.score||b.correct_count-a.correct_count);
 const top=players.length?players[0].score:0;
 const winners=top>0?players.filter(p=>p.score===top):[];
 const me=players.find(p=>p.id===s.player_id);
 return {code:s.code,mode:s.mode,date:new Date().toISOString(),me:me?me.nickname:'',myScore:me?me.score:0,top,
  players:players.slice(0,10).map(p=>({n:p.nickname,s:p.score})),winners:winners.map(p=>p.nickname),won:!!me&&winners.some(w=>w.id===me.id)};
}
function compShowWinner(s){
 const box=$('compWinner');if(!box)return;
 if(!compComplete(s)){box.classList.add('hidden');return}
 const r=compResult(s);let t;
 if(!r.winners.length)t='Ninguém pontuou nesta competição.';
 else if(r.winners.length===1)t=`🏆 Vencedor: ${r.winners[0]} com ${r.top} pontos!`;
 else t=`🤝 Empate! ${r.winners.join(' e ')} fizeram ${r.top} pontos.`;
 if(r.won)t+=`\n${CHAMP_NAME[r.mode]} — medalha conquistada! Ela fica guardada neste aparelho.`;
 box.textContent=t;box.style.whiteSpace='pre-line';box.classList.remove('hidden');
 compRecordResult(s);
}
function compRecordResult(s){
 if(!compComplete(s))return;
 const r=compResult(s);if(!r.me)return;
 const h=champRead();
 if(h.some(x=>x.code===r.code&&sameNick(x.me,r.me)))return;
 h.push(r);champWrite(h);renderChamp();
}
function renderChamp(){
 const nick=compNick();
 const mine=champRead().filter(r=>sameNick(r.me,nick));
 const wl=mine.filter(r=>r.won&&r.mode==='live').length,wa=mine.filter(r=>r.won&&r.mode==='async').length;
 const line=mine.length?`👑 Batalhas vencidas: ${wl} • 🏆 Desafios vencidos: ${wa} • Competições disputadas: ${mine.length}`:'👑 Campeonatos: ainda sem vitórias. Vença uma batalha ou um desafio entre amigos!';
 if($('champLine'))$('champLine').textContent=line;
 if($('compMedalLine'))$('compMedalLine').textContent=mine.length?line:'Nenhuma competição encerrada ainda. Quando uma batalha ou desafio terminar, o ranking fica guardado aqui.';
 const list=$('compHistory');if(!list)return;list.innerHTML='';
 [...mine].reverse().slice(0,20).forEach(r=>{
  const pos=1+r.players.filter(p=>p.s>r.myScore).length;
  const el=document.createElement('div');el.className='item';
  const a=document.createElement('span');
  const when=new Date(r.date).toLocaleDateString('pt-BR');
  const top=r.players.slice(0,3).map((p,i)=>`${['🥇','🥈','🥉'][1+r.players.filter(x=>x.s>p.s).length-1]||''} ${p.n} (${p.s})`).join(' · ');
  a.textContent=`${when} • ${r.mode==='live'?'Batalha':'Desafio'} ${r.code} — ${top}`;
  const b=document.createElement('b');b.textContent=`${pos}º lugar${r.won?' 👑':''}`;
  el.append(a,b);list.append(el);
 });
}
// Resultados de salas encerradas enquanto o aparelho estava fechado também entram no histórico.
async function compSyncResults(){
 try{
  if(!compClient()||!compNick())return;
  const prefix=COMP_TOKEN_KEY('');const done=new Set(champRead().filter(r=>sameNick(r.me,compNick())).map(r=>r.code));
  const codes=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(prefix))codes.push(k.slice(prefix.length))}
  for(const code of codes.filter(c=>!done.has(c)).slice(-15)){
   try{const s=await compRpc('get_competition_state',{p_code:code,p_token:localStorage.getItem(COMP_TOKEN_KEY(code))});compRecordResult(s)}catch(e){}
  }
 }catch(e){}
}
$('enterBtn').addEventListener('click',()=>setTimeout(()=>{renderChamp();compSyncResults()},400));
$('compBtn').addEventListener('click',()=>{renderChamp();compSyncResults()});
renderChamp();setTimeout(compSyncResults,1500);
