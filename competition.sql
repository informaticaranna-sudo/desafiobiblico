-- Desafio Bíblico: competição privada (Supabase / PostgreSQL)
create extension if not exists pgcrypto;

create table if not exists public.competition_rooms (
  id uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  mode text not null check (mode in ('async','live')),
  status text not null default 'waiting' check (status in ('waiting','active','finished')),
  question_set jsonb not null,
  current_index integer not null default 0,
  creator_token_hash text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.competition_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.competition_rooms(id) on delete cascade,
  nickname text not null,
  token_hash text not null,
  score integer not null default 0,
  correct_count integer not null default 0,
  finished_at timestamptz,
  joined_at timestamptz not null default now(),
  unique(room_id, token_hash)
);
create unique index if not exists competition_unique_nickname on public.competition_players(room_id, lower(nickname));
create table if not exists public.competition_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.competition_rooms(id) on delete cascade,
  player_id uuid not null references public.competition_players(id) on delete cascade,
  question_id integer not null,
  option_index integer not null,
  is_correct boolean not null,
  answered_at timestamptz not null default now(),
  unique(player_id, question_id)
);

alter table public.competition_rooms enable row level security;
alter table public.competition_players enable row level security;
alter table public.competition_answers enable row level security;
revoke all on public.competition_rooms, public.competition_players, public.competition_answers from anon, authenticated;

create or replace function public.create_competition(p_nickname text, p_mode text, p_questions jsonb, p_token text)
returns jsonb language plpgsql security definer set search_path=public, extensions as $$
declare v_code text; v_room public.competition_rooms; v_player public.competition_players;
begin
 if length(trim(p_nickname)) not between 1 and 30 then raise exception 'Informe um apelido de 1 a 30 caracteres.'; end if;
 if p_mode not in ('async','live') then raise exception 'Modo inválido.'; end if;
 if jsonb_typeof(p_questions) <> 'array' or jsonb_array_length(p_questions) <> 10 then raise exception 'A competição precisa ter exatamente 10 perguntas.'; end if;
 if exists (select 1 from jsonb_array_elements(p_questions) q where jsonb_array_length(q->'options') <> 3 or (select count(*) from jsonb_array_elements(q->'options') o where (o->>'correct')::boolean) <> 1) then raise exception 'Há perguntas sem três alternativas e um gabarito.'; end if;
 loop
   v_code := upper(substr(encode(gen_random_bytes(5),'hex'),1,6));
   exit when not exists(select 1 from competition_rooms where invite_code=v_code);
 end loop;
 insert into competition_rooms(invite_code,mode,status,question_set,creator_token_hash)
 values(v_code,p_mode,p_questions,encode(digest(p_token,'sha256'),'hex'),case when p_mode='live' then 'waiting' else 'active' end)
 returning * into v_room;
 insert into competition_players(room_id,nickname,token_hash) values(v_room.id,trim(p_nickname),encode(digest(p_token,'sha256'),'hex')) returning * into v_player;
 return jsonb_build_object('code',v_room.invite_code,'player_id',v_player.id,'mode',v_room.mode,'status',v_room.status);
end $$;

create or replace function public.join_competition(p_code text, p_nickname text, p_token text)
returns jsonb language plpgsql security definer set search_path=public, extensions as $$
declare v_room competition_rooms; v_player competition_players;
begin
 select * into v_room from competition_rooms where invite_code=upper(trim(p_code)) for update;
 if not found then raise exception 'Código não encontrado.'; end if;
 if v_room.status='finished' then raise exception 'Esta competição já foi encerrada.'; end if;
 if length(trim(p_nickname)) not between 1 and 30 then raise exception 'Informe um apelido de 1 a 30 caracteres.'; end if;
 if (select count(*) from competition_players where room_id=v_room.id)>=10 then raise exception 'Esta sala já atingiu o limite de 10 participantes.'; end if;
 insert into competition_players(room_id,nickname,token_hash) values(v_room.id,trim(p_nickname),encode(digest(p_token,'sha256'),'hex')) returning * into v_player;
 return jsonb_build_object('code',v_room.invite_code,'player_id',v_player.id,'mode',v_room.mode,'status',v_room.status);
exception when unique_violation then raise exception 'Este apelido já está sendo usado nesta sala. Escolha outro.';
end $$;

create or replace function public.get_competition_state(p_code text, p_token text)
returns jsonb language plpgsql security definer set search_path=public, extensions as $$
declare v_room competition_rooms; v_player competition_players;
begin
 select * into v_room from competition_rooms where invite_code=upper(trim(p_code));
 if not found then raise exception 'Sala não encontrada.'; end if;
 select * into v_player from competition_players where room_id=v_room.id and token_hash=encode(digest(p_token,'sha256'),'hex');
 if not found then raise exception 'Este acesso não pertence a um participante da sala.'; end if;
 return jsonb_build_object(
  'code',v_room.invite_code,'mode',v_room.mode,'status',v_room.status,'current_index',v_room.current_index,
  'questions',v_room.question_set,'player_id',v_player.id,'creator_id',(select p.id from competition_players p where p.room_id=v_room.id and p.token_hash=v_room.creator_token_hash limit 1),
  'players',(select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'nickname',p.nickname,'score',p.score,'correct_count',p.correct_count,'finished_at',p.finished_at) order by p.score desc,p.joined_at),'[]'::jsonb) from competition_players p where p.room_id=v_room.id),
  'answers',(select coalesce(jsonb_agg(jsonb_build_object('player_id',a.player_id,'question_id',a.question_id,'is_correct',a.is_correct)),'[]'::jsonb) from competition_answers a where a.room_id=v_room.id),
  'my_answers',(select coalesce(jsonb_agg(jsonb_build_object('question_id',a.question_id,'option_index',a.option_index,'is_correct',a.is_correct)),'[]'::jsonb) from competition_answers a where a.player_id=v_player.id)
 );
end $$;

create or replace function public.submit_competition_answer(p_code text,p_token text,p_question_id integer,p_option_index integer)
returns jsonb language plpgsql security definer set search_path=public, extensions as $$
declare v_room competition_rooms; v_player competition_players; v_q jsonb; v_opt jsonb; v_correct boolean;
begin
 select * into v_room from competition_rooms where invite_code=upper(trim(p_code)) for update;
 if not found or v_room.status<>'active' then raise exception 'A competição não está ativa.'; end if;
 select * into v_player from competition_players where room_id=v_room.id and token_hash=encode(digest(p_token,'sha256'),'hex');
 if not found then raise exception 'Participante não autorizado.'; end if;
 select q into v_q from jsonb_array_elements(v_room.question_set) q where (q->>'id')::integer=p_question_id;
 if v_q is null then raise exception 'Pergunta inválida.'; end if;
 if v_room.mode='live' and (v_room.question_set->v_room.current_index->>'id')::integer<>p_question_id then raise exception 'A pergunta atual mudou. Atualize o placar.'; end if;
 if exists(select 1 from competition_answers where player_id=v_player.id and question_id=p_question_id) then raise exception 'Você já respondeu esta pergunta.'; end if;
 select o into v_opt from jsonb_array_elements(v_q->'options') with ordinality t(o,n) where n=p_option_index+1;
 if v_opt is null then raise exception 'Alternativa inválida.'; end if;
 v_correct := coalesce((v_opt->>'correct')::boolean,false);
 insert into competition_answers(room_id,player_id,question_id,option_index,is_correct) values(v_room.id,v_player.id,p_question_id,p_option_index,v_correct);
 update competition_players set score=score+case when v_correct then 10 else 0 end, correct_count=correct_count+case when v_correct then 1 else 0 end where id=v_player.id;
 if (select count(*) from competition_answers where player_id=v_player.id) >= jsonb_array_length(v_room.question_set) then update competition_players set finished_at=now() where id=v_player.id; end if;
 return jsonb_build_object('correct',v_correct,'score',(select score from competition_players where id=v_player.id));
end $$;

create or replace function public.start_live_competition(p_code text,p_token text)
returns jsonb language plpgsql security definer set search_path=public, extensions as $$
declare v_room competition_rooms;
begin
 select * into v_room from competition_rooms where invite_code=upper(trim(p_code)) for update;
 if not found or v_room.creator_token_hash<>encode(digest(p_token,'sha256'),'hex') then raise exception 'Somente quem criou a sala pode iniciar.'; end if;
 if v_room.mode<>'live' or v_room.status<>'waiting' then raise exception 'Esta sala não está aguardando início.'; end if;
 update competition_rooms set status='active',current_index=0 where id=v_room.id;
 return jsonb_build_object('status','active');
end $$;

create or replace function public.advance_live_competition(p_code text,p_token text)
returns jsonb language plpgsql security definer set search_path=public, extensions as $$
declare v_room competition_rooms; v_qid integer; v_total integer; v_done integer;
begin
 select * into v_room from competition_rooms where invite_code=upper(trim(p_code)) for update;
 if not found or v_room.creator_token_hash<>encode(digest(p_token,'sha256'),'hex') then raise exception 'Somente quem criou a sala pode avançar.'; end if;
 if v_room.mode<>'live' or v_room.status<>'active' then raise exception 'A batalha não está ativa.'; end if;
 v_qid := (v_room.question_set->v_room.current_index->>'id')::integer;
 select count(*) into v_total from competition_players where room_id=v_room.id;
 select count(*) into v_done from competition_answers where room_id=v_room.id and question_id=v_qid;
 if v_done < v_total then raise exception 'Aguarde todos os participantes responderem antes de avançar.'; end if;
 if v_room.current_index+1>=jsonb_array_length(v_room.question_set) then update competition_rooms set status='finished' where id=v_room.id; return jsonb_build_object('status','finished'); end if;
 update competition_rooms set current_index=current_index+1 where id=v_room.id;
 return jsonb_build_object('status','active','current_index',v_room.current_index+1);
end $$;

revoke all on function public.create_competition(text,text,jsonb,text), public.join_competition(text,text,text), public.get_competition_state(text,text), public.submit_competition_answer(text,text,integer,integer), public.start_live_competition(text,text), public.advance_live_competition(text,text) from public;
grant execute on function public.create_competition(text,text,jsonb,text), public.join_competition(text,text,text), public.get_competition_state(text,text), public.submit_competition_answer(text,text,integer,integer), public.start_live_competition(text,text), public.advance_live_competition(text,text) to anon, authenticated;
